package com.carlofy.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "repair_proofs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepairProof {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "service_request_id")
    private ServiceRequest serviceRequest;

    private String type; // BEFORE, DURING, AFTER
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String videoUrl;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String thumbnailUrl;
    private String description;
    
    private LocalDateTime uploadedAt;
}
