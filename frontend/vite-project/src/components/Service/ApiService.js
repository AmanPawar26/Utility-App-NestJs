import axios from 'axios'

const BASE_URL = '/';

const ApiService = {
    //CRUD
    createProperty: (data) => axios.post(`${BASE_URL}/properties`, data),
    getAllProperties: () => axios.get(`${BASE_URL}/properties`),
    getPropertyById: (id) => axios.get(`${BASE_URL}/properties/${id}`),
    getPropertiesByCity: (city) => axios.get(`${BASE_URL}/properties/city/${city}`),
    updateProperty: (id, data) => axios.put(`${BASE_URL}/properties/${id}`, data),
    deleteProperty: (id) => axios.delete(`${BASE_URL}/properties/${id}`),

    //Sync
    loadFromGoogleSheets: () => axios.get(`${BASE_URL}/sync/load`),
    saveToGoogleSheets: () => axios.post(`${BASE_URL}/sync/save`),
}

export default ApiService
