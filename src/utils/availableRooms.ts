import type { Equipment, Reservation, Room } from '_tosslib/server/types';
import { timeToMinutes } from 'utils/timeSlots';

export interface RoomAvailabilityFilters {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: Equipment[];
  preferredFloor: number | null;
}

function hasTimeConflict(reservation: Reservation, roomId: string, date: string, startTime: string, endTime: string) {
  if (reservation.roomId !== roomId || reservation.date !== date) {
    return false;
  }


  return timeToMinutes(reservation.start) < timeToMinutes(endTime) && timeToMinutes(reservation.end) > timeToMinutes(startTime);
}

function isAvailableRoom(room: Room, reservations: Reservation[], filters: RoomAvailabilityFilters) {
  const { date, startTime, endTime, attendees, equipment, preferredFloor } = filters;

  if (room.capacity < attendees) return false;
  if (!equipment.every(item => room.equipment.includes(item))) return false;
  if (preferredFloor !== null && room.floor !== preferredFloor) return false;

  return !reservations.some(reservation => hasTimeConflict(reservation, room.id, date, startTime, endTime));
}

function sortAvailableRooms(a: Room, b: Room) {
  if (a.floor !== b.floor) return a.floor - b.floor;
  return a.name.localeCompare(b.name);
}

export function getAvailableRooms(rooms: Room[], reservations: Reservation[], filters: RoomAvailabilityFilters) {
  return rooms
    .filter(room => isAvailableRoom(room, reservations, filters))
    .sort(sortAvailableRooms);
}
