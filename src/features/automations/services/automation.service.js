import axios from 'axios';

// Replace with your actual n8n webhook URL
const WEBHOOK_URL = 'https://sensai88.app.n8n.cloud/webhook/start-automation';

export const startAutomation = async ({ documentId, content, fileName }) => {
    try {
        const response = await axios.post(WEBHOOK_URL, {
            documentId,
            content,
            fileName
        });
        return response.data;
    } catch (error) {
        console.error("Error starting automation:", error);
        throw error;
    }
};