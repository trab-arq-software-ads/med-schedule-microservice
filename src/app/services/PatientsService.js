const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const PatientsRepository = require("../repositories/PatientsRepository");

// Loading the .proto file
const packageDefinition = protoLoader.loadSync(
  path.resolve(__dirname, "../proto/Patients.proto"),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const patientsProto = grpc.loadPackageDefinition(packageDefinition);

const { PatientService } = patientsProto;

// Defining the PatientServer class that contains the logic for the gRPC methods
class PatientServer {
  constructor() {
    this.server = new grpc.Server();
    this.server.addService(PatientService.service, {
      ListPatients: this.listPatients,
      GetPatient: this.getPatient,
      CreatePatient: this.createPatient,
      UpdatePatient: this.updatePatient,
      DeletePatient: this.deletePatient,
    });
  }

  // Implementing the methods here
  listPatients(call, callback) {
    PatientsRepository.findAll()
      .then((patients) => {
        const response = { patients };
        callback(null, response);
      })
      .catch((error) => {
        callback(error, null);
      });
  }

  getPatient(call, callback) {
    const { id } = call.request;

    PatientsRepository.findById(id)
      .then((patient) => {
        if (!patient) {
          callback({
            code: grpc.status.NOT_FOUND,
            details: "Patient not found",
          });
          return;
        }
        const response = { patient };
        callback(null, response);
      })
      .catch((error) => {
        callback(error, null);
      });
  }

  createPatient(call, callback) {
    const { name, email, phone, birthday } = call.request;

    // validation
    if (!name) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: "Name is required",
      });
      return;
    }

    PatientsRepository.findByName(name)
      .then((existentPatient) => {
        // validation
        if (existentPatient) {
          callback(
            {
              code: grpc.status.ALREADY_EXISTS,
              details: "This name is already in use",
            },
            null
          );
          return;
        }

        PatientsRepository.create(name, email, phone, birthday)
          .then((newPatient) => {
            const response = { newPatient };
            callback(null, response);
          })
          .catch((error) => {
            callback(error, null);
          });
      })
      .catch((error) => {
        callback(error, null);
      });
  }

  updatePatient(call, callback) {
    const { id, name, specialization } = call.request;

    PatientRepository.findById(id)
      .then((existingPatient) => {
        if (!existingPatient) {
          callback(
            { code: grpc.status.NOT_FOUND, details: "Patient not found" },
            null
          );
          return;
        }

        // validation
        if (!name) {
          callback(
            { code: grpc.status.INVALID_ARGUMENT, details: "Name is required" },
            null
          );
          return;
        }

        PatientRepository.findByName(name)
          .then((patientByName) => {
            if (patientByName && patientByName.id !== id) {
              callback(
                {
                  code: grpc.status.ALREADY_EXISTS,
                  details: "This name is already in use",
                },
                null
              );
              return;
            }

            PatientRepository.update(id, { name, specialization })
              .then((updatedPatient) => {
                const response = { patient: updatedPatient };
                callback(null, response);
              })
              .catch((error) => {
                callback(error, null);
              });
          })
          .catch((error) => {
            callback(error, null);
          });
      })
      .catch((error) => {
        callback(error, null);
      });
  }

  deletePatient(call, callback) {
    const { id } = call.request;

    PatientRepository.delete(id)
      .then(() => {
        callback(null, {});
      })
      .catch((error) => {
        callback(error, null);
      });
  }

  // Iniciar o servidor gRPC
  start(port) {
    this.server.bindAsync(
      `0.0.0.0:${port}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          console.error(`Failed to start gRPC server: ${err}`);
          return;
        }
        console.log(`gRPC server running on port ${port}`);
      }
    );
  }
}

module.exports = PatientServer;
