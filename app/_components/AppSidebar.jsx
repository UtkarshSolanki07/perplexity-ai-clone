"use client"
import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import Image from 'next/image'
import { Compass, GalleryHorizontalEnd, LogIn, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SignOutButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'

const AppSidebar = () => {
    const path = usePathname();
    const { user } = useUser();

    const baseMenuOptions = [
        {
            title: 'Home',
            icon: Search,
            path: '/'
        },
        {
            title: 'Discover',
            icon: Compass,
            path: '/discover'
        },
        {
            title: 'Library',
            icon: GalleryHorizontalEnd,
            path: '/library'
        }
    ];

    // Add Sign In button only if user is not logged in
    const MenuOptions = user 
        ? baseMenuOptions 
        : [
            ...baseMenuOptions,
            {
                title: 'Sign In',
                icon: LogIn,
                path: '/sign-in'
            }
        ];

  return (
    <div>
      <Sidebar className='bg-accent'>
        <SidebarHeader className='bg-accent flex items-center py-5 justify-center'>
          <Image src={'/logo.png'} width={190} height={160} alt={'logo'} />
        </SidebarHeader>
        <SidebarContent className='bg-accent'>
          <SidebarGroup>
            <SidebarContent>
              <SidebarMenu>
                {MenuOptions.map((menu, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton 
                      asChild 
                      className={`p-5 py-5 hover:bg-transparent hover:font-bold ${path === menu.path ? 'font-bold' : ''}`}
                    >
                      <a href={menu.path} className="">
                        <menu.icon className="h-9 w-9" />
                        <span className="text-lg">{menu.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              {!user ? ( 
                <SignUpButton mode="modal">
                  <Button className="rounded-full mx-4 mt-4">Sign Up</Button>
                </SignUpButton>
              ) : (
                <SignOutButton>
                  <Button className="rounded-full mx-4 mt-4">Log Out</Button>
                </SignOutButton>
              )}
            </SidebarContent>
          </SidebarGroup>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter className="bg-accent mt-auto">
          <div className="p-5 flex flex-col">
            <h2 className="text-lg font-semibold">Premium Plan</h2>
            <p className="text-sm text-gray-600 mt-1 mb-3">Upgrade for AI copilot, unlimited uploads & advanced features</p>
            <Button variant={'secondary'} className="text-gray-500 hover:text-gray-700">
              Learn More
            </Button>
            <div className="mt-3">
              <UserButton />
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
export default AppSidebar