import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import { Bell, Home, LogOut, User, Users, Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null;
        }
        throw err;
      }
    },
  });

  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => axiosInstance.get("/notifications"),
    enabled: !!authUser,
  });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => axiosInstance.get("/connections/requests"),
    enabled: !!authUser,
  });

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const unreadNotificationCount = notifications?.data?.filter(n => !n.read).length || 0;
  const unreadConnectionRequestsCount = connectionRequests?.data?.length || 0;

  return (
    <nav className="bg-base-100 shadow-md sticky top-0 z-20 border-b border-secondary">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="/small-logo.png"
            alt="CoffeeConnect Logo"
            className="h-12 w-12 rounded-full shadow-md"
          />
          <span className="text-3xl font-serif text-primary select-none">CoffeeConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10 text-neutral font-semibold tracking-wide">
          <Link to="/" className="flex items-center gap-2 hover:text-accent transition duration-300">
            <Home size={24} className="stroke-primary" />
            Home
          </Link>
          <Link to="/network" className="relative flex items-center gap-2 hover:text-accent transition duration-300">
            <Users size={24} className="stroke-primary" />
            Network
            {unreadConnectionRequestsCount > 0 && (
              <span className="absolute -top-2 -right-5 bg-accent text-base-100 text-xs font-bold rounded-full px-2 py-0.5 animate-pulse shadow-md">
                {unreadConnectionRequestsCount}
              </span>
            )}
          </Link>
          <Link to="/notifications" className="relative flex items-center gap-2 hover:text-accent transition duration-300">
            <Bell size={24} className="stroke-primary" />
            Notifications
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-2 -right-5 bg-accent text-base-100 text-xs font-bold rounded-full px-2 py-0.5 animate-pulse shadow-md">
                {unreadNotificationCount}
              </span>
            )}
          </Link>
                              <Link to="/jobs" className="relative flex items-center gap-2 hover:text-accent transition duration-300">
            <ShoppingBag  className="stroke-primary" size={24}  />  Jobs
          </Link>
        </div>



        {/* User Actions Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {authUser ? (
            <>
              <Link
                to={`/profile/${authUser.username}`}
                className="flex items-center space-x-3 text-neutral hover:text-accent transition duration-300"
              >
                <User size={28} className="stroke-primary" />
                <span className="hidden md:inline text-lg font-medium">{authUser.name}</span>
              </Link>
              <button
                onClick={() => logout()}
                className="bg-secondary text-base-100 px-5 py-2 rounded-full shadow-md font-semibold hover:bg-accent hover:text-base-100 transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="border border-secondary text-secondary px-4 py-2 rounded-full font-semibold hover:bg-secondary hover:text-base-100 transition duration-300">
                Sign In
              </Link>
              <Link to="/signup" className="bg-secondary text-base-100 px-4 py-2 rounded-full shadow-md font-semibold hover:bg-accent hover:text-base-100 transition duration-300">
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-base-100 border-t border-secondary px-6 py-4 space-y-4 shadow-lg">
          <Link to="/" className="flex items-center gap-2 hover:text-accent transition duration-300" onClick={() => setMenuOpen(false)}>
            <Home size={24} className="stroke-primary" />
            Home
          </Link>
          <Link to="/network" className="relative flex items-center gap-2 hover:text-accent transition duration-300" onClick={() => setMenuOpen(false)}>
            <Users size={24} className="stroke-primary" />
            Network
            {unreadConnectionRequestsCount > 0 && (
              <span className="absolute -top-2 -right-5 bg-accent text-base-100 text-xs font-bold rounded-full px-2 py-0.5 animate-pulse shadow-md">
                {unreadConnectionRequestsCount}
              </span>
            )}
          </Link>
          <Link to="/notifications" className="relative flex items-center gap-2 hover:text-accent transition duration-300" onClick={() => setMenuOpen(false)}>
            <Bell size={24} className="stroke-primary" />
            Notifications
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-2 -right-5 bg-accent text-base-100 text-xs font-bold rounded-full px-2 py-0.5 animate-pulse shadow-md">
                {unreadNotificationCount}
              </span>
            )}
          </Link>
          
                              <Link to="/jobs" className="relative flex items-center gap-2 hover:text-accent transition duration-300" onClick={() => setMenuOpen(false)}>
            <ShoppingBag  className="stroke-primary" size={24}  />  Jobs
          </Link>
          <div className="flex flex-col space-y-2 mt-4">
            {authUser ? (
              <>
                <Link
                  to={`/profile/${authUser.username}`}
                  className="flex items-center space-x-3 text-neutral hover:text-accent transition duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={28} className="stroke-primary" />
                  <span className="text-lg font-medium">{authUser.name}</span>
                </Link>
                
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="bg-secondary text-base-100 px-5 py-2 rounded-full shadow-md font-semibold hover:bg-accent hover:text-base-100 transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="border border-secondary text-secondary px-4 py-2 rounded-full font-semibold hover:bg-secondary hover:text-base-100 transition duration-300" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to="/signup" className="bg-secondary text-base-100 px-4 py-2 rounded-full shadow-md font-semibold hover:bg-accent hover:text-base-100 transition duration-300" onClick={() => setMenuOpen(false)}>
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
