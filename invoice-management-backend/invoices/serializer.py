from rest_framework import serializers
from .models import Invoice, InvoiceDetail


class InvoiceDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for the InvoiceDetail model
    """
    class Meta:
        model = InvoiceDetail
        fields = ['id', 'description', 'quantity', 'unit_price', 'line_total']
        read_only_fields = ['line_total']

    def validate(self, data):
        """
        Custom validation for InvoiceDetail fields
        """
        if data['quantity'] <= 0:
            raise serializers.ValidationError({"quantity": "Quantity must be greater than zero."})
        if data['unit_price'] <= 0:
            raise serializers.ValidationError({"unit_price": "Unit price must be greater than zero."})
        return data


class InvoiceSerializer(serializers.ModelSerializer):
    """
    Serializer for the Invoice model with nested InvoiceDetail
    """
    details = InvoiceDetailSerializer(many=True)

    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'customer_name', 'date', 'total_amount', 'details']
        read_only_fields = ['total_amount']

    def validate_details(self, value):
        """
        Ensure details are not empty
        """
        if not value:
            raise serializers.ValidationError("Details cannot be empty.")
        return value

    def create(self, validated_data):
        """
        Create an invoice along with its details
        """
        details_data = validated_data.pop('details')
        invoice = Invoice.objects.create(**validated_data)
        total_amount = 0

        for detail_data in details_data:
            line_total = detail_data['quantity'] * detail_data['unit_price']
            detail_data['line_total'] = line_total
            InvoiceDetail.objects.create(invoice=invoice, **detail_data)
            total_amount += line_total

        invoice.total_amount = total_amount
        invoice.save()
        return invoice

    def update(self, instance, validated_data):
        """
        Update an invoice and its details
        """
        details_data = validated_data.pop('details', [])
        instance.invoice_number = validated_data.get('invoice_number', instance.invoice_number)
        instance.customer_name = validated_data.get('customer_name', instance.customer_name)
        instance.date = validated_data.get('date', instance.date)
        instance.save()

        # Update or recreate details
        instance.details.all().delete()
        total_amount = 0

        for detail_data in details_data:
            line_total = detail_data['quantity'] * detail_data['unit_price']
            detail_data['line_total'] = line_total
            InvoiceDetail.objects.create(invoice=instance, **detail_data)
            total_amount += line_total

        instance.total_amount = total_amount
        instance.save()
        return instance
