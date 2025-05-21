import React from 'react';

const NewsCard = ({ news }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer mt-6" onClick={() => window.open(news?.formattedUrl, '_blank')}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={news?.pagemap?.cse_thumbnail?.[0]?.src || news?.pagemap?.cse_image?.[0]?.src} 
          alt={news.title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-5 space-y-3">
        <h2 className="font-bold text-xl text-gray-800 line-clamp-2 group-hover:text-blue-600">{news.title}</h2>
        <p className="text-gray-600 text-sm line-clamp-3">{news.snippet}</p>
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-gray-500">{news?.displayLink}</span>
          <span className="text-xs text-blue-600 font-medium">Read more →</span>
        </div>
      </div>
    </div>
  );
}

export default NewsCard;