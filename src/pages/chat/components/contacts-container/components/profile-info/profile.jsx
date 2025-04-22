import { useAppStore } from "@/store";
import apiClient from "@/lib/api-client";
import { HOST, LOGOUT_ROUTE } from "@/lib/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { getColor } from "@/lib/utils";
import { useEffect, useState } from "react";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logout = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate("/auth");
        setUserInfo(undefined);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full py-3 px-4 flex items-center justify-between bg-gradient-to-tr from-[#1e1f25] to-[#292a31] shadow-inner">
      <div className="flex gap-3 items-center">
        <div className="relative">
          <Avatar className={`${isMobileView ? 'w-10 h-10' : 'w-12 h-12'} rounded-full shadow-md overflow-hidden flex items-center justify-center`}>
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className={`object-cover ${isMobileView ? 'w-10 h-10' : 'w-12 h-12'} bg-black rounded-full`}
              />
            ) : (
              <div
                className={`uppercase ${isMobileView ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-md'} font-semibold border ${getColor(
                  userInfo.color
                )} flex items-center justify-center rounded-full bg-gray-800 text-white`}
              >
                {userInfo.firstName
                  ? userInfo.firstName[0]
                  : userInfo.email[0]}
              </div>
            )}
          </Avatar>
        </div>
        <div className={`text-white font-medium ${isMobileView ? 'text-xs max-w-[120px]' : 'text-sm'} truncate`}>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : userInfo.email}
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <FiEdit2
                className="text-purple-400 hover:text-purple-500 cursor-pointer transition"
                size={isMobileView ? 18 : 20}
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-[#1e1e22] border border-gray-700 text-sm text-white px-3 py-2 rounded shadow-lg"
            >
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <IoPowerSharp
                className="text-red-500 hover:text-red-600 cursor-pointer transition"
                size={isMobileView ? 18 : 20}
                onClick={logout}
              />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-[#1e1e22] border border-gray-700 text-sm text-white px-3 py-2 rounded shadow-lg"
            >
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
