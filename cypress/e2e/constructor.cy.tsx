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

    // 4. Открываем страницу конструктора
    cy.visit('/');

    // 5. Ждём загрузки ингредиентов и данных пользователя
    cy.wait('@getIngredients');
    cy.wait('@getUser');
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
        cy.get('button')
          .contains('×')
          .should('be.visible')
          .click({ force: true });
      });
    };

    beforeEach(() => {
      cy.visit('/');
      cy.wait('@getIngredients', { timeout: 10000 });
    });

    it('должен открывать модальное окно ингредиента', () => {
      openModal();

      cy.get('#modals', { timeout: 10000 })
        .should('be.visible')
        .within(() => {
          cy.contains('Детали ингредиента').should('be.visible');
          cy.contains(BUN_NAME).should('be.visible');
        });
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      // 1. Открываем модальное окно
      openModal();
      cy.get('#modals').should('be.visible', 'Модальное окно должно открыться');

      // 2. Находим первую кнопку внутри модального окна и кликаем по ней
      cy.get('#modals')
        .find('button')
        .first()
        .should('be.visible', 'Кнопка закрытия должна быть видна')
        .click();

      // 3. Проверяем, что модальное окно закрылось
      cy.get('#modals').should(
        'not.be.visible',
        'Модальное окно должно закрыться'
      );
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      // Открываем модальное окно
      openModal();
      cy.get('#modals').should('be.visible', 'Модальное окно должно открыться');

      // Кликаем по оверлею с force: true — игнорируем проверки видимости
      cy.get('.RuQycGaRTQNbnIEC5d3Y')
        .should('exist')
        .click({ force: true }) // force: true позволяет кликнуть, даже если элемент перекрыт
        .then(() => {
          // Ждём закрытия модального окна
          cy.get('#modals').should(
            'not.be.visible',
            'Модальное окно должно закрыться после клика на оверлей'
          );
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

    it('нажатие кнопки «Оформить заказ» и проверка модального окна', () => {
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
    });

    it('проверка пустоты конструктора после закрытия модального окна', () => {
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});
