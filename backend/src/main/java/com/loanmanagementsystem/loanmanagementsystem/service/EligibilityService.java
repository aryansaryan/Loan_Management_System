package com.loanmanagementsystem.loanmanagementsystem.service;

import com.loanmanagementsystem.loanmanagementsystem.dto.LoanRequest;

/** Evaluates loan requests and returns risk and eligibility metrics. */
public interface EligibilityService {

    /** Computes eligibility data for a loan request. */
    EligibilityResult evaluate(LoanRequest req);

    /** Immutable evaluation result returned by the service. */
    record EligibilityResult(
            double dti,
            int riskScore,
            String decision,
            double recommendedRate
    ) {}
}
