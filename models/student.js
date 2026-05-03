import sql from "./db.js";

export async function getAllStudents() {
  const students = await sql`
    SELECT *
    FROM students
    ORDER BY created_at DESC
  `;
  return students;
}

export async function studentStats() {
  const stats = await sql`
    SELECT
      (SELECT COUNT(*) FROM students) AS total_students,
      (SELECT COUNT(*) FROM students WHERE status = 'active') AS active_students,
      (SELECT COUNT(*) FROM students WHERE status = 'inactive') AS inactive_students
  `;
  return stats[0];
}

export async function registerStudent(
  student_id,
  name,
  fh_name,
  email,
  gender,
  phone,
  department,
  course,
  amount,
  bank,
  status,
  created_at,
  updated_at,
) {
  const newStudent = await sql`
    INSERT INTO students 
      (student_id, name, fh_name, email, gender, phone, department, course, amount, bank, status, created_at, updated_at)
    VALUES 
      (${student_id}, ${name}, ${fh_name}, ${email}, ${gender}, ${phone}, ${department}, ${course}, ${amount}, ${bank}, 'active', NOW(), NOW())
    RETURNING id
  `;

  return newStudent[0];
}

export async function updateStudent(id, data) {
  const updatedStudent = await sql`
    UPDATE students SET
      name = ${data.name},
      fh_name = ${data.fh_name},
      gender = ${data.gender},
      phone = ${data.phone},
      department = ${data.department},
      course = ${data.course},
      amount = ${data.amount},
      bank = ${data.bank},
      status = ${data.status},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  return updatedStudent[0];
}
export async function getStudentById(id) {
  const student = await sql`
    SELECT *
    FROM students
    WHERE id = ${id}
  `;
  return student[0] ?? {};
}

export async function deleteStudent(id) {
  await sql`
    DELETE FROM students
    WHERE id = ${id}
  `;
}
