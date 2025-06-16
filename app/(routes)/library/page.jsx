'use client'
import { supabase } from '@/app/Supabase'
import { useUser } from '@clerk/nextjs'
import { SquareArrowOutUpRight, Trash2 } from 'lucide-react'
import moment from 'moment/moment'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const Library = () => {
    
    const {user}=useUser();

    const [libraryHistory,setLibraryHistory]=useState();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const router=useRouter();
    
    useEffect(()=>{
        user&&GetLibraryHistory();
    },[user])
    
    const GetLibraryHistory=async()=>{
        let {data:Library,error}=await supabase
        .from('Library')
        .select('*')
        .eq('userEmail',user?.primaryEmailAddress?.emailAddress)
        .order('id', { ascending: false });
        console.log("Library Data:",Library);
        setLibraryHistory(Library);
    }

    const handleDeleteClick = (e, item) => {
        e.stopPropagation(); // Prevent navigation when clicking delete
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    }

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
        
        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('Library')
                .delete()
                .eq('id', itemToDelete.id)
                .eq('userEmail', user?.primaryEmailAddress?.emailAddress);

            if (error) {
                throw error;
            }

            // Update local state to remove the deleted item
            setLibraryHistory(prev => prev?.filter(item => item.id !== itemToDelete.id));
            
            toast.success("Chat deleted successfully");
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error("Failed to delete chat. Please try again.");
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    }

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    }

    return (
        <div className='mt-20 px-10 md:px-20 lg:px-36 xl:px-56 '>
            <h2 className='font-bold text-2xl'>Library</h2>
            <div className='mt-7'>
                {libraryHistory?.length === 0 ? (
                    <div className='text-center py-10'>
                        <p className='text-gray-500'>No chat history found</p>
                    </div>
                ) : (
                    libraryHistory?.map((item,index)=>(
                        <div className='cursor-pointer group' key={index}>
                            <div className='flex justify-between items-center py-2'>
                                <div 
                                    className='flex-1 mr-4'
                                    onClick={()=>router.push(`/search/${item.libId}`)}
                                >
                                    <h2 className='font-bold'>{item.searchInput}</h2>
                                    <p className='text-xs text-gray-500'>{moment(item.created_at).fromNow()}</p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                        onClick={(e) => handleDeleteClick(e, item)}
                                    >
                                        <Trash2 className='h-4 w-4 text-red-500 hover:text-red-700' />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={()=>router.push(`/search/${item.libId}`)}
                                    >
                                        <SquareArrowOutUpRight className='h-4 w-4'/>
                                    </Button>
                                </div>
                            </div>
                            <hr className='my-4'/>
                        </div>
                    ))
                )}
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{itemToDelete?.searchInput}"? 
                            This action cannot be undone and will permanently remove this chat from your library.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel 
                            onClick={handleDeleteCancel}
                            disabled={isDeleting}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Library