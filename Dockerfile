# Stage 1: Build the application using Maven and Java 17
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Run the application using a modern Java 17 image (Eclipse Temurin)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the JAR generated in the build stage
COPY --from=build /app/target/cse499seniorproject-todolist-js-1.0-SNAPSHOT.jar app.jar

# Expose the default port managed dynamically by Render
EXPOSE 8080

# Command to run the compiled JAR application
ENTRYPOINT ["java", "-jar", "app.jar"]