'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Atom, AudioLines, Cpu, Globe, Mic, Paperclip, SearchCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { AIModelsOption } from '@/services/Shared'
import { supabase } from '@/app/Supabase'
import { useUser } from '@clerk/nextjs'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
  
function ChatInputBox() {
    const [userSearchInput, setUserSearchInput] = useState('');
    const [searchType, setSearchType] = useState('search');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [isHovering, setIsHovering] = useState(false);
    const [pulseEffect, setPulseEffect] = useState(false);

    useEffect(() => {
        if (!userSearchInput) {
            const interval = setInterval(() => {
                setPulseEffect(true);
                setTimeout(() => setPulseEffect(false), 1000);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [userSearchInput]);

    const onSearchQuery = async () => {
        setLoading(true);
        const libId = uuidv4();
        const { data } = await supabase.from('Library').insert([
            {
                searchInput: userSearchInput,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                type: searchType,
                libId: libId,
            }
        ]).select();
        setLoading(false);

        router.push(`/search/${libId}`);
        console.log(data[0]);
    }

    return (
        <div className='flex flex-col h-screen w-full items-center justify-center relative'>
            
            <div 
                className={`transition-all duration-700 ease-in-out ${userSearchInput ? 'opacity-50 scale-90' : 'opacity-100 scale-100'}`}
                style={{transform: `translateY(${userSearchInput ? '-20px' : '0px'})`}}
            >
                <Image src={'/logo.png'} alt='logo' width={260} height={250} priority />
            </div>
            
            <div 
                className={`p-2 w-full max-w-2xl border rounded-2xl mt-10 transition-all duration-300 
                    ${isHovering ? 'shadow-lg' : 'shadow-md'} 
                    ${userSearchInput ? 'border-blue-400' : 'border-gray-200'}`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <div className='flex justify-between items-end'>
                    <Tabs defaultValue="Search" className="w-[400px]">
                        <TabsContent value="Search" className="transition-all duration-300 ease-in-out">
                            <input 
                                type="text" 
                                placeholder='Ask Anything'
                                onChange={(e) => setUserSearchInput(e.target.value)}
                                className='w-full p-4 outline-none transition-all duration-300'
                            />
                        </TabsContent>
                        <TabsContent value="Research">
                            <input 
                                type="text" 
                                placeholder='Research Anything'
                                onChange={(e) => setUserSearchInput(e.target.value)}
                                className='w-full p-4 outline-none transition-all duration-300'
                            />
                        </TabsContent>
                        <TabsList>
                            <TabsTrigger 
                                value="Search" 
                                className='text-primary text-pretty transition-transform duration-200 hover:scale-105' 
                                onClick={() => setSearchType('search')}
                            > 
                                <SearchCheck className="mr-1" /> Search
                            </TabsTrigger>
                            <TabsTrigger 
                                value="Research" 
                                className='text-primary text-pretty transition-transform duration-200 hover:scale-105' 
                                onClick={() => setSearchType('research')}
                            > 
                                <Atom className="mr-1" /> Research
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className='flex gap-4 items-center'>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant='ghost' className="transition-transform duration-200 hover:scale-110">
                                    <Cpu className='text-gray-500 h-5 w-5 transition-all duration-300 hover:text-blue-500' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="animate-in fade-in-50 zoom-in-95 duration-200">
                                {AIModelsOption.map((model, index) => (
                                    <DropdownMenuItem key={index} className="hover:bg-blue-50 transition-colors duration-200">
                                        <div className='mb-1'>
                                            <h2 className='text-xs'>{model.name}</h2>
                                            <p className='text-xs'>{model.desc}</p>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Globe className='text-gray-500 h-5 w-5 transition-all duration-300 hover:text-blue-500 hover:scale-110 cursor-pointer' />
                        <Paperclip className='text-gray-500 h-5 w-5 transition-all duration-300 hover:text-blue-500 hover:scale-110 cursor-pointer' />
                        <Mic className='text-gray-500 h-5 w-5 transition-all duration-300 hover:text-blue-500 hover:scale-110 cursor-pointer' />
                        
                        <Button 
                            onClick={() => {
                                userSearchInput ? onSearchQuery() : null;
                            }}
                            disabled={loading}
                            className={`transition-all duration-300 ease-in-out rounded-full 
                                ${pulseEffect && !userSearchInput ? 'animate-pulse' : ''} 
                                ${loading ? 'bg-blue-400' : ''}`}
                        >
                            {!userSearchInput ? 
                                <AudioLines className={`text-white h-5 w-5 transition-all duration-300 ${pulseEffect ? 'scale-110' : 'scale-100'}`} /> : 
                                <ArrowRight className={`text-white h-5 w-5 ${loading ? 'animate-spin' : 'animate-bounce'}`} />
                            }
                        </Button>
                    </div>
                </div>
            </div>
            
            <div className={`mt-6 text-gray-400 text-sm transition-opacity duration-500 ${userSearchInput ? 'opacity-0' : 'opacity-80'}`}>
                Start typing to search or research anything
            </div>
        </div>
    )
}

export default ChatInputBox