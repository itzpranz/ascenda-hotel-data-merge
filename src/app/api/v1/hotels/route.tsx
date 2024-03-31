import { getHotels } from "@/lib/service/hotel";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { destinationId, hotelIds, page, pageSize } = validateHotelQuery(request);
        const hotels = await getHotels(destinationId, hotelIds, page, pageSize);
        return new Response(JSON.stringify(hotels), {
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        });
    } catch (e: any) {
        return new Response(JSON.stringify({
            error_code: e.errorCode,
            message: e.message,
        }), {
            status: e.httpStatusCode,
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        });
    }
}

function validateHotelQuery(request: NextRequest): { destinationId?: string | null, hotelIds?: string[], page?: number, pageSize?: number} {
    const queryParam = request.nextUrl.searchParams;
    const destinationId = queryParam.get("destination_id");
    const hotelIds = queryParam.get("hotel_ids");
    const pageSize = queryParam.get("page_size");
    const page = queryParam.get("page");
    
    if (!destinationId && !hotelIds) {
        throw {
            errorCode: "INVALID_REQUEST",
            message: "Either destination_id or hotel_ids is required",
            httpStatusCode: 400,
        };
    }

    if (destinationId && hotelIds) {
        throw {
            errorCode: "INVALID_REQUEST",
            message: "Only one of destination_id or hotel_ids is allowed",
            httpStatusCode: 400,
        };
    }

    if (page && !Number.isInteger(parseInt(page))) {
        throw {
            errorCode: "INVALID_REQUEST",
            message: "Page should be a positive integer",
            httpStatusCode: 400,
        };
    }

    if (pageSize && !Number.isInteger(parseInt(pageSize))) {
        throw {
            errorCode: "INVALID_REQUEST",
            message: "Page Size should be a positive integer",
            httpStatusCode: 400,
        };
    }

    if (pageSize && (parseInt(pageSize) < 1 || parseInt(pageSize) > 100)) {
        throw {
            errorCode: "INVALID_REQUEST",
            message: "Page Size should be between 1 and 100",
            httpStatusCode: 400,
        };
    }


    return {
        destinationId,
        hotelIds: hotelIds?.split(',').map((id) => id.trim()),
        pageSize: parseInt(pageSize || '10'),
        page: parseInt(page || '1'),
    }
};