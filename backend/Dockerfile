FROM python:3.13-alpine

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

CMD ["fastapi", "dev", "--host", "0.0.0.0"]
