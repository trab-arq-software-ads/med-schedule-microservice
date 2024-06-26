const db = require("../../database/index");

class PatientRepository {
  async create({ name, email, phone }) {
    const [row] = await db.query(
      `
      INSERT INTO patients(name, email, phone)
      VALUES($1, $2, $3)
      RETURNING *
      `,
      [name, email, phone]
    );

    return row;
  }

  async findAll() {
    const rows = await db.query(`SELECT * FROM patients ORDER BY name`);

    return rows;
  }

  async findById(id) {
    const [row] = await db.query("SELECT * FROM patients WHERE id = $1", [id]);

    return row;
  }

  async findByEmail(email) {
    const [row] = await db.query("SELECT * FROM patients WHERE email = $1", [
      email,
    ]);

    return row;
  }

  async update(id, { name, email, phone }) {
    const [row] = await db.query(
      `
    UPDATE patients
    SET name = $1, email = $2, phone = $3
    WHERE id = $4
    RETURNING *
    `,
      [name, email, phone, id]
    );

    return row;
  }

  async delete(id) {
    const deleteOp = await db.query("DELETE FROM patients WHERE id = $1", [id]);

    return deleteOp;
  }
}

module.exports = new PatientRepository();
