package com.carlofy.backend.repository;

import com.carlofy.backend.model.ServiceRequest;
import com.carlofy.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface ServiceRepository extends JpaRepository<ServiceRequest, Long> {
    @Query("SELECT s FROM ServiceRequest s LEFT JOIN FETCH s.car LEFT JOIN FETCH s.user WHERE s.user = :user")
    List<ServiceRequest> findByUser(@Param("user") User user);

    @Query("SELECT s FROM ServiceRequest s LEFT JOIN FETCH s.car LEFT JOIN FETCH s.user ORDER BY s.requestDate DESC")
    List<ServiceRequest> findByOrderByRequestDateDesc();

    long countByBookingDateAndBookingTime(LocalDate bookingDate, String bookingTime);

    @Query("SELECT s FROM ServiceRequest s LEFT JOIN FETCH s.car c LEFT JOIN FETCH s.user u WHERE " +
           "(:status IS NULL OR s.status = :status) AND " +
           "(:carModel IS NULL OR LOWER(c.model) LIKE LOWER(CONCAT('%', :carModel, '%'))) AND " +
           "(:startDate IS NULL OR s.requestDate >= :startDate) AND " +
           "(:endDate IS NULL OR s.requestDate <= :endDate) " +
           "ORDER BY s.requestDate DESC")
    List<ServiceRequest> findWithFilters(
        @Param("status") String status,
        @Param("carModel") String carModel,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    @Modifying
    @Transactional
    @Query("DELETE FROM ServiceRequest s WHERE s.car = :car")
    void deleteByCar(@Param("car") com.carlofy.backend.model.Car car);

    @Query("SELECT s FROM ServiceRequest s WHERE s.car.id = :carId")
    List<ServiceRequest> findByCarId(@Param("carId") Long carId);
}
