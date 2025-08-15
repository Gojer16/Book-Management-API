import { useState } from "react";
import { NewBook } from "./useBooks";

export const useForm = (initialState: NewBook) => {
  const [formData, setFormData] = useState<NewBook>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setFormData(initialState);

  return { formData, handleChange, setFormData, resetForm };
};
