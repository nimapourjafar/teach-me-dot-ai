from flask import Flask, request, send_from_directory
from werkzeug.utils import secure_filename
import os
import faiss
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
import pickle
from langchain.document_loaders import PagedPDFSplitter
from dotenv import load_dotenv

load_dotenv()

os.environ["OPENAI_API_KEY"] = os.environ.get('OPENAI_API_KEY')

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'server/data'

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    loader = PagedPDFSplitter(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    pages = loader.load_and_split()

    store = FAISS.from_documents(pages, OpenAIEmbeddings())
    faiss.write_index(store.index, os.path.join(app.config['UPLOAD_FOLDER'], f"{filename}.index"))
    store.index = None
    with open(os.path.join(app.config['UPLOAD_FOLDER'], f"{filename}.pkl"), "wb") as f:
        pickle.dump(store, f)

    return 'File uploaded successfully'