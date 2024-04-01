# Ascenda Hotel Data Merge

This project is an implementation of a simplified hotel data procurement and merging process, designed to work as a web server with an API endpoint. It allows querying hotel data from multiple suppliers, merging them based on specific rules, and delivering the merged data via an API endpoint with filtering capabilities.

## Features

- Dynamic fetching of data from multiple suppliers simultaneously.
- Local caching mechanism with a TTL of 5 minutes to optimize performance.
- Paginated API response for efficient data retrieval.
- Simple React web application for demonstrating search functionality and API response time.

## System Design
![System Design logo](/public/SystemDesign.png)

## API Endpoints

### GET `/api/v1/hotels`

```yaml
Parameters:
- `destination_id`: string (optional) - ID of the destination to filter hotels by.
- `hotel_ids`: string[] (optional) - Array of hotel IDs to filter hotels by.

Response:
- `status`: number - HTTP status code.
- `data`:
  - `hotels`: Hotel[] - Array of hotel objects.
  - `nextPage?`: number - Next page number if pagination is enabled.
```

### Hotel Object
```yaml
Hotel:
  id: string - Unique identifier for the hotel.
  destination_id: number - ID of the destination associated with the hotel.
  name: string - Name of the hotel.
  location: Location - Location details of the hotel.
  description: string - Description of the hotel.
  amenities: { [type: string]: string[] } - Amenities offered by the hotel.
  images?: { [type: string]: Image[] } - Images of the hotel.
  booking_conditions?: string[] - Booking conditions for the hotel.
```

## Data Merge and Cleanup Rules

When merging duplicate hotel data, the following rules are applied:

- **ID:** Destination ID will always remain the same.
- **Name:** The longest name will be retained.
- **Description:** The longest description will be retained.
- **Location:** Latest latitude, longitude, address, city, and country will be retained.
- **Amenities:** All amenities from both objects will be merged.
- **Images:** All images from both objects will be merged.
- **Booking Conditions:** All booking conditions from both objects will be merged.

## Deployment

The solution is deployed on Vercel and can be accessed at [Ascenda Hotel Data Merge](https://ascenda-hotel-data-merge.vercel.app/).

## Optimization Considerations

- Caching mechanism for faster data retrieval.
- Paginated API response for efficient data transfer.
- Concurrent fetching of data from multiple suppliers.

## Bonus Features

- Demonstration of deployment using Vercel.
- Simple React web application for testing the API and showcasing API response time.

## Run Application Locally
To run the Ascenda Hotel Data Merge application locally, follow these steps:

### Prerequisites
- Node.js installed on your machine (version 14 or above recommended)
- npm (Node Package Manager) or yarn installed

### Steps

1. **Clone the Repository**: 
   Clone the repository from GitHub to your local machine using the following command:
   ```bash
   git clone https://github.com/itzpranz/ascenda-hotel-data-merge
   ```

2. **Navigate to the Project Directory**:
   Move into the cloned project directory:
   ```bash
   cd ascenda-hotel-data-merge
   ```

3. **Install Dependencies**:
   Install the project dependencies using npm or yarn:
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Run the Application**:
    - Dev Mode:
    Start the development server to run the application:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    - Prod Mode:
    Build the server and run Production Server to run the application
    ```bash
    npm run build
    # or
    yarn build

    npm run start
    # or
    yarn start
    ```

5. **Access the Application**:
   Once the development server is up and running, you can access the application in your web browser at `http://localhost:3000`.

### Additional Information

- The application uses Next.js framework. The `npm run dev` command starts a development server with hot reloading enabled.
- Any changes you make to the source code will automatically reflect in the browser without the need to restart the server.
- You can explore and test the features of the application locally before deployment.

That's it! You now have the Ascenda Hotel Data Merge application running locally on your machine.

Feel free to explore the solution and provide feedback!
