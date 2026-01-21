package com.loanmanagementsystem.loanmanagementsystem.entity;

/** User roles used for access control. */
public enum UserRole {

    /** Full system access and administration. */
    ADMIN,

    /** Reviews and approves or rejects loans. */
    ANALYST,

    /** Submits loan applications and views personal data. */
    CUSTOMER
}
