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
			console.log(data);
			/*
			setList(
				//data.toString()
        data.map((sub) => ({
          id: sub.id,
          title: sub.snippet.title,
        }))
			);*/
			setLoading(false);
		}
	}, [loading]);

	return (
		<div>
			<h1>NextAuth Google test</h1>

			{!session ? (
				<button onClick={() => signIn()}>Sign In</button>
			) : (
				<>
					<button onClick={() => signOut()}>Sign Out</button>
					<pre>{JSON.stringify(session, null, 2)}</pre>
					<button onClick={() => setLoading(!loading)} disabled={loading}>
						Get my health data
					</button>
					{loading && <p>Loading...</p>}
					<ul>
						{list.map((sub) => (
							<li key={sub.id}>{sub.title}</li>
						))}
					</ul>
				</>
			)}
		</div>
	);
}
