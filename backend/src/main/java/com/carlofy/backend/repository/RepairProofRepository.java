package com.carlofy.backend.repository;

import com.carlofy.backend.model.RepairProof;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepairProofRepository extends JpaRepository<RepairProof, Long> {
    List<RepairProof> findByServiceRequestId(Long serviceRequestId);
}
