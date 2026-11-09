export interface CustomerLink {
    id: string;
    userId: string;
    customerCode: string;
    customerName: string;
    serviceAddress: string;
    meterNumber?: string | null;
    createdAt: Date;
    updatedAt: Date;
}