import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from "@testing-library/react"
import DeleteModal from "../Modal/DeleteModal"
import ApiService from "../Service/ApiService";

jest.mock('../Service/ApiService')

describe('Basic test', () => {
    test('Sample test for checking if delete modal is rendering or not', () => {
        render(
            <DeleteModal
                onClose={() => { }}
                setError={() => { }}
            />
        )
        expect(screen.getByText(/delete property/i)).toBeInTheDocument();
    })
})
describe("Simulating user click", () => {
    test('Prompts property id user wishes to delete', () => {
        render(
            <DeleteModal
                onClose={() => { }}
                setError={() => { }}
            />
        )
        expect(screen.getByPlaceholderText(/enter property id/i)).toBeInTheDocument();
    })
})
