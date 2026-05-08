package com.carlofy.backend.dto;

import com.carlofy.backend.model.User;
import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private String phone;
    private User.Role role;
}
