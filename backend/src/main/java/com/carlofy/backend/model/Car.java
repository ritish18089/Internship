package com.carlofy.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cars")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String model;
    private String number;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
