"use client";
import axios from 'axios';
import { Cpu, DollarSign, Globe, Loader2, Palette, Star, Volleyball } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import NewsCard from './_components/NewsCard';

const options = [
  {
    title: 'Top',
    icon: Star,
    searchQuery: 'breaking news OR headlines OR latest'
  },
  {
    title: 'Tech & Science',
    icon: Cpu,
    searchQuery: 'technology OR science OR innovation OR AI'
  },
  {
    title: 'Finance',
    icon: DollarSign,
    searchQuery: 'finance OR business OR economy OR stock market'
  },
  {
    title: 'Art & Culture',
    icon: Palette,
    searchQuery: 'art OR culture OR entertainment OR movies OR music'
  },
  {
    title: 'Sports',
    icon: Volleyball,
    searchQuery: 'sports OR football OR basketball OR cricket OR tennis'
  }
];

function Discover() {
  const [selectedOption, setSelectedOption] = useState('Top');
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedOption) {
      GetSearchResult();
    }
  }, [selectedOption]);

  const GetSearchResult = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const selectedCategory = options.find(opt => opt.title === selectedOption);
      const searchQuery = selectedCategory?.searchQuery || 'latest news';
      
      const result = await axios.post('/api/google-search-api', {
        searchInput: searchQuery,
        searchType: 'Search'
      });
      
      console.log('API Response:', result.data);
      
      if (result.data.error) {
        setError(result.data.error);
        setLatestNews([]);
      } else {
        setLatestNews(result.data || []);
        if (!result.data || result.data.length === 0) {
          setError('No recent news articles found. Try a different category.');
        }
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      if (err.response?.status === 401) {
        setError('Invalid API key. Please check your NewsAPI configuration.');
      } else if (err.response?.status === 426) {
        setError('API rate limit exceeded. Please try again later.');
      } else {
        setError('Failed to load news. Please try again.');
      }
      setLatestNews([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mt-20 px-10 md:px-20 lg:px-36 xl:px-56 pb-10'>
      <h2 className='font-bold text-3xl flex gap-2 items-center'>
        <Globe /> <span>Discover</span>
      </h2>
      
      {/* Category Tabs */}
      <div className='flex mt-5 gap-2 flex-wrap'>
        {options.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedOption(item.title)}
            className={`flex gap-1 px-4 py-2 hover:text-primary items-center rounded-full cursor-pointer transition-all duration-300 ${
              selectedOption === item.title 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <item.icon className='h-4 w-4' />
            <h2 className='text-sm font-medium'>{item.title}</h2>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className='flex justify-center items-center py-20'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mt-5'>
          <p className='text-red-600 text-center'>{error}</p>
        </div>
      )}

      {/* News Grid */}
      {!loading && !error && latestNews.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          {latestNews.map((news, index) => (
            <NewsCard news={news} key={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && latestNews.length === 0 && (
        <div className='text-center py-20'>
          <Globe className='h-16 w-16 mx-auto text-gray-300 mb-4' />
          <p className='text-gray-500 text-lg'>No articles found</p>
          <p className='text-gray-400 text-sm mt-2'>Try selecting a different category</p>
        </div>
      )}
    </div>
  );
}

export default Discover;