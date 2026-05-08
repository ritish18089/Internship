package com.carlofy.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public org.springframework.boot.CommandLineRunner schemaFix(org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
        return args -> {
            System.out.println(">>> SCHEMA FIX STARTING...");
            
            try {
                System.out.println(">>> SCHEMA FIX: Checking for reset_password_otp column...");
                jdbcTemplate.execute("ALTER TABLE users ADD COLUMN reset_password_otp VARCHAR(255)");
            } catch (Exception e) {
                System.out.println("Note: Column reset_password_otp might already exist.");
            }

            try {
                jdbcTemplate.execute("ALTER TABLE users ADD COLUMN reset_password_otp_expiry DATETIME(6)");
            } catch (Exception e) {
                System.out.println("Note: Column reset_password_otp_expiry might already exist.");
            }
            
            try {
                System.out.println(">>> SCHEMA FIX: Ensuring service_slots table exists...");
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS service_slots (" +
                        "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                        "date DATE, " +
                        "time VARCHAR(255), " +
                        "capacity INT)");
            } catch (Exception e) {
                System.err.println(">>> SCHEMA FIX ERROR (Table Creation): " + e.getMessage());
            }

            try {
                System.out.println(">>> SCHEMA FIX: Making car_id nullable in service_requests...");
                jdbcTemplate.execute("ALTER TABLE service_requests MODIFY car_id BIGINT NULL");
            } catch (Exception e) {
                System.out.println("Note: Could not modify car_id column: " + e.getMessage());
            }

            try {
                System.out.println(">>> SCHEMA FIX: Adding cost column to service_requests...");
                jdbcTemplate.execute("ALTER TABLE service_requests ADD COLUMN cost DOUBLE");
            } catch (Exception e) {
                System.out.println("Note: cost column might already exist.");
            }
            
            System.out.println(">>> SCHEMA FIX: Completed.");
        };
    }
}
