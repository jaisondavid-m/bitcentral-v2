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

export async function setDepartmentCurrentSemester(id, currentSemesterId) {
  const headers = await getAdminHeaders();
  const res = await api.put(`/admin/academic/departments/${id}/current-semester`, { current_semester_id: currentSemesterId }, { headers });
  return res.data;
}

export async function deleteDepartment(id) {
  const headers = await getAdminHeaders();
  const res = await api.delete(`/admin/academic/departments/${id}`, { headers });
  return res.data;
}

// -----------------------------------------------------------------------------
// 2. REGULATIONS
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
// 3. BATCHES
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
// 4. SEMESTERS
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
// 5. COURSES (MAPPED TO DEPARTMENT, REGULATION, AND SEMESTER)
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

export async function bulkUploadCourses(formData) {
  const headers = await getAdminHeaders();
  const res = await api.post("/admin/academic/courses/bulk-upload", formData, {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}
