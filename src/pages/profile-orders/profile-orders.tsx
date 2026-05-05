import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { fetchUserOrders } from '../../services/slices/userOrderSlice';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { userOrderSlice } from '../../services/slices/userOrderSlice';
import { OrdersList } from '@components';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.userOrders);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user && orders.length === 0 && !isLoading) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, user, orders.length, isLoading]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!orders || orders.length === 0) {
    return <div>У вас пока нет заказов</div>;
  }

  return <OrdersList orders={orders} />;
};
