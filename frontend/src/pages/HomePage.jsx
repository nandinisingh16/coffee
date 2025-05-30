import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { Coffee } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";

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
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-accent text-white px-6 py-3 rounded-full shadow-lg font-semibold block lg:hidden"
        onClick={() => setShowRecommended(true)}
        style={{ minWidth: 220 }}
      >
        ☕ Baristas & Café Owners You May Know
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
    </div>
  );
};

export default HomePage;