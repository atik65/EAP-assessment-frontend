import { User, LogOut, KeyRound } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";

export const UserNav = ({ userProfile, onLogout }) => {
  // console.log("UserNav render - userProfile:", userProfile);

  const navigate = useNavigate();

  const getInitials = () => {
    if (!userProfile?.username) return "U";
    const firstInitial = userProfile.username.charAt(0).toUpperCase();
    return firstInitial;
  };

  const getUserName = () => {
    if (!userProfile?.username) return "User";
    return userProfile.username;
  };

  const getUserRole = () => {
    if (!userProfile?.role) return "";
    return userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <Avatar className="h-9 w-9 border-2 border-white/20">
            <AvatarImage src={userProfile?.avatar?.path} alt={getUserName()} />
            <AvatarFallback className="bg-white/20 text-sm font-semibold text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 px-2 py-2.5">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={userProfile?.avatar?.path}
                alt={getUserName()}
              />
              <AvatarFallback className="bg-[#0f6b47]/10 text-sm font-semibold text-[#0f6b47]">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              {/* <p className="text-sm font-medium"> username: {getUserName()}</p> */}
              <p className="text-xs text-muted-foreground">
                {userProfile?.email || ""}
              </p>
              {userProfile?.role && (
                <p className="text-xs text-muted-foreground chip font-medium ">
                  Role: {getUserRole()}
                </p>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          // onClick={() => navigate("/profile")}
          onClick={() => toast.info("My Profile feature is coming soon!")}
        >
          <User className="mr-2 h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          // onClick={() => navigate("/profile/change-password")}

          onClick={() => toast.info("Change Password feature is coming soon!")}
        >
          <KeyRound className="mr-2 h-4 w-4" />
          <span>Change Password</span>
        </DropdownMenuItem>
        {/* <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate("/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
