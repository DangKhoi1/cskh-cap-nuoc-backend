export interface Invoice {
  servicePointId: string;
  invoiceId: string;
  customerCode: string;
  customerName: string;
  billingPeriod: string;
  dueDate: string;
  consumptionM3: number;
  amount: number;
  currency: 'VND';
  status: 'UNPAID' | 'PAID' | 'CANCELLED';
}
