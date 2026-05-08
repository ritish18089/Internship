package com.carlofy.backend.config;

import com.carlofy.backend.model.User;
import com.carlofy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "ritish1808@gmail.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode("riti1234"))
                    .name("System Admin")
                    .phone("0000000000")
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println(">>> ADMIN SEEDER: Admin account created successfully: " + adminEmail);
        } else {
            // Ensure the existing admin has the correct password and role
            userRepository.findByEmail(adminEmail).ifPresent(admin -> {
                admin.setPassword(passwordEncoder.encode("riti1234"));
                admin.setRole(User.Role.ADMIN);
                userRepository.save(admin);
                System.out.println(">>> ADMIN SEEDER: Admin account updated successfully: " + adminEmail + " with password: riti1234");
            });
        }
    }
}
