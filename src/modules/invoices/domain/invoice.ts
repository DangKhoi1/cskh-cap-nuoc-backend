export interface Invoice {
  invoiceId: string;
  customerCode: string;
  customerName: string;
  billingPeriod: string;
  dueDate: string;
  oldIndex: number;
  newIndex: number;
  consumptionM3: number;
  amount: number;
  currency: 'VND';
  status: 'UNPAID' | 'PAID' | 'CANCELLED';
}
