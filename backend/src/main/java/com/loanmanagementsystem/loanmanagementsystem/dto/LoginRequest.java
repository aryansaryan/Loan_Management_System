package com.loanmanagementsystem.loanmanagementsystem.dto;

import lombok.Data;

/** Request payload for login and registration. */
@Data
public class LoginRequest {

    /** User's unique login name. */
    private String username;

    /** Raw password provided during authentication or signup. */
    private String password;
}
