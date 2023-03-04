from langchain.document_loaders import PagedPDFSplitter
from langchain.indexes import VectorstoreIndexCreator
import os


from dotenv import load_dotenv

load_dotenv()

os.environ["OPENAI_API_KEY"] = os.environ.get('OPENAI_API_KEY')

loader = PagedPDFSplitter("client/AXLER_LINEARALGEBRA.pdf")
index = VectorstoreIndexCreator().from_loaders([loader])

query = "What is a vector space?"
index.query_with_sources(query)
