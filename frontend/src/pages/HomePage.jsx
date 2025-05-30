import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { Coffee, Home, Users, ShoppingBag, Bell, User as UserIcon } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";
import { Link, useLocation } from "react-router-dom";

const HomePage = () => {
  // Provide queryFn for authUser
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

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  const [showRecommended, setShowRecommended] = useState(false);
  const location = useLocation();

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 bg-[#fdf6ee] min-h-screen p-4 relative'>
      <div className='hidden lg:block lg:col-span-1'>
        <Sidebar user={authUser} />
      </div>

      <div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
        <PostCreation user={authUser} />

        {posts?.map((post) => (
          <Post key={post._id} post={post} />
        ))}

        {posts?.length === 0 && (
          <div className='bg-[#fff3e6] rounded-xl shadow-lg p-8 text-center border border-[#d9b99b]'>
            <div className='mb-6'>
              <Coffee size={64} className='mx-auto text-[#6f4e37]' />
            </div>
            <h2 className='text-3xl font-bold mb-4 text-[#4b2e1d]'>No Brews Yet</h2>
            <p className='text-[#7a5c3e] mb-6'>Connect with baristas or cafés to start seeing coffee stories and job posts!</p>
          </div>
        )}
      </div>

      {/* Desktop: always visible */}
      {recommendedUsers?.length > 0 && (
        <div className='hidden lg:block col-span-1 lg:col-span-1 mb-6'>
          <div className='bg-[#f4e8da] rounded-xl shadow-md p-4 border border-[#dec3a5]'>
            <h2 className='text-lg font-semibold text-[#5a3e2b] mb-4'>Baristas & Café Owners You May Know</h2>
            {recommendedUsers?.map((user) => (
              <RecommendedUser key={user._id} user={user} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile: Button at footer */}
     <button
  className="fixed bottom-24 right-4 z-50 bg-accent text-white p-4 rounded-full shadow-lg block lg:hidden flex items-center justify-center"
  onClick={() => setShowRecommended(true)}
  aria-label="Baristas & Café Owners You May Know"
>
  <Coffee size={28} />
</button>

      {/* Mobile: Modal */}
      {showRecommended && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 lg:hidden">
          <div className="bg-[#f4e8da] rounded-xl shadow-lg p-6 w-11/12 max-w-md relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold"
              onClick={() => setShowRecommended(false)}
            >
              ×
            </button>
            <h2 className='text-lg font-semibold text-[#5a3e2b] mb-4'>Baristas & Café Owners You May Know</h2>
            {recommendedUsers?.map((user) => (
              <RecommendedUser key={user._id} user={user} />
            ))}
          </div>
        </div>
      )}

      {/* LinkedIn-style Mobile Footer Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-base-100 border-t border-secondary flex justify-around items-center py-2 shadow-lg">
        <Link
          to="/"
          className={`flex flex-col items-center text-xs font-semibold ${location.pathname === "/" ? "text-accent" : "text-neutral"} transition`}
        >
          <Home size={24} />
          Home
        </Link>
        <Link
          to="/network"
          className={`flex flex-col items-center text-xs font-semibold ${location.pathname === "/network" ? "text-accent" : "text-neutral"} transition`}
        >
          <Users size={24} />
          My Network
        </Link>
        <Link
          to="/jobs"
          className={`flex flex-col items-center text-xs font-semibold ${location.pathname === "/jobs" ? "text-accent" : "text-neutral"} transition`}
        >
          <ShoppingBag size={24} />
          Jobs
        </Link>
        <Link
          to="/notifications"
          className={`flex flex-col items-center text-xs font-semibold ${location.pathname === "/notifications" ? "text-accent" : "text-neutral"} transition`}
        >
          <Bell size={24} />
          Notifications
        </Link>
        <Link
          to={authUser ? `/profile/${authUser.username}` : "/login"}
          className={`flex flex-col items-center text-xs font-semibold ${location.pathname.startsWith("/profile") ? "text-accent" : "text-neutral"} transition`}
        >
          <UserIcon size={24} />
          Profile
        </Link>
      </nav>
    </div>
  );
};

export default HomePage;