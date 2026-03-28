import axios from "axios";

const API_BASE = "http://localhost:5000/api/automations";

/**
 * Trigger an automation flow in n8n via the backend
 * @param {Object} data - Process data
 * @param {string} data.documentId - Unique identifier for the document
 * @param {string} data.content - The text content to process
 * @param {string} [data.fileName] - Optional filename
 * @param {'crm' | 'contract'} data.type - Automation type
 * @returns {Promise<Object>} The API response
 */
export const startAutomation = async (data) => {
    try {
        const response = await axios.post(`${API_BASE}/start`, data);
        return response.data;
    } catch (error) {
        console.error("Error starting automation:", error);
        throw error.response?.data || error;
    }
};
