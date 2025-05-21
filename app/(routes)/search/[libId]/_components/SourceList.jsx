
import React from 'react';


function SourceList({ searchResult, loadingSearch }) {
 

  return (
    
    <div className="flex flex-wrap gap-3">
       {!searchResult && <div>
        <div className='w-full h-5 mt-2 bg-accent animate-pulse rounded-md'></div>
        <div className='w-1/2 h-5 mt-2 bg-accent animate-pulse rounded-md'></div>
        <div className='w-[70%] h-5 mt-2 bg-accent animate-pulse rounded-md'></div>

        </div>}
      {searchResult.map((item, index) => {
        let displayLink = '';
        try {
          displayLink = item.url ? new URL(item.url).hostname : '';
        } catch {
          displayLink = '';
        }
        const snippet = item.snippet || '';
        const thumbnail = item.thumbnail || '';
      

        return (
          
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-wrap items-start gap-2 bg-accent rounded-lg w-[200px] px-4 py-3 hover:bg-[#e1e3da] transition shadow-sm cursor-pointer"
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="Thumbnail"
                className="w-9 h-9 object-contain mt-0.5"
              />
            ) : (
              <div className="w-9 h-9 bg-gray-300 rounded-sm mt-0.5" />
            )}

            <div className="text-xs text-gray-800 font-medium w-full">{displayLink}</div>
            <div className="text-xs text-gray-700 leading-snug w-full line-clamp-3">
              {snippet}
            </div>
          </a>
        );
      })}
      {loadingSearch&&<div className='flex flex-wrap gap-2'>
        {[1,2,3,4].map((item,index)=>(
          <div className='w-[200px] h-[100px] rounded-2xl bg-accent animate-pulse' key={index}>
          </div>
        ))}
        </div>}
       
    </div>
  );
}

export default SourceList;
