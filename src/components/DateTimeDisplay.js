import React from 'react';
import moment from 'moment-timezone';

function formatDateTime(dateTimeStr) {
    const dateTime = moment.parseZone(dateTimeStr).tz('Asia/Jakarta', true);
    const currentTime = moment().tz('Asia/Jakarta');

    // Menghitung perbedaan waktu dalam menit
    const diffMinutes = currentTime.diff(dateTime, 'minutes');

    // Membuat pesan sesuai dengan perbedaan waktu
    if (diffMinutes < 1) {
        return 'Baru saja';
    } else if (diffMinutes < 60) {
        return `${diffMinutes} menit yang lalu`;
    } else if (diffMinutes < 24 * 60) {
        const diffHours = Math.floor(diffMinutes / 60);
        return `${diffHours} jam yang lalu`;
    } else if (diffMinutes < 24 * 60 * 7) {
        const diffDays = Math.floor(diffMinutes / (24 * 60));
        return `${diffDays} hari yang lalu`;
    } else if (diffMinutes < 24 * 60 * 30) {
        const diffWeeks = Math.floor(diffMinutes / (24 * 60 * 7));
        return `${diffWeeks} minggu yang lalu`;
    } else {
        return 'Lebih dari sebulan yang lalu';
    }

}
  

function DateTimeDisplay({ dateTimeStr }) {
  const formattedDateTime = formatDateTime(dateTimeStr);

  return (
    <span>{formattedDateTime}</span>
  );
}

export default DateTimeDisplay;