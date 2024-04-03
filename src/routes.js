const express = require("express");
const router = express.Router();

const DoctorController = require("./app/controllers/DoctorsController");

router.get("/doctors", DoctorController.list);
router.get("/doctors/:id", DoctorController.getById);
router.post("/doctors", DoctorController.create);
router.put("/doctors/:id", DoctorController.update);
router.delete("/doctors/:id", DoctorController.delete);

const PatientController = require("./app/controllers/PatientsController");

router.get("/patients", PatientController.list);
router.get("/patients/:id", PatientController.getById);
router.post("/patients", PatientController.create);
router.put("/patients/:id", PatientController.update);
router.delete("/patients/:id", PatientController.delete);

module.exports = router;
