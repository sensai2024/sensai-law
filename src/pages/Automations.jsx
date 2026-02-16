import React, { useState } from 'react';
import DocumentQueueTable from '../features/automations/DocumentQueueTable';
import AutomationReviewPanel from '../features/automations/AutomationReviewPanel';

// Mock data
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

const Automations = () => {
    const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
    const [selectedDocId, setSelectedDocId] = useState(null);

    const selectedDoc = documents.find(d => d.id === selectedDocId);

    const handleStartAutomation = () => {
        if (!selectedDoc) return;

        // Update status to Processing
        setDocuments(prev => prev.map(d =>
            d.id === selectedDocId ? { ...d, status: 'Processing' } : d
        ));

        // Simulate automation completion after 2 seconds
        setTimeout(() => {
            setDocuments(prev => prev.map(d =>
                d.id === selectedDocId ? { ...d, status: 'Sent to Draft' } : d
            ));
        }, 2000);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-text-primary">Automation Pipeline</h1>
                <p className="text-text-secondary">Review and trigger automated contract generation</p>
            </div>

            <div className="flex gap-6 flex-1 overflow-hidden">
                {/* LEFT PANEL - 65% */}
                <div className="w-[65%]">
                    <DocumentQueueTable
                        documents={documents}
                        selectedDocId={selectedDocId}
                        onSelectDocument={setSelectedDocId}
                    />
                </div>

                {/* RIGHT PANEL - 35% */}
                <div className="w-[35%]">
                    <AutomationReviewPanel
                        document={selectedDoc}
                        onStartAutomation={handleStartAutomation}
                    />
                </div>
            </div>
        </div>
    );
};

export default Automations;
