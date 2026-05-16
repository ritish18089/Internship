package com.carlofy.backend.repository;

import com.carlofy.backend.model.LogisticsRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LogisticsRepository extends JpaRepository<LogisticsRequest, Long> {
    List<LogisticsRequest> findByServiceRequestUserId(Long userId);
    List<LogisticsRequest> findByStatusNot(String status);
}
