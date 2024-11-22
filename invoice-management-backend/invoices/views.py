from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Invoice, InvoiceDetail
from .serializer import InvoiceSerializer


class InvoiceViewSet(APIView):
    """
    API View for managing invoices
    """

    def get(self, request):
        """
        List all invoices with pagination
        """
        invoices = Invoice.objects.all()
        page = int(request.GET.get('page', 1))
        page_size = 10
        start = (page - 1) * page_size
        end = start + page_size

        serializer = InvoiceSerializer(invoices[start:end], many=True)
        return Response({
            "status": "success",
            "page": page,
            "total": invoices.count(),
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Create a new invoice with its details
        """
        serializer = InvoiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": "success",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "status": "error",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        """
        Update an existing invoice
        """
        try:
            invoice = Invoice.objects.get(pk=pk)
        except Invoice.DoesNotExist:
            return Response({
                "status": "error",
                "message": "Invoice not found"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = InvoiceSerializer(invoice, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": "success",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "status": "error",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        """
        Delete an invoice
        """
        try:
            invoice = Invoice.objects.get(pk=pk)
        except Invoice.DoesNotExist:
            return Response({
                "status": "error",
                "message": "Invoice not found"
            }, status=status.HTTP_404_NOT_FOUND)

        invoice.delete()
        return Response({
            "status": "success",
            "message": "Invoice deleted successfully"
        }, status=status.HTTP_204_NO_CONTENT)
