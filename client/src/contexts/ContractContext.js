import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const ContractContext = createContext();

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentContract, setCurrentContract] = useState(null);

  const fetchContracts = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await axios.get(`/api/contracts?${params}`);
      setContracts(response.data.contracts);
      return response.data;
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchContract = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/contracts/${id}`);
      setCurrentContract(response.data.contract);
      return response.data.contract;
    } catch (error) {
      console.error('Error fetching contract:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createContract = async (contractData) => {
    try {
      const response = await axios.post('/api/contracts', contractData);
      const newContract = response.data.contract;
      setContracts(prev => [newContract, ...prev]);
      return { success: true, contract: newContract };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create contract'
      };
    }
  };

  const updateContract = async (id, contractData) => {
    try {
      const response = await axios.put(`/api/contracts/${id}`, contractData);
      const updatedContract = response.data.contract;
      
      setContracts(prev => 
        prev.map(contract => 
          contract._id === id ? updatedContract : contract
        )
      );
      
      if (currentContract && currentContract._id === id) {
        setCurrentContract(updatedContract);
      }
      
      return { success: true, contract: updatedContract };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update contract'
      };
    }
  };

  const deleteContract = async (id) => {
    try {
      await axios.delete(`/api/contracts/${id}`);
      setContracts(prev => prev.filter(contract => contract._id !== id));
      
      if (currentContract && currentContract._id === id) {
        setCurrentContract(null);
      }
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete contract'
      };
    }
  };

  const updateContractStatus = async (id, status) => {
    try {
      const response = await axios.post(`/api/contracts/${id}/status`, { status });
      const updatedContract = response.data.contract;
      
      setContracts(prev => 
        prev.map(contract => 
          contract._id === id ? updatedContract : contract
        )
      );
      
      if (currentContract && currentContract._id === id) {
        setCurrentContract(updatedContract);
      }
      
      return { success: true, contract: updatedContract };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update contract status'
      };
    }
  };

  const addContractMessage = async (id, message) => {
    try {
      const response = await axios.post(`/api/contracts/${id}/message`, { message });
      const updatedContract = response.data.contract;
      
      setContracts(prev => 
        prev.map(contract => 
          contract._id === id ? updatedContract : contract
        )
      );
      
      if (currentContract && currentContract._id === id) {
        setCurrentContract(updatedContract);
      }
      
      return { success: true, contract: updatedContract };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add message'
      };
    }
  };

  const uploadDocument = async (contractId, file, documentType) => {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('contractId', contractId);
      formData.append('documentType', documentType);

      const response = await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh the contract to get updated document references
      await fetchContract(contractId);

      return { success: true, document: response.data.document };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload document'
      };
    }
  };

  const downloadDocument = async (documentId) => {
    try {
      const response = await axios.get(`/api/documents/${documentId}/download`, {
        responseType: 'blob',
      });

      // Create a blob link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or use a default
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]
        : 'document';
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to download document'
      };
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      await axios.delete(`/api/documents/${documentId}`);
      
      // Refresh the current contract if it's loaded
      if (currentContract) {
        await fetchContract(currentContract._id);
      }
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete document'
      };
    }
  };

  const value = {
    contracts,
    currentContract,
    loading,
    fetchContracts,
    fetchContract,
    createContract,
    updateContract,
    deleteContract,
    updateContractStatus,
    addContractMessage,
    uploadDocument,
    downloadDocument,
    deleteDocument,
    setCurrentContract
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};
