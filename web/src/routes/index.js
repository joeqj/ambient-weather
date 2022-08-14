import json from '../../static/data.json';

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
