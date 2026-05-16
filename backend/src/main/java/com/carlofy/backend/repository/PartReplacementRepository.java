package com.carlofy.backend.repository;

import com.carlofy.backend.model.PartReplacement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PartReplacementRepository extends JpaRepository<PartReplacement, Long> {
    List<PartReplacement> findByCarId(Long carId);
}
