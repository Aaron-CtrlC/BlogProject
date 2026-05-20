import type { Response } from 'express';

interface SuccessOptions {
  message?: string;
  statusCode?: number;
}

export function sendSuccess<T>(res: Response, data: T, options?: SuccessOptions) {
  const { message, statusCode = 200 } = options ?? {};

  const body: Record<string, unknown> = { success: true, data };
  if (message) body.message = message;

  return res.status(statusCode).json(body);
}
