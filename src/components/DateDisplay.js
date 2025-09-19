import React from 'react';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';

// DateDisplay component to handle date formatting
const DateDisplay = ({ date }) => {
  if (!date) return null;

  const formattedDate = format(new Date(date), 'MMMM dd, yyyy');
  const isDateToday = isToday(new Date(date));
  const isDateTomorrow = isTomorrow(new Date(date));
  const isDateYesterday = isYesterday(new Date(date));

  // Display relative dates (Today, Tomorrow, Yesterday)
  let displayText = formattedDate;
  if (isDateToday) {
    displayText = 'Today';
  } else if (isDateTomorrow) {
    displayText = 'Tomorrow';
  } else if (isDateYesterday) {
    displayText = 'Yesterday';
  }

  return (
    <span
      style={{
        fontWeight: isDateToday ? 'bold' : 'normal',
        color: isDateToday ? '#ff6347' : '#000', // Highlight today
        paddingLeft: '8px',
      }}
    >
      {displayText}
    </span>
  );
};

export default DateDisplay;
