# Generated by Django 5.1.3 on 2024-11-21 20:08

import django.core.validators
import django.db.models.deletion
from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Invoice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('invoice_number', models.CharField(help_text='Unique invoice number', max_length=50, unique=True)),
                ('customer_name', models.CharField(help_text='Name of the customer', max_length=200)),
                ('date', models.DateField(help_text='Invoice date')),
                ('total_amount', models.DecimalField(decimal_places=2, default=Decimal('0.00'), help_text='Total amount of the invoice', max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='InvoiceDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(help_text='Item description', max_length=500)),
                ('quantity', models.PositiveIntegerField(help_text='Quantity of the item', validators=[django.core.validators.MinValueValidator(1)])),
                ('unit_price', models.DecimalField(decimal_places=2, help_text='Price per unit', max_digits=10, validators=[django.core.validators.MinValueValidator(Decimal('0.01'))])),
                ('line_total', models.DecimalField(decimal_places=2, help_text='Total for this line item', max_digits=10)),
                ('invoice', models.ForeignKey(help_text='Related invoice', on_delete=django.db.models.deletion.CASCADE, related_name='details', to='invoices.invoice')),
            ],
        ),
    ]