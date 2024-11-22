import { Invoice } from "@/app/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function fetchInvoices(page: number = 1) {
  const response = await fetch(`${API_BASE_URL}/invoices/?page=${page}`);
  if (!response.ok) throw new Error('Failed to fetch invoices');
  return response.json();
}

export async function createInvoice(data: Omit<Invoice, 'id'>) {
  const response = await fetch(`${API_BASE_URL}/invoices/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create invoice');
  return response.json();
}

export async function updateInvoice(id: number, data: Omit<Invoice, 'id'>) {
  const response = await fetch(`${API_BASE_URL}/invoices/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update invoice');
  return response.json();
}

export async function deleteInvoice(id: number) {
  const response = await fetch(`${API_BASE_URL}/invoices/${id}/`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete invoice');
  return response.json();
}