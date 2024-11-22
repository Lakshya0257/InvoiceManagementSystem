'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InvoiceForm } from '@/components/InvoiceForm';
import { fetchInvoices, createInvoice, updateInvoice, deleteInvoice } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Invoice } from './types';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const loadInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await fetchInvoices(page);
      setInvoices(response.data);
      setTotalPages(Math.ceil(response.total / 10));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load invoices',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    loadInvoices();
  },[])

  const handleCreateInvoice = async (data: Omit<Invoice, 'id'>) => {
    try {
      await createInvoice(data);
      setIsFormOpen(false);
      loadInvoices();
      toast({
        title: 'Success',
        description: 'Invoice created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create invoice',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateInvoice = async (data: Omit<Invoice, 'id'>) => {
    if (!selectedInvoice?.id) return;
    try {
      await updateInvoice(selectedInvoice.id, data);
      setIsFormOpen(false);
      setSelectedInvoice(null);
      loadInvoices();
      toast({
        title: 'Success',
        description: 'Invoice updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update invoice',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteInvoice = async (id: number) => {
    try {
      await deleteInvoice(id);
      loadInvoices();
      toast({
        title: 'Success',
        description: 'Invoice deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete invoice',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Button onClick={() => setIsFormOpen(true)}>Create Invoice</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.invoice_number}</TableCell>
              <TableCell>{invoice.customer_name}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>${invoice.total_amount}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setIsFormOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => invoice.id && handleDeleteInvoice(invoice.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-4 space-x-2">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <InvoiceForm
            initialData={selectedInvoice || undefined}
            onSubmit={selectedInvoice ? handleUpdateInvoice : handleCreateInvoice}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedInvoice(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}