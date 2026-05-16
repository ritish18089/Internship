# Build stage
FROM maven:3.8-eclipse-temurin-17 AS build
WORKDIR /app
# Copy everything from the backend folder to the root of our build container
COPY backend/ .
# Build the jar
RUN mvn package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -Dserver.port=$PORT -jar app.jar"]
