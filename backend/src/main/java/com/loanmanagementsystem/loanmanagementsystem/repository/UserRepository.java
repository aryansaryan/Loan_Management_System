package com.loanmanagementsystem.loanmanagementsystem.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.loanmanagementsystem.loanmanagementsystem.entity.User;
import com.loanmanagementsystem.loanmanagementsystem.entity.UserRole;

/** Repository for querying and persisting User entities. */
public interface UserRepository extends JpaRepository<User, Long> {

    /** Returns a user by username if present. */
    Optional<User> findByUsername(String username);

    /** Counts users assigned to a specific role. */
    long countByRole(UserRole role);

    /** Returns all users matching the given role. */
    List<User> findByRole(UserRole role);
}
