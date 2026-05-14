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
  schedule: Record<string, Lesson[]>; // day -> lessons
}

const DAYS = ['Pirmadienis', 'Antradienis', 'Trečiadienis', 'Ketvirtadienis', 'Penktadienis'];

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

const SUBJECTS = [
  'Matematika', 'Lietuvių k.', 'Anglų k.', 'Fizika', 'Chemija',
  'Biologija', 'Istorija', 'Geografija', 'Informatika', 'Muzika',
  'Dailė', 'Kūno kultūra', 'Technologijos', 'Vokiečių k.', 'Rusų k.'
];

const TEACHERS = [
  'J. Kazlauskienė', 'R. Petrauskas', 'A. Jonaitis', 'V. Stankevičienė',
  'D. Rimkus', 'L. Navickaitė', 'M. Gudaitis', 'S. Balčiūnienė',
  'T. Žukauskas', 'E. Mockienė', 'K. Sabaliauskas', 'G. Urbonienė'
];

const CLASSES = [
  '5a', '5b', '6a', '6b', '7a', '7b', '8a', '8b',
  '9a', '9b', '10a', '10b', 'IIg', 'IIIg', 'IVg'
];

function generateRoomSchedule(): Record<string, Lesson[]> {
  const schedule: Record<string, Lesson[]> = {};
  
  DAYS.forEach(day => {
    const lessons: Lesson[] = [];
    const numLessons = Math.floor(Math.random() * 4) + 3; // 3-6 lessons
    const usedSlots = new Set<number>();
    
    for (let i = 0; i < numLessons; i++) {
      let slot: number;
      do {
        slot = Math.floor(Math.random() * LESSON_TIMES.length);
      } while (usedSlots.has(slot));
      usedSlots.add(slot);
      
      lessons.push({
        id: `${day}-${slot}`,
        lessonNumber: slot + 1,
        timeStart: LESSON_TIMES[slot].start,
        timeEnd: LESSON_TIMES[slot].end,
        subject: SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)],
        teacher: TEACHERS[Math.floor(Math.random() * TEACHERS.length)],
        className: CLASSES[Math.floor(Math.random() * CLASSES.length)],
      });
    }
    
    schedule[day] = lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);
  });
  
  return schedule;
}

const STORAGE_KEY = 'school_rooms_data';
const DATA_VERSION = 3;

const ROOM_TEMPLATES: Omit<Room, 'schedule'>[] = [
  // 1 aukštas
  { id: '101', number: '101', floor: 1, type: 'Klasė', subject: 'Matematika' },
  { id: '102', number: '102', floor: 1, type: 'Klasė', subject: 'Anglų kalba' },
  { id: '103', number: '103', floor: 1, type: 'Klasė', subject: 'Vokiečių kalba' },
  { id: '105', number: '105', floor: 1, type: 'Klasė', subject: 'Matematika' },
  { id: '106', number: '106', floor: 1, type: 'Klasė', subject: 'Anglų kalba' },
  { id: '110', number: '110', floor: 1, type: 'Klasė', subject: 'Matematika' },
  { id: '115', number: '115', floor: 1, type: 'Klasė', subject: 'Matematika' },
  { id: '121', number: '121', floor: 1, type: 'Klasė', subject: 'Muzika' },
  // 2 aukštas
  { id: '201', number: '201', floor: 2, type: 'Klasė', subject: 'Lietuvių kalba' },
  { id: '202', number: '202', floor: 2, type: 'Klasė', subject: 'Matematika' },
  { id: '203', number: '203', floor: 2, type: 'Klasė', subject: 'Matematika' },
  { id: '204', number: '204', floor: 2, type: 'Klasė', subject: 'Istorija' },
  { id: '205', number: '205', floor: 2, type: 'Klasė', subject: 'Tikyba' },
  { id: '207', number: '207', floor: 2, type: 'Klasė', subject: 'Lietuvių kalba' },
  { id: '209', number: '209', floor: 2, type: 'Klasė', subject: 'Chemija' },
  { id: '210', number: '210', floor: 2, type: 'Klasė', subject: 'Ekonomika' },
  { id: '211', number: '211', floor: 2, type: 'Klasė', subject: 'Dailė/technologijos' },
  { id: '212', number: '212', floor: 2, type: 'Klasė', subject: 'Lietuvių kalba' },
  { id: '214', number: '214', floor: 2, type: 'Klasė', subject: 'Lietuvių kalba' },
  { id: '217', number: '217', floor: 2, type: 'Klasė', subject: 'Rusų kalba' },
  // 3 aukštas
  { id: '302', number: '302', floor: 3, type: 'Klasė', subject: 'Biologija' },
  { id: '303', number: '303', floor: 3, type: 'Klasė', subject: 'Anglų kalba' },
  { id: '305', number: '305', floor: 3, type: 'Klasė', subject: 'Geografija' },
  { id: '306', number: '306', floor: 3, type: 'Klasė', subject: 'Biologija' },
  { id: '308', number: '308', floor: 3, type: 'Klasė', subject: 'Chemija' },
  { id: '309', number: '309', floor: 3, type: 'Klasė', subject: 'Dailė' },
  { id: '310', number: '310', floor: 3, type: 'Klasė', subject: 'Anglų kalba' },
  { id: '312', number: '312', floor: 3, type: 'Klasė', subject: 'Anglų kalba' },
  { id: '313', number: '313', floor: 3, type: 'Klasė', subject: 'IT' },
  { id: '314', number: '314', floor: 3, type: 'Klasė', subject: 'Technologijos' },
  { id: '315', number: '315', floor: 3, type: 'Klasė', subject: 'Fizika' },
];

function generateDefaultRooms(): Room[] {
  return ROOM_TEMPLATES.map(t => ({ ...t, schedule: Object.fromEntries(DAYS.map(d => [d, []])) }));
}

function loadRooms(): Room[] {
  try {
    const version = localStorage.getItem('school_data_version');
    if (version !== String(DATA_VERSION)) throw new Error('old data');
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Room[];
  } catch {}
  const defaults = generateDefaultRooms();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  localStorage.setItem('school_data_version', String(DATA_VERSION));
  return defaults;
}

export let rooms: Room[] = loadRooms();

export function saveRoomsToStorage(data: Room[]) {
  rooms = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getCurrentDayName(): string {
  const dayIndex = new Date().getDay();
  // Sunday = 0, Monday = 1, etc. Map to our array (Mon=0..Fri=4)
  if (dayIndex >= 1 && dayIndex <= 5) return DAYS[dayIndex - 1];
  return DAYS[0]; // default to Monday on weekends
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
  const lessons = room.schedule[day] || [];
  return !lessons.some(l => l.lessonNumber === lessonNum);
}

export function isRoomFreeAt(room: Room, day: string, lessonNumber: number): boolean {
  const lessons = room.schedule[day] || [];
  return !lessons.some(l => l.lessonNumber === lessonNumber);
}
