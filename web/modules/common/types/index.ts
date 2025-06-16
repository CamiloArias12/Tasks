export type CommonServiceRes<T> = {
  data?: T;
  messages?: string[];
  errors?: [string[]];
};


export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

