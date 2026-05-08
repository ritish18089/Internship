package com.carlofy.backend.controller;

import com.carlofy.backend.model.ContactMessage;
import com.carlofy.backend.repository.ContactMessageRepository;
import com.carlofy.backend.service.EmailService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@CrossOrigin
public class ContactController {

    private final ContactMessageRepository contactMessageRepository;
    private final EmailService emailService;

    @PostMapping
    public ResponseEntity<?> submitContactForm(@RequestBody ContactRequest request) {
        // Save to database
        ContactMessage message = ContactMessage.builder()
                .name(request.getName())
                .email(request.getEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .build();
        
        contactMessageRepository.save(message);

        // Send email notification to admin
        try {
            emailService.sendContactInquiry(
                request.getName(), 
                request.getEmail(), 
                request.getSubject(), 
                request.getMessage()
            );
        } catch (Exception e) {
            // Log error but don't fail the request since it's already saved to DB
            System.err.println("Email notification failed: " + e.getMessage());
        }

        return ResponseEntity.ok("Contact inquiry received successfully");
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContactRequest {
        private String name;
        private String email;
        private String subject;
        private String message;
    }
}
