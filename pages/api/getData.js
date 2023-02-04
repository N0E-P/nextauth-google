import axios from "axios";
import { getToken } from "next-auth/jwt";

const secret = process.env.SECRET;

export default async (req, res) => {
	const token = await getToken({ req, secret, encryption: true });

	const { data } = await axios.get(`https://www.googleapis.com/fitness/v1/users/me/dataSources`, {
		headers: {
			Authorization: `Bearer ${token.accessToken}`,
		},
	});

	console.log(data);

	res.status(200).json(data);
};
