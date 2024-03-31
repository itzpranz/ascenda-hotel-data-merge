import { Hotel, Image, PaginatedHotelResponse } from "../model/hotel";

/*
Cache the hotel data for 5 minutes
*/
let cachedHotelData: Hotel[];
let cachedHotelDataTimestamp: number;
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export async function getHotels(destinationId?: string | null, hotelIds?: string[], page = 1, pageSize = 10): Promise<PaginatedHotelResponse> {
    let hotelData: Hotel[];
    if (cachedHotelData && Date.now() - cachedHotelDataTimestamp < CACHE_DURATION) {
        hotelData = cachedHotelData;
    } else {
        hotelData = await fetchHotelDetailsFromSupplier();
    }

    if (destinationId) {
        hotelData = hotelData.filter(hotel => hotel.destination_id === Number(destinationId));
    } else if (hotelIds && hotelIds.length) {
        hotelData = hotelData.filter(hotel => hotelIds.includes(hotel.id));
    } else {
        hotelData = [];
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedHotelData = hotelData.slice(startIndex, endIndex);

    return {
        hotels: paginatedHotelData,
        total: hotelData.length,
        page,
        pageSize,
        totalPages: Math.ceil(hotelData.length / pageSize),
    };
}

const SUPPLIERS: {[name: string]: {
    url: string;
    mapping: any;
}} = {
    acme: {
        url: 'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme',
        mapping: {
            id: 'Id',
            destination_id: 'DestinationId',
            name: 'Name',
            location: {
                lat: 'Latitude',
                lng: 'Longitude',
                address: (data: any) => [data.Address?.trim(), data.PostalCode?.trim()].join(', '),
                city: 'City',
                country: 'Country',
            },
            description: 'Description',
            amenities: (data: any) => {
                if (!data.Facilities || !data.Facilities.length) {
                    return undefined;
                }
                return {
                    general: data.Facilities,
                };
            },
        }
    },
    patagonia: {
        url: 'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia',
        mapping: {
            id: 'id',
            destination_id: 'destination',
            name: 'name',
            location: {
                lat: 'lat',
                lng: 'lng',
                address: 'address',
            },
            description: 'info',
            amenities: (data: any) => {
                if (!data.amenities || !data.amenities.length) {
                    return undefined;
                }
                return {
                    general: data.amenities,
                };
            },
            images: (data: any) => {
                const imageTypes = Object.keys(data.images);
                if (!imageTypes.length) {
                    return undefined;
                }
                const images: { [type: string]: Image[] } = {};

                imageTypes.forEach(type => {
                    images[type] = data.images[type].map((image: any) => ({
                        link: image.url,
                        description: image.description,
                    }));
                });
                return images;
            }
        }
    },
    paperflies : {
        url: 'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies',
        mapping: {
            id: 'hotel_id',
            destination_id: 'destination_id',
            name: 'hotel_name',
            location: {
                address: 'location.address',
                country: 'location.country',
            },
            description: 'details',
            amenities: (data: any) => {
                const amenitiesTypes = Object.keys(data.amenities);
                if (!amenitiesTypes.length) {
                    return undefined;
                }
                const amenities: { [type: string]: string[] } = {};

                amenitiesTypes.forEach(type => {
                    amenities[type] = data.amenities[type]
                });

                return amenities;
            },
            images: (data: any) => {
                const imageTypes = Object.keys(data.images);
                if (!imageTypes.length) {
                    return undefined;
                }
                const images: { [type: string]: Image[] } = {};

                imageTypes.forEach(type => {
                    images[type] = data.images[type].map((image: any) => ({
                        link: image.link,
                        description: image.caption,
                    }));
                });
            },
            booking_conditions: 'booking_conditions',
        }
    },
};

function mapHotelData(hotel: any, mapping: any) {
    const mappedHotel: any = {};
    for (const key in mapping) {
      if (typeof mapping[key] === 'object') {
        mappedHotel[key] = mapHotelData(hotel, mapping[key]);
      } else if (typeof mapping[key] === 'function') {
        mappedHotel[key] = mapping[key](hotel);
      } else {
        mappedHotel[key] = hotel[mapping[key]] || undefined;
      }
    }
    return mappedHotel;
}

function cleanupHotelData(hotels: Hotel[]): Hotel[] {
    const hotelMap: { [id: string]: Hotel } = {};

    hotels.forEach((hotel) => {
        const id = hotel.id;

        if (!hotelMap[id]) {
            hotelMap[id] = hotel;
        } else {
            // Merge the duplicate hotel's data with the existing hotel's data with simple rule written in comments
            const newHotelData: Hotel = {
                id,
                // desitination_id will always be same
                destination_id: hotel.destination_id,
                // will always be the longest name
                name: hotel.name?.length > hotelMap[id].name?.length ? hotel.name : hotelMap[id].name,
                // will always be the longest description
                description: hotel.description?.length > hotelMap[id].description?.length ? hotel.description : hotelMap[id].description,
                location: {
                    // will always be the latest lat and lng
                    lat: hotel.location?.lat || hotelMap[id].location?.lat,
                    lng: hotel.location?.lng || hotelMap[id].location?.lng,
                    // will always be the latest address
                    address: hotel.location?.address || hotelMap[id].location?.address,
                    // will always be the latest city
                    city: hotel.location?.city || hotelMap[id].location?.city,
                    // will always be the latest country
                    country: hotel.location?.country || hotelMap[id].location?.country,
                },
                // merge amenities such that the merged data contains all the amenities from both objects
                amenities: mergeAmenities(hotel.amenities, hotelMap[id].amenities),
                // merge images such that the merged data contains all the images from both objects
                images: mergeImages(hotel.images, hotelMap[id].images),
                // merge booking_conditions such that the merged data contains all the booking_conditions from both objects
                booking_conditions: Array.from(new Set([...(hotel.booking_conditions || []), ...(hotelMap[id].booking_conditions || [])])),
            };
            
            hotelMap[id] = newHotelData;
        }
    });

    const cleanedHotels: Hotel[] = Object.values(hotelMap);
  
    return cleanedHotels;
}

// Fetch hotel data from suppliers and return the cleaned up data
async function fetchHotelDetailsFromSupplier() {
    try {
        const hotelData: Hotel[] = await Promise.all(Object.keys(SUPPLIERS).map(async (supplier) => {
            const response = await fetch(SUPPLIERS[supplier].url);
            const data = await response.json();
            return data.map((hotel: any) => mapHotelData(hotel, SUPPLIERS[supplier].mapping) as Hotel);
        }));

        cachedHotelData = cleanupHotelData(hotelData.flat());
        cachedHotelDataTimestamp = Date.now();

        return cachedHotelData;
    } catch (error) {
        throw error;
    }
}

// Merge amenities data such that the merged data contains all the amenities from both objects
function mergeAmenities(a: { [type: string]: string[] } = {}, b: { [type: string]: string[] } = {}): { [type: string]: string[] } {
    const result: { [type: string]: string[] } = {};

    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
  
    allKeys.forEach((key) => {
      const mergedArray = Array.from(new Set([...(a[key] || []), ...(b[key] || [])]));
      result[key] = mergedArray;
    });

    return result;
}

// Merge images data such that the merged data contains all the images from both objects
function mergeImages(a: { [type: string]: Image[] } = {}, b: { [type: string]: Image[] } = {}): { [type: string]: Image[] } {
    const result: { [type: string]: Image[] } = {};

    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);

    allKeys.forEach((key) => {
      const mergedArray = Array.from(new Set([...(a[key] || []), ...(b[key] || [])]));
      result[key] = mergedArray;
    });
  
    return result;
}

