import { AxiosPromise, AxiosRequestConfig } from "axios";
import { RefetchOptions } from "axios-hooks";

export type AxiosRefetch = (
  config?: AxiosRequestConfig<any> | undefined,
  options?: RefetchOptions | undefined
) => AxiosPromise<any>;

export type HexathonData = {
  id: string; // api docs say this should be an i64? but i console.logged it in `EventCard` and its a string so....
  name: string;
  shortCode: string;
  isActive: boolean;
  isTeamBased: boolean;
  startDate: string;
  endDate: string;
  isDev?: boolean;
  coverImage?: string;
  emailHeaderImage: string;
};