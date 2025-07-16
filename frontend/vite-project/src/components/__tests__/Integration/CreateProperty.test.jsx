import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import CreateModal from "../../Modal/CreateModal"
import ApiService from "../../Service/ApiService"

jest.mock('../../Service/ApiService', () => ({
    createProperty: jest.fn()
}))

describe("Create Property", () => {
    it("allows user to fill the required fields to create a new property via the Create Modal", async() => {
        const userInput = {data: {id: 1}};
        ApiService.createProperty.mockResolvedValue(userInput);

         render(
            <CreateModal 
            onClose={() => {}}
            setError={() => {}}
            />
        )

        fireEvent.change(screen.getByPlaceholderText(/city \*/i), {
            target: {value: 'Test City'}
        });
         fireEvent.change(screen.getByPlaceholderText(/address \*/i), {
            target: { value: '123 Test St' }
        });

        fireEvent.change(screen.getByPlaceholderText(/zip code \*/i), {
            target: { value: '10001' }
        });

        fireEvent.change(screen.getByRole("combobox", {name: /property type \*/i}), 
        {
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

        fireEvent.change(screen.getByRole("combobox", {name: /listing type \*/i}), 
        {
            target: { value: 'sale' }
        });

        fireEvent.change(screen.getByPlaceholderText(/features/i), {
            target: { value: 'Balcony' }
        });
        fireEvent.click(screen.getByRole("button", {name: /create property/i}))

        await waitFor(()=>{
            screen.findByText(/Property created successfully!/);
        })
    })
})