"use client";
import axios from 'axios';
import { Cpu, DollarSign, Globe, Palette, Star, Volleyball } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import NewsCard from './_components/NewsCard';

const options = [
  {
    title: 'Top',
    icon: Star
  },
  {
    title: 'Tech & Science',
    icon: Cpu
  },
  {
    title: 'Finance',
    icon: DollarSign
  },
  {
    title: 'Art & Culture',
    icon: Palette
  },
  {
    title: 'Sports',
    icon: Volleyball
  }
];

function Discover() {
  const [selectedOption, setSelectedOption] = useState('Top');
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    selectedOption && GetSearchResult();
  }, [selectedOption]);

  const GetSearchResult = async () => {
    const result = await axios.post('/api/google-search-api', {
      searchInput: selectedOption + ' Latest News',
      searchType: 'Search'
    });
    console.log(result.data);
    setLatestNews(result.data);
  };

  return (
    <div className='mt-20 px-10 md:px-20 lg:px-36 xl:px-56'>
      <h2 className='font-bold text-3xl flex gap-2 items-center'>
        <Globe /> <span>Discover</span>
      </h2>
      <div className='flex mt-5'>
        {options.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedOption(item.title)}
            className={`flex gap-1 px-3 hover:text-primary items-center rounded-full cursor-pointer ${selectedOption === item.title ? 'bg-accent text-primary' : ''}`}>
            <item.icon className='h-4 w-4' />
            <h2 className='text-sm'>{item.title}</h2>
          </div>
        ))}
      </div>
      <div className='grid grid-cols-2 gap-5'>
        {latestNews?.map((news, index) => (
          <NewsCard news={news} key={index} />
        ))}
      </div>
    </div>
  );
}

export default Discover;
