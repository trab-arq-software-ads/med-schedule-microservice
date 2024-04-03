const DoctorRepository = require("../repositories/DoctorsRepository");

class DoctorController {
  // Método para listar todos os médicos
  async list(request, response) {
    const doctors = await DoctorRepository.findAll();

    response.json(doctors);
  }

  // Método para exibir um médico específico
  async getById(request, response) {
    const { id } = request.params;

    const doctor = await DoctorRepository.findById(id);

    if (!doctor) {
      return response.status(404).json({ error: "Doctor not found" });
    }

    response.json(doctor);
  }

  // Método para criar um novo médico
  async create(request, response) {
    const { name, specialization } = request.body;

    if (!name) {
      return response.status(400).json({ error: "Name is required" });
    }

    const doctorExists = await DoctorRepository.findByName(name);

    if (doctorExists) {
      return response
        .status(400)
        .json({ error: "This name is already in use" });
    }

    const doctor = await DoctorRepository.create({
      name,
      specialization,
    });

    response.json(doctor);
  }

  // Método para atualizar informações de um médico
  async update(request, response) {
    const { id } = request.params;
    const { name, specialization } = request.body;

    const doctorExists = await DoctorRepository.findById(id);

    if (!doctorExists) {
      return response.status(404).json({ error: "Doctor not found" });
    }

    if (!name) {
      return response.status(400).json({ error: "Name is required" });
    }

    const doctorByName = await DoctorRepository.findByName(name);

    if (doctorByName && doctorByName.id !== id) {
      return response
        .status(400)
        .json({ error: "This name is already in use" });
    }

    const doctor = await DoctorRepository.update(id, {
      name,
      specialization,
    });

    response.json(doctor);
  }

  // Método para excluir um médico
  async delete(request, response) {
    const { id } = request.params;

    await DoctorRepository.delete(id);

    response.sendStatus(204);
  }
}

module.exports = new DoctorController();
