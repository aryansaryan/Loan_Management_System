package com.loanmanagementsystem.loanmanagementsystem.service;

import com.loanmanagementsystem.loanmanagementsystem.dto.LoanRequest;
import com.loanmanagementsystem.loanmanagementsystem.entity.LoanApplication;

/** Handles core loan creation and processing logic. */
public interface LoanService {

    /** Creates and stores a new loan application. */
    LoanApplication applyLoan(LoanRequest req);
}
