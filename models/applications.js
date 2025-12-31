import sql from "./db.js";

export async function checkReferenceNumber(referenceNumber) {
  return await sql`
    SELECT *
    FROM applications
    WHERE reference_number = ${referenceNumber}
  `;
}
export async function getApplications() {
  return await sql`
        SELECT *
        FROM applications
        ORDER BY refenrenceNumber ASC
    `;
}
export async function registerApplication(
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
) {
  const newApplication = await sql`
    INSERT INTO applications 
      (reference_number, relationship_type, consulate, abh_offices, case_type, status, frv_email_sent_date, appointment_conformation_date, visa_appointment_date, visa_issue_date, visa_start_date, duration_months, insurance_submitted_date, passport_collected_date, created_at)
    VALUES 
      (${referenceNumber}, ${relationship_type}, ${consulate}, ${abh_offices}, ${case_type}, ${status}, ${frv_email_sent_date}, ${appointment_conformation_date}, ${visa_appointment_date}, ${visa_issue_date}, ${visa_start_date}, ${duration_months}, ${insurance_submitted_date}, ${passport_collected_date}, NOW())
    RETURNING id
  `;

  return newApplication[0];
}

export async function updateApplication(
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
) {
  const updatedApplication = await sql`
    UPDATE applications SET
      reference_number = ${referenceNumber},
      relationship_type = ${relationship_type},
      consulate = ${consulate},
      abh_offices = ${abh_offices},
      case_type = ${case_type},
      status = ${status},
      frv_email_sent_date = ${frv_email_sent_date},
      appointment_conformation_date = ${appointment_conformation_date},
      visa_appointment_date = ${visa_appointment_date},
      visa_issue_date = ${visa_issue_date},
      visa_start_date = ${visa_start_date},
      duration_months = ${duration_months},
      insurance_submitted_date = ${insurance_submitted_date},
      passport_collected_date = ${passport_collected_date}
    WHERE id = ${id}
    RETURNING *
  `;

  return updatedApplication[0];
}
