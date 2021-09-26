export interface Certificate {
  subject: Name;
  issuer: Name;
  not_before: Date;
  not_after: Date;
  sans: string[] | undefined;
  pub_key_info: PublicKey;
  misc: Miscellaneous;
  sha256: string;
  sha1: string;
  ca: boolean;
  key_usage: string;
  extended_key_usages: string[];
  subject_key_id: string;
  authority_key_id: string;
  crl_endpoints: string[];
  ocsp_server: string[];
  issuing_cert_url: string[];
}

export interface Name {
  country: string;
  state_province: string;
  locality: string;
  organization: string;
  organizational_unit: string;
  common_name: string;
}

export interface PublicKey {
  algorithm: string;
  size: number;
  value: string;
}

export interface Miscellaneous {
  serial_number: string;
  signature_algorithm: string;
  version: number;
  pem: string;
}