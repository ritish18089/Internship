package com.carlofy.backend.service;

import com.carlofy.backend.model.VisualFault;
import com.carlofy.backend.model.Car;
import com.carlofy.backend.model.User;
import com.carlofy.backend.repository.VisualFaultRepository;
import com.carlofy.backend.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VisualAnalysisService {
    private final VisualFaultRepository visualFaultRepository;
    private final CarRepository carRepository;

    public VisualFault analyzeVideo(Long carId, User user, String symptomType, String fileName, String fileUrl) {
        Car car = carRepository.findById(carId).orElseThrow();
        
        // Save as PENDING for Admin review
        VisualFault record = VisualFault.builder()
                .car(car)
                .user(user)
                .fileName(fileName)
                .fileUrl(fileUrl)
                .symptomType(symptomType)
                .detectedFault("Pending Admin Analysis")
                .confidenceScore(0.0)
                .technicianRecommendations("Technician is reviewing the diagnostic footage...")
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        return visualFaultRepository.save(record);
    }

    public VisualFault reviewDiagnostic(Long id, String detectedFault, String recommendations) {
        VisualFault record = visualFaultRepository.findById(id).orElseThrow();
        record.setDetectedFault(detectedFault);
        record.setTechnicianRecommendations(recommendations);
        record.setStatus("REVIEWED");
        record.setConfidenceScore(1.0); // 100% since it's human verified
        return visualFaultRepository.save(record);
    }

    public List<VisualFault> getMyLogs(User user) {
        return visualFaultRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<VisualFault> getAllLogs() {
        return visualFaultRepository.findAll();
    }

    public VisualFault getLogById(Long id) {
        return visualFaultRepository.findById(id).orElseThrow();
    }

    public void deleteLog(Long id, User user) {
        VisualFault log = visualFaultRepository.findById(id).orElseThrow();
        boolean isAdmin = user.getRole().name().equals("ADMIN");
        if (!log.getUser().getId().equals(user.getId()) && !isAdmin) {
            throw new RuntimeException("Unauthorized to delete this record");
        }
        visualFaultRepository.delete(log);
    }
}
