export const useFormValidation = <T extends Record<string, unknown>>() => {
  const validateForm = (formData: T): { isValid: boolean; errors: { [key: string]: string } } => {
    const newErrors: { [key: string]: string } = {};

    if ('email' in formData && typeof formData.email === 'string') {
      if (!formData.email) newErrors.email = 'Email is required.';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
    }

    if ('password' in formData && typeof formData.password === 'string') {
      if (!formData.password) newErrors.password = 'Password is required.';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    }
    
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  return { validateForm };
};
