// Một liên kết đã xác nhận giữa tài khoản app và điểm cấp nước.
export interface CustomerLink {
  linkId: string;
  servicePointId: string;
  customerCode: string;
  label: string;
  serviceAddress: string;
  meterNumber: string;
}
