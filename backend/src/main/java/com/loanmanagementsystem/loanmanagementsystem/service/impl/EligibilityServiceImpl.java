package com.loanmanagementsystem.loanmanagementsystem.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.loanmanagementsystem.loanmanagementsystem.dto.LoanRequest;
import com.loanmanagementsystem.loanmanagementsystem.service.EligibilityService;

/** Rule-based eligibility scoring using credit score, DTI, and employment type. */
@Service
public class EligibilityServiceImpl implements EligibilityService {

    /** Computes DTI, risk score, decision, and an interest rate estimate. */
    @Override
    public EligibilityResult evaluate(LoanRequest req) {
        double income = Optional.ofNullable(req.getMonthlyIncome()).orElse(0.0);
        double debt   = Optional.ofNullable(req.getMonthlyDebt()).orElse(0.0);
        int credit    = Optional.ofNullable(req.getCreditScore()).orElse(0);

        double dti = (income <= 0) ? 1.0 : (debt / income);

        int risk = 0;

        // Credit score impact
        if (credit >= 760) risk += 10;
        else if (credit >= 700) risk += 25;
        else if (credit >= 650) risk += 45;
        else risk += 70;

        // DTI impact
        if (dti <= 0.25) risk += 5;
        else if (dti <= 0.35) risk += 15;
        else if (dti <= 0.50) risk += 35;
        else risk += 55;

        // Employment impact
        switch (safe(req.getEmploymentType())) {
        case "SALARIED" -> risk += 5;
        case "SELF_EMPLOYED" -> risk += 15;
        case "STUDENT" -> risk += 25;
        default -> risk += 35;
        }

        risk = Math.min(100, Math.max(0, risk));

        String decision;
        if (credit < 600 || dti > 0.60) decision = "REJECT";
        else if (credit < 680 || dti > 0.45) decision = "REVIEW";
        else decision = "ELIGIBLE";

        double rate = 8.5 + (risk * 0.05);
        rate = Math.round(rate * 10.0) / 10.0;

        return new EligibilityResult(dti, risk, decision, rate);
    }

    /** Null-safe normalization used for string comparisons. */
    private String safe(String v) {
        return v == null ? "" : v.trim().toUpperCase();
    }
}
