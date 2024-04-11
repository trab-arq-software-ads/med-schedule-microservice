const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const packageDefinition = protoLoader.loadSync(
  path.resolve(__dirname, "../proto/Doctors.proto"),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const doctorsProto = grpc.loadPackageDefinition(packageDefinition);

const { DoctorService } = doctorsProto;

const DoctorRepository = require("../repositories/DoctorsRepository");

class DoctorServer {
  constructor() {
    this.server = new grpc.Server();
    this.server.addService(DoctorService.service, {
      ListDoctors: this.listDoctors,
      GetDoctor: this.getDoctor,
      CreateDoctor: this.createDoctor,
      UpdateDoctor: this.updateDoctor,
      DeleteDoctor: this.deleteDoctor,
    });
  }


  listDoctors(call, callback) {
    DoctorRepository.findAll()
      .then((doctors) => {
        const response = { doctors };
        callback(null, response);
      })
      .catch((error) => {
        callback(error, null);
      });
  }

  getDoctor(call, callback) {
    const { id } = call.request;
    DoctorRepository.findById(id)
      .then((doctor) => {
        if (!doctor) {
          callback(
            { code: grpc.status.NOT_FOUND, details: "Doctor not found" },
            null
          );
          return;
        }
        const response = { doctor };
        callback(null, response);
      })
      .catch((error) => {
        callback(error, null);
      });
  }

  createDoctor(call, callback) {
    const { name, specialization } = call.request;
    if (!name) {
      callback(
        { code: grpc.status.INVALID_ARGUMENT, details: "Name is required" },
        null
      );
      return;
    }

    DoctorRepository.findByName(name)
      .then((existingDoctor) => {
        if (existingDoctor) {
          callback(
            {
              code: grpc.status.ALREADY_EXISTS,
              details: "This name is already in use",
            },
            null
          );
          return;
        }

        DoctorRepository.create({ name, specialization })
          .then((newDoctor) => {
            const response = { doctor: newDoctor };
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

  updateDoctor(call, callback) {
    const { id, name, specialization } = call.request;
    DoctorRepository.findById(id)
      .then((existingDoctor) => {
        if (!existingDoctor) {
          callback(
            { code: grpc.status.NOT_FOUND, details: "Doctor not found" },
            null
          );
          return;
        }

        if (!name) {
          callback(
            { code: grpc.status.INVALID_ARGUMENT, details: "Name is required" },
            null
          );
          return;
        }

        DoctorRepository.findByName(name)
          .then((doctorByName) => {
            if (doctorByName && doctorByName.id !== id) {
              callback(
                {
                  code: grpc.status.ALREADY_EXISTS,
                  details: "This name is already in use",
                },
                null
              );
              return;
            }

            DoctorRepository.update(id, { name, specialization })
              .then((updatedDoctor) => {
                const response = { doctor: updatedDoctor };
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

  deleteDoctor(call, callback) {
    const { id } = call.request;
    DoctorRepository.delete(id)
      .then(() => {
        callback(null, {});
      })
      .catch((error) => {
        callback(error, null);
      });
  }

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

module.exports = DoctorServer;
