package com.carlofy.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> home() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "message", "Welcome to Carlofy Backend API! The service is running successfully.",
            "version", "1.0"
        ));
    }
}
