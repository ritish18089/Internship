package com.carlofy.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "part_replacements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartReplacement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String partName;
    private LocalDate replacementDate;
    private Double cost;
    private String notes;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;
}
