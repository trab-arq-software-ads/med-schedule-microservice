const express = require("express");
require("express-async-errors");

const grpcDoctorServer = require("./app/services/DoctorsService");
const grpcPatientServer = require("./app/services/PatientsService");

const routes = require("./routes");

const app = express();

// Start the gRPC server
const doctorServer = new grpcDoctorServer();
doctorServer.start(50051);

const patientServer = new grpcPatientServer();
patientServer.start(50052);

app.use(express.json());
app.use(routes);
app.use((error, request, response, next) => {
  console.log("#### Error Handler");
  console.log(error);
  response.sendStatus(500);
});

app.listen(3001, console.log("server started at http://localhost:3001"));
