package com.carlofy.backend.controller;

import com.carlofy.backend.dto.AuthResponse;
import com.carlofy.backend.dto.LoginRequest;
import com.carlofy.backend.dto.RegisterRequest;
import com.carlofy.backend.model.User;
import com.carlofy.backend.repository.UserRepository;
import com.carlofy.backend.security.JwtTokenProvider;
import com.carlofy.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;

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

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail()).get();
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getPhone(),
                user.getRole().name(),
                user.getProfileImage());

        return ResponseEntity.ok(new AuthResponse(jwt, userDto));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        if (!isValidPassword(registerRequest.getPassword())) {
            return ResponseEntity.badRequest().body("Password must be at least 8 characters long and contain uppercase, lowercase, digits, and special characters.");
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already taken!");
        }

        User user = User.builder()
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .name(registerRequest.getName())
                .phone(registerRequest.getPhone())
                .role(registerRequest.getRole())
                .build();

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            // For security, return OK even if the email is not found
            return ResponseEntity.ok("OTP sent if account exists.");
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setResetPasswordOtp(otp);
        user.setResetPasswordOtpExpiry(java.time.LocalDateTime.now().plusSeconds(100));
        userRepository.save(user);

        try {
            emailService.sendOtpEmail(email, otp);
            return ResponseEntity.ok("OTP sent successfully");
        } catch (Exception e) {
            System.err.println("Failed to send OTP to " + email + ": " + e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to send OTP");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || user.getResetPasswordOtp() == null || !user.getResetPasswordOtp().equals(otp)) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }

        if (user.getResetPasswordOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("OTP has expired");
        }

        return ResponseEntity.ok("OTP verified successfully");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("password");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || user.getResetPasswordOtp() == null || !user.getResetPasswordOtp().equals(otp)) {
            return ResponseEntity.badRequest().body("Invalid verification session");
        }

        if (!isValidPassword(newPassword)) {
            return ResponseEntity.badRequest().body("Password must be at least 8 characters long and contain uppercase, lowercase, digits, and special characters.");
        }

        if (user.getResetPasswordOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Verification expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordOtp(null);
        user.setResetPasswordOtpExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password reset successfully");
    }
}
