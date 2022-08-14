import json from '../../static/night-partly-cloudy.json';

export async function GET() {
	if (json) {
		return {
			body: {
				data: json[0]
			}
		};
	}

	return {
		status: 403
	};
}
