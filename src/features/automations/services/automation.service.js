// Mock data for development
const MOCK_DOCUMENTS = [
    {
        id: "DOC-001",
        fileName: "NDA_TechFlow_AlphaStream.pdf",
        source: "Google Drive",
        detectedClient: "TechFlow Inc.",
        contractType: "NDA",
        status: "Ready",
        uploadedTime: "5 mins ago",
        confidence: 94,
        extractedData: {
            parties: ["TechFlow Inc.", "Alpha Stream Ltd."],
            keyDates: ["2026-01-25", "2029-01-25"],
            category: "Non-Disclosure Agreement",
            aiNotes: "Standard mutual NDA. Jurisdiction: California. 3-year term."
        }
    },
    {
        id: "DOC-002",
        fileName: "MSA_Cyberdyne_Systems.pdf",
        source: "Google Drive",
        detectedClient: "Cyberdyne Systems",
        contractType: "MSA",
        status: "New",
        uploadedTime: "12 mins ago",
        confidence: 89,
        extractedData: {
            parties: ["Cyberdyne Systems", "Tech Corp"],
            keyDates: ["2026-02-01"],
            category: "Master Services Agreement",
            aiNotes: "Payment terms: Net 30. Auto-renewal clause detected."
        }
    },
    {
        id: "DOC-003",
        fileName: "Service_Agreement_Wayne_Ent.pdf",
        source: "Google Drive",
        detectedClient: "Wayne Enterprises",
        contractType: "Service Agreement",
        status: "Processing",
        uploadedTime: "1 hour ago",
        confidence: 91,
        extractedData: {
            parties: ["Wayne Enterprises"],
            keyDates: ["2026-03-01", "2027-03-01"],
            category: "Service Agreement",
            aiNotes: "1-year term with option to extend."
        }
    },
    {
        id: "DOC-004",
        fileName: "Employment_Contract_Harvey.pdf",
        source: "Google Drive",
        detectedClient: "Harvey Dent",
        contractType: "Employment",
        status: "Sent to Draft",
        uploadedTime: "3 hours ago",
        confidence: 97,
        extractedData: {
            parties: ["Harvey Dent", "Tech Corp"],
            keyDates: ["2026-02-15"],
            category: "Employment Contract",
            aiNotes: "Full-time position. Standard benefits package."
        }
    },
    {
        id: "DOC-005",
        fileName: "License_Stark_Industries.pdf",
        source: "Google Drive",
        detectedClient: "Stark Industries",
        contractType: "License",
        status: "Completed",
        uploadedTime: "1 day ago",
        confidence: 96,
        extractedData: {
            parties: ["Stark Industries", "Tech Corp"],
            keyDates: ["2026-01-20"],
            category: "Software License Agreement",
            aiNotes: "Perpetual license. No support included."
        }
    }
];

/**
 * Fetch all documents from the automation queue
 * @returns {Promise<Array>} Array of document objects
 * 
 * TO CONNECT TO REAL API:
 * Replace with: return fetch('/api/automations/documents').then(res => res.json())
 */
export const getDocuments = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return Promise.resolve(MOCK_DOCUMENTS);
};

/**
 * Fetch a single document by ID
 * @param {string} id - Document ID
 * @returns {Promise<Object>} Document object
 * 
 * TO CONNECT TO REAL API:
 * Replace with: return fetch(`/api/automations/documents/${id}`).then(res => res.json())
 */
export const getDocumentById = async (id) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const document = MOCK_DOCUMENTS.find(doc => doc.id === id);

    if (!document) {
        throw new Error(`Document with ID ${id} not found`);
    }

    return Promise.resolve(document);
};

/**
 * Start automation workflow for a document
 * @param {string} id - Document ID
 * @returns {Promise<Object>} Updated document object
 * 
 * TO CONNECT TO REAL API:
 * Replace with: return fetch(`/api/automations/documents/${id}/start`, { method: 'POST' }).then(res => res.json())
 */
export const startAutomation = async (id) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate automation start
    return Promise.resolve({
        id,
        status: 'Processing',
        message: 'Automation workflow started successfully'
    });
};
