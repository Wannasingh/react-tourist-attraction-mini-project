import React, { useState, useEffect } from "react";
import axios from "axios";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const TravelSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [trips, setTrips] = useState([]);
  const [showTooltip, setShowTooltip] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async (query = "") => {
    try {
      const response = await axios.get(
        `http://localhost:4001/trips?keywords=${query}`
      );
      setTrips(response.data.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    fetchTrips(query);
  };

  const handleTagClick = (tag) => {
    const updatedSearchTerm = searchTerm ? `${searchTerm} ${tag}` : tag;
    setSearchTerm(updatedSearchTerm);
    fetchTrips(updatedSearchTerm);
  };

  const handleCopyLink = (url, tripId) => {
    navigator.clipboard.writeText(url);
    setShowTooltip(tripId);
    setTimeout(() => setShowTooltip(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-5xl text-center text-sky-500 m-8">เที่ยวไหนดี</h1>
      <h2 className="text-lg">ค้นหาที่เที่ยว</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="หาที่เที่ยวแล้วไปกัน..."
        className="w-full p-3 border border-gray-300 rounded-md mb-8 text-lg text-center"
      />
      <div className="space-y-8">
        {trips.map((trip) => (
          <div
            key={trip.eid}
            className="flex flex-col md:flex-row gap-6 p-4 border rounded-lg"
          >
            <div className="md:w-1/3">
              <img
                src={trip.photos[0]}
                alt={trip.title}
                width={400}
                height={300}
                className="rounded-lg object-cover w-full h-[200px]"
              />
            </div>
            <div className="md:w-2/3">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <a
                    href={trip.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold mb-2 hover:text-blue-500"
                  >
                    {trip.title}
                  </a>
                  <br />
                  <span className="text-gray-600 mb-4">
                    {trip.description.length > 100
                      ? `${trip.description.slice(0, 100)}...`
                      : trip.description}
                  </span>
                  <p
                    onClick={() => window.open(trip.url, "_blank")}
                    className="text-sky-500 rounded-md hover:text-blue-500 underline cursor-pointer"
                  >
                    อ่านต่อ
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-gray-600">หมวด</span>
                    {trip.tags.map((tag, index) => (
                      <React.Fragment key={index}>
                        {index === trip.tags.length - 1 && (
                          <span className="text-gray-600">และ</span>
                        )}
                        <span
                          onClick={() => handleTagClick(tag)}
                          className="text-gray-600 hover:underline cursor-pointer underline"
                        >
                          {tag}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {trip.photos.slice(1).map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 2}`}
                        width={100}
                        height={100}
                        className="rounded object-cover w-20 h-20"
                      />
                    ))}
                  </div>
                </div>
                <div className="relative group">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyLink(trip.url, trip.eid)}
                    className="mt-48"
                  >
                    <Copy className="h-4 w-4 text-sky-500" />
                  </Button>
                  {showTooltip === trip.eid && (
                    <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-blue-400 rounded transition-opacity duration-300 opacity-100">
                      📋 Link copied!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelSearch;
