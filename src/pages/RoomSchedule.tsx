import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ScheduleTable from '@/components/ScheduleTable';
import { rooms, isRoomFreeNow } from '@/data/mockData';
import { ArrowLeft, DoorOpen, DoorClosed } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RoomSchedule = () => {
  const { roomId } = useParams();
  const room = rooms.find(r => r.id === roomId);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('teacher_logged_in') === 'true');

  if (!room) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isLoggedIn={isLoggedIn} onLogout={() => { localStorage.removeItem('teacher_logged_in'); setIsLoggedIn(false); }} />
        <main className="container py-20 text-center">
          <h1 className="font-heading text-2xl font-bold mb-4">Kabinetas nerastas</h1>
          <Button asChild variant="outline">
            <Link to="/">Grįžti į pradžią</Link>
          </Button>
        </main>
      </div>
    );
  }

  const isFree = isRoomFreeNow(room);

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} onLogout={() => { localStorage.removeItem('teacher_logged_in'); setIsLoggedIn(false); }} />

      <main className="container py-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Visi kabinetai
          </Link>
        </Button>

        <div className="glass-card rounded-2xl p-6 md:p-8">
          <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-1">
                Kabinetas {room.number}
              </h1>
              <p className="text-muted-foreground">{room.type} · {room.floor} aukštas</p>
            </div>
            <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border ${isFree ? 'status-free' : 'status-occupied'}`}>
              {isFree ? <DoorOpen className="h-4 w-4" /> : <DoorClosed className="h-4 w-4" />}
              {isFree ? 'Šiuo metu laisva' : 'Šiuo metu užimta'}
            </div>
          </div>

          <ScheduleTable room={room} />
        </div>
      </main>
    </div>
  );
};

export default RoomSchedule;
