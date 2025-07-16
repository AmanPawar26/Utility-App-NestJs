import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DeleteModal from "../../Modal/DeleteModal";
import ApiService from "../../Service/ApiService";


jest.mock('../../Service/ApiService', () => ({
  __esModule: true,
  default: {
    getPropertyById: jest.fn(),
    deleteProperty: jest.fn(),
  },
}));


beforeAll(() => {
  window.confirm = jest.fn(() => true);
});

describe('Delete property by id', () => {
  const sampleData = {
    id: 1,
    City: "Test City",
    Address: "123 Test St",
    ZipCode: "12345",
    Property_Type: "apartment",
    Price: "100000",
    Square_Feet: 1000,
    Beds: 3,
    Bathrooms: 2,
    Features: "Test features",
    Listing_Type: "rent",
  };

  beforeEach(() => {
    ApiService.getPropertyById.mockResolvedValue({ data: sampleData });
    ApiService.deleteProperty.mockResolvedValue({ message: "Success" });
  });

  it('deletes property successfully', async () => {
    render(<DeleteModal onClose={() => { }} setError={() => { }} />);

   
    fireEvent.change(screen.getByPlaceholderText(/enter property id/i), {
      target: { value: "1" },
    });

   
    fireEvent.click(screen.getByRole("button", { name: /load property/i }));

    
    await screen.findByText(/city:/i);

    // Click delete
    fireEvent.click(screen.getByRole("button", { name: /delete property/i }));

    
    await screen.findByText(/deleted successfully/i);
  });
});
