import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { useForm } from '../../hooks';
import { registerUser } from '../../services/slices/userSlice';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

export const Register: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const error = useSelector((state) => state.user.error);
  const isLoading = useSelector((state) => state.user.isLoading);

  const { values, handleInputChange } = useForm({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(registerUser(values)).unwrap();
      // При успешной регистрации можно перенаправить пользователя
      navigate('/');
    } catch (err) {
      console.error('Ошибка регистрации:', err);
    }
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={values.email}
      userName={values.name}
      password={values.password}
      setEmail={(value) =>
        handleInputChange({ target: { name: 'email', value } } as any)
      }
      setPassword={(value) =>
        handleInputChange({ target: { name: 'password', value } } as any)
      }
      setUserName={(value) =>
        handleInputChange({ target: { name: 'name', value } } as any)
      }
      handleSubmit={handleSubmit}
    />
  );
};
