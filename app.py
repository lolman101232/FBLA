# app.py (Flask application)
'''
%%capture --no-stderr
!pip install flask
!pip install langchain-ollama
!pip install langchain-nomic "nomic[local]"
!pip install langchain
!pip install tiktoken scikit-learn
!pip install --quiet -U langchain langchain_community tiktoken langchain-nomic "nomic[local]" langchain-ollama scikit-learn
%pip install -qU pypdf

'''

from flask import Flask, render_template, request, jsonify
from langchain_ollama import ChatOllama
model_id = "llama3.2:1b"
llm = ChatOllama(model=model_id, temperature=0)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import SKLearnVectorStore
from langchain_nomic.embeddings import NomicEmbeddings
from langchain_ollama import ChatOllama
from flask_cors import CORS

docs1 = PyPDFLoader(r"/Users/anshkare/Desktop/FBLA 24-25/FBLA/Financial-History-Daniel.pdf")
docs2 = PyPDFLoader(r"/Users/anshkare/Desktop/FBLA 24-25/FBLA/Navigating-the-Website.pdf")
docs_pages = []
for doc in docs1.load():
    docs_pages.append(doc)
for doc in docs2.load():
    docs_pages.append(doc)


text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    chunk_size=1000, chunk_overlap=200
)
doc_splits = text_splitter.split_documents(docs_pages)

vectorstore = SKLearnVectorStore.from_documents(
    documents=doc_splits,
    embedding=NomicEmbeddings(model="nomic-embed-text-v1.5", inference_mode="local"),
)

retriever = vectorstore.as_retriever(search_kwargs={"k":1})

from langchain.schema import HumanMessage

# Prompt
rag_prompt = """You are personal finance advisor for the user. The user is a teen, so he is not paying rent, but he still should be saving his money 

for things like college. 

Print out a summary of the context provided. 

Here is the context to use to answer the question:

{context} 

Think carefully about the above context. 

Now, review the user question:

{question}

Provide an answer to this questions using only the above context. 

Use three sentences maximum and keep the answer concise.

Answer:"""


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

app = Flask(__name__)
CORS(app)

@app.route('/process_data', methods=['POST'])
def process_data():
    data = request.get_json()  # Get JSON data sent from JavaScript
    if not data or 'text' not in data:
        return jsonify({'error': 'Missing or invalid data'}), 400

    text = data['text']

    # Do some Python processing (e.g., concatenate the string with itself)
    docs_txt = format_docs(docs_pages)
    rag_prompt_formatted = rag_prompt.format(context=docs_txt, question=text)
    generation = llm.invoke([HumanMessage(content=rag_prompt_formatted)])
    result = generation.content

    return jsonify({'result': result})  # Send the result back as JSON

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Change Flask to match JavaScript