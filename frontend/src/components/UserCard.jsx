import { Link } from "react-router-dom";

function UserCard({ user, isConnection }) {
	return (
		<div className='bg-coffee-light rounded-xl shadow-md p-4 flex flex-col items-center transition-all hover:scale-[1.02] hover:shadow-xl'>
			<Link to={`/profile/${user.username}`} className='flex flex-col items-center'>
				<img
					src={user.profilePicture || "/avatar.png"}
					alt={user.name}
					className='w-24 h-24 rounded-full object-cover mb-4 border-2 border-coffee-dark'
				/>
				<h3 className='font-serif font-semibold text-lg text-center'>{user.name}</h3>
			</Link>
			<p className='text-coffee-dark text-center'>
				{user.headline === "Member" ? "Member" : user.headline}
			</p>
			<p className='text-sm text-coffee-dark/70 mt-2'>{user.connections?.length} connections</p>
			<button className='mt-4 btn btn-accent flex items-center gap-2'>
				{isConnection ? "☕ Connected" : "🤝 Connect"}
			</button>
		</div>
	);
}

export default UserCard;
