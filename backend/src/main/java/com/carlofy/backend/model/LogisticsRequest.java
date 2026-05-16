package com.carlofy.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "logistics_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogisticsRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "service_request_id")
    private ServiceRequest serviceRequest;

    private String type; // PICKUP, DELIVERY
    private String status; // PENDING, ASSIGNED, EN_ROUTE, ARRIVED, COMPLETED
    
    private String driverName;
    private String driverPhone;
    
    private String pickupAddress;
    private String otp;
    
    // Simulated live tracking coordinates
    private Double currentLat;
    private Double currentLng;
    
    private LocalDateTime scheduledTime;
    private LocalDateTime completedAt;
}
