FROM continuumio/miniconda3:22.11.1

WORKDIR /app

COPY . .

RUN conda env create -f environment.yml

SHELL ["conda", "run", "-n", "myenv", "/bin/bash", "-c"]

RUN echo "Doing installs in requirements.txt..."

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080


ENTRYPOINT ["conda", "run", "--no-capture-output", "-n", "myenv", "python", "app.py"]

# # Base image
# FROM python:3.9

# # Set working directory
# WORKDIR /app

# # Copy requirements file and install dependencies
# COPY requirements.txt .

# RUN apt-get update

# RUN apt-get install -y swig

# RUN pip install -r requirements.txt

# # Copy app files to working directory
# COPY . .

# # Set environment variables
# ENV FLASK_APP=app.py
# ENV FLASK_ENV=production
# ENV OPENAI_API_KEY=YOUR_API_KEY_HERE

# # Expose port
# EXPOSE 5000

# # Start Flask app
# CMD ["flask", "run", "--host=0.0.0.0"]
