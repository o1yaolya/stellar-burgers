import {
  createOrder,
  getOrderByNumber,
  clearOrderModalData
} from '../orderSlice';
import orderReducer from '../orderSlice';
import { TOrderState } from '../orderSlice';
import { TOrder } from '@utils-types';

// Mock данных
const mockOrder: TOrder = {
  _id: '6a03843ba64177001b3354e3',
  ingredients: [
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa0946',
    '643d69a5c3f7b9001cfa093c'
  ],
  status: 'done',
  name: 'Био-марсианский минеральный люминесцентный краторный бургер',
  createdAt: '2026-05-12T19:49:15.337Z',
  updatedAt: '2026-05-12T19:49:15.444Z',
  number: 105206
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null
};

describe('orderReducer', () => {
  describe('reducers', () => {
    it('должен очищать orderModalData при clearOrderModalData', () => {
      const stateWithData: TOrderState = {
        ...initialState,
        orderModalData: mockOrder
      };

      const state = orderReducer(stateWithData, clearOrderModalData());

      expect(state.orderModalData).toBeNull();
    });
  });

  describe('extraReducers для createOrder', () => {
    it('должен устанавливать orderRequest в true при createOrder.pending', () => {
      const state = orderReducer(
        initialState,
        createOrder.pending('requestId', mockOrder.ingredients)
      );

      expect(state.orderRequest).toBe(true);
      expect(state.orderModalData).toBeNull();
    });

    it('должен устанавливать orderRequest в false и сохранять orderModalData при createOrder.fulfilled', () => {
      const state = orderReducer(
        { ...initialState, orderRequest: true },
        createOrder.fulfilled(mockOrder, 'requestId', mockOrder.ingredients)
      );

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('должен устанавливать orderRequest в false при createOrder.rejected', () => {
      const errorMessage = 'Ошибка создания заказа';
      const mockError = new Error(errorMessage);

      const state = orderReducer(
        { ...initialState, orderRequest: true },
        createOrder.rejected(
          null,
          'requestId',
          mockOrder.ingredients,
          mockError
        )
      );

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
    });
  });

  describe('extraReducers для getOrderByNumber', () => {
    it('должен сохранять orderModalData при getOrderByNumber.fulfilled', () => {
      const state = orderReducer(
        initialState,
        getOrderByNumber.fulfilled(mockOrder, 'requestId', mockOrder.number)
      );

      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.orderRequest).toBe(false); // не должен менять orderRequest
    });
  });

  describe('неизвестные экшены', () => {
    it('должен сохранять состояние при неизвестном экшене', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION' };
      const state = orderReducer(initialState, unknownAction);

      expect(state).toEqual(initialState);
    });
  });
});
