'use client';
import { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaTimes, FaSpinner, FaCrosshairs } from 'react-icons/fa';
import { geocode, reverseGeocode } from '../../lib/geocode';

export default function LocationInput({ type, value, onChange, placeholder }) {
  const isPickup = type === 'pickup';
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const timer = useRef(null);
  const querySeq = useRef(0);

  const handleChange = (text) => {
    onChange(text, null);
    clearTimeout(timer.current);

    if (text.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSearching(true);
    const seq = ++querySeq.current;
    timer.current = setTimeout(async () => {
      try {
        const results = await geocode(text);
        if (seq !== querySeq.current) return;
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        if (seq === querySeq.current) setSearching(false);
      }
    }, 400);
  };

  const pickSuggestion = (s) => {
    onChange(s.label, { lat: s.lat, lng: s.lng });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const useCurrentLocation = async () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
      );
      const { latitude, longitude } = pos.coords;
      const label = await reverseGeocode(latitude, longitude);
      onChange(label, { lat: latitude, lng: longitude });
      setSuggestions([]);
      setShowSuggestions(false);
    } catch {
      // user denied or unavailable — fall back to manual entry
    } finally {
      setLocating(false);
    }
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="relative">
      <div className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 rounded-xl p-4 transition-all duration-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-black">
        <FaMapMarkerAlt
          className={`text-xl shrink-0 ${isPickup ? 'text-green-500' : 'text-red-500'}`}
        />

        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => value && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
        />

        {searching ? (
          <FaSpinner className="animate-spin text-gray-400 shrink-0" />
        ) : isPickup && !value ? (
          <button
            onClick={useCurrentLocation}
            title="Use my current location"
            className="text-gray-400 hover:text-gray-600 transition shrink-0"
          >
            <FaCrosshairs className={locating ? 'animate-spin' : ''} />
          </button>
        ) : value ? (
          <button
            onClick={() => handleChange('')}
            className="text-gray-400 hover:text-gray-600 transition shrink-0"
          >
            <FaTimes />
          </button>
        ) : null}
      </div>

      {showSuggestions && (
        <div className="absolute w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10 max-h-72 overflow-y-auto">
          {suggestions.map((s, i) => (
            <button
              key={`${s.lat}-${s.lng}-${i}`}
              onClick={() => pickSuggestion(s)}
              className="w-full text-left p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0"
            >
              <FaMapMarkerAlt className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-700 truncate">{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
