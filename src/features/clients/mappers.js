// src/features/clients/mappers.js
export function mapClientsList(data) {
  const { approvals = [], contracts = [], transcripts = [] } = data;
  
  const clientsMap = new Map();

  const getOrCreateClient = (email) => {
    if (!email) return null;
    let client = clientsMap.get(email);
    if (!client) {
      client = {
        email,
        name: 'Unknown',
        contractsCount: 0,
        approvalsCount: 0,
        transcriptsCount: 0,
        lastActivity: null,
      };
      clientsMap.set(email, client);
    }
    return client;
  };

  approvals.forEach(approval => {
    const client = getOrCreateClient(approval.client_email);
    if (client) {
      if (approval.client_name) client.name = approval.client_name;
      client.approvalsCount++;
      const date = approval.reviewed_at || approval.created_at;
      if (date && (!client.lastActivity || new Date(date) > new Date(client.lastActivity))) {
        client.lastActivity = date;
      }
    }
  });

  contracts.forEach(contract => {
    const email = contract.transcripts?.client_email;
    const client = getOrCreateClient(email);
    if (client) {
      client.contractsCount++;
    }
  });

  transcripts.forEach(transcript => {
    const client = getOrCreateClient(transcript.client_email);
    if (client) {
      client.transcriptsCount++;
      const date = transcript.created_at;
      if (date && (!client.lastActivity || new Date(date) > new Date(client.lastActivity))) {
        client.lastActivity = date;
      }
    }
  });

  return Array.from(clientsMap.values());
}

export function mapClientDetails(data, email) {
  return {
    email,
    name: data.approvals?.find(a => a.client_name)?.client_name || data.transcripts?.find(t => t.client_name)?.client_name || 'Unknown',
    metrics: {
      contracts: data.contracts?.length || 0,
      approvals: data.approvals?.length || 0,
      transcripts: data.transcripts?.length || 0,
    },
    contracts: data.contracts || [],
    approvals: data.approvals || [],
    transcripts: data.transcripts || [],
    activities: data.activities || [],
  };
}
