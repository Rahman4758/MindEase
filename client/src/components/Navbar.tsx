// import { Link, useLocation } from "react-router-dom";
// import { Home, BookOpen, TrendingUp, Heart, LogOut , LogIn} from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {useNavigate} from 'react-router-dom';
// import {useEffect, useState} from 'react';


// const Navbar = () => {
//   const location = useLocation();
  
//   const navItems = [
//     { path: "/", icon: Home, label: "Journal" },
//     { path: "/history", icon: BookOpen, label: "History" },
//     { path: "/mood-graph", icon: TrendingUp, label: "Trends" },
//     { path: "/affirmations", icon: Heart, label: "Affirmations" },
//   ];

//   const AuthButton = () => {
//   const navigate = useNavigate();
//   // State to check if user is logged in based on presence of token
//    const [isLoggedIn, setIsLoggedIn] = useState(false);
//     useEffect(() => {
//        // Check if token exists in localStorage (or any other auth logic)
//        const token = localStorage.getItem('token');
//     setIsLoggedIn(!!token);
//   }, []); // Run once on mount

//   const handleLogout = () => {
//     // Remove token on logout
//     localStorage.removeItem('token');
//     setIsLoggedIn(false);  // update state
//     navigate('/login');    // Redirect to login page
//   };
// const handleLogin = () => {
//     navigate('/login'); // Navigate to login page
//   };
  
//   return (
//     <nav className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//               <Heart className="w-5 h-5 text-primary-foreground" />
//             </div>
//             <span className="text-xl font-semibold text-foreground">MindEase</span>
//           </div>

//           {/* Navigation Links */}
//           <div className="hidden md:flex items-center space-x-1">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = location.pathname === item.path;
              
//               return (
//                 <Link key={item.path} to={item.path}>
//                   <Button
//                     variant={isActive ? "secondary" : "ghost"}
//                     size="sm"
//                     className="flex items-center space-x-2 px-4 py-2"
//                   >
//                     <Icon className="w-4 h-4" />
//                     <span>{item.label}</span>
//                   </Button>
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Logout Button */}
//           <Button variant="outline" size="sm" className="flex items-center space-x-2"
//            onClick={isLoggedIn ? handleLogout : handleLogin}
//           >
//            {isLoggedIn ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            
//             <span className="hidden sm:inline">{isLoggedIn ? 'Logout' : 'Login'}</span>
//           </Button>
//         </div>

//         {/* Mobile Navigation */}
//         <div className="md:hidden flex justify-around py-2 border-t border-border/30">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = location.pathname === item.path;
            
//             return (
//               <Link key={item.path} to={item.path}>
//                 <Button
//                   variant={isActive ? "secondary" : "ghost"}
//                   size="sm"
//                   className="flex flex-col items-center space-y-1 p-2"
//                 >
//                   <Icon className="w-4 h-4" />
//                   <span className="text-xs">{item.label}</span>
//                 </Button>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, TrendingUp, Heart, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const AuthButton = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check token on mount and on localStorage changes
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Optional: listen to localStorage changes across tabs/windows
    const onStorageChange = () => {
      const updatedToken = localStorage.getItem("token");
      setIsLoggedIn(!!updatedToken);
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center space-x-2"
      onClick={isLoggedIn ? handleLogout : handleLogin}
    >
      {isLoggedIn ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
      <span className="hidden sm:inline">{isLoggedIn ? "Logout" : "Login"}</span>
    </Button>
  );
};

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Journal" },
    { path: "/history", icon: BookOpen, label: "History" },
    { path: "/mood-graph", icon: TrendingUp, label: "Trends" },
    { path: "/affirmations", icon: Heart, label: "Affirmations" },
  ];

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">MindEase</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2 px-4 py-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Auth Button */}
          <AuthButton />

        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-around py-2 border-t border-border/30">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="flex flex-col items-center space-y-1 p-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
