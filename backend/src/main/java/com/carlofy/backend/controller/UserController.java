package com.carlofy.backend.controller;

import com.carlofy.backend.dto.AuthResponse;
import com.carlofy.backend.dto.UpdateProfileRequest;
import com.carlofy.backend.model.User;
import com.carlofy.backend.repository.UserRepository;
import com.carlofy.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private boolean isValidPassword(String password) {
        if (password == null || password.length() < 8) return false;
        boolean hasUpper = false, hasLower = false, hasDigit = false, hasSpecial = false;
        String specialChars = "!@#$%^&*(),.?\":{}|<>";
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isLowerCase(c)) hasLower = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else if (specialChars.indexOf(c) != -1) hasSpecial = true;
        }
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateProfileRequest request, 
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        
        User user = userRepository.findById(currentUser.getId()).orElseThrow();

        // Check if email is being changed and if it already exists
        if (StringUtils.hasText(request.getEmail()) && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body("Email is already taken!");
            }
            user.setEmail(request.getEmail());
        }

        if (StringUtils.hasText(request.getName())) {
            user.setName(request.getName());
        }

        if (StringUtils.hasText(request.getPhone())) {
            user.setPhone(request.getPhone());
        }

        if (StringUtils.hasText(request.getPassword())) {
            if (!isValidPassword(request.getPassword())) {
                return ResponseEntity.badRequest().body("Password must be at least 8 characters long and contain uppercase, lowercase, digits, and special characters.");
            }
            if (!StringUtils.hasText(request.getOldPassword()) || 
                !passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body("Current password is incorrect!");
            }
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (StringUtils.hasText(request.getProfileImage())) {
            user.setProfileImage(request.getProfileImage());
        }

        userRepository.save(user);

        // Return updated user data (matching the structure expected by the frontend)
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
            user.getId(), 
            user.getEmail(), 
            user.getName(), 
            user.getPhone(),
            user.getRole().name(),
            user.getProfileImage()
        );
        
        return ResponseEntity.ok(userDto);
    }
}
