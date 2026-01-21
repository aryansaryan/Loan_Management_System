package com.loanmanagementsystem.loanmanagementsystem.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.loanmanagementsystem.loanmanagementsystem.entity.LoanApplication;
import com.loanmanagementsystem.loanmanagementsystem.entity.LoanStatus;
import com.loanmanagementsystem.loanmanagementsystem.repository.LoanRepository;
import com.loanmanagementsystem.loanmanagementsystem.service.LoanQueryService;

/** Handles loan listing with pagination, sorting, and optional status filtering. */
@Service
public class LoanQueryServiceImpl implements LoanQueryService {

    /** Data access for loans. */
    private final LoanRepository loanRepository;

    public LoanQueryServiceImpl(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    /** Returns a paged loan list with optional status filter. */
    @Override
    public Page<LoanApplication> listLoans(int page, int size, String sortBy, String direction, LoanStatus status) {
        Sort sort = "desc".equalsIgnoreCase(direction)
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        PageRequest pageable = PageRequest.of(page, size, sort);
        return (status == null) ? loanRepository.findAll(pageable) : loanRepository.findByStatus(status, pageable);
    }
}
