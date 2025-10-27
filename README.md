# Asset Cost Calculator - React Frontend

Фронтенд-приложение для системы расчета стоимости активов TCO, построенное на React + TypeScript.

## 🚀 Быстрый старт

### Установка зависимостей
```bash
npm install
```

### Запуск приложения

#### Вариант 1: С mock данными (без Django бэкенда)
```bash
npm run start:mock
```

#### Вариант 2: С подключением к Django API
```bash
npm run start:api
```

#### Вариант 3: Стандартный запуск
```bash
npm start
```
По умолчанию используется реальный API через прокси на `http://localhost:8000`.

## 📦 Доступные команды

В директории проекта доступны следующие команды:

### `npm run start:mock`
Запускает приложение в режиме разработки с использованием mock данных.\
Откройте [http://localhost:3000](http://localhost:3000) для просмотра в браузере.

### `npm run start:api`
Запускает приложение в режиме разработки с подключением к Django API.\
Требуется запущенный Django сервер на `http://localhost:8000`.

### `npm start`
Стандартный запуск (по умолчанию использует реальный API).

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
