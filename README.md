Certainly! Here's the updated README with the API schema section:

---

# Hotel Management API

## Overview

Ascenda Hotel Search API provides endpoints to manage hotels, including retrieving a list of hotels, filtering hotels by destination ID or hotel IDs, and pagination support. This API allows users to fetch hotel data for various purposes such as booking, displaying hotel details, and more.

## Features

- Retrieve a list of hotels
- Filter hotels by destination ID or hotel IDs
- Hotel data consolidated from various sources
- Paginate through the list of hotels
- Get detailed information about each hotel, including amenities, location, and images
- Handle errors gracefully with appropriate error responses

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/hotel-management-api.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build Server:
    ```bash
    npm build
    ```

4. Start the server:

   ```bash
   npm start
   ```

5. The server will start running on `http://localhost:3000`.

## Usage

1. Make requests to the provided endpoints using tools like `curl`, Postman, or your preferred HTTP client.
2. Use query parameters to filter hotels based on your requirements.
3. Handle the API responses appropriately based on the status codes and response data.

## API Schema

### List of Hotels with Pagination

```yaml
GET /api/v1/hotels

Parameters:
  - destination_id: string (optional) - ID of the destination to filter hotels by
  - hotel_ids: string (optional) - Comma seperated hotel IDs to filter hotels by

Response:
  Response:
  status: number - HTTP status code
  data:
    hotels: Hotel[] - Array of hotel objects
    total: number - Total number of hotels in the response
    page: number - Current page number
    pageSize: number - Number of hotels per page
    totalPages: number - Total number of pages
```

### Hotel Object

```yaml
Hotel:
  id: string - Unique identifier for the hotel
  destination_id: number - ID of the destination associated with the hotel
  name: string - Name of the hotel
  location: Location - Location details of the hotel
  description: string - Description of the hotel
  amenities: { [type: string]: string[] } - Amenities offered by the hotel
  images: { [type: string]: Image[] } - Images of the hotel
  booking_conditions: string[] - Booking conditions for the hotel
```

## Data Merge and Cleanup Rules

When merging duplicate hotel data, the following rules are applied:

- **ID**: Destination ID will always remain the same.
- **Name**: The longest name will be retained.
- **Description**: The longest description will be retained.
- **Location**: Latest latitude, longitude, address, city, and country will be retained.
- **Amenities**: All amenities from both objects will be merged.
- **Images**: All images from both objects will be merged.
- **Booking Conditions**: All booking conditions from both objects will be merged.

## Additional Information

- This App is built on the Next.js framework and deployed online using Vercel. It can be accessed at [Ascenda Hotel Search App](https://ascenda-hotel-data-merge.vercel.app/).
- The data is dynamically fetched from various sources simultaneously to ensure fast retrieval. A local cache mechanism is built with a TTL of 5 minutes so that data need not be fetched every time an API is hit.
- The API response is paginated, so in the case of a large dataset, it can be fetched easily.
- A simple React app is also deployed, demonstrating the search feature. It also shows the API response time. The API response time can improve drastically once an active cache is already present in the system.