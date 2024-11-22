# Invoice Management System

## Overview

The **Invoice Management System** is a full-stack application developed with a **Django REST Framework** backend and a **React** frontend. This system allows users to efficiently create, update, manage, and view invoices, with the capability to handle multiple line items within a single invoice. The backend API is designed to handle CRUD operations for invoices and invoice details, while the frontend provides a responsive and user-friendly interface for managing these invoices.

## Table of Contents
- [Backend Overview](#backend-overview)
- [Screenshots](#screenshots)

## Backend Overview

The backend of the system is built using **Django** and **Django REST Framework (DRF)**. It exposes an API for managing invoices and their details.

### Models

1. **Invoice**
   - `id`: Auto-incremented primary key.
   - `invoice_number`: CharField (unique).
   - `customer_name`: CharField.
   - `date`: DateField.

2. **InvoiceDetail**
   - `id`: Auto-incremented primary key.
   - `invoice`: ForeignKey to `Invoice`.
   - `description`: CharField.
   - `quantity`: IntegerField (positive).
   - `unit_price`: DecimalField.
   - `line_total`: DecimalField (computed field).

### API Endpoints

The primary endpoint for managing invoices is `/api/invoices/`. The backend supports the following HTTP methods:
- **GET**: Retrieve a list of invoices (with pagination).
- **POST**: Create a new invoice with associated line items.
- **PUT**: Update an existing invoice.
- **DELETE**: Delete an invoice.

#### Sample Request Payload for Creating an Invoice:
```json
{
  "invoice_number": "INV001",
  "customer_name": "John Doe",
  "date": "2024-11-12",
  "details": [
    {
      "description": "Product A",
      "quantity": 2,
      "unit_price": 50.00
    },
    {
      "description": "Product B",
      "quantity": 1,
      "unit_price": 75.00
    }
  ]
}
```

## Screenshots
![image](https://github.com/user-attachments/assets/b6ec4007-8d5b-43ab-b730-0c57885a6db9)
![image](https://github.com/user-attachments/assets/9bfc8286-f828-4f63-aff8-e1fcff1b9938)


