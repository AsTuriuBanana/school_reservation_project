import { Link } from 'react-router-dom';
import { Room, isRoomFreeNow } from '@/data/mockData';
import { DoorOpen, DoorClosed } from 'lucide-react';

interface RoomCardProps {
  room: Room;
}

const RoomCard = ({ room }: RoomCardProps) => {
  const isFree = isRoomFreeNow(room);

  return (
    <Link
      to={`/room/${room.id}`}
      className="group glass-card rounded-xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-heading text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
            {room.number}
          </h3>
          <p className="text-sm text-muted-foreground">{room.type} · {room.floor} aukštas</p>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${isFree ? 'status-free' : 'status-occupied'}`}>
          {isFree ? <DoorOpen className="h-3.5 w-3.5" /> : <DoorClosed className="h-3.5 w-3.5" />}
          {isFree ? 'Laisva' : 'Užimta'}
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;
