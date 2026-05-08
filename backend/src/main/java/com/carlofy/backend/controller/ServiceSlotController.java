package com.carlofy.backend.controller;

import com.carlofy.backend.model.ServiceSlot;
import com.carlofy.backend.repository.ServiceSlotRepository;
import com.carlofy.backend.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services/slots")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ServiceSlotController {

    private final ServiceSlotRepository slotRepository;
    private final ServiceRepository requestRepository;

    @GetMapping
    public List<ServiceSlot> getSlotsByDate(@RequestParam String date) {
        LocalDate localDate = LocalDate.parse(date);
        List<ServiceSlot> slots = slotRepository.findByDate(localDate);
        
        // Enhance with availability check
        return slots.stream().map(slot -> {
            long count = requestRepository.countByBookingDateAndBookingTime(slot.getDate(), slot.getTime());
            slot.setBookedCount(count);
            return slot;
        }).collect(Collectors.toList());
    }

    @GetMapping("/available")
    public List<Map<String, Object>> getAvailableSlots(@RequestParam String date) {
        LocalDate localDate = LocalDate.parse(date);
        List<ServiceSlot> slots = slotRepository.findByDate(localDate);
        
        return slots.stream().map(slot -> {
            long bookedCount = requestRepository.countByBookingDateAndBookingTime(slot.getDate(), slot.getTime());
            boolean available = bookedCount < slot.getCapacity();
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", slot.getId());
            map.put("time", slot.getTime());
            map.put("available", available);
            map.put("remaining", slot.getCapacity() - bookedCount);
            return map;
        }).collect(Collectors.toList());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createSlot(@RequestBody ServiceSlot slot) {
        try {
            ServiceSlot saved = slotRepository.save(slot);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteSlot(@PathVariable Long id) {
        slotRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
