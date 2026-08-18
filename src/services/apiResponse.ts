import type { IpApiResponse } from "../models/ip_model";


const API_URL: string = "https://geo.ipify.org/api/v2/country,city?apiKey=at_AATSo42bmm6MOJ1f2nVEB7atYGY3T"


export async function getIpAddressOrDomain(key: string = '', value: string = '') {
    let url = '';
    if (key !== '' && value !== '') {
        url = `${API_URL}&${key}=${value}`;
    } else {
        url = API_URL;
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch. Try Again.")
        }

        const data: IpApiResponse = await response.json();

        return data;

    } catch (error) {
        console.error("Failed to fetch products:", error);
        throw error;
    }

}