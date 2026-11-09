
export const V2_CUSTOMER_PORT = Symbol('V2_CUSTOMER_PORT');

export interface V2CustomerProfile {
    customerCode: string;
    customerName: string;
    serviceAddress: string;
    meterNumber?: string | null;
}

export interface V2CustomerPort {
    verifyAndGetCustomer(customerCode: string, phoneNumber: string): Promise<V2CustomerProfile | null>;
}