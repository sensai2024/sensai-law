import axios from 'axios';

const API_URL = 'https://sensai88.app.n8n.cloud/webhook/61302632-316f-431c-b440-ef9e17362dbc';

export const getContracts = async () => {
    const response = await axios.get(API_URL);
    // Ensure the response data is an array
    if (response.data && !Array.isArray(response.data)) {
        return [response.data];
    }
    return response.data || [];
};
