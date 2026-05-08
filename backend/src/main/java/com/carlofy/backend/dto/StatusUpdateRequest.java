package com.carlofy.backend.dto;

import lombok.Data;

@Data
public class StatusUpdateRequest {
    private String status;
    private Double cost;
}
