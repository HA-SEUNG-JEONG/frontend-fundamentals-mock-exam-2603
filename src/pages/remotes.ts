import Axios from 'axios';
import type { Equipment, Reservation, Room } from '_tosslib/server/types';

const api = Axios.create();

interface ApiErrorResponse {
  message?: string;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (Axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    return data?.message ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function throwApiError(error: unknown, fallback: string): never {
  throw new Error(getErrorMessage(error, fallback));
}

export async function getRooms() {
  const response = await api.get<Room[]>('/api/rooms');
  return response.data;
}

export async function getReservations(date: string) {
  const response = await api.get<Reservation[]>('/api/reservations', {
    params: { date },
  });
  return response.data;
}

export async function createReservation(data: {
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: Equipment[];
}) {
  try {
    const response = await api.post<{ ok: boolean; reservation?: unknown; code?: string; message?: string }>(
      '/api/reservations',
      data
    );
    return response.data;
  } catch (error) {
    throwApiError(error, '예약에 실패했습니다.');
  }
}

export async function getMyReservations() {
  const response = await api.get<Reservation[]>('/api/my-reservations');
  return response.data;
}

export async function cancelReservation(id: string) {
  try {
    const response = await api.delete<{ ok: boolean }>(`/api/reservations/${id}`);
    return response.data;
  } catch (error) {
    throwApiError(error, '취소에 실패했습니다.');
  }
}
