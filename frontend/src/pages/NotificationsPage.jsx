import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { ExternalLink, Eye, MessageSquare, ThumbsUp, Trash2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { formatDistanceToNow } from "date-fns";

const NotificationsPage = () => {
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

	const queryClient = useQueryClient();

	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: () => axiosInstance.get("/notifications"),
	});

	const { mutate: markAsReadMutation } = useMutation({
		mutationFn: (id) => axiosInstance.put(`/notifications/${id}/read`),
		onSuccess: () => {
			queryClient.invalidateQueries(["notifications"]);
		},
	});

	const { mutate: deleteNotificationMutation } = useMutation({
		mutationFn: (id) => axiosInstance.delete(`/notifications/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries(["notifications"]);
			toast.success("Notification deleted");
		},
	});

	const renderNotificationIcon = (type) => {
		switch (type) {
			case "like":
				return <ThumbsUp className='text-blue-500' />;
			case "comment":
				return <MessageSquare className='text-green-500' />;
			case "connectionAccepted":
				return <UserPlus className='text-purple-500' />;
			default:
				return null;
		}
	};

	const renderNotificationContent = (notification) => {
		switch (notification.type) {
			case "like":
				return (
					<span>
						<strong>{notification.relatedUser.name}</strong> liked your post
					</span>
				);
			case "comment":
				return (
					<span>
						<Link to={`/profile/${notification.relatedUser.username}`} className='font-bold'>
							{notification.relatedUser.name}
						</Link>{" "}
						commented on your post
					</span>
				);
			case "connectionAccepted":
				return (
					<span>
						<Link to={`/profile/${notification.relatedUser.username}`} className='font-bold'>
							{notification.relatedUser.name}
						</Link>{" "}
						accepted your connection request
					</span>
				);
			default:
				return null;
		}
	};

	const renderRelatedPost = (relatedPost) => {
		if (!relatedPost) return null;

		return (
			<Link
				to={`/post/${relatedPost._id}`}
				className='mt-2 p-2 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors'
			>
				{relatedPost.image && (
					<img src={relatedPost.image} alt='Post preview' className='w-10 h-10 object-cover rounded' />
				)}
				<div className='flex-1 overflow-hidden'>
					<p className='text-sm text-gray-600 truncate'>{relatedPost.content}</p>
				</div>
				<ExternalLink size={14} className='text-gray-400' />
			</Link>
		);
	};

	return (
		<div className='grid grid-cols-1 lg:grid-cols-4 gap-6 bg-base-100 min-h-screen p-4'>
			{/* Sidebar */}
			<div className='hidden lg:block lg:col-span-1'>
				<Sidebar user={authUser} />
			</div>
			{/* Main Content */}
			<div className='col-span-1 lg:col-span-3'>
				<div className='bg-secondary rounded-xl shadow-lg p-6'>
					<h1 className='text-2xl font-serif font-bold mb-6 text-coffee-dark'>Notifications</h1>

					{isLoading ? (
						<p>Loading notifications...</p>
					) : notifications && notifications.data.length > 0 ? (
						<ul>
							{notifications.data.map((notification) => (
								<li
									key={notification._id}
									className={`bg-coffee-light border rounded-xl p-4 my-4 transition-all hover:shadow-md ${
										!notification.read ? "border-accent" : "border-gray-200"
									}`}
								>
									<div className='flex items-start justify-between'>
										<div className='flex items-center space-x-4'>
											<Link to={`/profile/${notification.relatedUser.username}`}>
												<img
													src={notification.relatedUser.profilePicture || "/avatar.png"}
													alt={notification.relatedUser.name}
													className='w-12 h-12 rounded-full object-cover'
												/>
											</Link>

											<div>
												<div className='flex items-center gap-2'>
													<div className='p-1 bg-gray-100 rounded-full'>
														{renderNotificationIcon(notification.type)}
													</div>
													<p className='text-sm'>{renderNotificationContent(notification)}</p>
												</div>
												<p className='text-xs text-gray-500 mt-1'>
													{formatDistanceToNow(new Date(notification.createdAt), {
														addSuffix: true,
													})}
												</p>
												{renderRelatedPost(notification.relatedPost)}
											</div>
										</div>

										<div className='flex gap-2'>
											{!notification.read && (
												<button
													onClick={() => markAsReadMutation(notification._id)}
													className='p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors'
													aria-label='Mark as read'
												>
													<Eye size={16} />
												</button>
											)}

											<button
												onClick={() => deleteNotificationMutation(notification._id)}
												className='p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors'
												aria-label='Delete notification'
											>
												<Trash2 size={16} />
											</button>
										</div>
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className="bg-coffee-light rounded-xl shadow p-6 text-center">
							<Eye size={48} className="mx-auto text-coffee-dark mb-4" />
							<h3 className="text-xl font-serif font-semibold mb-2">No Notifications</h3>
							<p className="text-coffee-dark">
								You’re all caught up! Sip your coffee and relax.
							</p>
						</div>
					)}
				</div>
			</div>
			{/* Sidebar for mobile */}
			<div className="lg:hidden mb-6">
				<Sidebar user={authUser} />
			</div>
		</div>
	);
};
export default NotificationsPage;
