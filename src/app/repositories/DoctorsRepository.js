const db = require("../../database/index");

class DoctorRepository {
  async create({ name, specialization }) {
    const [row] = await db.query(
      `
      INSERT INTO doctors(name, specialization)
      VALUES($1, $2)
      RETURNING *
      `,
      [name, specialization]
    );

    return row;
  }

  async findAll() {
    const rows = await db.query(`SELECT * FROM doctors ORDER BY name`);

    return rows;
  }

  async findById(id) {
    const [row] = await db.query("SELECT * FROM doctors WHERE id = $1", [id]);

    return row;
  }

  async findByName(name) {
    const [row] = await db.query("SELECT * FROM doctors WHERE name = $1", [
      name,
    ]);

    return row;
  }

  async update(id, { name, specialization }) {
    const [row] = await db.query(
      `
    UPDATE doctors
    SET name = $1, specialization = $2
    WHERE id = $3
    RETURNING *
    `,
      [name, specialization, id]
    );

    return row;
  }

  async delete(id) {
    const deleteOp = await db.query("DELETE FROM doctors WHERE id = $1", [id]);

    return deleteOp;
  }
}

module.exports = new DoctorRepository();
