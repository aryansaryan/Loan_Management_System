package com.loanmanagementsystem.loanmanagementsystem.dto;

import lombok.Data;

/** Request payload for updating user profile details. */
@Data
public class UpdateProfileRequest {

    /** User’s display name. */
    private String fullName;

    /** Email address for communication. */
    private String email;

    /** Contact phone number. */
    private String phone;
}
