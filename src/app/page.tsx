'use client';

import HotelDetail from "@/components/HotelDetail";
import { Hotel } from "@/lib/model/hotel";
import { useState } from "react";

export default function Home() {
  const [destinationId, setDestinationId] = useState('');
  const [hotelIds, setHotelIds] = useState('');
  const [message, setMessage] = useState('');
  const [hotelData, setHotelData] = useState<Hotel[]>([]);
  const [hotelDetail, setHotelDetail] = useState<Hotel>();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function searchByDestinationId(e: any) {
    e.preventDefault();
    await getHotelDetails('destination_id', destinationId);
    setDestinationId('');
  }

  async function searchByHotelIds(e: any) {
    e.preventDefault();
    await getHotelDetails('hotel_ids', hotelIds);
    setHotelIds('');
  }

  async function  getHotelDetails(key: string, value: string) {
    setLoading(true);
    setIsError(false);
    setMessage('');
    setHotelData([]);
    setHotelDetail(undefined);
    const startTime = performance.now();

    try {
      const response = await fetch(`/api/v1/hotels?${key}=${value}`);
      console.log(response);
      
      if (!response.ok) {
        const errorMessage = JSON.parse(await response.text());
        setMessage(`Failed to fetch hotels: ${response.statusText} : ${errorMessage.message}`);
        setIsError(true);
        return;
      }

      const data = await response.json();

      const endTime = performance.now();
      const timeTaken = endTime - startTime;
      setHotelData(data.hotels);
      setMessage(`API response in ${timeTaken.toFixed(2)} milliseconds`);
    } catch (error) {
      setMessage(`Error fetching data: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex">
      <div className="flex flex-auto min-h-screen flex-col items-center p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex">
          <div className="flex flex-col items-center justify-between">
            <h1 className="text-4xl font-bold text-center">
              Welcome to Ascenda Hotel Search
            </h1>
            <p className="text-center">
              The best place to find the best hotels in the world
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 mt-10">
          <form onSubmit={searchByDestinationId} className="rounded-sm border border-stroke bg-white drop-shadow dark:border-stone-950 dark:bg-stone-900 p-8">
              <div className="mb-8">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Destination ID
                  </label>
                  <input
                      type={"text"}
                      name="destination_id"
                      value={destinationId}
                      onChange={(e) => setDestinationId(e.target.value)}
                      placeholder="Enter Destination ID"
                      className="w-full rounded border-[2px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
              </div>
              <button disabled={loading} type="submit" className="flex w-full justify-center rounded bg-blue-500 p-3 font-medium text-gray hover:bg-opacity-90">Search By Destination ID</button>
          </form>
          <form  onSubmit={searchByHotelIds} className="rounded-sm border border-stroke bg-white drop-shadow dark:border-stone-950 dark:bg-stone-900 p-8">
              <div className="mb-8">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Hotel IDs (comma separated)
                  </label>
                  <input
                      type={"text"}
                      value={hotelIds}
                      name="hotel_ids"
                      onChange={(e) => setHotelIds(e.target.value)}
                      placeholder="Enter Hotel IDs"
                      className="w-full rounded border-[2px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
              </div>
              <button disabled={loading} type="submit" className="flex w-full justify-center rounded bg-blue-500 p-3 font-medium text-gray hover:bg-opacity-90">Search by Hotel IDs</button>
          </form>
          <div className={`col-span-2 text-center ${isError ? 'text-red-500' : ''}`}>{message}</div>
        </div>
        <div className="mt-10">
          {hotelData.map((hotel: Hotel) => (
            <div onClick={() => setHotelDetail(hotel)} key={hotel.id} className={`rounded-sm cursor-pointer border border-stroke bg-white drop-shadow dark:border-stone-950 dark:bg-stone-900 hover:bg-gray-200 dark:hover:bg-stone-800 p-8 mb-4 ${hotel.id == hotelDetail?.id ? 'bg-gray-400 dark:bg-stone-700' : ''}`}>
              <h3 className="text-xl font-bold">{hotel.name}</h3>
              <p>{hotel.location.address}, {hotel.location.city}, {hotel.location.country}</p>
            </div>
          ))}
          {loading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>
      <HotelDetail hotelDetail={hotelDetail} />
    </main>
  );
}
