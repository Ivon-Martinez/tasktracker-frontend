# Stage 1: Build the frontend
FROM node:20-alpine AS build


WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install


COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the built app with a lightweight server
FROM nginx:alpine


COPY --from=build /app/dist /usr/share/nginx/html


EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]

