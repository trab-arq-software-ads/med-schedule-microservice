# Doctors and Patients API 

Using Express with PostgreSQL.

## Running the app 

```
$ npm install

$ npm start
```

## Routes
### Doctors
```
GET /doctors -> Retorna todos os médicos registrados.
POST /doctors -> Cria um novo médico.
GET /doctors/:id -> Retorna o médico com o ID especificado.
PUT /doctors/:id -> Atualiza o médico com o ID especificado.
DELETE /doctors/:id -> Deleta o médico com o ID especificado.
```
### Patients
```
GET /patients -> Retorna todos os pacientes registrados.
POST /patients -> Cria um novo paciente.
GET /patients/:id -> Retorna o paciente com o ID especificado.
PUT /patients/:id -> Atualiza o paciente com o ID especificado.
DELETE /patients/:id -> Deleta o paciente com o ID especificado.
```
