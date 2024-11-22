'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@/app/types';
import { toast } from '@/hooks/use-toast';

interface InvoiceFormProps {
  initialData?: Invoice;
  onSubmit: (data: Omit<Invoice, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export function InvoiceForm({ initialData, onSubmit, onCancel }: InvoiceFormProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<Invoice>({
    defaultValues: initialData || {
      invoice_number: '',
      customer_name: '',
      date: new Date().toISOString().split('T')[0],
      details: [{ description: '', quantity: 1, unit_price: 0, line_total: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details',
  });

  const onFormSubmit = async (data: Invoice) => {
    try {
      await onSubmit(data);
      toast({
        title: 'Success',
        description: 'Invoice saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save invoice',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Invoice' : 'Create Invoice'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                {...register('invoice_number', { required: 'Invoice number is required' })}
                placeholder="Invoice Number"
              />
              {errors.invoice_number && (
                <span className="text-red-500 text-sm">{errors.invoice_number.message}</span>
              )}
            </div>
            <div>
              <Input
                {...register('customer_name', { required: 'Customer name is required' })}
                placeholder="Customer Name"
              />
              {errors.customer_name && (
                <span className="text-red-500 text-sm">{errors.customer_name.message}</span>
              )}
            </div>
            <div>
              <Input
                type="date"
                {...register('date', { required: 'Date is required' })}
              />
              {errors.date && (
                <span className="text-red-500 text-sm">{errors.date.message}</span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-4 gap-4">
                <Input
                  {...register(`details.${index}.description`)}
                  placeholder="Description"
                />
                <Input
                  type="number"
                  {...register(`details.${index}.quantity`)}
                  placeholder="Quantity"
                />
                <Input
                  type="number"
                  step="0.01"
                  {...register(`details.${index}.unit_price`)}
                  placeholder="Unit Price"
                />
                <Button type="button" variant="destructive" onClick={() => remove(index)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ description: '', quantity: 1, unit_price: 0, line_total: 0 })}
          >
            Add Item
          </Button>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Invoice</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}