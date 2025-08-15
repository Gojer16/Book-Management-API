import { useState } from 'react';
import { useRouter } from 'next/navigation';

type SubmitFn<T> = (formData: T) => Promise<void>;

export const useFormSubmit = <T extends Record<string, any>>(submitUrl: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent, formData: T, validateForm: (formData: T) => { isValid: boolean; errors: Record<string, string> }, setErrors: (errors: Record<string, string>) => void) => {
    e.preventDefault();
    setApiError('');

    const { isValid, errors } = validateForm(formData);
    setErrors(errors);

    if (!isValid) return;

    setIsLoading(true);

    try {
      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Request failed');

      if (data.token) localStorage.setItem('token', data.token);

      router.push('/'); // ! Redirect link
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading, apiError };
};
