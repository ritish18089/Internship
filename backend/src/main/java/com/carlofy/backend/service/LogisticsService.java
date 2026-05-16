package com.carlofy.backend.service;

import com.carlofy.backend.model.LogisticsRequest;
import com.carlofy.backend.model.ServiceRequest;
import com.carlofy.backend.repository.LogisticsRepository;
import com.carlofy.backend.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class LogisticsService {
    private final LogisticsRepository logisticsRepository;
    private final ServiceRepository serviceRepository;

    public LogisticsRequest createLogistics(Long serviceId, String type, String address, LocalDateTime scheduledTime) {
        ServiceRequest serviceRequest = serviceRepository.findById(serviceId).orElseThrow();
        
        String otp = String.format("%04d", new Random().nextInt(10000));
        
        LogisticsRequest request = LogisticsRequest.builder()
                .serviceRequest(serviceRequest)
                .type(type)
                .status("PENDING")
                .pickupAddress(address)
                .otp(otp)
                .scheduledTime(scheduledTime)
                .currentLat(12.9716) // Default Bangalore Lat
                .currentLng(77.5946) // Default Bangalore Lng
                .build();
                
        return logisticsRepository.save(request);
    }

    public LogisticsRequest assignDriver(Long logisticsId, String driverName, String driverPhone) {
        LogisticsRequest request = logisticsRepository.findById(logisticsId).orElseThrow();
        request.setDriverName(driverName);
        request.setDriverPhone(driverPhone);
        request.setStatus("ASSIGNED");
        return logisticsRepository.save(request);
    }

    public LogisticsRequest updateStatus(Long logisticsId, String status) {
        LogisticsRequest request = logisticsRepository.findById(logisticsId).orElseThrow();
        request.setStatus(status);
        if (status.equals("COMPLETED")) {
            request.setCompletedAt(LocalDateTime.now());
        }
        return logisticsRepository.save(request);
    }

    public List<LogisticsRequest> getMyLogistics(Long userId) {
        List<LogisticsRequest> list = logisticsRepository.findByServiceRequestUserId(userId);
        // Simulate movement for active requests
        list.forEach(this::simulateMovement);
        return list;
    }

    public List<LogisticsRequest> getAllActive() {
        return logisticsRepository.findByStatusNot("COMPLETED");
    }

    private void simulateMovement(LogisticsRequest request) {
        if ("EN_ROUTE".equals(request.getStatus())) {
            Random r = new Random();
            request.setCurrentLat(request.getCurrentLat() + (r.nextDouble() - 0.5) * 0.01);
            request.setCurrentLng(request.getCurrentLng() + (r.nextDouble() - 0.5) * 0.01);
            logisticsRepository.save(request);
        }
    }
}
