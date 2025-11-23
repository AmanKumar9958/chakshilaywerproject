// Document Processing API Service

const API_BASE = 'https://n8n.srv983857.hstgr.cloud/webhook';

// 1. Contract Comparison Tool
export const compareContracts = async (file1, file2) => {
  try {
    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);
    
    const response = await fetch(`${API_BASE}/a027ab82-e53c-4246-9982-c41c79ac9bca`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Contract comparison failed:', error);
    throw error;
  }
};

// 2. Contract Risk Analysis
export const analyzeContractRisk = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file1', file);
    
    const response = await fetch(`${API_BASE}/32c4f30e-6722-4125-bd7d-691f0e9460e4`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Risk analysis failed:', error);
    throw error;
  }
};

// 3. Document Summarizer
export const summarizeDocument = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file1', file);
    
    const response = await fetch(`${API_BASE}/12ac51e5-e395-4c18-b5f9-ddd9516e6ed3`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Document summarization failed:', error);
    throw error;
  }
};

// 4. Task Generator (Compliance)
export const generateComplianceTasks = async (regulation, country, companyType) => {
  try {
    const requestBody = {
      Regulation: regulation,
      Country: country,
      CompanyType: companyType
    };
    
    const response = await fetch(`${API_BASE}/compliance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Compliance task generation failed:', error);
    throw error;
  }
};

// Helper function to create a File object from sample data
export const createMockFile = (fileName, type = 'application/pdf') => {
  // Create a simple mock file for testing
  const blob = new Blob(['Mock PDF content for ' + fileName], { type });
  const file = new File([blob], fileName, { type });
  return file;
};