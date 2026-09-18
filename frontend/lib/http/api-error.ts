import { z } from 'zod';

const apiIssueSchema = z.object({
  path: z.string(),
  message: z.string(),
});

export const apiErrorPayloadSchema = z.object({
  message: z.union([z.string(), z.array(z.string())]).optional(),
  issues: z.array(apiIssueSchema).optional(),
});

export interface ApiIssue {
  path: string;
  message: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly issues: ApiIssue[] = [],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
