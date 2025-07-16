import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import React from 'react';
import '@testing-library/jest-dom';
import ReadModal from "../Modal/ReadModal"
import ApiService from "../Service/ApiService";

const mockProperties = [
    {
        id: 1,
        City: 'New York',
        Address: '123 Test St',
        ZipCode: '10001',
        Property_Type: 'Apartment',
        Price: '300000',
        Square_Feet: 900,
        Beds: 2,
        Bathrooms: 1,
        Features: 'Balcony',
        Listing_Type: 'Sale',
    }
];

jest.mock('../Service/ApiService')

describe('sample test', () => {
    test('Sample test for checking read modal is rendering or not', () => {
        render(
            <ReadModal
                onClose={() => { }}
                results={[]}
                setResults={() => { }}
                loading={false}
                setLoading={() => { }}
                setError={() => { }}
            />
        );
        expect(screen.getByText(/search by city/i)).toBeInTheDocument();
        expect(screen.getByText(/search by id/i)).toBeInTheDocument();
        expect(screen.getByText(/get all properties/i)).toBeInTheDocument();
    })
})

describe('Simulating user click', () => {
    test('prompts city name input when "Search by City" button is clicked', () => {
        render(
            <ReadModal
                onClose={() => { }}
                results={[]}
                setResults={() => { }}
                loading={false}
                setLoading={() => { }}
                setError={() => { }}
            />
        );
        fireEvent.click(screen.getByText(/search by city/i));
        expect(screen.getByPlaceholderText(/enter city name/i)).toBeInTheDocument()
    })

    test('prompts property id when "Search by ID" button is clicked', () => {
        render(
            <ReadModal
                onClose={() => { }}
                results={[]}
                setResults={() => { }}
                loading={false}
                setLoading={() => { }}
                setError={() => { }}
            />
        );
        fireEvent.click(screen.getByText(/search by id/i));
        expect(screen.getByPlaceholderText(/enter property id/i)).toBeInTheDocument()
    })

    test('Displays table container when "All Properties" button is clicked and display results from db if present', () => {
        const results = render(
            <ReadModal
                onClose={() => { }}
                results={[mockProperties]}
                setResults={() => { }}
                loading={false}
                setLoading={() => { }}
                setError={() => { }}
            />
        );
        const tableDiv = screen.getByRole('table').closest('.table-container');
        expect(tableDiv).toBeInTheDocument();
    })
})

describe('Mock Api Call', () => {
    test('calls getAllProperties when "All Properties" button is clicked', async () => {
        const mockData = [
            {
                City: 'Mumbai',
                Address: "Wadala"
            }
        ];
        ApiService.getAllProperties.mockResolvedValue({ data: mockData })

        const setResults = jest.fn();

        render(
            <ReadModal
                onClose={() => { }}
                results={[]}
                setResults={setResults}
                loading={false}
                setLoading={() => { }}
                setError={() => { }}
            />
        );

        fireEvent.click(screen.getByText(/get all properties/i));
        expect(ApiService.getAllProperties).toHaveBeenCalled();
    })
    test('calls getPropertyByCity when "Get Property By City" button is clicked', async () => {
        const mockData = [
            {
                id: 1,
                City: 'New York',
                Address: '123 Test St',
                ZipCode: '10001',
                Property_Type: 'Apartment',
                Price: '300000',
                Square_Feet: 900,
                Beds: 2,
                Bathrooms: 1,
                Features: 'Balcony',
                Listing_Type: 'Sale',
            }
        ];

        ApiService.getPropertiesByCity.mockResolvedValue({ data: mockData });

        const Wrapper = () => {
            const [results, setResults] = React.useState([]);
            return (
                <ReadModal
                    onClose={() => { }}
                    results={results}
                    setResults={setResults}
                    loading={false}
                    setLoading={() => { }}
                    setError={() => { }}
                />
            );
        };

        render(<Wrapper />);

        fireEvent.click(screen.getByText(/search by city/i));
        fireEvent.change(screen.getByPlaceholderText(/enter city name/i), {
            target: { value: 'New York' },
        });
        fireEvent.click(screen.getByRole('button', { name: /search/i }));

        await waitFor(() => {
            expect(screen.getByText(/New York/i)).toBeInTheDocument();
        });
    });
    test('calls getPropertyById when "Get Property By Id" button is clicked', async () => {
        const mockData = 
            {
                id: 1,
                City: 'New York',
                Address: '123 Test St',
                ZipCode: '10001',
                Property_Type: 'Apartment',
                Price: '300000',
                Square_Feet: 900,
                Beds: 2,
                Bathrooms: 1,
                Features: 'Balcony',
                Listing_Type: 'Sale',
            }
        
        ApiService.getPropertyById.mockResolvedValue({ data: mockData });

        const Wrapper = () => {
            const [results, setResults] = React.useState([]);
            const [loading, setLoading] = React.useState(false);
            const [error, setError] = React.useState('');

            return (
                <ReadModal
                    onClose={() => { }}
                    results={results}
                    setResults={setResults}
                    loading={loading}
                    setLoading={setLoading}
                    setError={setError}
                />
            );
        };
        render(<Wrapper />)
        fireEvent.click(screen.getByText(/search by id/i));
        fireEvent.change(screen.getByPlaceholderText(/enter property id/i), {
            target: { value: '1' },
        })
        fireEvent.click(screen.getByRole('button', { name: /search/i }));

        await waitFor(() => {
            expect(screen.getByText(/new york/i)).toBeInTheDocument();
        })
    })

})