package com.carlofy.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "service_slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private String time;
    private Integer capacity;

    @Transient
    private Long bookedCount;
}
