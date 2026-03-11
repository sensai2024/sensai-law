let mockContracts = [
    {
        id: "contract_1",
        clientName: "EX9 Logistics",
        status: "Draft",
        createdAt: "2026-03-11",
        content: "# Contract\n\nExample contract..."
    }
];

export const getContracts = async () => {
    return [...mockContracts];
};

export const approveContract = async (id) => {
    // Simulate API call: POST /api/contracts/{id}/approve
    await new Promise(r => setTimeout(r, 1000));
    mockContracts = mockContracts.map(c => 
        c.id === id ? { ...c, status: "Sent" } : c
    );
    return Promise.resolve({ success: true, id, status: "Sent" });
};

export const regenerateContract = async (id) => {
    // Simulate API call: POST /api/contracts/{id}/regenerate
    await new Promise(r => setTimeout(r, 1000));
    mockContracts = mockContracts.map(c => 
        c.id === id ? { ...c, content: c.content + "\n\n(Regenerated content...)" } : c
    );
    return Promise.resolve({ success: true, id });
};
