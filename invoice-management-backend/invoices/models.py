from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

class Invoice(models.Model):
    """
    Invoice model representing the main invoice details
    """
    invoice_number = models.CharField(
        max_length=50, 
        unique=True, 
        help_text="Unique invoice number"
    )
    customer_name = models.CharField(
        max_length=200, 
        help_text="Name of the customer"
    )
    date = models.DateField(
        help_text="Invoice date"
    )
    total_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=Decimal('0.00'),
        help_text="Total amount of the invoice"
    )

    def __str__(self):
        return f"{self.invoice_number} - {self.customer_name}"

class InvoiceDetail(models.Model):
    """
    Invoice detail model representing line items
    """
    invoice = models.ForeignKey(
        Invoice, 
        on_delete=models.CASCADE, 
        related_name='details',
        help_text="Related invoice"
    )
    description = models.CharField(
        max_length=500, 
        help_text="Item description"
    )
    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        help_text="Quantity of the item"
    )
    unit_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Price per unit"
    )
    line_total = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        help_text="Total for this line item"
    )
