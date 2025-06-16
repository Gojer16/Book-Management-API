# 1. Base image
FROM node:20

# 2. Create and set working directory
WORKDIR /app

# 3. Install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy app source code
COPY . .

# 5. Expose port
EXPOSE 4000  # Change this if your app listens on a different port

# 6. Start app
CMD ["node", "app.js"]