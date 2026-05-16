package com.carlofy.backend.service;

import com.carlofy.backend.model.RepairProof;
import com.carlofy.backend.model.ServiceRequest;
import com.carlofy.backend.repository.RepairProofRepository;
import com.carlofy.backend.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepairProofService {
    private final RepairProofRepository repairProofRepository;
    private final ServiceRepository serviceRepository;

    public RepairProof addProof(Long serviceId, String type, String videoUrl, String description) {
        ServiceRequest serviceRequest = serviceRepository.findById(serviceId).orElseThrow();
        
        RepairProof proof = RepairProof.builder()
                .serviceRequest(serviceRequest)
                .type(type)
                .videoUrl(videoUrl)
                .thumbnailUrl("https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=400") // Generic workshop thumb
                .description(description)
                .uploadedAt(LocalDateTime.now())
                .build();
                
        return repairProofRepository.save(proof);
    }

    public List<RepairProof> getProofs(Long serviceId) {
        return repairProofRepository.findByServiceRequestId(serviceId);
    }

    public void deleteProof(Long id) {
        repairProofRepository.deleteById(id);
    }
}
