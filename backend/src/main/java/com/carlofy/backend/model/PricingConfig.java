package com.carlofy.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pricing_configs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String serviceType;
    
    private Double basePrice;
    private Double laborHours;
    private Double partCostEstimate;
    
    private Double seasonalMultiplier; // e.g., 1.1 for 10% increase
    private String activeSeason; // e.g., SUMMER, MONSOON, WINTER, NORMAL
}
