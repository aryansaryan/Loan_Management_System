package com.loanmanagementsystem.loanmanagementsystem.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.loanmanagementsystem.loanmanagementsystem.entity.User;
import com.loanmanagementsystem.loanmanagementsystem.entity.UserRole;
import com.loanmanagementsystem.loanmanagementsystem.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Seeds required users when the application starts.
 * Useful for local development, demos, and testing environments.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    /** Repository for accessing and persisting User entities. */
    private final UserRepository userRepository;

    /** Encodes raw passwords before storing them. */
    private final PasswordEncoder passwordEncoder;

    /**
     * Runs automatically during application startup.
     * Creates default users only if they do not already exist.
     */
    @Override
    public void run(String... args) {
        createUserIfMissing("admin", "admin123", UserRole.ADMIN);
        createUserIfMissing("analyst", "analyst123", UserRole.ANALYST);
        createUserIfMissing("customer", "customer123", UserRole.CUSTOMER);
    }

    /**
     * Creates a user only when the username is not already present.
     */
    private void createUserIfMissing(String username, String rawPassword, UserRole role) {
        if (userRepository.findByUsername(username).isPresent()) return;

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(role);

        userRepository.save(user);
    }
}
