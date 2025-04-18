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
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-3xl shadow-2xl flex flex-col md:grid md:grid-cols-2 overflow-hidden border-4 border-purple-500">

        {/* Left Panel */}
        <div className="p-6 md:p-6 flex flex-col justify-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <img src={Logo} alt="Logo" className="w-[120px] object-contain" />
            <h1 className="text-2xl font-bold text-white">Register User</h1>
            <img src={Victory} alt="Victory" className="w-12 h-12" />
            <p className="text-center text-gray-300 max-w-sm text-xs">
              Fill out the form to register a new user in the system.
            </p>
          </div>

          {/* Registration Form */}
          <Tabs defaultValue="register" className="w-full">
            <TabsContent value="register" className="mt-4 flex flex-col gap-3">
              <Input
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-white text-black p-3 rounded-xl border border-gray-600 focus:ring-2 focus:ring-purple-500"
              />
              <Input
                placeholder="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="bg-white text-black p-3 rounded-xl border border-gray-600 focus:ring-2 focus:ring-purple-500"
              />
              <Input
                placeholder="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="bg-white text-black p-3 rounded-xl border border-gray-600 focus:ring-2 focus:ring-purple-500"
              />
              <Input
                placeholder="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="bg-white text-black p-3 rounded-xl border border-gray-600 focus:ring-2 focus:ring-purple-500"
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="p-3 rounded-xl border border-gray-600 bg-white text-black focus:ring-2 focus:ring-purple-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full p-3 rounded-xl bg-purple-500 hover:bg-purple-700 transition text-white text-base font-semibold"
              >
                {loading ? "Registering..." : "Register User"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel */}
        <div className="hidden md:flex items-center justify-center bg-gray-900">
          <img src={Background} alt="Illustration" className="object-contain max-h-[550px]" />
        </div>

      </div>
    </div>
  );
};

export default AdminUserForm;
