import express from "express";
import {
  checkReferenceNumber,
  getApplications,
  registerApplication,
  updateApplication,
} from "../models/applications.js";
const router = express.Router();

router.post("/applications", async (req, res) => {
  try {
    const {
      user_id,
      reference_number,
      relationship_type,
      visa_type,
      consulate,
      case_type,
      status,
      frv_email_sent_date,
      appointment_conformation_date,
      visa_appointment_date,
      visa_issued_date,
      visa_start_date,
      duration_months,
      insurance_submitted_date,
      passport_collected_date,
      language,
      abh_offices,
      abh_document_submitted_date,
    } = req.body;
    const refenrenceNumber = await checkReferenceNumber(reference_number);
    if (refenrenceNumber.length > 0) {
      return res.status(400).json({
        error: "Application with this reference number already exists",
      });
    }
    await registerApplication(
      user_id,
      reference_number,
      relationship_type,
      consulate,
      abh_offices,
      case_type,
      status,
      frv_email_sent_date,
      appointment_conformation_date,
      visa_appointment_date,
      visa_issued_date,
      visa_start_date,
      duration_months,
      insurance_submitted_date,
      passport_collected_date,
      visa_type,
      language,
      abh_document_submitted_date
    );
    return res.json({ message: "New application created successfully!" });
  } catch (error) {
    console.log("err", error);
    return res.status(400).json({ error: error });
  }
});
router.put("/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      reference_number,
      relationship_type,
      visa_type,
      language,
      consulate,
      abh_offices,
      abh_document_submitted_date,
      case_type,
      status,
      frv_email_sent_date,
      appointment_conformation_date,
      visa_appointment_date,
      visa_issued_date,
      visa_start_date,
      duration_months,
      insurance_submitted_date,
      passport_collected_date,
    } = req.body;

    const updatedApplication = await updateApplication(
      id,
      reference_number,
      relationship_type,
      visa_type,
      language,
      consulate,
      abh_offices,
      abh_document_submitted_date,
      case_type,
      status,
      frv_email_sent_date,
      appointment_conformation_date,
      visa_appointment_date,
      visa_issued_date,
      visa_start_date,
      duration_months,
      insurance_submitted_date,
      passport_collected_date
    );

    if (updatedApplication.count === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    return res.json({ message: "Application updated successfully!" });
  } catch (error) {
    console.log("err", error);
    return res.status(400).json({ error: error });
  }
});
router.get("/applications", async (req, res) => {
  try {
    const applications = await getApplications();
    return res.json(applications);
  } catch (error) {
    console.log("err", error);
    return res.status(400).json({ error: error });
  }
});

export default router;
