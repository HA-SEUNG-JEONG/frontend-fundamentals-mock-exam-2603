export const BOOKING_START_HOUR = 9;
export const BOOKING_END_HOUR = 20;
export const TIME_SLOT_INTERVAL_MINUTES = 30;

function formatTimeSlot(totalMinutes: number) {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function buildTimeSlots(
  startHour = BOOKING_START_HOUR,
  endHour = BOOKING_END_HOUR,
  intervalMinutes = TIME_SLOT_INTERVAL_MINUTES
) {
  const slots: string[] = [];

  for (let minutes = startHour * 60; minutes <= endHour * 60; minutes += intervalMinutes) {
    slots.push(formatTimeSlot(minutes));
  }

  return slots;
}

export const TIME_SLOTS = buildTimeSlots();
export const START_TIME_OPTIONS = TIME_SLOTS.slice(0, -1);
export const END_TIME_OPTIONS = TIME_SLOTS.slice(1);

export function timeToMinutes(time: string) {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

export function isValidTimeSlot(time: string) {
  return TIME_SLOTS.includes(time);
}

export function isValidTimeRange(startTime: string, endTime: string) {
  return timeToMinutes(startTime) < timeToMinutes(endTime);
}
