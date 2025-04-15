import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import Logo from "../../assets/image.png";
import Background from "../../assets/side1.jpg";
import Victory from "../../assets/victory.svg";

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

 {/* const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const token = Cookies.get("adminToken");

      await axios.post("http://localhost:8000/api/auth/admin/register", formData, {
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
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }; */}
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = Cookies.get("adminToken");
  
      await axios.post("http://localhost:8000/api/auth/admin/register", formData, {
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
  
      // 👇 Replace this logic based on your app structure
      const currentUserRole = Cookies.get("role"); // or get it from context, redux, etc.
  
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900">
    <div className="w-full max-w-3xl bg-gray-900 rounded-3xl shadow-2xl grid xl:grid-cols-2 overflow-hidden">
  
      {/* Left Panel with border like login page */}
      <div className="p-6 xl:p-8 flex flex-col justify-center gap-8 border-t-4 border-l-4 border-b-4 border-purple-600">
        <div className="flex flex-col items-center gap-4">
          <img src={Logo} alt="Logo" className="w-[150px] object-contain" />
          <h1 className="text-3xl font-bold text-white">Register User</h1>
          <img src={Victory} alt="Victory" className="w-16 h-16" />
          <p className="text-center text-gray-300 max-w-sm text-sm">
            Fill out the form to register a new user in the system.
          </p>
        </div>
  
        {/* Registration Form */}
        <Tabs defaultValue="register" className="w-full">
          <TabsContent value="register" className="mt-6 flex flex-col gap-4">
            <Input
              placeholder="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="bg-white text-black p-4 rounded-xl border border-gray-600 focus:ring-2 focus:ring-purple-500"
            />
            <Input
              placeholder="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="bg-white text-black p-4 rounded-xl border border-gray-600 focus:ring-2 focus:ring-purple-500"
            />
            <Input
              placeholder="First Name"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="bg-white text-black p-4 rounded-xl border border-gray-600 focus:ring-2 focus:ring-purple-500"
            />
            <Input
              placeholder="Last Name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="bg-white text-black p-4 rounded-xl border border-gray-600 focus:ring-2 focus:ring-purple-500"
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="p-4 rounded-xl border border-gray-600 bg-white text-black focus:ring-2 focus:ring-purple-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full p-4 rounded-xl bg-purple-600 hover:bg-purple-700 transition text-white text-base font-semibold"
            >
              {loading ? "Registering..." : "Register User"}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
  
      {/* Right Panel with border like login page */}
      <div className="hidden xl:flex items-center justify-center bg-gray-900 border-t-4 border-r-4 border-b-4 border-purple-600">
        <img src={Background} alt="Illustration" className="object-contain max-h-[650px]" />
      </div>
    </div>
  </div>
  
  );
};

export default AdminUserForm;
