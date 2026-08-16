'use client';
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

export default function LocationInput({ type, value, onChange, placeholder }) {
  const isPickup = type === 'pickup';

  return (
    <div className="relative">
      <div className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 rounded-xl p-4 transition-all duration-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-black">
        <FaMapMarkerAlt 
          className={`text-xl ${isPickup ? 'text-green-500' : 'text-red-500'}`} 
        />
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
        />
        
        {value && (
          <button
            onClick={() => onChange('')}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes />
          </button>
        )}
      </div>
      
      {/* Quick suggestions */}
      {value && value.length > 1 && (
        <div className="absolute w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10">
          <div className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3">
            <FaMapMarkerAlt className="text-gray-400" />
            <div>
              <p className="text-sm font-medium">Current Location</p>
              <p className="text-xs text-gray-400">Use your current location</p>
            </div>
          </div>
          <div className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3">
            <FaMapMarkerAlt className="text-gray-400" />
            <div>
              <p className="text-sm font-medium">Home</p>
              <p className="text-xs text-gray-400">123 Main St, City</p>
            </div>
          </div>
          <div className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-t">
            <FaMapMarkerAlt className="text-gray-400" />
            <div>
              <p className="text-sm font-medium">Work</p>
              <p className="text-xs text-gray-400">456 Office Blvd, City</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
