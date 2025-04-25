import Background from "../../assets/side1.jpg";
import Victory from "../../assets/victory.svg";
import Logo from "../../assets/image.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api-client";
import { LOGIN_ROUTE } from "@/lib/constants";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateLogin = () => {
    if (!email.trim()) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.trim()) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;

    setLoading(true);
    try {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);
      console.log("token stored:", token);

      if (response.data?.user?.id) {
        setUserInfo(response.data.user);
        toast.success("Login successful!");
        navigate(response.data.user.profileSetup ? "/chat" : "/profile");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Login failed: ${error.response.data}`);
        console.error("Login error response:", error.response.data);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      <div className="w-full max-w-4xl bg-gray-900 rounded-3xl shadow-2xl flex flex-col md:grid md:grid-cols-2 overflow-hidden border-4 border-purple-600 m-4">
      
        {/* Left Panel */}
        <div className="p-5 md:p-8 flex flex-col justify-center gap-6 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>

          <div className="flex flex-col items-center gap-3 relative z-10">
            <div className="w-[100px] md:w-[120px] h-[100px] md:h-[120px] rounded-full bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center p-4 shadow-lg">
              <img src={Logo} alt="Logo" className="w-full object-contain" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">Welcome Back</h1>
            <img src={Victory} alt="Victory" className="w-10 h-10 md:w-12 md:h-12" />
            <p className="text-center text-gray-300 max-w-sm text-sm md:text-base">
              Fill in your credentials to get started with our chat app.
            </p>
          </div>

          {/* Login Form */}
          <Tabs defaultValue="login" className="w-full relative z-10">
             <TabsList className="flex justify-center w-full border-b border-gray-700 bg-transparent">
               <span className="text-white text-xl font-medium">Login</span>
             </TabsList>
            <TabsContent value="login" className="mt-6 flex flex-col gap-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input
                  placeholder="Email"
                  type="email"
                  className="p-3 pl-12 rounded-xl border border-gray-600 bg-gray-800/50 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-11 shadow-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  className="p-3 pl-12 pr-12 rounded-xl border border-gray-600 bg-gray-800/50 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-11 shadow-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? 
                    <EyeOff size={16} className="text-purple-300" /> : 
                    <Eye size={16} className="text-purple-300" />
                  }
                </button>
              </div>
              <Button
                onClick={handleLogin}
                className="w-full p-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition text-white text-base font-semibold h-11 mt-2 shadow-lg"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <div className="h-1 w-1/3 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mt-2"></div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel */}
        <div className="hidden md:block relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/70 via-purple-800/40 to-black/30 z-10"></div>
          <img src={Background} alt="Illustration" className="absolute inset-0 object-cover h-full w-full" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
