'use client'
import { supabase } from '@/app/Supabase';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Header from './_components/Header';
import DisplayResult from './_components/DisplayResult';

const SearchQueryResult = () => {
    const {libId}=useParams();
    const [searchInputRecord,setSearchInputRecord]=useState();

    useEffect(()=>{
        GetSearchQueryRecord();
    },[])

    const GetSearchQueryRecord=async()=>{
        let{data:Library, error}= await supabase
        .from('Library')
        .select('*,Chats(*)')
        .eq('libId',libId);

        console.log(Library[0]);
        setSearchInputRecord(Library[0]);
    }
  return (
    <div>
      <Header searchInputRecord={searchInputRecord}/>
      <div className='px-10 md:px-20 lg:px-36 xl:px-56 mt-20'>
        <DisplayResult searchInputRecord={searchInputRecord}/>
      </div>
    </div>
  )
}

export default SearchQueryResult
