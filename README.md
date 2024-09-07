# API VagaKey - Documentação de Endpoints
Esta API é responsável pelo gerenciamento de usuários, estacionamentos e reservas no sistema VagaKey.

### **Base URL**:
`http://localhost:3000`

---
## Gerenciamento de Usuários e Autenticação

### 1. Gerenciamento de Usuários
O gerenciamento de usuários na API VagaKey utiliza **MySQL** como banco de dados para armazenar as informações dos usuários, e **bcrypt** para garantir a segurança das senhas.

- **Criação de Usuário**: Ao criar um usuário, a senha fornecida é criptografada usando **bcrypt** e armazenada no banco de dados.
- **Atualização de Usuário**: Um usuário pode atualizar suas informações como nome e telefone. As atualizações são feitas com base no email do usuário.
- **Deletar Usuário**: Um usuário pode ser deletado do sistema, utilizando o email como identificador.
- **Buscar Usuário**: É possível buscar informações de um usuário pelo email.

### 2. Autenticação
A autenticação de usuários na API é feita usando **JWT (JSON Web Tokens)**. Aqui está o fluxo básico:

- **Login de Usuário**: Durante o login, a senha fornecida é comparada com o hash armazenado no banco de dados usando **bcrypt**. Se a senha for válida, um **token JWT** é gerado e enviado ao cliente.
- **Token JWT**: O token JWT contém informações como o email do usuário e tem uma validade configurada (10 horas). Ele é assinado com uma chave secreta.
- **Acesso Protegido**: O token JWT deve ser incluído no cabeçalho das requisições às rotas protegidas da API para que o acesso seja concedido. O servidor valida o token antes de permitir o acesso.

### Bibliotecas Utilizadas:
- **bcrypt**: Para criptografia das senhas dos usuários.
- **jsonwebtoken (JWT)**: Para geração de tokens JWT usados na autenticação.

---

## Usuários
### 1. Criar Usuário
- **Método**: `POST`
- **URL**: `/user/create`
**Descrição**: Cria um novo usuário no sistema.
**Corpo da Requisição (JSON)**:
```json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "telefone": "999999999",
  "tipousuario": "admin"
}
```

### 2. Login de Usuário
- **Método**: `POST`
- **URL**: `/user/login`
- **Descrição**: Autentica um usuário, fornecendo um token JWT para futuras requisições.
- **Corpo da Requisição (JSON)**:
```json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```
### 3. Atualizar Usuário
- **Método**: `PUT`
- **URL**: `/user/update`
- **Descrição**: Atualiza as informações de um usuário existente.
- **Corpo da Requisição (JSON)**:
```json

{
  "name": "João Silva Atualizado",
  "email": "joao@example.com",
  "telefone": "987654321"
}
```

### 4. Deletar Usuário
- **Método**: `DELETE`
- **URL**: `/user/delete`
- **Descrição**: Deleta um usuário existente no sistema.
- **Corpo da Requisição (JSON)**:
```json

{
  "email": "joao@example.com"
}
```

### 5. Buscar Usuário por Email
- **Método**: `GET`
- **URL**: `/user/:email`
- **Descrição**: Retorna os detalhes de um usuário específico com base no email.
- **Parâmetros**:
    - `:email:` O email do usuário que deseja buscar.

---

## Estacionamentos
### 1. Criar Estacionamento
- **Método**: `POST`
- **URL**: `/estacionamento/create`
- **Descrição**: Cria um novo estacionamento no sistema.
- **Corpo da Requisição (JSON)**:
```json

{
  "nome": "Estacionamento Central",
  "capacidadeTotal": 100,
  "vagasDisponiveis": 50,
  "tarifaPorHora": 5.0,
  "horarioFuncionamento": "08:00 - 18:00",
  "idUsuario": 1,
  "enderecoCep": "12345-678",
  "enderecoCidade": "São Paulo",
  "enderecoEstado": "SP",
  "enderecoNumero": "123",
  "enderecoRua": "Rua Central"
}
```
### 2. Pesquisar Estacionamentos
- **Método**: `GET`
- **URL**: `/estacionamento/search`
- **Descrição**: Pesquisa estacionamentos com base em critérios opcionais como nome, cidade, capacidade mínima e vagas disponíveis.
- **Exemplo de Parâmetros de Consulta**:
    - `?nome=Estacionamento Central`
    - `?cidade=São Paulo`
    - `?capacidadeMinima=100`
    - `?vagasDisponiveis=50`

---

## Reservas
### 1. Criar Reserva

- **Método**: `POST`
- **URL**: `/reserva/reservar`
- **Descrição**: Cria uma nova reserva de vaga em um estacionamento.
- **Corpo da Requisição (JSON)**:
```json

{
  "idUsuario": 1,
  "idEstacionamento": 1
}
```

### 2. Listar Todas as Reservas
- **Método**: `GET`
- **URL**: `/reserva/list`
- **Descrição**: Retorna todas as reservas registradas no sistema.

### 3. Atualizar Reserva
- **Método**: `PUT`
- **URL**: `/reserva/update`
- **Descrição**: Atualiza uma reserva existente, permitindo mudar o status (por exemplo, para "Cancelada").
- **Corpo da Requisição (JSON)**:
```json

{
  "idReserva": 1,
  "statusReserva": "Cancelada"
}
```

### 4. Finalizar Reserva
- **Método**: `POST`
- **URL**: `/reserva/finalizar`
- **Descrição**: Finaliza uma reserva e calcula o valor a ser pago com base no tempo de permanência.
- **Corpo da Requisição (JSON)**:
```json

{
  "idReserva": 1,
  "idMetodoPagamento": 1
}
```

### 5. Cancelar Reserva
- **Método**: `DELETE`
- **URL**: `/reserva/cancelar/:idReserva`
- **Descrição**: Cancela uma reserva existente e atualiza o número de vagas disponíveis no estacionamento.
- **Parâmetros**:
    - `:idReserva:` O ID da reserva a ser cancelada.