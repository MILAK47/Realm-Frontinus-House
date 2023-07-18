import dayjs from 'dayjs';

const detailedTime = (time: Date | string) => {
	return dayjs(time).format("MMM D, YYYY h:mm:ss a")
}

export function serverDateToString(dateStr: string) {
	const timestamp = Date.parse(dateStr);
	if (isNaN(timestamp)) {
		return '';
	}

	const datetime = new Date(timestamp);
	const now = new Date();
	// @ts-ignore
	const diff = Math.floor((now - datetime) / 1000);

	if (diff >= 86400 || diff < 0) {
		return datetime.toLocaleDateString();
	}

	if (diff < 60) {
		return 'just now';
	} else if (diff < 3600) {
		const minute = Math.floor(diff / 60);
		return minute === 1 ? '1 minute ago' : minute + ' minutes ago';
	} else {
		const hour = Math.floor(diff / 3600);
		return hour === 1 ? '1 hour ago' : hour + ' hours ago';
	}
}


export default detailedTime
