import { Hotel } from "@/lib/model/hotel";

export default function HotelDetail({ hotelDetail }: { hotelDetail?: Hotel }) {
    return (
        <div className={`min-h-screen bg-gray-100 dark:bg-stone-900 transition-all ${hotelDetail ? 'w-1/2 py-24' : 'w-0'}`}>
        { hotelDetail && (
          <>
          <section className="px-12 pb-6">
            <h4 className="text-sm"><span className="font-bold">ID: </span> {hotelDetail.id}</h4>
            <h4 className="text-sm"><span className="font-bold">Destinanation ID: </span> {hotelDetail.destination_id}</h4>
          </section>
          <section className="bg-stone-800 px-12 py-6">
            <h1 className="text-2xl font-bold mb-4">{hotelDetail.name}</h1>
            <p className="mt-4 text-sm">{hotelDetail.description}</p>
            <div>
                {hotelDetail.images && Object.keys(hotelDetail.images).map((type) => (
                    <div key={type} className="mt-4">
                        <h4 className="text-lg font-bold capitalize">{type}</h4>
                        <div className="grid grid-cols-4 gap-2">
                            {hotelDetail.images[type].map((image) => (
                            <img key={image.link} src={image.link} className="bg-stone-200 dark:bg-stone-700 h-32 object-cover" alt={image.description} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
          </section>
          {hotelDetail.location && (<section className="px-12 py-6">
            <h4 className="text-lg font-bold">Location</h4>
            <p>{hotelDetail.location.address}, {hotelDetail.location.city}, {hotelDetail.location.country}</p>
          </section>)}
          {hotelDetail.amenities && Object.keys(hotelDetail.amenities).length > 0 && (<section className="bg-stone-800 px-12 py-6">
            <h4 className="text-lg font-bold">Amenities</h4>
            <ul>
              {Object.keys(hotelDetail.amenities).map((type) => (
                <li key={type} className="capitalize mt-4">
                  <div className="font-bold">{type}</div>
                  <ul className="list-disc ml-4">
                    {hotelDetail.amenities[type].map((amenity: string) => (
                      <li key={amenity}>{amenity}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>)}
          {hotelDetail.booking_conditions && hotelDetail.booking_conditions.length > 0 && (<section className="px-12 py-6">
            <h4 className="text-lg font-bold">Booking Conditions</h4>
              <ul className="list-disc ml-4">
                {hotelDetail.booking_conditions.map((condition: string) => (
                  <li key={condition}>{condition}</li>
                ))}
              </ul>
          </section>)}
          </>
        )}
      </div>
    )
}