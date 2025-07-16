import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UpdateModal from '../../Modal/UpdateModal';
import ApiService from '../../Service/ApiService';

jest.mock('../../Service/ApiService', () => ({
    __esModule: true,
    default: {
        getPropertyById: jest.fn(),
        updateProperty: jest.fn(),
    },
}));

describe('Update property by id', () => {
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
        ApiService.getPropertyById.mockResolvedValue(sampleData);
        ApiService.updateProperty.mockResolvedValue({ message: "Success" });
    });

    it('loads and updates a property by id', async () => {
        render(
            <UpdateModal
                onClose={() => { }}
                setError={() => { }}
            />
        );

        
        const input = screen.getByPlaceholderText(/enter property id/i);
        fireEvent.change(input, { target: { value: "1" } });

        const loadButton = screen.getByRole("button", { name: /load property/i });
        fireEvent.click(loadButton);

        
        await waitFor(() => {
            expect(screen.getByDisplayValue("123 Test St")).toBeInTheDocument();
        });

        
        const addressInput = screen.getByPlaceholderText(/address \*/i);
        fireEvent.change(addressInput, { target: { value: "456 New Address" } });

        
        const updateButton = screen.getByRole("button", { name: /update/i });
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(ApiService.updateProperty).toHaveBeenCalled();
        });
    });
});
