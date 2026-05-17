# Stage 1: Build the React Frontend
FROM node:20 AS frontend-build
WORKDIR /app/frontend
# Copy package files and install dependencies
COPY frontend/package*.json ./
RUN npm install
# Copy the rest of the frontend source and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Spring Boot Backend
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /app/backend
# Copy the pom.xml and download dependencies (for caching)
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B
# Copy the source code
COPY backend/src ./src
# Copy the built frontend into the backend's static resources directory
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static
# Build the application
RUN mvn clean package -DskipTests

# Stage 3: Run the application
FROM eclipse-temurin:17-jre
WORKDIR /app
# Copy the generated JAR file from the backend-build stage
COPY --from=backend-build /app/backend/target/*.jar app.jar
# Expose the port
EXPOSE 8080
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
