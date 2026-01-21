package com.loanmanagementsystem.loanmanagementsystem.controller;

import com.loanmanagementsystem.loanmanagementsystem.dto.LoginRequest;
import com.loanmanagementsystem.loanmanagementsystem.dto.LoginResponse;
import com.loanmanagementsystem.loanmanagementsystem.entity.User;
import com.loanmanagementsystem.loanmanagementsystem.entity.UserRole;
import com.loanmanagementsystem.loanmanagementsystem.repository.UserRepository;
import com.loanmanagementsystem.loanmanagementsystem.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/** Auth endpoints for registration and login (JWT-based). */
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    /** User persistence access. */
    private final UserRepository userRepository;

    /** Hashes passwords and verifies credentials. */
    private final PasswordEncoder passwordEncoder;

    /** Creates signed JWT tokens for authenticated users. */
    private final JwtUtil jwtUtil;

    /** Creates a new user with the default CUSTOMER role. */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody LoginRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username and password are required");
        }

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.CUSTOMER);

        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    /** Validates credentials and returns a JWT token on success. */
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid username or password"
                ));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new LoginResponse(token, user.getUsername(), user.getRole());
    }
}
