export interface IpApiResponse {
    ip: string;
    isp: string;
    location: Location;
    as: AutonomousSystem;
}

export interface Location {
    city: string;
    country: string;
    geonameId: number;
    lat: number;
    lng: number;
    postalCode: string;
    region: string;
    timezone: string;
}

export interface AutonomousSystem {
    asn: number;
    domain: string;
    name: string;
    route: string;
    type: string;
}

export const data = {
    ip: "8.8.8.8",
    location: {
        country: "US",
        region: "California",
        timezone: "-07:00"
    },
    as: {
        asn: 15169,
        name: "GOOGLE",
        route: "8.8.8.0 / 24",
        domain: "https://about.google/intl/en/",
        type: "Content"
    },
    isp: "Google LLC"
}