package com.loanmanagementsystem.loanmanagementsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.loanmanagementsystem.loanmanagementsystem.entity.LoanApplication;

/** Repository for CRUD operations on LoanApplication entities. */
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
}
