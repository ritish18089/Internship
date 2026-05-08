package com.carlofy.backend.repository;

import com.carlofy.backend.model.Car;
import com.carlofy.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByUser(User user);
}
