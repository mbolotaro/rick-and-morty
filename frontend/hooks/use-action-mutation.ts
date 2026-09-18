'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ActionError } from '@/lib/actions/result';
import { HttpStatus } from '@/lib/http/status';

interface UseActionMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  refreshOnSuccess?: boolean;
  redirectOnSuccess?: string;
  redirectOnUnauthorized?: string;
}

export function useActionMutation<TData, TVariables>(
  options: UseActionMutationOptions<TData, TVariables>,
) {
  const router = useRouter();

  return useMutation<TData, Error, TVariables>({
    mutationFn: options.mutationFn,
    onSuccess: (data, variables) => {
      options.onSuccess?.(data, variables);

      if (options.redirectOnSuccess) router.push(options.redirectOnSuccess);
      if (options.refreshOnSuccess) router.refresh();
    },
    onError: (error) => {
      if (
        error instanceof ActionError &&
        error.status === HttpStatus.Unauthorized &&
        options.redirectOnUnauthorized
      ) {
        router.push(options.redirectOnUnauthorized);
        return;
      }

      toast.error(error.message);
    },
  });
}
