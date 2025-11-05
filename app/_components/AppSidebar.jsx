"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Compass, GalleryHorizontalEnd, LogIn, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const AppSidebar = () => {
  const path = usePathname();
  const { user } = useUser();

  const baseMenuOptions = [
    {
      title: "Home",
      icon: Search,
      path: "/",
    },
    {
      title: "Discover",
      icon: Compass,
      path: "/discover",
    },
    {
      title: "Library",
      icon: GalleryHorizontalEnd,
      path: "/library",
    },
  ];

  // Add Sign In button only if user is not logged in
  const MenuOptions = user
    ? baseMenuOptions
    : [
        ...baseMenuOptions,
        {
          title: "Sign In",
          icon: LogIn,
          path: "/sign-in",
        },
      ];

  return (
    <div>
      <Sidebar className="bg-slate-900 text-white border-r border-slate-700">
        <SidebarHeader className="bg-slate-800 border-b border-slate-700 flex items-center justify-center py-6">
          <Image
            src={"/logo.png"}
            width={140}
            height={120}
            alt={"logo"}
            className="filter brightness-0 invert"
          />
        </SidebarHeader>
        <SidebarContent className="bg-slate-900 px-3">
          <SidebarGroup>
            <SidebarMenu className="space-y-1 mt-6">
              {MenuOptions.map((menu, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    className={`flex items-center space-x-4 p-3 rounded-lg transition-colors duration-200 ${
                      path === menu.path
                        ? "bg-slate-700 text-white"
                        : "hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    <a
                      href={menu.path}
                      className="flex items-center space-x-4 w-full"
                    >
                      <menu.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{menu.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <div className="mt-8 px-1">
              {!user ? (
                <SignUpButton mode="modal">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors">
                    Sign Up
                  </Button>
                </SignUpButton>
              ) : (
                <SignOutButton>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-md transition-colors">
                    Log Out
                  </Button>
                </SignOutButton>
              )}
            </div>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-slate-800 border-t border-slate-700 mt-auto p-4">
          <div className="p-3">
            <h2 className="text-sm font-semibold text-slate-200 mb-2">
              Premium Plan
            </h2>
            <p className="text-xs text-slate-400 mb-3 leading-tight">
              Upgrade for AI copilot, unlimited uploads & advanced features
            </p>
            <Button
              variant={"outline"}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs py-1 rounded transition-colors"
            >
              Learn More
            </Button>
            <div className="mt-3 flex justify-center">
              <UserButton />
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
};
export default AppSidebar;
