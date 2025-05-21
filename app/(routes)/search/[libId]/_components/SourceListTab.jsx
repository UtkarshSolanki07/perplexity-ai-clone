import Image from 'next/image'
import React from 'react'

const SourceListTab = ( {chats} ) => {
  return (
    <div>
      {chats?.searchResult.map((item,index)=>(
        <div key={index}>
            <div className='flex gap-2 mt-4 items-center'>
                <h2>{index+1}</h2>
                <Image src={item?.thumbnail} alt={item.title} width={25} height={25} unoptimized={true}
                className='rounded-full w-[25px] h-[25px] border'/>
                
                <div>
                    <h2 className='text-xs'>{item.url}</h2>
                </div>
            </div>
            <h2 className='mt-1 line-clamp-1 font-bold text-lg text-gray-600'>{item.title}</h2>
            <h2 className='mt-1 text-xs text-gray-600'>{item.snippet}</h2>
        </div>
      ))}
    </div>
  )
}

export default SourceListTab
