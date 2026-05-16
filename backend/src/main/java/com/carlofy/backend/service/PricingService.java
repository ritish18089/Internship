package com.carlofy.backend.service;

import com.carlofy.backend.model.PricingConfig;
import com.carlofy.backend.repository.PricingConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PricingService {
    private final PricingConfigRepository pricingConfigRepository;
    
    private static final double LABOR_RATE_PER_HOUR = 450.0;

    public Map<String, Object> calculateDynamicPrice(String serviceType, String carModel) {
        PricingConfig config = pricingConfigRepository.findByServiceType(serviceType)
                .orElse(getDefaultConfig(serviceType));

        double laborCost = config.getLaborHours() * LABOR_RATE_PER_HOUR;
        double partsCost = config.getPartCostEstimate();
        double multiplier = config.getSeasonalMultiplier() != null ? config.getSeasonalMultiplier() : 1.0;
        
        double subtotal = laborCost + partsCost;
        double total = subtotal * multiplier;

        Map<String, Object> response = new HashMap<>();
        response.put("serviceType", serviceType);
        response.put("laborCost", laborCost);
        response.put("partsCost", partsCost);
        response.put("seasonalMultiplier", multiplier);
        response.put("totalEstimate", total);
        
        // Market Comparison Data
        Map<String, Double> market = new HashMap<>();
        market.put("carlofy", total);
        market.put("authorized_dealer", total * 1.4);
        market.put("local_garage", total * 0.85);
        response.put("marketComparison", market);

        return response;
    }

    public List<PricingConfig> getAllConfigs() {
        return pricingConfigRepository.findAll();
    }

    public PricingConfig updateConfig(PricingConfig config) {
        return pricingConfigRepository.save(config);
    }

    private PricingConfig getDefaultConfig(String serviceType) {
        return PricingConfig.builder()
                .serviceType(serviceType)
                .basePrice(1000.0)
                .laborHours(2.0)
                .partCostEstimate(500.0)
                .seasonalMultiplier(1.0)
                .activeSeason("NORMAL")
                .build();
    }
}
