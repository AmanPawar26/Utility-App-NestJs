import { fireEvent, render, screen, within, waitFor} from "@testing-library/react"
import React from 'react';
import '@testing-library/jest-dom';
import UpdateModal from "../../Modal/UpdateModal"
import ApiService from "../../Service/ApiService";


jest.mock('../../Service/ApiService')


describe("Basic Test", () => {
    test('Sample test for checking update modal is rendering or not', () => {
        render(
            <UpdateModal
                onClose={() => { }}
                setError={() => { }}
            />
        )
        expect(screen.getByText(/update property/i)).toBeInTheDocument();
    })
})
describe("Simulating user click", () => {
    test('Fetches the property based on id', () => {
        render(
            <UpdateModal
                onClose={() => { }}
                setError={() => { }}
            />
        )
        expect(screen.getByPlaceholderText(/enter property id/i)).toBeInTheDocument();
    })
})
describe("Update Modal select fields", () => {
    beforeEach(() => {
        ApiService.getPropertyById.mockResolvedValue({
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
        })
    })
    test("renders property type select field after loading property for a specific id", async () => {
        render(
            <UpdateModal
                onClose={() => { }}
                setError={() => { }}
            />
        )
        const input = screen.getByPlaceholderText(/enter property id/i);
        fireEvent.change(input, { target: { value: "1" } })

        const button = screen.getByRole("button", { name: /load property/i });
        fireEvent.click(button);

        const select = await screen.findByLabelText(/property type \*/i);
        const options = within(select).getAllByRole("option");

        const defaultOption = within(select).getByRole("option", {
            name: /select property type \*/i,
        })

        expect(defaultOption.selected).toBe(false);
        expect(select.value).toBe("apartment");
        expect(options.length).toBe(6);
    })
    test('renders listing type select fields after loading property for a specific id', async () => {
        render(
            <UpdateModal
                onClose={() => { }}
                setError={() => { }}
            />
        )
        const input = screen.getByPlaceholderText(/enter property id/i);
        fireEvent.change(input, { target: { value: "1" } });

        const button = screen.getByRole("button", { name: /load property/i });
        fireEvent.click(button);

        const select = await screen.findByLabelText(/listing type \*/i);
        const options = within(select).getAllByRole("option");

        const defaultOption = within(select).getByRole("option", {
            name: /select listing type \*/i,
        });
        expect(defaultOption.selected).toBe(false);
        expect(select.value).toBe("rent");
        expect(options.length).toBe(3);
    })
})
describe('Update property', () => {
    const onCloseMock = jest.fn();
    const setErrorMock = jest.fn();

    const mockData = {
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
    }

    beforeEach(() => {
        ApiService.getPropertyById.mockResolvedValue(mockData);
        ApiService.updateProperty = jest.fn().mockResolvedValue({ message: "Success" })
    })
    test('Updating required fields for a specific id', async () => {
        render(
            <UpdateModal
                onClose={() => { }}
                setError={() => { }}
            />
        )
        const input = screen.getByPlaceholderText(/enter property id/i);
        fireEvent.change(input, { target: { value: "1" } });

        const loadbutton = screen.getByRole("button", { name: /load property/i });
        fireEvent.click(loadbutton);

        await screen.findByLabelText(/property type \*/i);

        fireEvent.change(screen.getByPlaceholderText(/city \*/i), {
            target: {value : "New Test City"},
        })

        fireEvent.change(screen.getByPlaceholderText(/price \*/i), {
            target: {value : "120000"},
        })
 
        const submitButton = screen.getByRole("button", {name: /update property/i});
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(ApiService.updateProperty).toHaveBeenCalledWith(1, expect.objectContaining({
                City: "New Test City",
                Price: "120000"
            }))
        })
    })
})