package com.carlofy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsData {
    private List<MonthlyData> monthlyStats;
    private List<ServiceTypeStats> serviceTypeStats;
    private long totalServices;
    private long pendingServices;
    private long completedServices;

    @Data
    @AllArgsConstructor
    public static class MonthlyData {
        private String month;
        private long count;
    }

    @Data
    @AllArgsConstructor
    public static class ServiceTypeStats {
        private String type;
        private long count;
    }
}
