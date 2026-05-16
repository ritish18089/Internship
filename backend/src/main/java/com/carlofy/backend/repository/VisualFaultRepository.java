package com.carlofy.backend.repository;

import com.carlofy.backend.model.VisualFault;
import com.carlofy.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VisualFaultRepository extends JpaRepository<VisualFault, Long> {
    List<VisualFault> findByUserOrderByCreatedAtDesc(User user);
}
