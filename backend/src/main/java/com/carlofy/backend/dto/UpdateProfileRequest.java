package com.carlofy.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateProfileRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
    private String oldPassword;
    private String profileImage;
}
