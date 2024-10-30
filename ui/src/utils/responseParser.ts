import { AxiosResponse } from "axios";

export const successResponseParser = <T>(response: any): APIResp<T> => {
  if (response.data.status === 200) {
    return {
      error: false,
      message: "Success",
      data: response.data.data as T,
    };
  }
  return {
    error: true,
    message: response.data.message,
    data: null as T,
  };
};
export const failureResponseParser = <T>(err: any): APIResp<T> => {
  console.error("API ERROR:", err);
  return {
    error: true,
    message: "Internal Server Error",
    data: null,
  } as APIResp;
};
