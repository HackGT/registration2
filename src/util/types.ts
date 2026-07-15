import { AxiosPromise, AxiosRequestConfig } from "axios";
import { RefetchOptions } from "axios-hooks";

export type AxiosRefetch = (
  config?: AxiosRequestConfig<any> | undefined,
  options?: RefetchOptions | undefined
) => AxiosPromise<any>;

export interface ReferralData {
  firstName?: string;
  lastName?: string;
  email?: string;
  school?: string;
  resume?: {
    name?: string;
  };
  referForEarlyApplication?: boolean;
  referForReimbursement?: boolean;
  essay?: string;
}

export interface Referral {
  id: string;
  status: string;
  updatedAt?: string;
  referrerId?: string;
  referrerName?: string;
  referrerEmail?: string;
  hexathon?: string;
  referralData?: ReferralData;
}

export interface ReferralsResponse {
  referrals: Referral[];
  total: number;
}
