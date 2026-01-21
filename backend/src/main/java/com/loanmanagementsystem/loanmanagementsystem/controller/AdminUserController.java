package com.loanmanagementsystem.loanmanagementsystem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.loanmanagementsystem.loanmanagementsystem.entity.User;
import com.loanmanagementsystem.loanmanagementsystem.entity.UserRole;
import com.loanmanagementsystem.loanmanagementsystem.repository.UserRepository;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

/** Admin-only endpoints for listing users, changing roles, and toggling accounts. */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    /** User persistence access. */
    private final UserRepository userRepository;

    /** Lists users, optionally filtered by role. */
    @GetMapping
    public List<UserResponse> listUsers(@RequestParam(required = false) UserRole role) {
        List<User> users = (role == null) ? userRepository.findAll() : userRepository.findByRole(role);
        return users.stream().map(UserResponse::from).toList();
    }

    /** Updates a user's role. */
    @PutMapping("/{id}/role")
    public UserResponse updateRole(@PathVariable Long id, @RequestBody UpdateRoleRequest req) {
        if (req == null || req.role == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role is required");
        }

        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setRole(req.role);
        userRepository.save(user);
        return UserResponse.from(user);
    }

    /** Enables/disables a user without deleting their record. */
    @PutMapping("/{id}/active")
    public UserResponse updateActive(@PathVariable Long id, @RequestBody UpdateActiveRequest req) {
        if (req == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Active flag required");
        }

        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setActive(req.active);
        userRepository.save(user);
        return UserResponse.from(user);
    }

    /** Payload for role update requests. */
    @Data
    public static class UpdateRoleRequest {
        public UserRole role;
    }

    /** Payload for account enable/disable requests. */
    @Data
    public static class UpdateActiveRequest {
        public boolean active;
    }

    /** Safe user view returned to clients (no password or internal fields). */
    @Data
    @AllArgsConstructor
    public static class UserResponse {
        private Long id;
        private String username;
        private UserRole role;
        private boolean active;

        public static UserResponse from(User u) {
            return new UserResponse(u.getId(), u.getUsername(), u.getRole(), u.isActive());
        }
    }
}
