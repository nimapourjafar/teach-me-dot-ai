import faiss
from langchain import OpenAI
from langchain.chains import VectorDBQAWithSourcesChain
import pickle
import os
from dotenv import load_dotenv

load_dotenv()

os.environ["OPENAI_API_KEY"] = os.environ.get('OPENAI_API_KEY')

index = faiss.read_index("server/docs.index")

with open("server/faiss_store.pkl", "rb") as f:
    store = pickle.load(f)

    store.index = index
chain = VectorDBQAWithSourcesChain.from_llm(llm=OpenAI(temperature=0), vectorstore=store)

result = chain({"question": "What are Ray Dalio's principles?"})

print(f"Answer: {result['answer']}")