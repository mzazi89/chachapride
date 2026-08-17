'use client';
import { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import { useRide } from '../context/RideContext';
import { reverseGeocode } from '../../lib/geocode';

const LS_KEY = 'chacha-location';

export default function LocationBanner() {
  const { userLocation, setUserLocation, pickup, setPickup } = useRide();
  const [visible, setVisible] = useState(false);
  const [denied, setDenied] = useState(false);
  const watchId = useRef(null);

  // Auto-select the pickup point from the first location fix (only if empty)
  const applyPosition = (pos) => {
    const coords = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
    };
    setUserLocation(coords);
    if (!pickup) {
      reverseGeocode(coords.lat, coords.lng)
        .catch(() => `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`)
        .then((label) => setPickup(label, { lat: coords.lat, lng: coords.lng }));
    }
  };

  const startTracking = () => {
    if (watchId.current != null) return;
    watchId.current = navigator.geolocation.watchPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setDenied(true);
        }
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
  };

  const enableLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyPosition(pos);
        localStorage.setItem(LS_KEY, 'granted');
        startTracking();
        setVisible(false);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setDenied(true);
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const dismiss = () => {
    localStorage.setItem(LS_KEY, 'dismissed');
    setVisible(false);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(LS_KEY) === 'granted') {
      startTracking();
      return;
    }
    if (localStorage.getItem(LS_KEY) === 'dismissed') return;
    if (!('geolocation' in navigator)) return;

    navigator.permissions?.query({ name: 'geolocation' }).then((s) => {
      if (s.state === 'granted') {
        localStorage.setItem(LS_KEY, 'granted');
        startTracking();
        // already approved before: still grab the exact position and set pickup
        navigator.geolocation.getCurrentPosition(
          (pos) => applyPosition(pos),
          () => {},
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else if (s.state === 'prompt') {
        setVisible(true);
      } else {
        setDenied(true);
        setVisible(true);
      }
    }).catch(() => setVisible(true));
  }, []);

  useEffect(() => () => {
    if (watchId.current != null) navigator.geolocation.clearWatch(watchId.current);
  }, []);

  if (!visible) return null;

  return (
    <div className="mb-6 rounded-2xl border border-violet-200 bg-violet-50 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-3 flex-1">
        <FaMapMarkerAlt className="text-violet-600 text-xl shrink-0" />
        <div>
          <p className="font-semibold text-gray-800 text-sm sm:text-base">
            {denied ? 'Location is turned off' : 'Enable location for faster pickups'}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            {denied
              ? 'Allow location access in your browser settings so drivers can find you, then reload this page.'
              : userLocation
                ? 'Location enabled — drivers can see your position.'
                : 'We use your location to set your pickup point and track your driver in real time.'}
          </p>
        </div>
      </div>
      {!userLocation && (
        <button
          onClick={enableLocation}
          className="shrink-0 px-4 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition"
        >
          Turn on location
        </button>
      )}
      <button
        onClick={dismiss}
        className="shrink-0 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-violet-100 transition"
        aria-label="Dismiss"
      >
        <FaTimes />
      </button>
    </div>
  );
}
