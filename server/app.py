from flask import Flask, request, send_from_directory
from werkzeug.utils import secure_filename
import os
import faiss
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
import pickle
from langchain.document_loaders import PagedPDFSplitter
from dotenv import load_dotenv
from langchain.chains import VectorDBQAWithSourcesChain
from langchain import OpenAI

load_dotenv()

os.environ["OPENAI_API_KEY"] = os.environ.get('OPENAI_API_KEY')

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'server/data'


@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    # get rid of the .pdf in the file name

    filename = secure_filename(file.filename).split(".pdf")[0]

    os.mkdir(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename, filename+".pdf"))

    loader = PagedPDFSplitter(os.path.join(
        app.config['UPLOAD_FOLDER'], filename, filename+".pdf"))
    pages = loader.load_and_split()

    store = FAISS.from_documents(pages, OpenAIEmbeddings())
    faiss.write_index(store.index, os.path.join(
        app.config['UPLOAD_FOLDER'], filename, f"{filename}.index"))
    store.index = None
    with open(os.path.join(app.config['UPLOAD_FOLDER'], filename, f"{filename}.pkl"), "wb") as f:
        pickle.dump(store, f)

    return 'File uploaded successfully'


@app.route('/generate', methods=['POST'])
def generate_answer():
    filename = request.form['filename']
    question = request.form['question']

    index = faiss.read_index(os.path.join(
        app.config['UPLOAD_FOLDER'], filename, f"{filename}.index"))
    with open(os.path.join(app.config['UPLOAD_FOLDER'],filename, f"{filename}.pkl"), "rb") as f:
        store = pickle.load(f)

    store.index = index
    chain = VectorDBQAWithSourcesChain.from_chain_type(llm=OpenAI(
        temperature=0, max_tokens=500), chain_type="map_reduce", vectorstore=store)

    result = chain({"question": question})

    return result['answer']

# Serve the uploaded PDF file


@app.route('/pdf/<path:filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename,filename+".pdf")


if __name__ == '__main__':
    app.run(
        debug=True,
    )
