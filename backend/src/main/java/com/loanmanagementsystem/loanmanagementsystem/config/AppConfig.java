package com.loanmanagementsystem.loanmanagementsystem.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Central configuration class for defining shared application beans.
 */
@Configuration
public class AppConfig {

    /**
     * Provides a PasswordEncoder bean using BCrypt hashing.
     * BCrypt automatically salts passwords and applies adaptive hashing
     * to improve resistance against brute-force attacks.
     *
     * This encoder is injected wherever password encryption or validation is required.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
