import sql from "./db.js";

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
      (${student_id}, ${name}, ${fh_name}, ${email}, ${gender}, ${phone}, ${department}, ${course}, ${amount}, ${bank}, ${status}, ${created_at}, ${updated_at})
    RETURNING id
  `;

  return newStudent[0];
}

export async function updateStudent(id, data) {
  const updatedStudent = await sql`
    UPDATE students SET
      name = ${data.name},
      fh_name = ${data.fh_name},
      email = ${data.email},
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
export async function getStudentById(student_id) {
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

export async function getAllStudents() {
  const students = await sql`
    SELECT *
    FROM students
    ORDER BY created_at DESC
  `;
  return students;
}
