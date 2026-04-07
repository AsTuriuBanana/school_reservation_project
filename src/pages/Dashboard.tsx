import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { rooms, DAYS_LIST, LESSON_TIMES_LIST, isRoomFreeAt } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CalendarCheck, DoorOpen } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const val = localStorage.getItem('teacher_logged_in') === 'true';
    if (!val) navigate('/login');
    return val;
  });

  const [selectedDay, setSelectedDay] = useState(DAYS_LIST[0]);
  const [selectedLesson, setSelectedLesson] = useState('1');

  const freeRooms = useMemo(() => {
    return rooms.filter(room => isRoomFreeAt(room, selectedDay, parseInt(selectedLesson)));
  }, [selectedDay, selectedLesson]);

  const handleReserve = (roomNumber: string) => {
    toast.success(`Kabinetas ${roomNumber} rezervuotas! (${selectedDay}, ${selectedLesson} pamoka)`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          localStorage.removeItem('teacher_logged_in');
          setIsLoggedIn(false);
          navigate('/');
        }}
      />

      <main className="container py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
          Mokytojo valdymo panelė
        </h1>
        <p className="text-muted-foreground mb-8">
          Pasirinkite dieną ir pamoką, kad rastumėte laisvus kabinetus
        </p>

        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Diena</label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_LIST.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Pamoka</label>
              <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LESSON_TIMES_LIST.map((time, i) => (
                    <SelectItem key={i} value={String(i + 1)}>
                      {i + 1} pamoka ({time.start}–{time.end})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <DoorOpen className="h-5 w-5 text-success" />
          Laisvi kabinetai ({freeRooms.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {freeRooms.map(room => (
            <div key={room.id} className="glass-card rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground">{room.number}</h3>
                <p className="text-sm text-muted-foreground">{room.type}</p>
              </div>
              <Button size="sm" onClick={() => handleReserve(room.number)} className="gap-1.5">
                <CalendarCheck className="h-4 w-4" />
                Rezervuoti
              </Button>
            </div>
          ))}
        </div>

        {freeRooms.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Pasirinktu laiku visi kabinetai užimti
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
