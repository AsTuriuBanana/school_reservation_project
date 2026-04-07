import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { rooms as initialRooms, DAYS_LIST, LESSON_TIMES_LIST, Room, Lesson } from '@/data/mockData';
import { Plus, Pencil, Trash2, Users, CalendarDays, DoorOpen, Shield } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  active: boolean;
}

const MOCK_TEACHERS: Teacher[] = [
  { id: '1', name: 'J. Kazlauskienė', email: 'j.kazlauskiene@mokykla.lt', subject: 'Matematika', active: true },
  { id: '2', name: 'R. Petrauskas', email: 'r.petrauskas@mokykla.lt', subject: 'Fizika', active: true },
  { id: '3', name: 'A. Jonaitis', email: 'a.jonaitis@mokykla.lt', subject: 'Informatika', active: true },
  { id: '4', name: 'V. Stankevičienė', email: 'v.stankeviciene@mokykla.lt', subject: 'Lietuvių k.', active: false },
  { id: '5', name: 'D. Rimkus', email: 'd.rimkus@mokykla.lt', subject: 'Anglų k.', active: true },
];

const Admin = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const val = localStorage.getItem('teacher_logged_in') === 'true';
    if (!val) navigate('/login');
    return val;
  });

  const [managedRooms, setManagedRooms] = useState<Room[]>(() => [...initialRooms]);
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);

  // Room form
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomFloor, setNewRoomFloor] = useState('1');
  const [newRoomType, setNewRoomType] = useState('Klasė');

  // Teacher form
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('');

  // Schedule editing
  const [editRoom, setEditRoom] = useState<string>(initialRooms[0]?.id || '');
  const [editDay, setEditDay] = useState(DAYS_LIST[0]);
  const [editLessonSlot, setEditLessonSlot] = useState('1');
  const [editSubject, setEditSubject] = useState('');
  const [editTeacher, setEditTeacher] = useState('');
  const [editClass, setEditClass] = useState('');

  const selectedRoom = managedRooms.find(r => r.id === editRoom);
  const selectedDayLessons = selectedRoom?.schedule[editDay] || [];

  const handleAddRoom = () => {
    if (!newRoomNumber.trim()) {
      toast.error('Įveskite kabineto numerį');
      return;
    }
    if (managedRooms.some(r => r.number === newRoomNumber.trim())) {
      toast.error('Toks kabinetas jau egzistuoja');
      return;
    }
    const newRoom: Room = {
      id: newRoomNumber.trim(),
      number: newRoomNumber.trim(),
      floor: parseInt(newRoomFloor),
      type: newRoomType,
      schedule: Object.fromEntries(DAYS_LIST.map(d => [d, []])),
    };
    setManagedRooms(prev => [...prev, newRoom]);
    setNewRoomNumber('');
    toast.success(`Kabinetas ${newRoom.number} pridėtas!`);
  };

  const handleDeleteRoom = (roomId: string) => {
    setManagedRooms(prev => prev.filter(r => r.id !== roomId));
    toast.success('Kabinetas pašalintas');
  };

  const handleAddTeacher = () => {
    if (!newTeacherName.trim() || !newTeacherEmail.trim()) {
      toast.error('Užpildykite vardą ir el. paštą');
      return;
    }
    const teacher: Teacher = {
      id: String(Date.now()),
      name: newTeacherName.trim(),
      email: newTeacherEmail.trim(),
      subject: newTeacherSubject.trim(),
      active: true,
    };
    setTeachers(prev => [...prev, teacher]);
    setNewTeacherName('');
    setNewTeacherEmail('');
    setNewTeacherSubject('');
    toast.success(`Mokytojas ${teacher.name} pridėtas!`);
  };

  const handleToggleTeacher = (id: string) => {
    setTeachers(prev =>
      prev.map(t => t.id === id ? { ...t, active: !t.active } : t)
    );
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    toast.success('Mokytojas pašalintas');
  };

  const handleAddLesson = () => {
    if (!editSubject.trim() || !editTeacher.trim() || !editClass.trim()) {
      toast.error('Užpildykite visus pamokos laukus');
      return;
    }
    const slot = parseInt(editLessonSlot);
    const time = LESSON_TIMES_LIST[slot - 1];
    const newLesson: Lesson = {
      id: `${editDay}-${slot}-${Date.now()}`,
      lessonNumber: slot,
      timeStart: time.start,
      timeEnd: time.end,
      subject: editSubject.trim(),
      teacher: editTeacher.trim(),
      className: editClass.trim(),
    };

    setManagedRooms(prev =>
      prev.map(room => {
        if (room.id !== editRoom) return room;
        const dayLessons = room.schedule[editDay] || [];
        if (dayLessons.some(l => l.lessonNumber === slot)) {
          toast.error('Ši pamokos vieta jau užimta');
          return room;
        }
        return {
          ...room,
          schedule: {
            ...room.schedule,
            [editDay]: [...dayLessons, newLesson].sort((a, b) => a.lessonNumber - b.lessonNumber),
          },
        };
      })
    );
    setEditSubject('');
    setEditTeacher('');
    setEditClass('');
    toast.success('Pamoka pridėta!');
  };

  const handleDeleteLesson = (lessonId: string) => {
    setManagedRooms(prev =>
      prev.map(room => {
        if (room.id !== editRoom) return room;
        return {
          ...room,
          schedule: {
            ...room.schedule,
            [editDay]: (room.schedule[editDay] || []).filter(l => l.id !== lessonId),
          },
        };
      })
    );
    toast.success('Pamoka pašalinta');
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
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-7 w-7 text-primary" />
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Administratoriaus panelė
          </h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Valdykite tvarkaraščius, kabinetus ir mokytojų paskyras
        </p>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="schedule" className="gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Tvarkaraščiai</span>
            </TabsTrigger>
            <TabsTrigger value="rooms" className="gap-1.5">
              <DoorOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Kabinetai</span>
            </TabsTrigger>
            <TabsTrigger value="teachers" className="gap-1.5">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Mokytojai</span>
            </TabsTrigger>
          </TabsList>

          {/* ===== SCHEDULE TAB ===== */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-heading text-xl font-semibold mb-4">Redaguoti tvarkaraštį</h2>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="space-y-2">
                  <Label>Kabinetas</Label>
                  <Select value={editRoom} onValueChange={setEditRoom}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {managedRooms.map(r => (
                        <SelectItem key={r.id} value={r.id}>{r.number}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Diena</Label>
                  <Select value={editDay} onValueChange={setEditDay}>
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_LIST.map(d => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Current lessons table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Laikas</TableHead>
                    <TableHead>Dalykas</TableHead>
                    <TableHead>Mokytojas</TableHead>
                    <TableHead>Klasė</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LESSON_TIMES_LIST.map((time, i) => {
                    const lesson = selectedDayLessons.find(l => l.lessonNumber === i + 1);
                    return (
                      <TableRow key={i} className={lesson ? '' : 'opacity-50'}>
                        <TableCell className="font-medium">{i + 1}</TableCell>
                        <TableCell>{time.start}–{time.end}</TableCell>
                        <TableCell>{lesson?.subject || '—'}</TableCell>
                        <TableCell>{lesson?.teacher || '—'}</TableCell>
                        <TableCell>{lesson?.className || '—'}</TableCell>
                        <TableCell>
                          {lesson && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Add lesson form */}
              <div className="mt-6 border-t border-border pt-6">
                <h3 className="font-medium text-foreground mb-4">Pridėti pamoką</h3>
                <div className="flex flex-wrap gap-3 items-end">
                  <div className="space-y-1">
                    <Label className="text-xs">Pamoka</Label>
                    <Select value={editLessonSlot} onValueChange={setEditLessonSlot}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LESSON_TIMES_LIST.map((t, i) => (
                          <SelectItem key={i} value={String(i + 1)}>
                            {i + 1} ({t.start})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Dalykas</Label>
                    <Input
                      value={editSubject}
                      onChange={e => setEditSubject(e.target.value)}
                      placeholder="Matematika"
                      className="w-36"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Mokytojas</Label>
                    <Input
                      value={editTeacher}
                      onChange={e => setEditTeacher(e.target.value)}
                      placeholder="V. Pavardė"
                      className="w-36"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Klasė</Label>
                    <Input
                      value={editClass}
                      onChange={e => setEditClass(e.target.value)}
                      placeholder="8a"
                      className="w-24"
                    />
                  </div>
                  <Button onClick={handleAddLesson} className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Pridėti
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ===== ROOMS TAB ===== */}
          <TabsContent value="rooms" className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-heading text-xl font-semibold mb-4">Pridėti naują kabinetą</h2>
              <div className="flex flex-wrap gap-3 items-end">
                <div className="space-y-1">
                  <Label className="text-xs">Numeris</Label>
                  <Input
                    value={newRoomNumber}
                    onChange={e => setNewRoomNumber(e.target.value)}
                    placeholder="305"
                    className="w-28"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Aukštas</Label>
                  <Select value={newRoomFloor} onValueChange={setNewRoomFloor}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map(f => (
                        <SelectItem key={f} value={String(f)}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tipas</Label>
                  <Select value={newRoomType} onValueChange={setNewRoomType}>
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['Klasė', 'Laboratorija', 'Kompiuterių klasė', 'Sporto salė', 'Aktų salė'].map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddRoom} className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Pridėti
                </Button>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-heading text-xl font-semibold mb-4">
                Visi kabinetai ({managedRooms.length})
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numeris</TableHead>
                    <TableHead>Aukštas</TableHead>
                    <TableHead>Tipas</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {managedRooms.map(room => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.number}</TableCell>
                      <TableCell>{room.floor}</TableCell>
                      <TableCell>{room.type}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRoom(room.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ===== TEACHERS TAB ===== */}
          <TabsContent value="teachers" className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-heading text-xl font-semibold mb-4">Pridėti mokytoją</h2>
              <div className="flex flex-wrap gap-3 items-end">
                <div className="space-y-1">
                  <Label className="text-xs">Vardas, pavardė</Label>
                  <Input
                    value={newTeacherName}
                    onChange={e => setNewTeacherName(e.target.value)}
                    placeholder="V. Pavardenis"
                    className="w-44"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">El. paštas</Label>
                  <Input
                    value={newTeacherEmail}
                    onChange={e => setNewTeacherEmail(e.target.value)}
                    placeholder="vardas@mokykla.lt"
                    className="w-48"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Dalykas</Label>
                  <Input
                    value={newTeacherSubject}
                    onChange={e => setNewTeacherSubject(e.target.value)}
                    placeholder="Matematika"
                    className="w-36"
                  />
                </div>
                <Button onClick={handleAddTeacher} className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Pridėti
                </Button>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-heading text-xl font-semibold mb-4">
                Mokytojų sąrašas ({teachers.length})
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vardas</TableHead>
                    <TableHead>El. paštas</TableHead>
                    <TableHead>Dalykas</TableHead>
                    <TableHead>Būsena</TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map(teacher => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell className="text-muted-foreground">{teacher.email}</TableCell>
                      <TableCell>{teacher.subject}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            teacher.active
                              ? 'bg-success/10 text-success'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {teacher.active ? 'Aktyvus' : 'Neaktyvus'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleTeacher(teacher.id)}
                            className="h-8 w-8"
                            title={teacher.active ? 'Deaktyvuoti' : 'Aktyvuoti'}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTeacher(teacher.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
