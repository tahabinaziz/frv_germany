import express from "express";
import {
  checkReferenceNumber,
  getApplications,
  registerApplication,
} from "../models/applications.js";
const router = express.Router();

router.post("/applications", async (req, res) => {
  try {
    const {
      referenceNumber,
      relationship_type,
      consulate,
      abh_offices,
      case_type,
      status,
      frv_email_sent_date,
      appointment_conformation_date,
      visa_appointment_date,
      visa_issue_date,
      visa_start_date,
      duration_months,
      insurance_submitted_date,
      passport_collected_date,
    } = req.body;
    const refenrenceNumber = await checkReferenceNumber(referenceNumber);
    if (refenrenceNumber.length > 0) {
      return res.status(400).json({
        error: "Application with this reference number already exists",
      });
    }
    await registerApplication(
      referenceNumber,
      relationship_type,
      consulate,
      abh_offices,
      case_type,
      status,
      frv_email_sent_date,
      appointment_conformation_date,
      visa_appointment_date,
      visa_issue_date,
      visa_start_date,
      duration_months,
      insurance_submitted_date,
      passport_collected_date
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
      referenceNumber,
      relationship_type,
      consulate,
      abh_offices,
      case_type,
      status,
      frv_email_sent_date,
      appointment_conformation_date,
      visa_appointment_date,
      visa_issue_date,
      visa_start_date,
      duration_months,
      insurance_submitted_date,
      passport_collected_date,
    } = req.body;

    const updatedApplication = await updateApplication(
      id,
      referenceNumber,
      relationship_type,
      consulate,
      abh_offices,
      case_type,
      status,
      frv_email_sent_date,
      appointment_conformation_date,
      visa_appointment_date,
      visa_issue_date,
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
