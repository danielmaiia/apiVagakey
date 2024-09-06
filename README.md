# API VagaKey - Documentação de Endpoints
Esta API é responsável pelo gerenciamento de usuários, estacionamentos e reservas no sistema VagaKey.

### **Base URL**:
`http://localhost:3000`

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