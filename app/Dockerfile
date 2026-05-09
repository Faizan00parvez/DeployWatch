# Stage 1 - Dependencies install karo
FROM python:3.11-slim AS builder

WORKDIR /app

COPY src/requirements.txt .

RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2 - Final lightweight image
FROM python:3.11-slim

WORKDIR /app

# Builder se sirf installed packages copy karo
COPY --from=builder /root/.local /root/.local

# App ka code copy karo
COPY src/ .

ENV PATH=/root/.local/bin:$PATH
ENV FLASK_ENV=production

EXPOSE 5000

CMD ["python", "app.py"]