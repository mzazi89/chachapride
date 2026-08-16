export default function RideCard({ type, icon, price, time, isAffordable }) {
  return (
    <div className={`
      border-2 p-4 rounded-xl cursor-pointer transition-all
      ${isAffordable ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-black'}
    `}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <p className="font-bold">{type}</p>
            <p className="text-sm text-gray-600">{time} min away</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold">${price}</p>
          {isAffordable && (
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
              Best price
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
