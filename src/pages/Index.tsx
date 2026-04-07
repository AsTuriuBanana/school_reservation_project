import { useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import RoomCard from '@/components/RoomCard';
import { rooms, DAYS_LIST, LESSON_TIMES_LIST, isRoomFreeAt, getCurrentDayName } from '@/data/mockData';

const Index = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('teacher_logged_in') === 'true');

  const filteredRooms = useMemo(() => {
    if (!searchQuery) return rooms;
    const q = searchQuery.toLowerCase();

    if (q === 'laisva' || q === 'laisvos' || q === 'free') {
      return rooms.filter(room => {
        const day = getCurrentDayName();
        return LESSON_TIMES_LIST.some((_, i) => isRoomFreeAt(room, day, i + 1));
      });
    }

    return rooms.filter(room =>
      room.number.toLowerCase().includes(q) ||
      room.type.toLowerCase().includes(q)
    );
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">Nieko nerasta pagal užklausą „{searchQuery}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
