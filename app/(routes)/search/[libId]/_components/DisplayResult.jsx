import React, { useEffect, useState } from 'react';
import { Loader2Icon, LucideImage, LucideList, LucideSparkles, Send } from 'lucide-react';
import AnswerDisplay from './AnswerDisplay';
import axios from 'axios';
import { supabase } from '@/app/Supabase';
import { useParams } from 'next/navigation';
import ImageListTab from './ImageListTab';
import SourceListTab from './SourceListTab';
import { Button } from '@/components/ui/button';

const DisplayResult = ({ searchInputRecord }) => {
    const tabs = [
        { label: 'Answer', icon: LucideSparkles },
        { label: 'Images', icon: LucideImage },
        { label: 'Sources', icon: LucideList, badge: 10 },
    ];

    const [activeTab, setActiveTab] = useState('Answer');
    const [searchResults, setSearchResults] = useState([searchInputRecord]);
    const { libId } = useParams();
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [userInput, setUserInput] = useState('');
    

    useEffect(() => {
            searchInputRecord?.Chats.length==0 ? getSearchApiResult() : GetSearchRecords();
            setSearchResults(searchInputRecord);
            console.log('Search Input Record:', searchInputRecord);
        
    }, [searchInputRecord]);

    const getSearchApiResult = async () => {
        if (!userInput && !searchInputRecord?.searchInput) return;
        
        setLoadingSearch(true);

        const result = await axios.post('/api/google-search-api', {
            searchInput: userInput || searchInputRecord.searchInput,
            searchType: searchInputRecord.type??'Search',
        });

        const formattedSearchResp = result.data.slice(0, 5).map((item, index) => ({
            title: item.title,
            url: item.link,
            snippet: item.snippet,
            index: index + 1,
            thumbnail:
                item?.pagemap?.cse_thumbnail?.[0]?.src ||
                item?.pagemap?.cse_image?.[0]?.src ||
                '',
        }));

        setSearchResults(formattedSearchResp);
        console.log('Formatted Search Results:', formattedSearchResp);

        const { data } = await supabase
            .from('Chats')
            .insert([
                {
                    libId: libId,
                    searchResult: formattedSearchResp,
                    userSearchInput: userInput || searchInputRecord?.searchInput,
                },
            ])
            .select();

        console.log("Inserted record ID:", data[0].id);
        await GetSearchRecords();
        setLoadingSearch(false);
        await GenerateAIResp(formattedSearchResp, data[0].id);
        setUserInput(''); // Clear input after search
    };

    const GenerateAIResp = async (formattedSearchResp, recordId) => {
        const result = await axios.post('/api/llm-model', {
            searchInput: userInput || searchInputRecord?.searchInput,
            searchResult: formattedSearchResp,
            recordId: recordId,
        });

        const runId = result.data;
        console.log("Run ID:", runId);

        const interval = setInterval(async () => {
            const runResp = await axios.post('/api/get-inngest-status', {
                runId: runId,
            });

            if (runResp?.data?.data?.[0]?.status === 'Completed') {
                console.log('COMPLETED');
                await GetSearchRecords();
                clearInterval(interval);
            }
        }, 1000);
    };

    const GetSearchRecords=async()=>{
        let{data:Library, error}= await supabase
                .from('Library')
                .select('*,Chats(*)')
                .eq('libId',libId)
                .order('id', {foreignTable:'Chats', ascending: true })
                ;
                
        setSearchResults(Library[0]);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && userInput.trim()) {
            getSearchApiResult();
        }
    };

    return (
        <div className='mt-7'>
            {searchResults?.Chats?.map((chat, index) => (
              <div key={index} className='mt-7'>
                
                <h2 className='font-bold text-4xl text-gray-600 '>{chat?.userSearchInput}</h2>
                <div className="flex items-center space-x-6 border-b border-gray-200 pb-2 mt-6">
            
                {tabs.map(({ label, icon: Icon, badge }) => (
                    <button
                        key={label}
                        onClick={() => setActiveTab(label)}
                        className={`flex items-center gap-1 relative text-sm font-medium text-gray-700 hover:text-black ${activeTab === label ? 'text-black' : ''}`}
                    >
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                        {badge && (
                            <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                {badge}
                            </span>
                        )}
                        {activeTab === label && (
                            <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-black rounded"></span>
                        )}
                    </button>
                ))}
                <div className="ml-auto text-sm text-gray-500">
                    1 task <span className="ml-1">↗</span>
                </div>
            </div>

            <div>
                {activeTab =='Answer'?
                <AnswerDisplay chat={chat} loadingSearch={loadingSearch} />:
                activeTab=='Images'?<ImageListTab chat={chat}/> 
                : activeTab=='Sources'?
                <SourceListTab chats={chat}/>:null
                }
            </div>
                <hr className='my-5' />
              </div>  
            ))}
            <div className='bg-white w-full border rounded-lg shadow-md p-3 px-5 flex justify-between fixed bottom-6 max-w-md lg:max-w-xl xl:max-w-3xl'>
                <input 
                    placeholder='Type Anything...' 
                    className='outline-none w-full mr-2' 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <Button 
                    onClick={getSearchApiResult} 
                    disabled={loadingSearch || !userInput.trim()}
                    className={!userInput.trim() ? 'opacity-50 cursor-not-allowed' : ''}
                >
                    {loadingSearch ? <Loader2Icon className='animate-spin'/> : <Send/>}
                </Button>
            </div>
        </div>
    );
};

export default DisplayResult;