package com.carlofy.backend.controller;

import com.carlofy.backend.model.Notification;
import com.carlofy.backend.repository.NotificationRepository;
import com.carlofy.backend.security.CustomUserDetails;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping("/my")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(@AuthenticationPrincipal CustomUserDetails currentUser) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        
        List<NotificationResponse> response = notifications.stream()
                .map(n -> new NotificationResponse(n.getId(), n.getMessage(), n.getCreatedAt().toString(), n.isRead()))
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(response);
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<?> markAllAsRead(@AuthenticationPrincipal CustomUserDetails currentUser) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear-all")
    @jakarta.transaction.Transactional
    public ResponseEntity<?> clearAllNotifications(@AuthenticationPrincipal CustomUserDetails currentUser) {
        notificationRepository.deleteByUserId(currentUser.getId());
        return ResponseEntity.ok().build();
    }

    @Data
    @AllArgsConstructor
    public static class NotificationResponse {
        private Long id;
        private String message;
        private String createdAt;
        private boolean isRead;
    }
}
