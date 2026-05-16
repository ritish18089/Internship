package com.carlofy.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "accident_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccidentRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private LocalDate date;
    private String severity;
    private Double repairCost;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;
}
