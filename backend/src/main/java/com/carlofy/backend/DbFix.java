package com.carlofy.backend;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DbFix {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/carlofy_db";
        String user = "root";
        String password = "riti1234";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            
            System.out.println("Applying DB fix: making car_id nullable in service_requests...");
            stmt.execute("ALTER TABLE service_requests MODIFY car_id BIGINT NULL;");
            System.out.println("Fix applied successfully!");
            
        } catch (Exception e) {
            System.err.println("Failed to apply DB fix: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
