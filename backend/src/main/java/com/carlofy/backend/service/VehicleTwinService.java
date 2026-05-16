package com.carlofy.backend.service;

import com.carlofy.backend.model.*;
import com.carlofy.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class VehicleTwinService {
    private final CarRepository carRepository;
    private final ServiceRepository serviceRepository;
    private final PartReplacementRepository partReplacementRepository;
    private final AccidentRecordRepository accidentRecordRepository;

    public Map<String, Object> getVehicleTwin(Long carId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        List<ServiceRequest> services = serviceRepository.findByCarId(carId);
        List<PartReplacement> parts = partReplacementRepository.findByCarId(carId);
        List<AccidentRecord> accidents = accidentRecordRepository.findByCarId(carId);

        Map<String, Object> twin = new HashMap<>();
        twin.put("car", car);
        twin.put("services", services);
        twin.put("parts", parts);
        twin.put("accidents", accidents);
        twin.put("healthScore", calculateHealthScore(car, services, accidents));

        return twin;
    }

    private int calculateHealthScore(Car car, List<ServiceRequest> services, List<AccidentRecord> accidents) {
        int score = 100;

        // Deduct for accidents
        score -= accidents.size() * 15;

        // Deduct for pending or cancelled services if they indicate neglect
        long pendingServices = services.stream()
                .filter(s -> "PENDING".equals(s.getStatus()))
                .count();
        score -= pendingServices * 5;

        // Add for completed services
        long completedServices = services.stream()
                .filter(s -> "COMPLETED".equals(s.getStatus()))
                .count();
        score += completedServices * 2;

        // Ensure score is within 0-100
        return Math.max(0, Math.min(100, score));
    }

    public List<Map<String, Object>> getTimeline(Long carId) {
        List<ServiceRequest> services = serviceRepository.findByCarId(carId);
        List<AccidentRecord> accidents = accidentRecordRepository.findByCarId(carId);

        List<Map<String, Object>> timeline = new ArrayList<>();

        services.forEach(s -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", s.getBookingDate());
            entry.put("type", "SERVICE");
            entry.put("title", s.getServiceType());
            entry.put("status", s.getStatus());
            entry.put("notes", s.getTechnicianNotes());
            timeline.add(entry);
        });

        accidents.forEach(a -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", a.getDate());
            entry.put("type", "ACCIDENT");
            entry.put("title", "Accident Reported");
            entry.put("description", a.getDescription());
            entry.put("severity", a.getSeverity());
            timeline.add(entry);
        });

        timeline.sort((a, b) -> ((String) b.get("date")).compareTo((String) a.get("date")));

        return timeline;
    }
}
