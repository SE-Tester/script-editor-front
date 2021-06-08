import { AxiosResponse, Method } from 'axios';

export interface ApiFetch<DataType, ResponseType> {
  dispatch: any;
  url: string;
  isLegacy: boolean;
  method: Method;
  body: DataType;
  formData: FormData;
  callback: (data: ResponseType) => void;
  error: (err: AxiosResponse) => void;
  tokens: any;
}
