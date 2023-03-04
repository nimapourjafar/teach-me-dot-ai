from langchain.text_splitter import CharacterTextSplitter
import faiss
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
import pickle
import os
from dotenv import load_dotenv
from langchain.document_loaders import PagedPDFSplitter

load_dotenv()
os.environ["OPENAI_API_KEY"] = os.environ.get('OPENAI_API_KEY')

loader = PagedPDFSplitter("server/data/AXLER_LINEARALGEBRA.pdf")
pages = loader.load_and_split()


# # Create a vector store from the documents and save it to disk
store = FAISS.from_documents(pages, OpenAIEmbeddings())

# store = FAISS.from_texts(filtered_docs, OpenAIEmbeddings())
faiss.write_index(store.index, "docs1.index")
store.index = None
with open("faiss_store1.pkl", "wb") as f:
    pickle.dump(store, f)