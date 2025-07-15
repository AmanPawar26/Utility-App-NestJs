import { fireEvent, render, screen, within, waitFor } from "@testing-library/react"
import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import CreateModal from "../Modal/CreateModal"
import ApiService from "../Service/ApiService";

jest.mock('../Service/ApiService')

describe("Basic test", () => {
    test('Sample test for checking create modal is rendering or not', async () => {
        render(
            <CreateModal
                onClose={() => { }}
                setError={() => { }}
            />
        );
        expect(screen.getByText(/create new property/i)).toBeInTheDocument();
    })
})
describe("Simulating user click", () => {
    test('Submits data entered in the form fields for creating a new property', () => {
        render(
            <CreateModal
                onClose={() => { }}
                setError={() => { }}
            />
        );
        expect(screen.getByText(/create property/i)).toBeInTheDocument();
    })
    test("Selects property type when creating a new property", () => {
        render(
            <CreateModal
                onClose={() => { }}
                setError={() => { }}
            />
        );
        const selectElement = screen.getByLabelText(/property type \*/i);
        const options = within(selectElement).getAllByRole("option");

        const defaultOption = within(selectElement).getByRole("option", {
            name: /select property type \*/i,
        })
        expect(defaultOption.selected).toBe(true);
        expect(options.length).toBe(6)
    })
    test("select listing type when creating a new property", () => {
        render(
            <CreateModal
                onClose={() => { }}
                setError={() => { }}
            />
        );
        const selectElement = screen.getByLabelText(/listing type \*/i);
        const options = within(selectElement).getAllByRole("option")

        const defaultOption = within(selectElement).getByRole("option", {
            name: /select listing type \*/i,
        })

        expect(defaultOption.selected).toBe(true);
        expect(options.length).toBe(3);
    })
})
describe('Create a new property', () => {
    test('Form to be filled with required fields to create a new property', async () => {
        const onCloseMock = jest.fn();
        const setErrorMock = jest.fn();

        const mockResponse = { data: { id: 1 } };
        ApiService.createProperty.mockResolvedValue(mockResponse);

        render(
            <CreateModal
                onClose={onCloseMock}
                setError={setErrorMock}
            />
        );

        fireEvent.change(screen.getByPlaceholderText(/city \*/i), {
            target: { value: 'New York' }
        });

        fireEvent.change(screen.getByPlaceholderText(/address \*/i), {
            target: { value: '123 Test St' }
        });

        fireEvent.change(screen.getByPlaceholderText(/zip code \*/i), {
            target: { value: '10001' }
        });

        fireEvent.change(screen.getByLabelText(/property type \*/i), {
            target: { value: 'apartment' }
        });

        fireEvent.change(screen.getByPlaceholderText(/price \*/i), {
            target: { value: '300000' }
        });

        fireEvent.change(screen.getByPlaceholderText(/square feet \*/i), {
            target: { value: '900' }
        });

        fireEvent.change(screen.getByPlaceholderText(/bedrooms/i), {
            target: { value: '2' }
        });

        fireEvent.change(screen.getByPlaceholderText(/bathrooms/i), {
            target: { value: '1.5' }
        });

        fireEvent.change(screen.getByLabelText(/listing type \*/i), {
            target: { value: 'sale' }
        });

        fireEvent.change(screen.getByPlaceholderText(/features/i), {
            target: { value: 'Balcony' }
        });

        fireEvent.click(screen.getByRole('button', { name: /create property/i }));

        await waitFor(() => {
            expect(ApiService.createProperty).toHaveBeenCalledWith(expect.objectContaining({
                City: 'New York',
                Address: '123 Test St',
                ZipCode: '10001',
                Property_Type: 'apartment',
                Price: '300000',
                Square_Feet: 900,
                Beds: 2,
                Bathrooms: 1.5,
                Features: 'Balcony',
                Listing_Type: 'sale'
            }));
        });
    });
});