package com.loanmanagementsystem.loanmanagementsystem.dto;

import com.loanmanagementsystem.loanmanagementsystem.entity.UserRole;

import lombok.AllArgsConstructor;
import lombok.Data;

/** Response returned after a successful login. */
@Data
@AllArgsConstructor
public class LoginResponse {

    /** JWT token used for authenticated API requests. */
    private String token;

    /** Logged-in user's username. */
    private String username;

    /** User role used for access control and UI rendering. */
    private UserRole role;
}
