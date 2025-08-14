import { useState } from 'react';

type Errors = { [key: string]: string };

export const useFormInput = <T extends Record<string, any>>(initialState: T) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return { formData, setFormData, errors, setErrors, handleInputChange };
};