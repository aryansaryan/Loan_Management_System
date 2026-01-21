package com.loanmanagementsystem.loanmanagementsystem.service;

import org.springframework.data.domain.Page;

import com.loanmanagementsystem.loanmanagementsystem.entity.LoanApplication;
import com.loanmanagementsystem.loanmanagementsystem.entity.LoanStatus;

/** Provides paginated access to loan applications with sorting and filtering. */
public interface LoanQueryService {

    /** Returns a page of loans based on paging, sort, and optional status filter. */
    Page<LoanApplication> listLoans(
            int page,
            int size,
            String sortBy,
            String direction,
            LoanStatus status
    );
}
