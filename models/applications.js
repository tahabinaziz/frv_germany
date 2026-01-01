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
        ORDER BY reference_number ASC
    `;
}
export async function registerApplication(
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
) {
  const newApplication = await sql`
    INSERT INTO applications 
      (user_id, reference_number, relationship_type, consulate, abh_offices, case_type, status, frv_email_sent_date, appointment_conformation_date, visa_appointment_date, visa_issued_date, visa_start_date, duration_months, insurance_submitted_date, passport_collected_date, created_at,visa_type, language, abh_document_submitted_date)
    VALUES 
      (${user_id}, ${reference_number}, ${relationship_type}, ${consulate}, ${abh_offices},${case_type}, ${status}, ${frv_email_sent_date}, ${appointment_conformation_date}, ${visa_appointment_date}, ${visa_issued_date}, ${visa_start_date}, ${duration_months}, ${insurance_submitted_date}, ${passport_collected_date}, NOW(), ${visa_type}, ${language}, ${abh_document_submitted_date})
    RETURNING id
  `;

  return newApplication[0];
}

export async function updateApplication(
  id,
  reference_number,
  visa_type,
  language,
  abh_document_submitted_date,
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
  passport_collected_date
) {
  const updatedApplication = await sql`
    UPDATE applications SET
      reference_number = ${reference_number},
        visa_type = ${visa_type},
       language = ${language},
      relationship_type = ${relationship_type},
      consulate = ${consulate},
      abh_offices = ${abh_offices},
        abh_document_submitted_date = ${abh_document_submitted_date},
      case_type = ${case_type},
      status = ${status},
      frv_email_sent_date = ${frv_email_sent_date},
      appointment_conformation_date = ${appointment_conformation_date},
      visa_appointment_date = ${visa_appointment_date},
      visa_issued_date = ${visa_issued_date},
      visa_start_date = ${visa_start_date},
      duration_months = ${duration_months},
      insurance_submitted_date = ${insurance_submitted_date},
      passport_collected_date = ${passport_collected_date}
    WHERE id = ${id}
    RETURNING *
  `;

  return updatedApplication[0];
}
