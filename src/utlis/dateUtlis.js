
import { MEAL_TIMINGS, BOYS_DATA, GIRLS_DATA, HostelType } from '../Pages/MessDetails/constants.js';

/**
 * Converts HH:MM string to total minutes from midnight
 */
export const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Parses DD-MM-YY string to a JS Date object
 */
export const parseDataDate = (dateStr) => {
  const [day, month, year] = dateStr.split('-').map(Number);
  return new Date(2000 + year, month - 1, day);
};

/**
 * Formats a Date object into YYYY-MM-DD for input[type=date]
 */
export const formatDateToISO = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a Date object into DD-MM-YY string to match JSON data
 */
export const formatDateToDataKey = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
};

/**
 * Determines which meal is currently active or upcoming
 */
export const getActiveMeal = (now) => {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (currentMinutes < timeToMinutes(MEAL_TIMINGS.breakfast.end)) return 'breakfast';
  if (currentMinutes < timeToMinutes(MEAL_TIMINGS.lunch.end)) return 'lunch';
  if (currentMinutes < timeToMinutes(MEAL_TIMINGS.tea.end)) return 'tea';
  if (currentMinutes < timeToMinutes(MEAL_TIMINGS.dinner.end)) return 'dinner';
  
  return 'next_day_breakfast';
};

export const getMessDataByDate = (hostel, date) => {
  const dateKey = formatDateToDataKey(date);
  const data = hostel === HostelType.BOYS ? BOYS_DATA : GIRLS_DATA;
  return data.mess.find(d => d.date === dateKey);
};