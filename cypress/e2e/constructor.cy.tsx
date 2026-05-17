const BUN_NAME = 'Краторная булка N-200i';
const INGREDIENT_NAME = 'Биокотлета из марсианской Магнолии';
const SAUCE_NAME = 'Соус фирменный Space Sauce';
const API = 'https://norma.education-services.ru/api';

describe('E2E тесты: Конструктор бургера', () => {
  beforeEach(() => {
    // 1. Устанавливаем моковый токен авторизации
    cy.setCookie('accessToken', 'mock-token');
    localStorage.setItem('refreshToken', 'mock-refresh');

    // 2. Перехватываем запрос к API за ингредиентами
    cy.intercept('GET', `${API}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // 3. Перехватываем запрос данных пользователя (для оформления заказа)
    cy.intercept('GET', `${API}/auth/user`, {
      fixture: 'user.json'
    }).as('getUser');

    // 4. Перехватываем POST-запрос на создание заказа
    cy.intercept('GET', `${API}/orders`, { fixture: 'order.json' }).as(
      'createOrder'
    );

    // 5. Открываем страницу конструктора
    cy.visit('/');

    // 6. Ждём загрузки ингредиентов и данных пользователя
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  // ОЧИСТКА МОКОВ ПОСЛЕ КАЖДОГО ТЕСТА
  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.clearLocalStorage('refreshToken');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен позволять добавить булку в конструктор', () => {
      cy.addIngredientByName(BUN_NAME);
      cy.get('[class*=constructor-element]').contains(BUN_NAME).should('exist');
    });

    it('должен позволять добавить начинку в конструктор', () => {
      cy.addIngredientByName(INGREDIENT_NAME);
      cy.get('[class*=constructor-element]')
        .contains(INGREDIENT_NAME)
        .should('exist');
    });

    it('должен позволять добавить соус в конструктор', () => {
      cy.addIngredientByName(SAUCE_NAME);
      cy.get('[class*=constructor-element]')
        .contains(SAUCE_NAME)
        .should('exist');
    });
  });

  describe('Модальные окна', () => {
    // Вспомогательная функция для открытия модального окна
    const openModal = () => {
      cy.contains(BUN_NAME)
        .parent('li')
        .find('a')
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });
    };

    // Вспомогательная функция для закрытия модального окна через крестик
    const closeModalWithCloseButton = () => {
      cy.get('#modals').within(() => {
        cy.get('button').should('be.visible').click({ force: true });
      });
    };

    beforeEach(() => {
      cy.visit('/');
      cy.wait('@getIngredients', { timeout: 10000 });
    });

    it('должен открывать модальное окно ингредиента', () => {
      openModal();

      // Проверяем видимость содержимого модального окна вместо самого #modals
      cy.get('#modals').within(() => {
        cy.contains('Детали ингредиента').should('exist');
        cy.contains(BUN_NAME).should('exist');
      });
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      // 1. Открываем модальное окно
      openModal();

      // Ждём видимости содержимого модалки
      cy.get('#modals').within(() => {
        cy.contains('Детали ингредиента').should(
          'be.visible',
          'Заголовок "Детали ингредиента" должен быть виден'
        );
        cy.contains(BUN_NAME).should(
          'be.visible',
          'Название ингредиента должно быть видно'
        );
      });

      // 2. Находим первую кнопку внутри модального окна и кликаем по ней
      cy.get('#modals')
        .find('button')
        .first()
        .should('be.visible', 'Кнопка закрытия должна быть видна')
        .click();

      // 3. Проверяем, что содержимое модального окна исчезло
      cy.get('#modals').within(() => {
        cy.contains('Детали ингредиента').should(
          'not.exist',
          'Заголовок "Детали ингредиента" должен исчезнуть'
        );
        cy.contains(BUN_NAME).should(
          'not.exist',
          'Название ингредиента должно исчезнуть'
        );
      });
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      // Открываем модальное окно
      openModal();

      // Ждём видимости содержимого модалки
      cy.get('#modals').within(() => {
        cy.contains('Детали ингредиента').should('exist');
      });

      // Кликаем по оверлею
      cy.get('.RuQycGaRTQNbnIEC5d3Y')
        .should('exist')
        .click({ force: true })
        .then(() => {
          // Проверяем, что содержимое модального окна исчезло
          cy.get('#modals').within(() => {
            cy.contains('Детали ингредиента').should('not.exist');
            cy.contains(BUN_NAME).should('not.exist');
          });
        });
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Перехватываем POST-запрос на создание заказа
      cy.intercept('POST', `${API}/orders`, { fixture: 'order.json' }).as(
        'createOrder'
      );
    });

    it('оформление заказа, закрытие модального окна и очистка конструктора', () => {
      // 1. Собираем бургер
      cy.addIngredientByName(BUN_NAME);
      cy.addIngredientByName(INGREDIENT_NAME);
      cy.addIngredientByName(SAUCE_NAME);

      // 2. Кликаем по кнопке «Оформить заказ»
      cy.contains('Оформить заказ').click();

      // 3. Ждём создания заказа
      cy.wait('@createOrder');

      // 4. Проверяем модальное окно и номер заказа
      cy.get('#modals').contains('105206').should('exist');

      // 5. Закрываем модальное окно (кликаем по крестику)
      cy.get('#modals').find('button').first().should('be.visible').click();

      // 6. Проверяем, что содержимое модального окна исчезло
      cy.get('#modals').within(() => {
        cy.contains('105206').should('not.exist');
      });

      // 7. Проверяем очистку конструктора (должны исчезнуть добавленные ингредиенты)
      cy.get('[class*=constructor-element]').should('not.exist');

      // 8. Проверяем подсказки об empty state
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});
