package com.loanmanagementsystem.loanmanagementsystem.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.loanmanagementsystem.loanmanagementsystem.entity.LoanApplication;
import com.loanmanagementsystem.loanmanagementsystem.entity.LoanStatus;

/** Repository for querying and persisting loan applications. */
public interface LoanRepository extends JpaRepository<LoanApplication, Long> {

    /** Returns loans filtered by status with pagination support. */
    Page<LoanApplication> findByStatus(LoanStatus status, Pageable pageable);
}
