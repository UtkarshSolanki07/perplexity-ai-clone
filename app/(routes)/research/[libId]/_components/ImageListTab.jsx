import React from "react";

// The research object in this route stores results under `researchResult` (not `searchResult`).
// This component reads from either key and renders only valid image URLs.
function ImageListTab({ research }) {
  const items = research?.researchResult || research?.searchResult || [];
  const images = items.filter(
    (s) => typeof s?.thumbnail === "string" && s.thumbnail.trim().length > 0
  );

  return (
    <div className="mt-7">
      <h2 className="font-bold text-2xl mb-3">Images</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((source, index) => (
          <a
            key={index}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block"
          >
            <img
              src={source.thumbnail}
              alt={source.title || "Image result"}
              className="w-full h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
              onError={(e) => {
                const el = e.currentTarget;
                // hide card if image fails to load
                const parent = el.closest("a");
                if (parent) parent.style.display = "none";
              }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                View Source
              </span>
            </div>
          </a>
        ))}
      </div>
      {images.length === 0 && (
        <p className="text-gray-500 text-center mt-8">
          No images available for this research.
        </p>
      )}
    </div>
  );
}

export default ImageListTab;
