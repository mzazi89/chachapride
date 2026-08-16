import { FaCar, FaBicycle, FaBus, FaMapMarkerAlt } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header - Uber style */}
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Uber</h1>
          <nav className="space-x-6 text-gray-700">
            <a href="#" className="hover:text-gray-900">Ride</a>
            <a href="#" className="hover:text-gray-900">Drive</a>
            <a href="#" className="hover:text-gray-900">Business</a>
            <button className="bg-black text-white px-4 py-2 rounded-full">
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Main Booking Section */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl">
          <h2 className="text-3xl font-bold mb-6">Go anywhere</h2>
          
          {/* Ride Type Selector */}
          <div className="flex gap-4 mb-6 border-b pb-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full">
              <FaCar /> Ride
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <FaBicycle /> Delivery
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <FaBus /> Transit
            </button>
          </div>

          {/* Location Inputs */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-xl">
              <FaMapMarkerAlt className="text-green-500" />
              <input 
                type="text" 
                placeholder="Enter pickup location"
                className="bg-transparent w-full outline-none"
              />
            </div>
            
            <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-xl">
              <FaMapMarkerAlt className="text-red-500" />
              <input 
                type="text" 
                placeholder="Enter destination"
                className="bg-transparent w-full outline-none"
              />
            </div>
          </div>

          {/* Ride Options */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="border-2 border-black rounded-xl p-4 text-center cursor-pointer hover:shadow-lg transition">
              <div className="text-2xl">🚗</div>
              <p className="font-bold">UberX</p>
              <p className="text-sm text-gray-600">Affordable</p>
              <p className="text-sm font-bold">$8-12</p>
            </div>
            
            <div className="border rounded-xl p-4 text-center cursor-pointer hover:border-black transition">
              <div className="text-2xl">🚐</div>
              <p className="font-bold">UberXL</p>
              <p className="text-sm text-gray-600">6 seats</p>
              <p className="text-sm font-bold">$12-18</p>
            </div>
            
            <div className="border rounded-xl p-4 text-center cursor-pointer hover:border-black transition">
              <div className="text-2xl">🛻</div>
              <p className="font-bold">Uber Comfort</p>
              <p className="text-sm text-gray-600">Extra legroom</p>
              <p className="text-sm font-bold">$15-22</p>
            </div>
          </div>

          {/* Request Button */}
          <button className="w-full mt-6 bg-black text-white py-4 rounded-full text-lg font-bold hover:bg-gray-800 transition">
            Request Ride
          </button>
        </div>
      </main>
    </div>
  );
}
