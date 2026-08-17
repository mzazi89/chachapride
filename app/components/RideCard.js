'use client';
import { FaClock, FaUsers, FaCheck } from 'react-icons/fa';
import { fmtKsh } from '../../lib/format';

export default function RideCard({ ride, selected, onSelect }) {
  const { type, icon, price, time, capacity, affordable, description } = ride;

  return (
    <div
      onClick={onSelect}
      className={`
        relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
        ${selected 
          ? 'border-black bg-gray-50 shadow-lg' 
          : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-3xl">{icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-lg">{type}</p>
              {affordable && (
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-medium">
                  Best price
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{description}</p>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FaClock className="text-xs" />
                {time} min
              </span>
              <span className="flex items-center gap-1">
                <FaUsers className="text-xs" />
                {capacity} seats
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="font-bold text-lg">{fmtKsh(price)}</p>
          <p className="text-xs text-gray-400">est. price</p>
          {selected && (
            <div className="mt-2 flex justify-end">
              <FaCheck className="text-green-500 text-sm" />
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="absolute -top-1 -right-1">
          <div className="bg-green-500 rounded-full p-1">
            <FaCheck className="text-white text-xs" />
          </div>
        </div>
      )}
    </div>
  );
}
