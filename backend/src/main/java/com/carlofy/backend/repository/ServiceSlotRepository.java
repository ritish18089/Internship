package com.carlofy.backend.repository;

import com.carlofy.backend.model.ServiceSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ServiceSlotRepository extends JpaRepository<ServiceSlot, Long> {
    List<ServiceSlot> findByDate(LocalDate date);
}
