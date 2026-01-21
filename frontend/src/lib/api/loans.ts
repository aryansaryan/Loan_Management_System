import client from "./client";

/** Must match backend enum exactly. */
export type LoanStatus = "SUBMITTED" | "APPROVED" | "REJECTED";

/** Display labels used by the UI. */
export const LOAN_STATUS_LABEL: Record<LoanStatus, string> = {
  SUBMITTED: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

/** Loan model returned from the API. */
export type LoanApplication = {
  id: number;
  fullName?: string;
  amount?: number;
  tenure?: number;
  interestRate?: number;
  riskScore?: number;
  eligibilityDecision?: string;
  status?: LoanStatus;
  createdAt?: string;

  // Optional fields if backend expands later
  username?: string;
  applicantUsername?: string;
};

/** Fetches loans with pagination, sorting, and optional filtering. */
export async function listLoans(params?: {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "asc" | "desc";
  status?: LoanStatus;
}) {
  const res = await client.get("/api/loans", { params });
  return res.data;
}

/** Marks a loan as approved. */
export async function approveLoan(id: number) {
  const res = await client.patch(`/api/loans/${id}/approve`);
  return res.data;
}

/** Marks a loan as rejected. */
export async function rejectLoan(id: number) {
  const res = await client.patch(`/api/loans/${id}/reject`);
  return res.data;
}
