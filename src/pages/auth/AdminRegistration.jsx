// eslint-disable-next-line
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import the js-cookie library
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import default styles

const AdminUserForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "user", // default role is user
  });

  // Handle form change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // Get token from cookies
      console.log("Admin Token:", token);

      const response = await axios.post("https://chat.pizeonfly.com/api/auth/admin/register", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // Send cookies
      });

      // Show success toast notification
      toast.success("User registered successfully!", {
        position: "bottom-center", // Centered at the bottom
        style: {
          backgroundColor: "white",
          color: "black",
        },
        progressStyle: {
          backgroundColor: "black", // Black sliding progress bar
        },
      });

      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "user",
      }); // Reset form
    } catch (error) {
      console.error("Error Response:", error.response);

      // Show error toast notification
      toast.error(error.response?.data?.message || "Failed to register user", {
        position: "bottom-center", // Centered at the bottom
        style: {
          backgroundColor: "white",
          color: "black",
        },
        progressStyle: {
          backgroundColor: "black", // Black sliding progress bar
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900"> {/* Dark background */}
      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold text-center mb-5 text-white">Register New User</h2>

        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 shadow-md rounded"> {/* Dark form background */}
          <div className="mb-4">
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
          >
            Register User
          </button>
        </form>

        {/* Toast notification container */}
        <ToastContainer position="bottom-center" /> {/* Centered at the bottom */}
      </div>
    </div>
  );
};

export default AdminUserForm;
