package com.loanmanagementsystem.loanmanagementsystem.entity;

/** Lifecycle state of a loan application. */
public enum LoanStatus {

    /** Awaiting review after submission. */
    SUBMITTED,

    /** Approved by an analyst or admin. */
    APPROVED,

    /** Rejected during review. */
    REJECTED
}
