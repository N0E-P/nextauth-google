import { signIn, signOut, useSession } from "next-auth/client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
	const [session] = useSession();
	const [loading, setLoading] = useState(false);
	const [list, setList] = useState([]);

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
			<h1>NextAuth Google test</h1>

			{!session ? (
				<button onClick={() => signIn("google")}>Sign In</button>
			) : (
				<>
					<button onClick={() => signOut()}>Sign Out</button>
					<pre>{JSON.stringify(session, null, 2)}</pre>
					<button onClick={() => setLoading(!loading)} disabled={loading}>
						Get my health data
					</button>
					<ul>
						{list.map((value) => (
							<li key={value.date}>
								{value.date}: {value.heartRate}
							</li>
						))}
					</ul>
				</>
			)}
		</div>
	);
}
