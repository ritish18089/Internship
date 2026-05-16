package com.carlofy.backend.controller;

import com.carlofy.backend.service.VehicleTwinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VehicleTwinController {
    private final VehicleTwinService vehicleTwinService;

    @GetMapping("/{id}/twin")
    public ResponseEntity<Map<String, Object>> getVehicleTwin(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleTwinService.getVehicleTwin(id));
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<List<Map<String, Object>>> getTimeline(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleTwinService.getTimeline(id));
    }
}
