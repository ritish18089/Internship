package com.carlofy.backend.controller;

import com.carlofy.backend.model.ServiceRequest;
import com.carlofy.backend.model.User;
import com.carlofy.backend.repository.CarRepository;
import com.carlofy.backend.repository.NotificationRepository;
import com.carlofy.backend.repository.ServiceRepository;
import com.carlofy.backend.repository.UserRepository;
import com.carlofy.backend.model.Car;
import com.carlofy.backend.model.Notification;
import com.carlofy.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final NotificationRepository notificationRepository;

    @GetMapping("/my")
    public List<ServiceRequest> getMyRequests(@AuthenticationPrincipal CustomUserDetails currentUser) {
        User user = userRepository.findById(currentUser.getId()).get();
        return serviceRepository.findByUser(user);
    }

    @PostMapping
    public ServiceRequest createRequest(@RequestBody ServiceRequest request, @AuthenticationPrincipal CustomUserDetails currentUser) {
        User user = userRepository.findById(currentUser.getId()).get();
        
        // If the payload specifies a user and the current actor is an ADMIN, assign it to the specified user
        if (request.getUser() != null && request.getUser().getId() != null && "ADMIN".equals(user.getRole().name())) {
            User targetUser = userRepository.findById(request.getUser().getId()).orElse(user);
            request.setUser(targetUser);
        } else {
            // Otherwise, implicitly assign it to the logged-in user (Customer)
            request.setUser(user);
        }

        request.setRequestDate(LocalDate.now());
        request.setStatus("PENDING");
        
        // Ensure car is fully loaded for the response
        if (request.getCar() != null && request.getCar().getId() != null) {
            Car car = carRepository.findById(request.getCar().getId()).orElse(null);
            request.setCar(car);
        }
        
        return serviceRepository.save(request);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ServiceRequest> getAllRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String carModel,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate
    ) {
        System.out.println("Fetching all requests with filters - Status: " + status + ", Model: " + carModel + ", Start: " + startDate + ", End: " + endDate);
        
        // If all parameters are null, return all ordered by date
        if (status == null && carModel == null && startDate == null && endDate == null) {
            return serviceRepository.findByOrderByRequestDateDesc();
        }
        
        // Convert empty strings to null for JPA query compatibility
        String statusFilter = (status != null && !status.isEmpty()) ? status : null;
        String modelFilter = (carModel != null && !carModel.isEmpty()) ? carModel : null;
        
        return serviceRepository.findWithFilters(statusFilter, modelFilter, startDate, endDate);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ServiceRequest updateStatus(@PathVariable Long id, @RequestBody com.carlofy.backend.dto.StatusUpdateRequest statusUpdate) {
        ServiceRequest request = serviceRepository.findById(id).orElseThrow();
        String cleanStatus = statusUpdate.getStatus().replace("\"", "");
        request.setStatus(cleanStatus);
        
        if (statusUpdate.getCost() != null) {
            request.setCost(statusUpdate.getCost());
        }
        
        ServiceRequest updated = serviceRepository.save(request);

        // Create Notification for the user
        String carInfo = request.getCar() != null ? 
            request.getCar().getBrand() + " " + request.getCar().getModel() + " (" + request.getCar().getNumber() + ")" : 
            "your vehicle";
            
        Notification notification = Notification.builder()
                .user(request.getUser())
                .message("Service Update: Your request for " + carInfo + " has been moved to " + cleanStatus + ".")
                .createdAt(LocalDateTime.now())
                .isRead(false)
                .build();
        
        notificationRepository.save(notification);

        return updated;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails currentUser) {
        ServiceRequest request = serviceRepository.findById(id).orElseThrow();
        // Allow deletion if the user is the owner OR if they are an ADMIN
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
                
        if (!request.getUser().getId().equals(currentUser.getId()) && !isAdmin) {
            return ResponseEntity.status(403).build();
        }
        serviceRepository.delete(request);
        return ResponseEntity.ok().build();
    }
}
