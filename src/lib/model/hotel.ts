export interface Image {
    link: string;
    description: string;
}
export interface Location {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
}
export interface Hotel {
    id: string;
    destination_id: number;
    name: string;
    location: Location;
    description: string;
    amenities: {[type: string]: string[]};
    images: { [type: string]: Image[] };
    booking_conditions: string[];
}

export interface PaginatedHotelResponse {
    hotels: Hotel[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
