package com.carlofy.backend.controller;

import com.carlofy.backend.model.VisualFault;
import com.carlofy.backend.model.User;
import com.carlofy.backend.repository.UserRepository;
import com.carlofy.backend.security.CustomUserDetails;
import com.carlofy.backend.service.VisualAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/visual-diagnostic")
@RequiredArgsConstructor
public class VisualAnalysisController {
    private final VisualAnalysisService visualAnalysisService;
    private final UserRepository userRepository;

    @PostMapping("/analyze")
    public VisualFault analyze(@RequestBody Map<String, Object> payload, @AuthenticationPrincipal CustomUserDetails currentUser) {
        User user = userRepository.findById(currentUser.getId()).get();
        Long carId = Long.parseLong(payload.get("carId").toString());
        String symptomType = payload.get("symptomType").toString();
        String fileName = payload.get("fileName").toString();
        String fileUrl = payload.get("fileUrl").toString();
        
        return visualAnalysisService.analyzeVideo(carId, user, symptomType, fileName, fileUrl);
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public VisualFault review(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String fault = payload.get("detectedFault");
        String recommendations = payload.get("technicianRecommendations");
        return visualAnalysisService.reviewDiagnostic(id, fault, recommendations);
    }

    @GetMapping("/my")
    public List<VisualFault> getMyLogs(@AuthenticationPrincipal CustomUserDetails currentUser) {
        User user = userRepository.findById(currentUser.getId()).get();
        return visualAnalysisService.getMyLogs(user);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<VisualFault> getAllLogs() {
        return visualAnalysisService.getAllLogs();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public VisualFault getLog(@PathVariable Long id) {
        return visualAnalysisService.getLogById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteLog(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails currentUser) {
        User user = userRepository.findById(currentUser.getId()).get();
        visualAnalysisService.deleteLog(id, user);
    }
}
