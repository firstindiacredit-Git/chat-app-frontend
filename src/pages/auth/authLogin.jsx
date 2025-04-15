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

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-3xl bg-gray-900 rounded-3xl shadow-2xl grid xl:grid-cols-2 overflow-hidden">
        
        {/* Left Panel with top, left, and bottom border */}
        <div className="p-6 xl:p-8 flex flex-col justify-center gap-8 border-t-4 border-l-4 border-b-4 border-purple-600">
          <div className="flex flex-col items-center gap-4">
            <img src={Logo} alt="Logo" className="w-[150px] object-contain" />
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <img src={Victory} alt="Victory" className="w-16 h-16" />
            <p className="text-center text-gray-300 max-w-sm text-sm">
              Fill in your credentials to get started with our chat app.
            </p>
          </div>
  
          {/* Login Form */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="flex justify-center w-full border-b border-gray-700">
              <TabsTrigger
                value="login"
                className="text-gray-300 w-full text-lg pb-2 data-[state=active]:text-purple-400 data-[state=active]:border-b-4 data-[state=active]:border-purple-400 data-[state=active]:font-semibold"
              >
                Login
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-6 flex flex-col gap-4">
              <Input
                placeholder="Email"
                type="email"
                className="p-4 rounded-xl border border-gray-600 bg-white text-black focus:ring-2 focus:ring-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="p-4 rounded-xl border border-gray-600 bg-white text-black focus:ring-2 focus:ring-purple-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                onClick={handleLogin}
                className="w-full p-4 rounded-xl bg-purple-600 hover:bg-purple-700 transition text-white text-base font-semibold"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
  
        {/* Right Panel */}
        <div className="hidden xl:flex items-center justify-center bg-gray-900 border-t-4 border-r-4 border-b-4 border-purple-600">
  <img src={Background} alt="Illustration" className="object-contain max-h-[650px]" />
</div>

      </div>
    </div>
  );
  
};

export default Auth;
