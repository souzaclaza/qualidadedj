// Temporary mock data storage
const mockStorage = {
  toners: [],
  retornados: [],
  garantias: [],
  fornecedores: [],
  configuracoes: {
    empresa: null
  }
};

export async function testConnection() {
  return { 
    success: true, 
    message: 'Mock connection successful!' 
  };
}

export async function createTables() {
  return { 
    success: true, 
    message: 'Mock tables created successfully!' 
  };
}

// Export mock storage for direct access
export const db = mockStorage;