"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { AppSidebarHeader, TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import useProfile from "@/hooks/useProfile";

const data = {
  intro: {
    title: "Admin Panel",
    logo: GalleryVerticalEnd,
  },
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme   Inc.",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    // {
    //   title: "Parent Menu",
    //   url: "#",
    //   icon: Frame,
    //   isActive: true,
    //   items: [
    //     {
    //       title: "Menu Item One",
    //       url: "#",
    //     },
    //     {
    //       title: "Menu Item Two",
    //       url: "#",
    //     },
    //     {
    //       title: "Menu Item Three",
    //       url: "#",
    //     },
    //     {
    //       title: "Menu Item Four",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Categories",
      url: "/categories",
      icon: BookOpen,
    },
    {
      title: "Products",
      url: "/products",
      icon: PieChart,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: Map,
    },
    {
      title: "Restock Queue",
      url: "/restock-queue",
      icon: SquareTerminal,
    },
    {
      title: "Activity Logs",
      url: "/activity-logs",
      icon: Bot,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const navigate = useNavigate();
  const { userProfile } = useProfile();

  return (
    <Sidebar className={"border-none "} collapsible="icon" {...props}>
      <SidebarHeader
        onClick={() => navigate("/")}
        className={"bg-(--color-erp-primary)  text-white "}
      >
        <AppSidebarHeader intro={data.intro} />
      </SidebarHeader>
      <SidebarContent className={"border-r "}>
        <NavMain groupLabel="" items={data.navMain} />
        {/* <NavMain groupLabel="Group Two" items={data.navMain} />
        <NavMain groupLabel="Group Three" items={data.navMain} /> */}
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter className={"border-r "}>
        {userProfile && <NavUser user={userProfile} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
