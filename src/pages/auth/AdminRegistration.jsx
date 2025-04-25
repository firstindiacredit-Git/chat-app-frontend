import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import Logo from "../../assets/image.png";
import Background from "../../assets/side1.jpg";
import Victory from "../../assets/victory.svg";
import { Mail, Lock, User, UserCog } from "lucide-react";

const AdminUserForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = Cookies.get("adminToken");

      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/admin/register`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      toast.success("User registered successfully!");

      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "user",
      });

      const currentUserRole = Cookies.get("role");

      if (currentUserRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/home");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1c1d25] p-4">
      <div className="w-full max-w-3xl bg-gray-900 rounded-3xl shadow-2xl flex flex-col md:grid md:grid-cols-2 overflow-hidden border-4 border-purple-600">

        {/* Left Panel */}
        <div className="p-5 md:p-6 flex flex-col justify-center gap-4 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>

          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center p-4 shadow-lg">
              <img src={Logo} alt="Logo" className="w-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-white mt-2">Register User</h1>
            <img src={Victory} alt="Victory" className="w-10 h-10" />
            <p className="text-center text-gray-300 max-w-sm text-sm">
              Fill out the form to register a new user in the system.
            </p>
          </div>

          {/* Registration Form */}
          <Tabs defaultValue="register" className="w-full relative z-10">
            <TabsContent value="register" className="mt-2 flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <Input
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="p-2 pl-12 rounded-xl border border-gray-600 bg-gray-800/50 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-10 shadow-md"
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <Input
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="p-2 pl-12 rounded-xl border border-gray-600 bg-gray-800/50 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-10 shadow-md"
                />
              </div>
              
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <Input
                  placeholder="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="p-2 pl-12 rounded-xl border border-gray-600 bg-gray-800/50 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-10 shadow-md"
                />
              </div>
              
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <Input
                  placeholder="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="p-2 pl-12 rounded-xl border border-gray-600 bg-gray-800/50 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-10 shadow-md"
                />
              </div>
              
              <div className="relative">
                <UserCog className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-2 pl-12 rounded-xl border border-gray-600 bg-gray-800/50 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-10 shadow-md"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full p-2 rounded-xl bg-purple-600 hover:bg-purple-700 transition text-white text-base font-semibold h-10 mt-1 shadow-lg"
              >
                {loading ? "Registering..." : "Register User"}
              </Button>
              
              <div className="h-1 w-1/3 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mt-1"></div>
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

export default AdminUserForm;
