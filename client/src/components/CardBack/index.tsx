// import React from "react";
// import "../assets/css/card.css";

export const CardBack: React.FC = () => {
  return (
    <div className="card-back" id="card">
       
            <label htmlFor="definition" className="block text-sm font-medium text-gray-700 mb-2">
              Definition/Answer (Back of card)
            </label>
            <textarea
              id="definition"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Enter the definition, answer, or explanation..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          
    </div>
  );
};