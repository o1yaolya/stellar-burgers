import { rootReducer } from '../services/root-reducer';


describe('rootReducer', () => {
  it('возвращает начальное состояние при неизвестном экшене UNKNOWN_ACTION', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual({
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0
      },
      order: {
        orderRequest: false,
        orderModalData: null
      },
      userOrder: {
        orders: [],
        isLoading: false,
        error: null
      },
      user: {
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false
      }
    });
  });
});
