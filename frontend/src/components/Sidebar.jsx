import { Link } from "react-router-dom";
import { Home, UserPlus, Bell, ShoppingBag } from "lucide-react";

export default function Sidebar({ user }) {
	return (
		<aside className='bg-coffee-dark text-coffee-light rounded-2xl shadow-xl p-6 flex flex-col items-center min-h-[300px]'>
			<div className='mb-6'>
				<img
					src={user.profilePicture || "/avatar.png"}
					alt={user.name}
					className='w-20 h-20 rounded-full border-4 border-coffee-light shadow-lg'
				/>
				<h2 className='mt-4 text-2xl font-serif font-bold'>
					☕ Welcome back, {user.name}! 
				</h2>
				<p className='text-coffee-light/80'>
					{user.headline === "Member" ? "Member" : user.headline}
				</p>
			</div>
			<nav className='w-full'>
				<ul className='space-y-0 py-2'>
					<li>
						<Link
							to='/'
							className='flex items-center gap-2 py-2 px-4 rounded-xl hover:bg-coffee-light/20 transition-all'
						>
							<Home className='mr-2' size={20} /> Home
						</Link>
					</li>
					<li>
						<Link
							to='/network'
							className='flex items-center gap-2 py-2 px-4 rounded-xl hover:bg-coffee-light/20 transition-all'
						>
							<UserPlus className='mr-2' size={20} /> Brew new connections
						</Link>
					</li>
					<li>
						<Link
							to='/notifications'
							className='flex items-center gap-2 py-2 px-4 rounded-xl hover:bg-coffee-light/20 transition-all'
						>
							<Bell className='mr-2' size={20} /> Notifications
						</Link>
					</li>
					<li>

						        <Link to="/jobs" className="flex items-center gap-2 py-2 px-4 rounded-xl hover:bg-coffee-light/20 transition-all">
  <ShoppingBag  className='mr-2' size={20} />  Jobs
</Link>
					</li>
				</ul>
			</nav>
		</aside>
	);
}
