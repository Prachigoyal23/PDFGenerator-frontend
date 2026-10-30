import axios from 'axios';

// Reads from .env: VITE_API_BASE_URL (defaults to empty string for relative proxy, or explicit backend URL)
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';

const API_TIMEOUT = import.meta.env.VITE_REQUEST_TIMEOUT_MS
  ? parseInt(import.meta.env.VITE_REQUEST_TIMEOUT_MS, 10)
  : 120000;

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});

export const checkHealth = async () => {
  const response = await API.get('/api/health');
  return response.data;
};

export const fetchTemplates = async () => {
  const response = await API.get('/api/templates');
  return response.data;
};

export const saveTemplate = async (templateData) => {
  const response = await API.post('/api/templates', templateData);
  return response.data;
};

export const deleteTemplate = async (id) => {
  const response = await API.delete(`/api/templates/${id}`);
  return response.data;
};

export const parseExcelFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await API.post('/api/pdf/parse-excel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Dynamically prefixes baseURL from .env so sample download works regardless of deployment host
export const downloadSampleExcelUrl = `${API_BASE_URL}/api/pdf/sample-excel`;

export const previewTemplateHtml = async (templateId, customTemplate, record) => {
  const response = await API.post('/api/pdf/preview-html', {
    templateId,
    customTemplate,
    record,
  });
  return response.data;
};

export const generateSinglePdfBlob = async (templateId, customTemplate, record) => {
  const response = await API.post(
    '/api/pdf/generate-single',
    { templateId, customTemplate, record },
    { responseType: 'blob' }
  );
  return response;
};

export const generateBatchZipBlob = async (templateId, customTemplate, records, mapping) => {
  const response = await API.post(
    '/api/pdf/generate-batch-zip',
    { templateId, customTemplate, records, mapping },
    { responseType: 'blob' }
  );
  return response;
};

export default API;
