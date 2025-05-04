# 🍱 Lunch Delivery System

Sistema completo para **controle de entregas de lanches escolares**, com:

- 📱 Aplicativo mobile usando **React Native + Expo**
- 🌐 API REST com **Node.js + Express + MongoDB**

---

## 📁 Estrutura do Projeto

```
lunchDelivery/
├── lunchApp_ec7/         # Aplicativo Mobile (React Native)
│   ├── screens/          # Telas do app
│   │   ├── Authorization/
│   │   ├── Delivery/
│   │   └── Students/
│   ├── services/         # Comunicação com a API
│   └── App.js            # Entrada principal do app
│
└── lunchServer/          # Servidor Node.js (API)
    ├── config/           # Configurações e coleção Postman
    ├── controller/       # Controladores de rotas
    ├── middlewares/      # Validações e middlewares
    ├── model/            # Modelos de dados (Mongoose)
    ├── routes/           # Definições de rotas
    └── index.js          # Entrada principal do servidor
```

---

## ⚙️ Pré-requisitos

### 📦 MongoDB

- Tenha o MongoDB instalado e rodando na porta padrão `27017`.

### 📫 Postman (recomendado)

- Importe a coleção localizada em:
  ```
  ./lunchServer/config/LunchSystemAPI.postman_collection.json
  ```
- Ao criar uma entrega de lanche, **substitua o valor `ID_DE_AUTORIZACAO`** pelo ID real retornado ao criar a autorização correspondente.

### 🔍 Extensão recomendada (opcional)

- **MongoDB for VSCode** – para visualizar os dados direto pelo editor.

---

## 🚀 Servidor `lunchServer`

### Instalação de dependências

```bash
npm install
```

### Inicialização do servidor

```bash
node ./index.js
```

---

## 📲 Aplicativo `lunchApp_ec7`

### Instalação de dependências

```bash
npm install
```

### Dependências principais

```bash
npm install \
@react-native-community/datetimepicker \
@react-native-picker/picker \
@react-navigation/bottom-tabs \
@react-navigation/native \
@react-navigation/native-stack \
axios \
date-fns \
expo \
expo-image-picker \
react \
react-native \
react-native-safe-area-context \
react-native-screens
```

### Configuração da API

- No arquivo `./lunchApp_ec7/services/api.js`, altere a constante `HOST_IP`:

```js
const HOST_IP = 'XXX.XXX.X.XX';
```

### Inicialização do app

```bash
npx expo start --android
```

---

## ✅ Pronto para usar!

Agora você tem um sistema funcional para registrar, autorizar e entregar lanches escolares — com comunicação entre app e backend. 🚀

---