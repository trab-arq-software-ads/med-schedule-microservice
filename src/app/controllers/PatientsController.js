const PatientRepository = require("../repositories/PatientsRepository");

class PatientController {
  async list(request, response) {
    const patients = await PatientRepository.findAll();

    response.json(patients);
  }

  async getById(request, response) {
    const { id } = request.params;

    const patient = await PatientRepository.findById(id);

    if (!patient) {
      return response.status(404).json({ error: "Patient not found" });
    }

    response.json(patient);
  }

  async create(request, response) {
    const { name, email, phone, birthday } = request.body;

    if (!name) {
      return response.status(400).json({ error: "Name is required" });
    }

    const patientExists = await PatientRepository.findByEmail(email);

    if (patientExists) {
      return response
        .status(400)
        .json({ error: "This e-mail is already in use" });
    }

    const patient = await PatientRepository.create({
      name,
      email,
      phone,
      birthday,
    });

    response.json(patient);
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, email, phone, birthday } = request.body;

    const patientExists = await PatientRepository.findById(id);

    if (!patientExists) {
      return response.status(404).json({ error: "Patient not found" });
    }

    if (!name) {
      return response.status(400).json({ error: "Name is required" });
    }

    const patientByEmail = await PatientRepository.findByEmail(email);

    if (patientByEmail && patientByEmail.id !== id) {
      return response
        .status(400)
        .json({ error: "This e-mail is already in use" });
    }

    const patient = await PatientRepository.update(id, {
      name,
      email,
      phone,
      birthday,
    });

    response.json(patient);
  }

  async delete(request, response) {
    const { id } = request.params;

    await PatientRepository.delete(id);

    response.sendStatus(204);
  }
}

module.exports = new PatientController();
