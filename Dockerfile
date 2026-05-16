# Build stage
FROM maven:3.8-eclipse-temurin-17 AS build
WORKDIR /app
# Copy everything from the backend folder to the root of our build container
COPY backend/ .
# Build the jar
RUN mvn package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
