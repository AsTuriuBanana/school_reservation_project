import { useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import RoomCard from '@/components/RoomCard';
import { rooms, DAYS_LIST, LESSON_TIMES_LIST, isRoomFreeAt, getCurrentDayName } from '@/data/mockData';

const lessonNumberPattern = /^(\d+)\s*pamok/;

const Index = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('teacher_logged_in') === 'true');

  const filteredRooms = useMemo(() => {
    if (!searchQuery) return rooms;
    const q = searchQuery.toLowerCase();

    const lessonMatch = q.match(lessonNumberPattern);
    if (lessonMatch) {
      const lessonNum = parseInt(lessonMatch[1]);
      const day = getCurrentDayName();
      return rooms.filter(room => isRoomFreeAt(room, day, lessonNum));
    }

    if (q === 'laisva' || q === 'laisvos' || q === 'free') {
      return rooms.filter(room => {
        const day = getCurrentDayName();
        return LESSON_TIMES_LIST.some((_, i) => isRoomFreeAt(room, day, i + 1));
      });
    }

    const subjectRooms = rooms.filter(room =>
      Object.values(room.schedule).some(lessons =>
        lessons.some(lesson => lesson.subject.toLowerCase().includes(q))
      )
    );
    if (subjectRooms.length > 0) return subjectRooms;

    return rooms.filter(room =>
      room.number.toLowerCase().includes(q) ||
      room.type.toLowerCase().includes(q) ||
      (room.subject && room.subject.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const floors = useMemo(() => {
    if (searchQuery) return null;
    const grouped: Record<number, typeof rooms> = {};
    rooms.forEach(room => {
      if (!grouped[room.floor]) grouped[room.floor] = [];
      grouped[room.floor].push(room);
    });
    return Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b));
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          localStorage.removeItem('teacher_logged_in');
          setIsLoggedIn(false);
        }}
      />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Kabinetų tvarkaraščiai
          </h1>
          <p className="text-muted-foreground">
            {searchQuery
              ? `Paieškos rezultatai: „${searchQuery}" — rasta ${filteredRooms.length}`
              : 'Pasirinkite kabinetą norėdami peržiūrėti tvarkaraštį'}
          </p>
        </div>

        {floors ? (
          floors.map(([floor, floorRooms]) => (
            <div key={floor} className="mb-8 last:mb-0">
              <h2 className="font-heading text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                  {floor}
                </span>
                {floor} aukštas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {floorRooms.map(room => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}

        {filteredRooms.length === 0 && !floors && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">Nieko nerasta pagal užklausą „{searchQuery}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
