# Stage 1: Build the application using Maven and Java 17
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Run the application using only Java 17 Runtime
FROM openjdk:17-jdk-slim
WORKDIR /app
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/cse499seniorproject-todolist-js-1.0-SNAPSHOT.jar app.jar

# Exposes the default port (Render will manage it dynamically)
EXPOSE 8080

# Command to run the compiled JAR
ENTRYPOINT ["java", "-jar", "app.jar"]