package com.carlofy.backend.repository;

import com.carlofy.backend.model.PricingConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PricingConfigRepository extends JpaRepository<PricingConfig, Long> {
    Optional<PricingConfig> findByServiceType(String serviceType);
}
