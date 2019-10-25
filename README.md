# Desafio Backend Club Petro

Foi proposta o tratamento de vendas fraudulentas através de uma API que utiliza das seguintes regras:

```
1. O mesmo frentista pode vender no máximo 20 abastecimentos no mês
```

```
2. Um único frentista pode vender no máximo 20% de todas vendas
```

```
3. Um único cliente pode abastecer seu carro no máximo 7 vezes por mês.
```

```
4. Um frentista pode vender no máximo 3 vezes para o mesmo cliente.
```

# Solução Proposta

---

#### 1. Banco de dados

Foi escolhido utilizar um banco NoSQL, sendo ele o banco de dados **MongoDB**. O motivo da escolha está associado ao fato dessa ser uma aplicação de pequeno porte, sua simplicidade de implementação, configuração e de ser bem indicado para aplicações que não possuem muitas relações entre as entidades, como é o caso do problema proposto.
Para aplicações de maior porte com muitos relacionamentos é mais indicado um banco SQL como o MySQL ou Postgres.

---

#### 2. Models

##### 2.1 Client

Model referente aos clientes do sistema. Possui os seguintes campos:

| Campo      | Descrição                                                                           |
| ---------- | ----------------------------------------------------------------------------------- |
| cpf        | Um campo obrigatório do tipo Int (Number na notação do Mongo).                      |
| clientCode | Campo obrigatório do tipo string, referente ao código único do cliente.             |
| createdAt  | Timestamp do momento da criação do registro. É feito internamente pelo mongo.       |
| updatedAt  | Timestamp do momento da última edição do registro. É feito internamente pelo mongo. |

Vale ressaltar que todo objeto do mongo possui um campo único de nome **\_id**, porém como esse é um código gerado internamento pelo próprio mongo que não tem como alterar e esse codigo único de cliente pode ter padrões utilizados pela própria empresa, foi criado esse campo.

##### 2.2 Attendant

Model referente aos frentistas do sistema. Possui os seguintes campos:

| Campo         | Descrição                                                                           |
| ------------- | ----------------------------------------------------------------------------------- |
| cpf           | Um campo obrigatório do tipo Int (Number na notação do Mongo).                      |
| attendantCode | Campo obrigatório do tipo string, referente ao código único do frentista.           |
| createdAt     | Timestamp do momento da criação do registro. É feito internamente pelo mongo.       |
| updatedAt     | Timestamp do momento da última edição do registro. É feito internamente pelo mongo. |

##### 2.3 Sale

Model referente às vendas do sistema.

| Campo         | Descrição                                                                                                                                                                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| price         | Um campo obrigatório do tipo float (Decimal128 na notação do Mongo).                                                                                                                                                                          |
| clientCode    | Campo obrigatório do tipo string, referente ao código único do cliente que efetuou a compra.                                                                                                                                                  |
| attendantCode | Campo obrigatório do tipo string, referente ao código único do frentista que realizou a venda.                                                                                                                                                |
| client        | Campo obrigatório, porém passado de forma interna pelo controller ao inserir uma venda bem sucedida no sistema. É o id interno do mongo, utilizado para popular a venda com as informações dos clientes sem ter redundancia de armazenamento. |
| createdAt     | Timestamp do momento da criação do registro. É feito internamente pelo mongo.                                                                                                                                                                 |
| updatedAt     | Timestamp do momento da última edição do registro. É feito internamente pelo mongo.                                                                                                                                                           |

---

#### 3. Controllers

Os controllers criados foram **AttendantController**, **ClientController** e **SaleController**. Todos eles possuem as mesmas duas funções implementadas, sendo elas: _store e index_.

| Função | Descrição                                                                                       |
| ------ | ----------------------------------------------------------------------------------------------- |
| store  | Função responsável por armazenar o dado respectivo model no banco de dados.                     |
| index  | Função responsável por retornar um json contendo o dado de todos registros do respectivo model. |

---

#### 4. API

Foi implementado os seguintes métodos na api.

| URL base | https://localhost.com |
| -------- | --------------------- |


| Método | Rota        | Descrição                                                                                                              |
| :----- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| GET    | /clients    | Retorna o json contendo todos clientes cadastrados no sistema.                                                         |
| POST   | /clients    | Cadastra um cliente no sistema ao passar no body da requisição os campos **cpf** e **clientCode**.                     |
| GET    | /attendants | Retorna o json contendo todos frentistas cadastrados no sistema.                                                       |
| POST   | /attendants | Cadastra um frentista no sistema ao passar no body da requisição os campos **cpf** e **attendantCode**.                |
| GET    | /sales      | Retorna o json contendo todos as vendas cadastradas no sistema.                                                        |
| POST   | /sales      | Cadastra uma venda no sistema ao passar no body da requisição os campos **attendantCode**, **clientCode** e **price**. |

Vale ressaltar que erros foram tratados e a api retorna sempre um campo chamado **error** que contém o valor **true** ou **false**, indicando se foi uma operação bem sucedida ou não. Há também um campo **message** que sempre retorna uma mensagem para indicar o tipo de erro que ocorreu, caso ocorra.

---

#### 5. Observações

Para realizar os testes, o banco de dados foi hospedado no meu cluster pessoal do **MongoDB Atlas** que já está populado com dados até o dia 31/10/2019. Após essa data os testes deveram ser realizados localmente.

Foi adicionado no arquivo **SaleController.js** uma condição extra, se não sempre entraria na condição 2 citada no tópico 1. Se o sistema ainda não está populado e todos frentistas possuem zero vendas, qualquer venda que ele faça significa 100% das vendas. Então foi colocada mais uma condição, sendo ela:

```js
if (attendantSales + 1 > totalSales * 0.2 && totalSales > 5)
	return res.json({
		error: true,
		message: 'Error. The seller has reached the limit of 20% of sales.',
	});
```

Com essa condição, é necessário ter mais de 5 vendas para começar analisar os 20% do total de vendas.

---

#### 6. Como executar

Para executar basta rodar o comando:

```
yarn dev
```

---

### Dúvidas? Sugestões? Críticas?

Manda um e-mail para **fagundesjg@outlook.com** que responderei o mais breve possível :)
