package com.loanmanagementsystem.loanmanagementsystem.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.loanmanagementsystem.loanmanagementsystem.entity.UserRole;
import com.loanmanagementsystem.loanmanagementsystem.repository.LoanRepository;
import com.loanmanagementsystem.loanmanagementsystem.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/** Exposes high-level system metrics for admin dashboards and monitoring. */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminMetricsController {

    /** Access to user-related metrics. */
    private final UserRepository userRepository;

    /** Access to loan-related metrics. */
    private final LoanRepository loanRepository;

    /** Returns aggregated counts for users and loan applications. */
    @GetMapping("/metrics")
    public AdminMetricsResponse metrics() {
        long customers = userRepository.countByRole(UserRole.CUSTOMER);
        long analysts  = userRepository.countByRole(UserRole.ANALYST);
        long admins    = userRepository.countByRole(UserRole.ADMIN);
        long loans     = loanRepository.count();

        return new AdminMetricsResponse(customers, analysts, admins, loans);
    }

    /** Immutable response model serialized automatically to JSON. */
    public record AdminMetricsResponse(
        long customers,
        long analysts,
        long admins,
        long loans
    ) {}
}
