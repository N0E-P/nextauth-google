import { signIn, signOut, useSession } from "next-auth/client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
	const [session] = useSession();
	const [loading, setLoading] = useState(false);
	const [list, setList] = useState([]);

	// Get data from Google FIT API
	useEffect(async () => {
		if (loading) {
			const { data } = await axios.get("/api/getData", {
				withCredentials: true,
			});
			setList(data);
			setLoading(false);
		}
	}, [loading]);

	return (
		<div>
			<h1>Google login test</h1>
			{!session ? (
				<button onClick={() => signIn("google")}>Sign In</button>
			) : (
				<>
					<img
						onClick={() => signOut()}
						src={session.user.image}
						width="100px"
						height="100px"
					/>

					<p>Welcome {session.user.name}!</p>
					<p>Your email is {session.user.email}</p>
					<p>
						Your session expires the{" "}
						{new Date(session.expires).toLocaleString("en-GB", {
							timeZone: "UTC",
						})}
					</p>

					<button onClick={() => setLoading(!loading)} disabled={loading}>
						Get my health data
					</button>
					{list.map((value) => (
						<li key={value.date}>
							{value.date}: {value.heartRate}
						</li>
					))}
				</>
			)}
		</div>
	);
}
