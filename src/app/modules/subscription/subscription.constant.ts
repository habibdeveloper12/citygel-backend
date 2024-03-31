import moment from 'moment';

export const calculateNextMonthDuration = (month: number) => {
  // Get the current date
  const currentDate = moment();
  // Add 1 month to the current date and get the end of the resulting month
  const endOfNextMonth = currentDate.add(month, 'month').endOf('month');
  // Calculate the duration in days from the current date to the end of next month
  const durationInDays = endOfNextMonth.diff(currentDate, 'days') + 1; // Add 1 to include the current day
  return durationInDays;
};
