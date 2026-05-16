package com.carlofy.backend.controller;

import com.carlofy.backend.model.RepairProof;
import com.carlofy.backend.service.RepairProofService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/repair-proofs")
@RequiredArgsConstructor
public class RepairProofController {
    private final RepairProofService repairProofService;

    @GetMapping("/service/{serviceId}")
    public List<RepairProof> getProofs(@PathVariable Long serviceId) {
        return repairProofService.getProofs(serviceId);
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public RepairProof addProof(@RequestBody Map<String, Object> payload) {
        Long serviceId = Long.parseLong(payload.get("serviceId").toString());
        String type = payload.get("type").toString();
        String videoUrl = payload.get("videoUrl").toString();
        String description = payload.get("description").toString();
        
        return repairProofService.addProof(serviceId, type, videoUrl, description);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProof(@PathVariable Long id) {
        repairProofService.deleteProof(id);
    }
}
