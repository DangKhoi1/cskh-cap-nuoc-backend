// Một liên kết đã xác nhận giữa tài khoản app và mã khách hàng cấp nước.
export interface CustomerLink {
  linkId: string;
  customerCode: string;
  label: string;
  serviceAddress: string;
  meterNumber: string;
}
