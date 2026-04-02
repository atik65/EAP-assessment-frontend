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
    title: "Smart Inventory",
    logo: GalleryVerticalEnd,
  },

  navMain: [
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
    <Sidebar  className={"border-none "} collapsible="icon" {...props}>
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
