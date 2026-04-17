import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch } from '../../services/store';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getOrderByNumber } from '../../services/slices/orderSlice';
import { TOrder } from '@utils-types';

interface OrderInfoState {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const { ingredients } = useSelector((state) => state.ingredients);
  const { orders: feedOrders } = useSelector((state) => state.feed);
  const { orders: userOrders } = useSelector((state) => state.userOrders);

  const [state, setState] = useState<OrderInfoState>({
    order: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    if (!number) {
      setState({
        order: null,
        isLoading: false,
        error: 'Номер заказа не указан'
      });
      return;
    }

    const orderNumber = Number(number);
    if (isNaN(orderNumber)) {
      setState({
        order: null,
        isLoading: false,
        error: 'Некорректный номер заказа'
      });
      return;
    }

    // Сначала ищем в локальных данных
    const allOrders = [...feedOrders, ...userOrders];
    const foundOrder = allOrders.find((order) => order.number === orderNumber);

    if (foundOrder) {
      setState({ order: foundOrder, isLoading: false, error: null });
    } else {
      // Если не нашли — запрашиваем с сервера
      dispatch(getOrderByNumber(orderNumber))
        .unwrap()
        .then((order) => {
          setState({ order, isLoading: false, error: null });
        })
        .catch((err) => {
          console.error('Failed to fetch order:', err);
          setState({
            order: null,
            isLoading: false,
            error: 'Не удалось загрузить заказ'
          });
        });
    }
  }, [dispatch, number, feedOrders, userOrders]);

  const orderInfo = useMemo(() => {
    if (!state.order || !ingredients.length) return null;

    const date = new Date(state.order.createdAt);

    const ingredientsInfo = state.order.ingredients.reduce(
      (acc: Record<string, TIngredient & { count: number }>, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    return {
      ...state.order,
      ingredientsInfo: ingredientsInfo,
      date,
      total
    };
  }, [state.order, ingredients]);

  if (state.isLoading) {
    return <Preloader />;
  }

  if (state.error) {
    return (
      <div>
        <p>{state.error}</p>
      </div>
    );
  }

  if (!orderInfo) {
    return (
      <div>
        <p>Заказ не найден</p>
      </div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
