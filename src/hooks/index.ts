import { ChangeEvent, useState } from 'react';

export function useForm<T extends Record<string, string>>(inputValues: T) {
  const [values, setValues] = useState<T>(inputValues);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const resetForm = () => {
    setValues(inputValues);
  };
  return { values, handleInputChange, setValues, resetForm };
}
