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
chain = VectorDBQAWithSourcesChain.from_chain_type(llm=OpenAI(temperature=0), chain_type="map_reduce",vectorstore=store)

result = chain({"question": "What are principles? (Include a citation from the text)"})

print(f"Answer: {result['answer']}")