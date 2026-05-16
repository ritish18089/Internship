package com.carlofy.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "service_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String serviceType;
    private String status;
    private LocalDate requestDate;
    private LocalDate bookingDate;
    private String bookingTime;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;

    private Double cost;
    private Double laborCost;
    private Double partsCost;

    @Column(columnDefinition = "TEXT")
    private String technicianNotes;
    
    private Integer healthImpact; // Score from -10 to 10

    @OneToOne(mappedBy = "serviceRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private LogisticsRequest logistics;

    @OneToMany(mappedBy = "serviceRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<RepairProof> repairProofs;
}
