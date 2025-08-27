# Sử dụng Node.js LTS
FROM node:18-alpine

# Set thư mục làm việc
WORKDIR /app

# Copy package files trước để tận dụng Docker cache
COPY package*.json ./

RUN npm ci

# Copy source code sau khi cài dependencies
COPY . .

# Expose port
EXPOSE 3000 

# Chạy app với host 0.0.0.0 để có thể truy cập từ bên ngoài container
CMD ["npm", "start"]