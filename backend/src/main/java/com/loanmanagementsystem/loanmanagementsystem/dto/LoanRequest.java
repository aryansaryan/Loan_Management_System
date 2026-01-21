package com.loanmanagementsystem.loanmanagementsystem.dto;

import lombok.Data;

/** Request payload for creating a loan application. */
@Data
public class LoanRequest {

    /** Applicant full name. */
    private String fullName;

    /** Requested loan amount. */
    private Double amount;

    /** Loan duration in months. */
    private Integer tenure;

    /** Monthly income of the applicant. */
    private Double monthlyIncome;

    /** Current monthly debt obligations. */
    private Double monthlyDebt;

    /** Credit score used for eligibility checks. */
    private Integer creditScore;

    /** Employment category of the applicant. */
    private String employmentType;

    /** Reason for requesting the loan. */
    private String purpose;
}
