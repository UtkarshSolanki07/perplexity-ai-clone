import React, { useState } from "react";
import { ExternalLink } from "lucide-react";

function SourceList({ searchResult, loadingSearch }) {
  const [hoveredSource, setHoveredSource] = useState(null);

  return (
    <div className="mt-7">
      <h2 className="font-bold text-2xl mb-3">Sources</h2>
      {loadingSearch ? (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap">
          {searchResult?.map((source, index) => (
            <div key={index} className="relative">
              <button
                className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm hover:bg-blue-200 transition-colors"
                onMouseEnter={() => setHoveredSource(index)}
                onMouseLeave={() => setHoveredSource(null)}
              >
                {source.index}
              </button>

              {hoveredSource === index && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                  <div className="flex gap-3">
                    {source.thumbnail && (
                      <img
                        src={source.thumbnail}
                        alt={source.title}
                        className="w-16 h-16 object-cover rounded flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2">
                        {source.title}
                      </h4>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-3">
                        {source.snippet}
                      </p>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium inline-flex items-center gap-1"
                      >
                        Visit Source <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SourceList;
