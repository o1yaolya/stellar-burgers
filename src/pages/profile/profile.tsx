import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/userSlice';
import { useForm } from '../../hooks';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  // Инициализируем форму только когда пользователь загружен
  const { values, handleInputChange, setValues } = useForm({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (!user && !isUserLoaded) {
      setIsUserLoaded(true);
    }
  }, [dispatch, user, isUserLoaded]);

  useEffect(() => {
    if (user) {
      setValues({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user, setValues]);

  const isFormChanged =
    (user && values.name !== user.name) ||
    (user && values.email !== user.email) ||
    !!values.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const updatedData: { name?: string; email?: string; password?: string } =
      {};
    if (values.name !== user?.name) updatedData.name = values.name;
    if (values.email !== user?.email) updatedData.email = values.email;
    if (values.password) updatedData.password = values.password;

    if (Object.keys(updatedData).length > 0) {
      await dispatch(updateUser(updatedData));
      setValues({ ...values, password: '' });
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setValues({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  return (
    <ProfileUI
      formValue={values}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
