import useProfile from "@/hooks/useProfile";

import Navbar from "./Navbar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { Separator } from "../ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

import logout from "@/lib/logout";
import FullScreenControl from "../common/FullScreenControl";
import { UserNav } from "./UserNav";

const AdminLayout = ({ children }) => {

  
  // const { userProfile, isLoadingProfile } = useProfile();
  // console.log("Profile from useProfile:", { userProfile, isLoadingProfile });

  // return (
  //   <div>
  //     <div className="sticky top-0 z-50">
  //       <Header userProfile={userProfile} />
  //       <Navbar />
  //     </div>
  //     <main className="px-4 py-8 lg:px-0">
  //       <div className="mx-auto w-full max-w-7xl">{children}</div>
  //     </main>
  //   </div>
  // );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 bg-background z-50 border-b-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 ">
          <LayoutHeader />
        </header>

        <main className="p-5">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;

const LayoutHeader = () => {
  const { userProfile, isLoadingProfile } = useProfile();
  // const userProfile = null; // Placeholder for user profile
  // const { isLoadingProfile } = false;

  const handleLogout = async () => {
    await logout();
  };

  const currentPath = window.location.pathname;

  return (
    <div className="flex items-center justify-between h-full gap-2 px-4 bg-(--color-erp-primary) text-white shadow-sm w-full">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 hover:bg-white/20 hover:text-white" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block ">
              <BreadcrumbLink className={"text-white"} href="/">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            {currentPath !== "/" && (
              <BreadcrumbSeparator className="hidden md:block text-white" />
            )}

            {currentPath !== "/" && (
              <BreadcrumbItem>
                <BreadcrumbLink
                  className={"text-white capitalize"}
                  href={currentPath}
                >
                  {currentPath
                    ?.split("/")
                    ?.filter(Boolean)
                    ?.slice(-1)[0]
                    ?.replace(/-/g, " ") || "Dashboard"}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* theme toggle or profile avatar will be placed */}
      <div className="flex h-full items-center gap-3">
        {/* <ThemeToggle /> */}

        {/* full screen control */}
        <FullScreenControl />

        {/* user nav */}
        <UserNav userProfile={userProfile} onLogout={handleLogout} />
      </div>
    </div>
  );
};
