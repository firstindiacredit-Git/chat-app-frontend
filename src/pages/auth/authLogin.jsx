import Background from "../../assets/login2.png";
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
  const { setUserInfo } = useAppStore(); // Correct hook from Zustand or Redux
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Optional: to handle loading state

  // Validate the email and password fields
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

  // Handle login request
  const handleLogin = async () => {
    if (!validateLogin()) return;

    setLoading(true); // Start loading state

    try {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );
const token = response.data.token; // Adjust according to your response structure
      localStorage.setItem("token", token)
       console.log(" token stored:", token);
      if (response.data?.user?.id) {
        setUserInfo(response.data.user); // Correct user info update
        toast.success("Login successful!");

        if (response.data.user.profileSetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <img src={Logo} className="h-[100px]" style={{ width: '300px', height: 'auto' }} alt="Logo" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome</h1>
            <img src={Victory} className="h-[100px] mb-4" alt="Victory" />
            <p className="font-medium text-center">
              Fill all details to get started with our chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs defaultValue="login" className="w-3/4">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="login"
                >
                  Login
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="flex flex-col gap-5 mt-10">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="rounded-full p-6"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} className="h-[700px]" alt="Background" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
