import React from "react";

const NewsCard = ({ news }) => {
  // Handle different possible image sources from Google Search API
  const getImageUrl = () => {
    if (news?.pagemap?.cse_thumbnail?.[0]?.src) {
      return news.pagemap.cse_thumbnail[0].src;
    }
    if (news?.pagemap?.cse_image?.[0]?.src) {
      return news.pagemap.cse_image[0].src;
    }
    if (news?.pagemap?.metatags?.[0]?.["og:image"]) {
      return news.pagemap.metatags[0]["og:image"];
    }
    if (news?.image?.thumbnailUrl) {
      return news.image.thumbnailUrl;
    }
    return null;
  };

  // Format date if available
  const formatDate = () => {
    if (news?.pagemap?.metatags?.[0]?.["article:published_time"]) {
      const date = new Date(news.pagemap.metatags[0]["article:published_time"]);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return "Recent";
  };

  const imageUrl = getImageUrl();
  const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

  return (
    <div
      className="group relative bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-1"
      onClick={() => window.open(news?.link || news?.formattedUrl, "_blank")}
    >
      {/* Image Section with Enhanced Overlay */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
        <img
          src={imageUrl || fallbackImage}
          alt={news?.title || "News article"}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Floating Badge */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
            <span className="text-xs font-semibold text-blue-600">View Article</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Source Badge */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {news?.displayLink || "News Source"}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
          {news?.title || "Untitled Article"}
        </h2>

        {/* Snippet */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {news?.snippet || "No description available for this article."}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatDate()}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all duration-300">
            <span>Read more</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-3xl border-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default NewsCard;