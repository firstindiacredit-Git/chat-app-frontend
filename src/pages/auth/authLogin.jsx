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
      <div className="w-full max-w-6xl bg-gray-900 rounded-3xl shadow-2xl flex flex-col md:grid md:grid-cols-2 overflow-hidden border-4 border-purple-500 m-4">
      
        {/* Left Panel */}
        <div className="p-6 md:p-10 flex flex-col justify-center gap-8">

          <div className="flex flex-col items-center gap-4">
            <img src={Logo} alt="Logo" className="w-[120px] md:w-[150px] object-contain" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome Back</h1>
            <img src={Victory} alt="Victory" className="w-12 h-12 md:w-16 md:h-16" />
            <p className="text-center text-gray-300 max-w-sm text-sm md:text-base">
              Fill in your credentials to get started with our chat app.
            </p>
          </div>

          {/* Login Form */}
          <Tabs defaultValue="login" className="w-full">
             <TabsList className="flex justify-center w-full border-b border-gray-700">Login
             {/* <TabsTrigger
                value="login"
                className="text-gray-300 w-full text-lg pb-2 data-[state=active]:text-purple-600 data-[state=active]:border-b-4 data-[state=active]:border-purple-500 data-[state=active]:font-semibold"
              > *
                Login
              </TabsTrigger>*/}
            </TabsList>
            <TabsContent value="login" className="mt-6 flex flex-col gap-4">
              <Input
                placeholder="Email"
                type="email"
                className="p-4 rounded-xl border border-gray-600 bg-white text-black focus:ring-2 focus:ring-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <Input
                placeholder="Password"
                type="password"
                className="p-4 rounded-xl border border-gray-600 bg-white text-black focus:ring-2 focus:ring-purple-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <Button
                onClick={handleLogin}
                className="w-full p-4 rounded-xl bg-purple-500 hover:bg-purple-500 transition text-white text-base font-semibold"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel */}
        <div className="hidden md:flex items-center justify-center bg-gray-900">
          <img src={Background} alt="Illustration" className="object-contain max-h-[500px] md:max-h-[650px] w-full" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
