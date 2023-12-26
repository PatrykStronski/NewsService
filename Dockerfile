FROM node:18

WORKDIR /app

COPY package*.json ./
COPY entrypoint.sh /entrypoint.sh
COPY . .

RUN rm -rf node_modules
RUN npm install
RUN chmod +x /entrypoint.sh
RUN mkdir -p ./src/keys
RUN echo 'DATABASE_URL="postgresql://postgres:postgres@postgres:5432/newsservice?schema=public"' > ./.env
RUN openssl genrsa -out ./src/keys/key.pem 2048
RUN openssl rsa -in ./src/keys/key.pem -outform PEM -pubout -out ./src/keys/public.pem

ENTRYPOINT ["/entrypoint.sh"]
