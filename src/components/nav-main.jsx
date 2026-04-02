import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar"


export function NavMain({ items, groupLabel = "" }) {

 const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar()
 

  const location = useLocation();
  const currentPath = location.pathname;




  return (
    <SidebarGroup >
      {groupLabel && (
        <SidebarGroupLabel className={"text-[#9CA3AF]"}>
          {groupLabel}
        </SidebarGroupLabel>
      )}
       <SidebarMenu >
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            {item?.items ? (
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={"text-[#9CA3AF] "}
                    tooltip={item.title}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          className={"text-[#9CA3AF]"}
                          asChild
                        >
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem>
                <SidebarMenuButton
                  variant="default"
                  className={`text-gray-900 hover:bg-[#8552FD] hover:text-white py-5  ${
                    currentPath === item.url ? "bg-[#8552FD] text-white" : ""
                  }`}
                  tooltip={item.title}
                    asChild
                    onClick={() => {
                      setOpenMobile(false);
                    }}
                >
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </Collapsible>
        ))}
      </SidebarMenu>
     
      </SidebarGroup>
  );
}
