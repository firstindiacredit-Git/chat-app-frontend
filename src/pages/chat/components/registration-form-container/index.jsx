import { useState, useEffect } from "react";
import { useAppStore } from "@/store";
import AdminUserForm from "@/pages/auth/AdminRegistration";
import { X } from "lucide-react";

const RegistrationFormContainer = () => {
  const { setShowRegistrationForm } = useAppStore();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const closeForm = () => {
    setShowRegistrationForm(false);
  };
  
  return (
    <div className="flex-1 bg-[#1c1d25] flex flex-col justify-center items-center relative">
      {/* Close Button */}
      <button
        onClick={closeForm}
        className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-gray-300 z-10"
      >
        &times;
      </button>
      
      {/* Registration Form */}
      <div className="w-full max-w-4xl px-4">
        <AdminUserForm />
      </div>
    </div>
  );
};

export default RegistrationFormContainer; 