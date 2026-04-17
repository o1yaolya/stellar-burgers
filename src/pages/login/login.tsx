import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks';
import { loginUser } from '../../services/slices/userSlice';

export const Login: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isLoading, error } = useSelector((state) => state.user);
  const { values, handleInputChange } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(values)).unwrap();
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    } catch (err) {
      console.error('', err);
    }
  };

  return (
    <LoginUI
      errorText=''
      email={values.email}
      setEmail={(value) =>
        handleInputChange({ target: { name: 'email', value } } as any)
      }
      password={values.password}
      setPassword={(value) =>
        handleInputChange({ target: { name: 'password', value } } as any)
      }
      handleSubmit={handleSubmit}
    />
  );
};
