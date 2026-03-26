import axios from "axios";

const API_BASE = "http://localhost:5000/api/webhook";

/**
 * Fetch all documents received from n8n webhooks
 * @returns {Promise<Object>} The API response containing the documents array
 */
export const getDocuments = async () => {
    try {
        const { data } = await axios.get(`${API_BASE}/documents`);
        console.log(data);
        // The backend returns { success: true, data: [...] }
        return data.data || [];
    } catch (error) {
        console.error("Error fetching webhook documents:", error);
        throw error;
    }
};
