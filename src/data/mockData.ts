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

const ROOM_TYPES = ['Klasė', 'Laboratorija', 'Kompiuterių klasė', 'Sporto salė', 'Aktų salė'];

export const rooms: Room[] = [
  { id: '101', number: '101', floor: 1, type: 'Klasė', schedule: generateRoomSchedule() },
  { id: '102', number: '102', floor: 1, type: 'Klasė', schedule: generateRoomSchedule() },
  { id: '103', number: '103', floor: 1, type: 'Kompiuterių klasė', schedule: generateRoomSchedule() },
  { id: '104', number: '104', floor: 1, type: 'Klasė', schedule: generateRoomSchedule() },
  { id: '201', number: '201', floor: 2, type: 'Klasė', schedule: generateRoomSchedule() },
  { id: '202', number: '202', floor: 2, type: 'Laboratorija', schedule: generateRoomSchedule() },
  { id: '203', number: '203', floor: 2, type: 'Klasė', schedule: generateRoomSchedule() },
  { id: '204', number: '204', floor: 2, type: 'Klasė', schedule: generateRoomSchedule() },
  { id: '301', number: '301', floor: 3, type: 'Klasė', schedule: generateRoomSchedule() },
  { id: '302', number: '302', floor: 3, type: 'Laboratorija', schedule: generateRoomSchedule() },
  { id: '303', number: '303', floor: 3, type: 'Kompiuterių klasė', schedule: generateRoomSchedule() },
  { id: '304', number: '304', floor: 3, type: 'Klasė', schedule: generateRoomSchedule() },
  { id: 'SP', number: 'Sporto salė', floor: 1, type: 'Sporto salė', schedule: generateRoomSchedule() },
  { id: 'AK', number: 'Aktų salė', floor: 2, type: 'Aktų salė', schedule: generateRoomSchedule() },
];

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
