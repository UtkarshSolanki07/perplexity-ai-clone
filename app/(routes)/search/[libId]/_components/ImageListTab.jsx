import Image from 'next/image';
import React from 'react';

const ImageListTab = ({ chat }) => {
  return (
    <div className="flex gap-5 flex-wrap mt-6 justify-center">
      {chat?.searchResult?.length > 0 ? (
        chat.searchResult.map((item, index) => (
          <div
            key={index}
            className="relative group transition-transform duration-300 hover:scale-105 shadow-md hover:shadow-xl rounded-xl overflow-hidden bg-accent p-2"
          >
            <Image
              src={item?.thumbnail}
              alt={item?.title || 'Image'}
              width={200}
              height={200}
              className="bg-accent rounded-xl object-contain transition duration-300"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {item?.title || 'No Title'}
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground text-center w-full mt-4">No images to display.</p>
      )}
    </div>
  );
};

export default ImageListTab;
