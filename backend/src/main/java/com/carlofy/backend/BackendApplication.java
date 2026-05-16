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
    public org.springframework.boot.CommandLineRunner schemaFix(
            org.springframework.jdbc.core.JdbcTemplate jdbcTemplate,
            com.carlofy.backend.repository.PricingConfigRepository pricingRepo) {
        return args -> {
            System.out.println(">>> SCHEMA FIX STARTING...");
            
            // Seed Pricing Configs with the new Core Practical Services list
            System.out.println(">>> RE-SEEDING CORE PRACTICAL SERVICES...");
            pricingRepo.deleteAll(); // Clear old services to match new list exactly
            
            String[][] newServices = {
                {"Oil Change", "1.5", "1200"},
                {"Brake Service", "2.0", "1500"},
                {"Battery Service", "1.0", "3500"},
                {"Wheel Alignment", "1.0", "600"},
                {"AC Service", "2.5", "2000"},
                {"Car Wash", "0.5", "300"},
                {"Engine Diagnostics", "3.0", "1000"},
                {"Suspension Check", "2.0", "800"},
                {"Clutch Repair", "5.0", "4500"},
                {"Tire Replacement", "1.0", "5000"},
                {"Pickup & Delivery", "1.0", "200"},
                {"Emergency Assistance", "2.0", "500"},
                {"Periodic Maintenance", "4.0", "3000"},
                {"Interior Detailing", "3.0", "1500"},
                {"Insurance Assistance", "1.0", "0"}
            };

            for (String[] s : newServices) {
                pricingRepo.save(com.carlofy.backend.model.PricingConfig.builder()
                        .serviceType(s[0])
                        .laborHours(Double.parseDouble(s[1]))
                        .partCostEstimate(Double.parseDouble(s[2]))
                        .seasonalMultiplier(1.0)
                        .activeSeason("NORMAL")
                        .build());
            }
            System.out.println(">>> CORE PRACTICAL SERVICES SEEDED.");

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
                System.out.println(">>> SCHEMA FIX: Adding labor_cost and parts_cost columns to service_requests...");
                jdbcTemplate.execute("ALTER TABLE service_requests ADD COLUMN labor_cost DOUBLE");
                jdbcTemplate.execute("ALTER TABLE service_requests ADD COLUMN parts_cost DOUBLE");
            } catch (Exception e) {
                System.out.println("Note: labor_cost/parts_cost columns might already exist.");
            }
            
            System.out.println(">>> SCHEMA FIX: Completed.");
        };
    }
}
