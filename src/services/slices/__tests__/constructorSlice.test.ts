import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient
} from '../constructorSlice';
import { TIngredient } from '../../../utils/types';

const bun: TIngredient = {
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
};

const ingredient: TIngredient = {
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
};

const sauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

const initialState = {
  bun: null,
  ingredients: []
};

describe('burgerConstructorReducer', () => {
  it('должен позволять добавить булку в конструктор', () => {
    const state = burgerConstructorReducer(initialState, addIngredient(bun));
    expect(state.bun).toMatchObject(bun);
  });

  it('должен позволять добавить начинку в конструктор', () => {
    const state = burgerConstructorReducer(
      initialState,
      addIngredient(ingredient)
    );
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(ingredient);
  });

  it('должен позволять добавить несколько начинок', () => {
    let state = burgerConstructorReducer(
      initialState,
      addIngredient(ingredient)
    );
    state = burgerConstructorReducer(state, addIngredient(sauce));
    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]).toMatchObject(ingredient);
    expect(state.ingredients[1]).toMatchObject(sauce);
  });

  it('должен позволять удалить ингредиент из конструктора', () => {
    // Добавляем ингредиенты
    let state = burgerConstructorReducer(
      initialState,
      addIngredient(ingredient)
    );
    state = burgerConstructorReducer(state, addIngredient(sauce));

    // Получаем добавленный ингредиент ИЗ СОСТОЯНИЯ (у него есть поле id)
    const addedIngredient = state.ingredients.find(
      (item) => item._id === ingredient._id
    );

    // Проверяем, что ингредиент найден
    expect(addedIngredient).toBeDefined();

    // Удаляем ингредиент, передавая его id (UUID)
    state = burgerConstructorReducer(
      state,
      removeIngredient(addedIngredient!.id) // используем !, так как expect уже проверил, что addedIngredient существует
    );

    // Проверяем результат
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(sauce);
  });

  it('должен позволять изменить порядок ингредиентов', () => {
    let state = burgerConstructorReducer(
      initialState,
      addIngredient(ingredient)
    );
    state = burgerConstructorReducer(state, addIngredient(sauce));

    state = burgerConstructorReducer(
      state,
      moveIngredient({ dragIndex: 0, hoverIndex: 1 })
    );

    expect(state.ingredients[0]).toMatchObject(sauce);
    expect(state.ingredients[1]).toMatchObject(ingredient);
  });

  it('должен сохранять состояние при неизвестном экшене', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const state = burgerConstructorReducer(initialState, unknownAction);
    expect(state).toEqual(initialState);
  });
});
