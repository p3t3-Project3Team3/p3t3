// import { useLocation, useNavigate } from 'react-router-dom';
import React from "react";


export const CardFront: React.FC = () => {
  return (
    <div className="card-Fornt" id="card">
      <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-2">
              Term/Question (Front of card)
            </label>
            <textarea
              id="term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Enter the term, question, or prompt..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
    </div>
  );
};