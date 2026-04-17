import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { fetchFeed } from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { TOrdersData } from '@utils-types';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  useEffect(() => {
    handleGetFeeds();
  }, []);

  const orders = useSelector((state) => state.feed.orders);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
