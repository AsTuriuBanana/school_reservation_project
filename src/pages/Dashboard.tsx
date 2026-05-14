import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Room, DAYS_LIST, LESSON_TIMES_LIST, isRoomFreeAt } from '@/data/mockData';
import { fetchRooms, addReservation } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CalendarCheck, DoorOpen } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const val = localStorage.getItem('teacher_logged_in') === 'true';
    if (!val) navigate('/login');
    return val;
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms().then(data => { setRooms(data); setLoading(false); });
  }, []);

  const [selectedDay, setSelectedDay] = useState(DAYS_LIST[0]);
  const [selectedLesson, setSelectedLesson] = useState('1');
  const [reservingRoom, setReservingRoom] = useState<string | null>(null);
  const [reserveComment, setReserveComment] = useState('');

  const freeRooms = useMemo(() => {
    return rooms.filter(room => isRoomFreeAt(room, selectedDay, parseInt(selectedLesson)));
  }, [rooms, selectedDay, selectedLesson]);

  const handleReserve = (roomNumber: string) => {
    setReservingRoom(roomNumber);
    setReserveComment('');
  };

  const confirmReserve = async () => {
    if (!reservingRoom) return;
    try {
      await addReservation({
        room: reservingRoom,
        day: selectedDay,
        lesson: parseInt(selectedLesson),
        comment: reserveComment,
      });
      toast.success(`Kabinetas ${reservingRoom} rezervuotas! (${selectedDay}, ${selectedLesson} pamoka)`);
    } catch {
      toast.error('Nepavyko rezervuoti');
    }
    setReservingRoom(null);
    setReserveComment('');
  };

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} onLogout={() => { localStorage.removeItem('teacher_logged_in'); setIsLoggedIn(false); navigate('/'); }} />
      <main className="container py-20 text-center text-muted-foreground">Kraunama...</main>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} onLogout={() => { localStorage.removeItem('teacher_logged_in'); setIsLoggedIn(false); navigate('/'); }} />
      <main className="container py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Mokytojo valdymo panelė</h1>
        <p className="text-muted-foreground mb-8">Pasirinkite dieną ir pamoką, kad rastumėte laisvus kabinetus</p>

        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Diena</label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>{DAYS_LIST.map(day => (<SelectItem key={day} value={day}>{day}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Pamoka</label>
              <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>{LESSON_TIMES_LIST.map((time, i) => (<SelectItem key={i} value={String(i + 1)}>{i + 1} pamoka ({time.start}–{time.end})</SelectItem>))}</SelectContent>
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
                {room.subject && <p className="text-xs font-medium text-primary mt-0.5">{room.subject}</p>}
              </div>
              <Button size="sm" onClick={() => handleReserve(room.number)} className="gap-1.5">
                <CalendarCheck className="h-4 w-4" /> Rezervuoti
              </Button>
            </div>
          ))}
        </div>

        {freeRooms.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Pasirinktu laiku visi kabinetai užimti</div>
        )}
      </main>

      <Dialog open={!!reservingRoom} onOpenChange={(open) => { if (!open) setReservingRoom(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rezervuoti kabinetą {reservingRoom}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">{selectedDay}, {selectedLesson} pamoka</p>
          <div className="space-y-2">
            <label className="text-sm font-medium">Komentaras (neprivaloma)</label>
            <Textarea placeholder="PVz.: 2B klasės testas..." value={reserveComment} onChange={(e) => setReserveComment(e.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReservingRoom(null)}>Atšaukti</Button>
            <Button onClick={confirmReserve} className="gap-1.5"><CalendarCheck className="h-4 w-4" /> Rezervuoti</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
