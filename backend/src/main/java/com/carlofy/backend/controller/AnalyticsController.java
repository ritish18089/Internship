package com.carlofy.backend.controller;

import com.carlofy.backend.dto.AnalyticsData;
import com.carlofy.backend.model.ServiceRequest;
import com.carlofy.backend.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final ServiceRepository serviceRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AnalyticsData getAnalytics() {
        List<ServiceRequest> allRequests = serviceRepository.findAll();

        // 1. Monthly Stats (Last 6 months)
        Map<String, Long> monthlyCountMap = new LinkedHashMap<>();
        
        // Initialize last 6 months with 0
        Calendar cal = Calendar.getInstance();
        for (int i = 5; i >= 0; i--) {
            Calendar mCal = (Calendar) cal.clone();
            mCal.add(Calendar.MONTH, -i);
            String monthName = mCal.getDisplayName(Calendar.MONTH, Calendar.SHORT, Locale.ENGLISH);
            monthlyCountMap.put(monthName, 0L);
        }

        for (ServiceRequest req : allRequests) {
            if (req.getRequestDate() != null) {
                String monthName = req.getRequestDate().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
                if (monthlyCountMap.containsKey(monthName)) {
                    monthlyCountMap.put(monthName, monthlyCountMap.get(monthName) + 1);
                }
            }
        }

        List<AnalyticsData.MonthlyData> monthlyStats = monthlyCountMap.entrySet().stream()
                .map(e -> new AnalyticsData.MonthlyData(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        // 2. Service Type Stats
        Map<String, Long> typeCountMap = allRequests.stream()
                .filter(r -> r.getServiceType() != null)
                .collect(Collectors.groupingBy(ServiceRequest::getServiceType, Collectors.counting()));

        List<AnalyticsData.ServiceTypeStats> serviceTypeStats = typeCountMap.entrySet().stream()
                .map(e -> new AnalyticsData.ServiceTypeStats(e.getKey(), e.getValue()))
                .sorted(Comparator.comparingLong(AnalyticsData.ServiceTypeStats::getCount).reversed())
                .collect(Collectors.toList());

        // 3. Totals
        long totalServices = allRequests.size();
        long pendingServices = allRequests.stream().filter(r -> "PENDING".equals(r.getStatus())).count();
        long completedServices = allRequests.stream().filter(r -> "COMPLETED".equals(r.getStatus())).count();

        return AnalyticsData.builder()
                .monthlyStats(monthlyStats)
                .serviceTypeStats(serviceTypeStats)
                .totalServices(totalServices)
                .pendingServices(pendingServices)
                .completedServices(completedServices)
                .build();
    }
}
