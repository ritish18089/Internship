package com.carlofy.backend.controller;

import com.carlofy.backend.model.PricingConfig;
import com.carlofy.backend.service.PricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pricing")
@RequiredArgsConstructor
public class PricingController {
    private final PricingService pricingService;

    @GetMapping("/estimate")
    public Map<String, Object> getEstimate(@RequestParam String serviceType, @RequestParam(required = false) String carModel) {
        return pricingService.calculateDynamicPrice(serviceType, carModel);
    }

    @GetMapping("/configs")
    @PreAuthorize("isAuthenticated()")
    public List<PricingConfig> getConfigs() {
        return pricingService.getAllConfigs();
    }

    @PutMapping("/configs")
    @PreAuthorize("hasRole('ADMIN')")
    public PricingConfig updateConfig(@RequestBody PricingConfig config) {
        return pricingService.updateConfig(config);
    }
}
