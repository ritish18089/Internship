package com.carlofy.backend.controller;

import com.carlofy.backend.model.LogisticsRequest;
import com.carlofy.backend.security.CustomUserDetails;
import com.carlofy.backend.service.LogisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logistics")
@RequiredArgsConstructor
public class LogisticsController {
    private final LogisticsService logisticsService;

    @PostMapping("/schedule")
    public LogisticsRequest schedule(@RequestBody Map<String, Object> payload) {
        Long serviceId = Long.parseLong(payload.get("serviceId").toString());
        String type = payload.get("type").toString();
        String address = payload.get("address").toString();
        LocalDateTime scheduledTime = LocalDateTime.parse(payload.get("scheduledTime").toString());
        
        return logisticsService.createLogistics(serviceId, type, address, scheduledTime);
    }

    @GetMapping("/my")
    public List<LogisticsRequest> getMy(@AuthenticationPrincipal CustomUserDetails currentUser) {
        return logisticsService.getMyLogistics(currentUser.getId());
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    public List<LogisticsRequest> getAllActive() {
        return logisticsService.getAllActive();
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public LogisticsRequest assign(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return logisticsService.assignDriver(id, payload.get("driverName"), payload.get("driverPhone"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public LogisticsRequest updateStatus(@PathVariable Long id, @RequestParam String status) {
        return logisticsService.updateStatus(id, status);
    }
}
