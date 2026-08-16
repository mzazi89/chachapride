'use client';
import { FaArrowRight } from 'react-icons/fa';

export default function RequestButton({ onClick, isLoading = false }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="uber-button flex items-center justify-center gap-2 group"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>Finding rides...</span>
        </>
      ) : (
        <>
          <span>Request Ride</span>
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
}
