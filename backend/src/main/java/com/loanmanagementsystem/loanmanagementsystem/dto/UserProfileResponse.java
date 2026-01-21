package com.loanmanagementsystem.loanmanagementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/** Profile details returned to the frontend. */
@Data
@AllArgsConstructor
public class UserProfileResponse {

    /** User identifier. */
    private Long id;

    /** Login username. */
    private String username;

    /** User role as a string. */
    private String role;

    /** Full name displayed in the UI. */
    private String fullName;

    /** Email address. */
    private String email;

    /** Contact phone number. */
    private String phone;
}
