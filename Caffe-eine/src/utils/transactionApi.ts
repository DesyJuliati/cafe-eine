// ============================================
// FILE: src/utils/transactionApi.ts
// ============================================
// Semua fungsi API untuk transaksi.
// Digunakan oleh CheckoutModal dan dashboard.

import api from "@/utils/api";
import type { CartItem } from "@/store/cartStore";

// ===== TYPES =====
export interface TransactionPayload {
  items: CartItem[];
  total: number;
  paymentMethod: string;
  invoiceNumber: string;
  kasirId: string;
  status: "lunas" | "pending" | "ditolak";
}

export interface TransactionRecord extends TransactionPayload {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionListParams {
  page?: number;
  limit?: number;
  status?: "lunas" | "pending" | "ditolak";
  startDate?: string;
  endDate?: string;
}

export interface TransactionListResponse {
  data: TransactionRecord[];
  total: number;
  page: number;
  limit: number;
}

// ===== API FUNCTIONS =====

/**
 * Buat transaksi baru.
 * POST /api/transactions
 */
export async function createTransaction(
  payload: TransactionPayload
): Promise<TransactionRecord> {
  const response = await api.post<{ data: TransactionRecord }>(
    "/transactions",
    payload
  );
  return response.data.data;
}

/**
 * Ambil daftar transaksi dengan filter opsional.
 * GET /api/transactions
 */
export async function getTransactions(
  params?: TransactionListParams
): Promise<TransactionListResponse> {
  const response = await api.get<TransactionListResponse>("/transactions", {
    params,
  });
  return response.data;
}

/**
 * Ambil detail satu transaksi berdasarkan ID.
 * GET /api/transactions/:id
 */
export async function getTransactionById(
  id: string
): Promise<TransactionRecord> {
  const response = await api.get<{ data: TransactionRecord }>(
    `/transactions/${id}`
  );
  return response.data.data;
}

/**
 * Update status transaksi (kasir/admin menerima atau menolak).
 * PATCH /api/transactions/:id/status
 */
export async function updateTransactionStatus(
  id: string,
  status: "lunas" | "ditolak"
): Promise<TransactionRecord> {
  const response = await api.patch<{ data: TransactionRecord }>(
    `/transactions/${id}/status`,
    { status }
  );
  return response.data.data;
}
