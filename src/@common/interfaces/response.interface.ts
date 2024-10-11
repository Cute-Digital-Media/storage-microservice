export interface ResponseData<T = any> {
  status?: number;
  data?: T;
  message?: string;
}

const DEFAULT_OPTIONS = {
  data: undefined,
  message: undefined,
  status: 200,
};

export function ResponseMessage<T>(options: ResponseData<T>) {
  return { ...DEFAULT_OPTIONS, ...options };
}
