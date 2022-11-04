FROM python:3.10-slim

RUN apt-get update && \
    apt-get upgrade -y


WORKDIR /app

COPY requirements.txt .
RUN python -m pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED 1

CMD ["python", "main.py"]
