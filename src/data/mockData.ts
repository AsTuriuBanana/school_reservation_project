export interface Lesson {
  id: string;
  lessonNumber: number;
  timeStart: string;
  timeEnd: string;
  subject: string;
  teacher: string;
  className: string;
}

export interface Room {
  id: string;
  number: string;
  floor: number;
  type: string;
  subject?: string;
  schedule: Record<string, Lesson[]>;
}

export const DAYS = ['Pirmadienis', 'Antradienis', 'Trečiadienis', 'Ketvirtadienis', 'Penktadienis'];

const LESSON_TIMES = [
  { start: '08:00', end: '08:45' },
  { start: '08:55', end: '09:40' },
  { start: '09:50', end: '10:35' },
  { start: '10:55', end: '11:40' },
  { start: '11:50', end: '12:35' },
  { start: '12:55', end: '13:40' },
  { start: '13:50', end: '14:35' },
];

export const LESSON_TIMES_LIST = LESSON_TIMES;
export const DAYS_LIST = DAYS;

export function getCurrentDayName(): string {
  const dayIndex = new Date().getDay();
  if (dayIndex >= 1 && dayIndex <= 5) return DAYS[dayIndex - 1];
  return DAYS[0];
}

export function getCurrentLessonNumber(): number | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  for (let i = 0; i < LESSON_TIMES.length; i++) {
    const [sh, sm] = LESSON_TIMES[i].start.split(':').map(Number);
    const [eh, em] = LESSON_TIMES[i].end.split(':').map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    if (currentMinutes >= start && currentMinutes <= end) return i + 1;
  }
  return null;
}

export function isRoomFreeNow(room: Room): boolean {
  const day = getCurrentDayName();
  const lessonNum = getCurrentLessonNumber();
  if (!lessonNum) return true;
  return !(room.schedule[day] || []).some(l => l.lessonNumber === lessonNum);
}

export function isRoomFreeAt(room: Room, day: string, lessonNumber: number): boolean {
  return !(room.schedule[day] || []).some(l => l.lessonNumber === lessonNumber);
}
