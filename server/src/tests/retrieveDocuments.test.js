import { jest } from '@jest/globals';
import { retrieveDocuments } from '../services/AI/utils/RAG.js';

// Create Jest mock functions
const mockGetEmbedding = jest.fn();
const mockRpc = jest.fn();

// Mock the modules
jest.mock('../services/AzureOpenAI.js', () => ({
  getEmbedding: (...args) => mockGetEmbedding(...args)
}));

jest.mock('../services/SupabaseClient.js', () => ({
  __esModule: true,
  default: {
    rpc: (...args) => mockRpc(...args)
  }
}));

describe('retrieveDocuments', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('should successfully retrieve documents', async () => {
    // 1. Setup test data
    const queryText = 'marketing strategy';
    const matchCount = 2;
    const mockEmbedding = new Array(1536).fill(0.1);
    const mockResults = [
      {
        id: "test-doc-1",
        similarity: 0.89,
        metadata: {
          chunk_content: "Marketing strategy 1",
          chunk_idx: 1,
          group: "Test Group",
          number_of_chunks: 10,
          original_doc_index: 1
        }
      },
      {
        id: "test-doc-2",
        similarity: 0.78,
        metadata: {
          chunk_content: "Marketing strategy 2",
          chunk_idx: 2,
          group: "Test Group",
          number_of_chunks: 10,
          original_doc_index: 1
        }
      }
    ];

    // 2. Setup mocks
    mockGetEmbedding.mockResolvedValueOnce(mockEmbedding);
    mockRpc.mockResolvedValueOnce({ data: mockResults, error: null });

    // 3. Execute function
    const result = await retrieveDocuments(queryText, matchCount);

    // 4. Assertions
    expect(result).toEqual(mockResults);
    expect(mockGetEmbedding).toHaveBeenCalledWith(queryText);
    expect(mockRpc).toHaveBeenCalledWith(
      'search_king_kong_quantum_growth',
      {
        query_embedding: mockEmbedding,
        match_count: matchCount
      }
    );
  });

  it('should handle errors properly', async () => {
    const queryText = 'marketing strategy';
    const matchCount = 2;
    
    // Test embedding generation error
    const mockEmbeddingError = new Error('Embedding generation failed');
    mockGetEmbedding.mockRejectedValueOnce(mockEmbeddingError);

    await expect(retrieveDocuments(queryText, matchCount))
      .rejects
      .toThrow('Embedding generation failed');

    // Test RPC error
    mockGetEmbedding.mockResolvedValueOnce(new Array(1536).fill(0.1));
    const rpcError = new Error('RPC call failed');
    mockRpc.mockResolvedValueOnce({ data: null, error: rpcError });

    await expect(retrieveDocuments(queryText, matchCount))
      .rejects
      .toThrow('RPC call failed');
  });
});