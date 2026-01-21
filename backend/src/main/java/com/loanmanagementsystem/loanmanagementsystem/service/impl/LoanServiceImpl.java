package com.loanmanagementsystem.loanmanagementsystem.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.loanmanagementsystem.loanmanagementsystem.dto.LoanRequest;
import com.loanmanagementsystem.loanmanagementsystem.entity.LoanApplication;
import com.loanmanagementsystem.loanmanagementsystem.entity.LoanStatus;
import com.loanmanagementsystem.loanmanagementsystem.repository.LoanRepository;
import com.loanmanagementsystem.loanmanagementsystem.service.EligibilityService;
import com.loanmanagementsystem.loanmanagementsystem.service.LoanService;

import lombok.RequiredArgsConstructor;

/** Creates loan applications and stores computed eligibility metrics. */
@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {

    /** Loan persistence access. */
    private final LoanRepository loanRepository;

    /** Evaluates DTI, risk, decision, and interest rate. */
    private final EligibilityService eligibilityService;

    /** Creates and saves a new loan application. */
    @Override
    public LoanApplication applyLoan(LoanRequest req) {
        var eval = eligibilityService.evaluate(req);

        LoanApplication loan = new LoanApplication();
        loan.setAmount(req.getAmount());
        loan.setTenure(req.getTenure());
        loan.setFullName(req.getFullName());
        loan.setMonthlyIncome(req.getMonthlyIncome());
        loan.setMonthlyDebt(req.getMonthlyDebt());
        loan.setCreditScore(req.getCreditScore());
        loan.setEmploymentType(req.getEmploymentType());
        loan.setPurpose(req.getPurpose());

        loan.setDti(eval.dti());
        loan.setRiskScore(eval.riskScore());
        loan.setEligibilityDecision(eval.decision());
        loan.setInterestRate(eval.recommendedRate());

        loan.setStatus(LoanStatus.SUBMITTED);
        loan.setCreatedAt(LocalDateTime.now());

        return loanRepository.save(loan);
    }
}
