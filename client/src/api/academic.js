import api from "./axios";
import { auth } from "../Authentication/firebase.js";

async function getAdminHeaders() {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("You must be signed in as an administrator");
  }
  const idToken = await currentUser.getIdToken();
  return {
    Authorization: `Bearer ${idToken}`,
  };
}

// -----------------------------------------------------------------------------
// DEPENDENT OPTIONS LOOKUP
// -----------------------------------------------------------------------------

export async function fetchAcademicOptions(params = {}) {
  const headers = await getAdminHeaders();
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/admin/academic/options${query ? `?${query}` : ""}`, { headers });
  return res.data;
}

// -----------------------------------------------------------------------------
// 1. DEPARTMENTS
// -----------------------------------------------------------------------------

export async function listDepartments(params = {}) {
  const headers = await getAdminHeaders();
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/admin/academic/departments${query ? `?${query}` : ""}`, { headers });
  return res.data;
}

export async function createDepartment(payload) {
  const headers = await getAdminHeaders();
  const res = await api.post("/admin/academic/departments", payload, { headers });
  return res.data;
}

export async function updateDepartment(id, payload) {
  const headers = await getAdminHeaders();
  const res = await api.put(`/admin/academic/departments/${id}`, payload, { headers });
  return res.data;
}

export async function deleteDepartment(id) {
  const headers = await getAdminHeaders();
  const res = await api.delete(`/admin/academic/departments/${id}`, { headers });
  return res.data;
}



// -----------------------------------------------------------------------------
// 3. REGULATIONS
// -----------------------------------------------------------------------------

export async function listRegulations(params = {}) {
  const headers = await getAdminHeaders();
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/admin/academic/regulations${query ? `?${query}` : ""}`, { headers });
  return res.data;
}

export async function createRegulation(payload) {
  const headers = await getAdminHeaders();
  const res = await api.post("/admin/academic/regulations", payload, { headers });
  return res.data;
}

export async function updateRegulation(id, payload) {
  const headers = await getAdminHeaders();
  const res = await api.put(`/admin/academic/regulations/${id}`, payload, { headers });
  return res.data;
}

export async function deleteRegulation(id) {
  const headers = await getAdminHeaders();
  const res = await api.delete(`/admin/academic/regulations/${id}`, { headers });
  return res.data;
}

// -----------------------------------------------------------------------------
// 4. BATCHES
// -----------------------------------------------------------------------------

export async function listBatches(params = {}) {
  const headers = await getAdminHeaders();
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/admin/academic/batches${query ? `?${query}` : ""}`, { headers });
  return res.data;
}

export async function createBatch(payload) {
  const headers = await getAdminHeaders();
  const res = await api.post("/admin/academic/batches", payload, { headers });
  return res.data;
}

export async function updateBatch(id, payload) {
  const headers = await getAdminHeaders();
  const res = await api.put(`/admin/academic/batches/${id}`, payload, { headers });
  return res.data;
}

export async function deleteBatch(id) {
  const headers = await getAdminHeaders();
  const res = await api.delete(`/admin/academic/batches/${id}`, { headers });
  return res.data;
}

// -----------------------------------------------------------------------------
// 5. SEMESTERS
// -----------------------------------------------------------------------------

export async function listSemesters(params = {}) {
  const headers = await getAdminHeaders();
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/admin/academic/semesters${query ? `?${query}` : ""}`, { headers });
  return res.data;
}

export async function createSemester(payload) {
  const headers = await getAdminHeaders();
  const res = await api.post("/admin/academic/semesters", payload, { headers });
  return res.data;
}

export async function updateSemester(id, payload) {
  const headers = await getAdminHeaders();
  const res = await api.put(`/admin/academic/semesters/${id}`, payload, { headers });
  return res.data;
}

export async function deleteSemester(id) {
  const headers = await getAdminHeaders();
  const res = await api.delete(`/admin/academic/semesters/${id}`, { headers });
  return res.data;
}

// -----------------------------------------------------------------------------
// 6. COURSES
// -----------------------------------------------------------------------------

export async function listCourses(params = {}) {
  const headers = await getAdminHeaders();
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/admin/academic/courses${query ? `?${query}` : ""}`, { headers });
  return res.data;
}

export async function createCourse(payload) {
  const headers = await getAdminHeaders();
  const res = await api.post("/admin/academic/courses", payload, { headers });
  return res.data;
}

export async function updateCourse(id, payload) {
  const headers = await getAdminHeaders();
  const res = await api.put(`/admin/academic/courses/${id}`, payload, { headers });
  return res.data;
}

export async function deleteCourse(id) {
  const headers = await getAdminHeaders();
  const res = await api.delete(`/admin/academic/courses/${id}`, { headers });
  return res.data;
}

// -----------------------------------------------------------------------------
// 7. CURRICULUM
// -----------------------------------------------------------------------------

export async function listCurriculum(params = {}) {
  const headers = await getAdminHeaders();
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/admin/academic/curriculum${query ? `?${query}` : ""}`, { headers });
  return res.data;
}

export async function assignCurriculum(payload) {
  const headers = await getAdminHeaders();
  const res = await api.post("/admin/academic/curriculum", payload, { headers });
  return res.data;
}

export async function updateCurriculum(id, payload) {
  const headers = await getAdminHeaders();
  const res = await api.put(`/admin/academic/curriculum/${id}`, payload, { headers });
  return res.data;
}

export async function deleteCurriculum(id) {
  const headers = await getAdminHeaders();
  const res = await api.delete(`/admin/academic/curriculum/${id}`, { headers });
  return res.data;
}

// -----------------------------------------------------------------------------
// 8. MATERIALS
// -----------------------------------------------------------------------------

export async function listMaterials(params = {}) {
  const headers = await getAdminHeaders();
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/admin/academic/materials${query ? `?${query}` : ""}`, { headers });
  return res.data;
}

export async function createMaterial(payload) {
  const headers = await getAdminHeaders();
  const res = await api.post("/admin/academic/materials", payload, { headers });
  return res.data;
}

export async function updateMaterial(id, payload) {
  const headers = await getAdminHeaders();
  const res = await api.put(`/admin/academic/materials/${id}`, payload, { headers });
  return res.data;
}

export async function deleteMaterial(id) {
  const headers = await getAdminHeaders();
  const res = await api.delete(`/admin/academic/materials/${id}`, { headers });
  return res.data;
}

// -----------------------------------------------------------------------------
// 9. EXAMS
// -----------------------------------------------------------------------------

export async function listExams(params = {}) {
  const headers = await getAdminHeaders();
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/admin/academic/exams${query ? `?${query}` : ""}`, { headers });
  return res.data;
}

export async function createExam(payload) {
  const headers = await getAdminHeaders();
  const res = await api.post("/admin/academic/exams", payload, { headers });
  return res.data;
}

export async function updateExam(id, payload) {
  const headers = await getAdminHeaders();
  const res = await api.put(`/admin/academic/exams/${id}`, payload, { headers });
  return res.data;
}

export async function deleteExam(id) {
  const headers = await getAdminHeaders();
  const res = await api.delete(`/admin/academic/exams/${id}`, { headers });
  return res.data;
}

// -----------------------------------------------------------------------------
// 10. EXAM SCHEDULES
// -----------------------------------------------------------------------------

export async function listExamSchedules(params = {}) {
  const headers = await getAdminHeaders();
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/admin/academic/exam-schedules${query ? `?${query}` : ""}`, { headers });
  return res.data;
}

export async function createExamSchedule(payload) {
  const headers = await getAdminHeaders();
  const res = await api.post("/admin/academic/exam-schedules", payload, { headers });
  return res.data;
}

export async function updateExamSchedule(id, payload) {
  const headers = await getAdminHeaders();
  const res = await api.put(`/admin/academic/exam-schedules/${id}`, payload, { headers });
  return res.data;
}

export async function deleteExamSchedule(id) {
  const headers = await getAdminHeaders();
  const res = await api.delete(`/admin/academic/exam-schedules/${id}`, { headers });
  return res.data;
}

// -----------------------------------------------------------------------------
// 11. QUESTION PAPERS
// -----------------------------------------------------------------------------

export async function listQuestionPapers(params = {}) {
  const headers = await getAdminHeaders();
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/admin/academic/question-papers${query ? `?${query}` : ""}`, { headers });
  return res.data;
}

export async function createQuestionPaper(payload) {
  const headers = await getAdminHeaders();
  const res = await api.post("/admin/academic/question-papers", payload, { headers });
  return res.data;
}

export async function updateQuestionPaper(id, payload) {
  const headers = await getAdminHeaders();
  const res = await api.put(`/admin/academic/question-papers/${id}`, payload, { headers });
  return res.data;
}

export async function deleteQuestionPaper(id) {
  const headers = await getAdminHeaders();
  const res = await api.delete(`/admin/academic/question-papers/${id}`, { headers });
  return res.data;
}
