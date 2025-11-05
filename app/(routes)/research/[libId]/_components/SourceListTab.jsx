import React from "react";
import { ExternalLink } from "lucide-react";

function SourceListTab({ researches }) {
  return (
    <div className="mt-7">
      <h2 className="font-bold text-2xl mb-3">All Sources</h2>
      <div className="space-y-3">
        {researches?.searchResult?.map((source, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              {source.index}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800 mb-1">
                {source.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                {source.snippet}
              </p>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
              >
                Visit Source <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            {source.thumbnail && (
              <img
                src={source.thumbnail}
                alt={source.title}
                className="w-16 h-16 object-cover rounded"
              />
            )}
          </div>
        ))}
      </div>
      {(!researches?.searchResult || researches.searchResult.length === 0) && (
        <p className="text-gray-500 text-center mt-8">
          No sources available for this research.
        </p>
      )}
    </div>
  );
}

export default SourceListTab;
