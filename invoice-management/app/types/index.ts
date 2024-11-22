export interface InvoiceDetail {
    id?: number;
    description: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }
  
  export interface Invoice {
    id?: number;
    invoice_number: string;
    customer_name: string;
    date: string;
    total_amount: number;
    details: InvoiceDetail[];
  }