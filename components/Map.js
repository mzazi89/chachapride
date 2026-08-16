'use client';
import { useEffect, useRef } from 'react';

export default function Map() {
  const mapContainer = useRef(null);

  useEffect(() => {
    // You can add Mapbox or Leaflet here
    // For now, just a placeholder
  }, []);

  return (
    <div ref={mapContainer} className="h-96 bg-gray-200 rounded-xl">
      <div className="flex items-center justify-center h-full text-gray-500">
        🗺️ Map will load here
      </div>
    </div>
  );
}
