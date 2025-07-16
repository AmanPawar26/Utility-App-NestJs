import React from 'react';
import '@testing-library/jest-dom';
import ReadModal from '../../Modal/ReadModal';
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import ApiService from "../../Service/ApiService"

jest.mock('../../Service/ApiService', () => ({
    __esModule: true,
    default: {
        getAllProperties: jest.fn(),
        getPropertiesByCity: jest.fn(),
        getPropertyById: jest.fn()
    }
}));

describe('Read Property: get all, get by city, get by id', () => {
    it('Gets all property', async () => {
        const sampleData = [
            {
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

        ApiService.getAllProperties.mockResolvedValue({ data: sampleData })

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
        fireEvent.click(screen.getByText(/get all properties/i));

        await waitFor(() => {
            screen.debug();
            expect(screen.getByText('New York')).toBeInTheDocument();
            expect(screen.getByText('123 Test St')).toBeInTheDocument();
            expect(screen.getByText('10001')).toBeInTheDocument();
            expect(screen.getByText('Apartment')).toBeInTheDocument();
            expect(screen.getByText(/\$?3,?00,?000/)).toBeInTheDocument();
            expect(screen.getByText('900')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Balcony')).toBeInTheDocument();
            expect(screen.getByText('Sale')).toBeInTheDocument();
        });

    })
    it("Get property by city", async () => {
        const sampleData = [
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
        ApiService.getPropertiesByCity.mockResolvedValue({ data: sampleData });

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
        })
        fireEvent.click(screen.getByRole('button', { name: /search/i }));

        await waitFor(() => {
            screen.debug();
            expect(screen.getByText(/New York/i)).toBeInTheDocument();
            expect(screen.getByText('123 Test St')).toBeInTheDocument();
            expect(screen.getByText('10001')).toBeInTheDocument();
            expect(screen.getByText('Apartment')).toBeInTheDocument();
            expect(screen.getByText(/\$?3,?00,?000/)).toBeInTheDocument();
            expect(screen.getByText('900')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Balcony')).toBeInTheDocument();
            expect(screen.getByText('Sale')).toBeInTheDocument();
        })
    })
    it('Get property by id', async () => {
        const sampleData = {
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
        ApiService.getPropertyById.mockResolvedValue({ data: sampleData });

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
        fireEvent.click(screen.getByText(/search by id/i));
        fireEvent.change(screen.getByPlaceholderText(/enter property id/i), {
            target: { value: '1' },
        })
        fireEvent.click(screen.getByRole('button', { name: /search/i }));
        await waitFor(() => {
            screen.debug();
            expect(screen.getByText(/New York/i)).toBeInTheDocument();
            expect(screen.getByText('123 Test St')).toBeInTheDocument();
            expect(screen.getByText('10001')).toBeInTheDocument();
            expect(screen.getByText('Apartment')).toBeInTheDocument();
            expect(screen.getByText(/\$?3,?00,?000/)).toBeInTheDocument();
            expect(screen.getByText('900')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Balcony')).toBeInTheDocument();
            expect(screen.getByText('Sale')).toBeInTheDocument();
        })
    })
})