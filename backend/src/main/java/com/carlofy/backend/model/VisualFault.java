package com.carlofy.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "visual_faults")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisualFault {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String fileName;
    private String symptomType; // e.g., EXHAUST, FLUID_LEAK, etc.
    
    private String detectedFault;
    private Double confidenceScore; // 0.0 to 1.0
    
    @Column(columnDefinition = "TEXT")
    private String technicianRecommendations;
    
    @Column(columnDefinition = "LONGTEXT")
    private String fileUrl; // Base64 or cloud storage link
    
    private String status; // PENDING, ANALYZED, REVIEWED
    private LocalDateTime createdAt;
}
