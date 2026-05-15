import { TIngredient } from '@utils-types';
import ingredientsReducer from '../ingredientsSlices';
import { fetchIngredients } from '../ingredientsSlices';

// Тестовые данные
const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }
];

const initialState = {
  ingredients: [],
  isLoading: false,
  error: null
};

describe('ingredientsReducer', () => {
  it('должен устанавливать isLoading в true при fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.pending('requestId')
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  it('должен сохранять ингредиенты и устанавливать isLoading в false при fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      fetchIngredients.fulfilled(mockIngredients, 'requestId')
    );
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
  it('должен сохранять ошибку и устанавливать isLoading в false при fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка загрузки ингредиентов';

    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      fetchIngredients.rejected(new Error(errorMessage), 'requestId')
    );

    expect(state.error).toBe(errorMessage);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([]);
  });

  it('должен сохранять состояние при неизвестном экшене', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const state = ingredientsReducer(initialState, unknownAction);
    expect(state).toEqual(initialState);
  });
});
