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
- Ao criar uma entrega de lanche, sua autorização e confirmar a entrega, **substitua o valor `ID_DE_AUTORIZACAO`** pelo ID real retornado ao criar a autorização correspondente.

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

O servidor exibirá todas as interfaces de rede disponíveis e seus respectivos endereços IP ao iniciar.

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

### Configuração da API e Conectividade 🔌

#### 1. Identificando o IP correto

Ao iniciar o servidor, ele mostrará todas as interfaces de rede disponíveis. Escolha o IP correto baseado no seu método de conexão:

- **USB Tethering**: Use o IP da interface Ethernet que apareceu após ativar o tethering
- **Wi-Fi**: Use o IP da interface Wi-Fi (geralmente começa com 192.168)
- **Rede Local**: Use o IP da interface de rede local

#### 2. Configurando o IP no App

No arquivo `./lunchApp_ec7/services/api.js`, atualize a constante `HOST_IP`:

```js
const HOST_IP = 'SEU_IP_AQUI';  // Ex: '192.168.154.189'
```

#### 3. Testando a Conexão

1. Inicie o servidor: `node ./index.js`
2. Teste o acesso no navegador do celular: `http://SEU_IP_AQUI:3000/students`
3. Se funcionar no navegador mas não no app, verifique:
   - Se o Expo está atualizado
   - Se o dispositivo e o PC estão na mesma rede
   - Se não há firewall bloqueando a conexão

### Troubleshooting 🔧

1. **Erro "Network Error"**:
   - Verifique se está usando o IP correto
   - Confirme se o servidor está rodando
   - Teste o acesso via navegador do celular

2. **USB Tethering**:
   - Use o IP da nova interface Ethernet que aparece ao ativar o tethering
   - Certifique-se que o USB está em modo de transferência de dados

3. **Expo não conecta**:
   - Atualize o Expo CLI: `npm install -g expo-cli`
   - Reinstale o Expo Go no dispositivo
   - Tente usar o modo túnel do Expo

### Inicialização do app

```bash
npx expo start --android
```

---

## ✅ Pronto para usar!

Agora você tem um sistema funcional para registrar, autorizar e entregar lanches escolares — com comunicação entre app e backend. 🚀

---