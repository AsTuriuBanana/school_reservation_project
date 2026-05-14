import { Room, LESSON_TIMES_LIST, DAYS_LIST, getCurrentDayName, getCurrentLessonNumber } from '@/data/mockData';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ScheduleTableProps {
  room: Room;
}

const ScheduleTable = ({ room }: ScheduleTableProps) => {
  const currentDay = getCurrentDayName();
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const currentLesson = getCurrentLessonNumber();
  const lessons = room.schedule[selectedDay] || [];

  return (
    <div>
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {DAYS_LIST.map(day => (
          <Button
            key={day}
            variant={selectedDay === day ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDay(day)}
            className="text-xs"
          >
            {day.slice(0, 3)}
          </Button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-3 font-heading font-semibold text-muted-foreground">Nr.</th>
              <th className="text-left py-3 px-3 font-heading font-semibold text-muted-foreground">Laikas</th>
              <th className="text-left py-3 px-3 font-heading font-semibold text-muted-foreground">Dalykas</th>
              <th className="text-left py-3 px-3 font-heading font-semibold text-muted-foreground">Mokytojas</th>
              <th className="text-left py-3 px-3 font-heading font-semibold text-muted-foreground">Klasė</th>
              <th className="text-left py-3 px-3 font-heading font-semibold text-muted-foreground">Būsena</th>
            </tr>
          </thead>
          <tbody>
            {LESSON_TIMES_LIST.map((time, index) => {
              const lesson = lessons.find(l => l.lessonNumber === index + 1);
              const isCurrentSlot = selectedDay === currentDay && currentLesson === index + 1;
              const isFree = !lesson;

              return (
                <tr
                  key={index}
                  className={`border-b border-border/50 transition-colors ${
                    isCurrentSlot ? 'bg-primary/5 ring-1 ring-primary/20 rounded' : 'hover:bg-muted/30'
                  }`}
                >
                  <td className="py-3 px-3 font-medium">{index + 1}</td>
                  <td className="py-3 px-3 text-muted-foreground font-mono text-xs">
                    {time.start}–{time.end}
                  </td>
                  <td className="py-3 px-3 font-medium">
                    {lesson ? lesson.subject : '—'}
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">
                    {lesson ? lesson.teacher : '—'}
                  </td>
                  <td className="py-3 px-3">
                    {lesson ? (
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {lesson.className}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                      isFree ? 'status-free' : 'status-occupied'
                    }`}>
                      {isFree ? '🟢 Laisva' : '🔴 Užimta'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;
