package com.carlofy.backend.controller;

import com.carlofy.backend.model.Car;
import com.carlofy.backend.model.User;
import com.carlofy.backend.repository.CarRepository;
import com.carlofy.backend.repository.UserRepository;
import com.carlofy.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.carlofy.backend.repository.ServiceRepository;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    @GetMapping
    public List<Car> getMyCars(@AuthenticationPrincipal CustomUserDetails currentUser) {
        User user = userRepository.findById(currentUser.getId()).get();
        return carRepository.findByUser(user);
    }

    @PostMapping
    public Car addCar(@RequestBody Car car, @AuthenticationPrincipal CustomUserDetails currentUser) {
        User user = userRepository.findById(currentUser.getId()).get();
        car.setUser(user);
        return carRepository.save(car);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteCar(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails currentUser) {
        Car car = carRepository.findById(id).orElseThrow();
        if (!car.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        // Delete all associated service requests to ensure they are removed from both Customer and Admin portals
        serviceRepository.deleteByCar(car);
 
        carRepository.delete(car);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable Long id, @RequestBody Car carDetails, @AuthenticationPrincipal CustomUserDetails currentUser) {
        Car car = carRepository.findById(id).orElseThrow();
        
        if (!car.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        car.setBrand(carDetails.getBrand());
        car.setModel(carDetails.getModel());
        car.setNumber(carDetails.getNumber());

        Car updatedCar = carRepository.save(car);
        return ResponseEntity.ok(updatedCar);
    }
}
