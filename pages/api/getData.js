import { getToken } from "next-auth/jwt";

const secret = process.env.SECRET;

export default async (req, res) => {
	// Set the start date to 7 day ago
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - 1);

	// Set the end date to the current date
	const endDate = new Date();
	endDate.setDate(endDate.getDate());

	// Get the token from the request
	const token = await getToken({ req, secret, encryption: true });

	// Get the data from the Google Fit API
	// https://developers.google.com/fit/rest/v1/data-sources#get_aggregated_data
	fetch(`https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`, {
		headers: {
			Authorization: `Bearer ${token.accessToken}`,
			"Content-Type": "application/json",
		},
		method: "post",
		body: JSON.stringify({
			aggregateBy: [
				{
					dataTypeName: "com.google.heart_rate.summary",
					dataSourceId:
						"derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm",
				},
			],
			bucketByTime: { durationMillis: 60000 }, // will look at the data for each minutes : 60000 : 86400000
			startTimeMillis: startDate.getTime(),
			endTimeMillis: endDate.getTime(),
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			// Create an array to store the heart rate data
			var heartRateData = [];

			// Loop through the data and get the heart rate
			for (var i = 0; i < data?.bucket?.length; i++) {
				if (data.bucket[i].dataset[0].point.length > 0) {
					// Convert the date to a readable format
					var date = new Date(parseInt(data.bucket[i].startTimeMillis, 10));
					date = date.toLocaleString("en-GB", {
						timeZone: "UTC",
					});

					// Add the data to the array
					heartRateData.push({
						date,
						heartRate: data.bucket[i].dataset[0].point[0].value[0].fpVal,
					});
				}
			}

			// Return the data
			if (heartRateData.length === 0) {
				res.status(404).json({ error: "No data found" });
			} else {
				res.status(200).json(heartRateData);
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error: error });
		});
};
