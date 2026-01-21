package com.loanmanagementsystem.loanmanagementsystem.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.loanmanagementsystem.loanmanagementsystem.dto.LoanRequest;
import com.loanmanagementsystem.loanmanagementsystem.entity.LoanApplication;
import com.loanmanagementsystem.loanmanagementsystem.entity.LoanStatus;
import com.loanmanagementsystem.loanmanagementsystem.repository.LoanRepository;
import com.loanmanagementsystem.loanmanagementsystem.service.LoanQueryService;
import com.loanmanagementsystem.loanmanagementsystem.service.LoanService;

import lombok.RequiredArgsConstructor;

/** Loan APIs: apply, list with pagination, and approve/reject (role-gated). */
@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    /** Handles validation + creation of new applications. */
    private final LoanService loanService;

    /** Handles listing with paging/sorting/filtering. */
    private final LoanQueryService loanQueryService;

    /** Used for direct status updates on approve/reject. */
    private final LoanRepository loanRepository;

    /** Creates a new loan application. */
    @PostMapping("/apply")
    public LoanApplication apply(@RequestBody LoanRequest request) {
        return loanService.applyLoan(request);
    }

    /** Lists loan applications with optional status filter. */
    @GetMapping
    public Page<LoanApplication> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) LoanStatus status
    ) {
        return loanQueryService.listLoans(page, size, sortBy, direction, status);
    }

    /** Sets status to APPROVED for the given loan id. */
    @PatchMapping("/{id}/approve")
    public LoanApplication approve(@PathVariable Long id) {
        LoanApplication loan = loanRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loan not found"));
        loan.setStatus(LoanStatus.APPROVED);
        return loanRepository.save(loan);
    }

    /** Sets status to REJECTED for the given loan id. */
    @PatchMapping("/{id}/reject")
    public LoanApplication reject(@PathVariable Long id) {
        LoanApplication loan = loanRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loan not found"));
        loan.setStatus(LoanStatus.REJECTED);
        return loanRepository.save(loan);
    }
}
