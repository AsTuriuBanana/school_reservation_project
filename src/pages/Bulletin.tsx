import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { fetchBulletinMessages, addBulletinMessage, deleteBulletinMessage, BulletinMessage } from '@/lib/api';
import { MessageSquare, Trash2, Send } from 'lucide-react';

const Bulletin = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const val = localStorage.getItem('teacher_logged_in') === 'true';
    if (!val) navigate('/login');
    return val;
  });

  const [messages, setMessages] = useState<BulletinMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchBulletinMessages().then(setMessages);
  }, []);

  const handlePost = async () => {
    if (!newMessage.trim()) { toast.error('Parašykite žinutę'); return; }
    const author = localStorage.getItem('teacher_name') || 'Mokytojas';
    try {
      const created = await addBulletinMessage(author, newMessage.trim());
      if (created) setMessages(prev => [created as BulletinMessage, ...prev]);
      setNewMessage('');
      toast.success('Žinutė paskelbta!');
    } catch { toast.error('Nepavyko paskelbti'); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBulletinMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      toast.success('Žinutė pašalinta');
    } catch { toast.error('Nepavyko pašalinti'); }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('lt-LT', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} onLogout={() => { localStorage.removeItem('teacher_logged_in'); setIsLoggedIn(false); navigate('/'); }} />
      <main className="container py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="h-7 w-7 text-primary" />
          <h1 className="font-heading text-3xl font-bold text-foreground">Bendra lentelė</h1>
        </div>
        <p className="text-muted-foreground mb-8">Palikite žinutę kitiems mokytojams</p>

        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="font-heading text-lg font-semibold mb-3">Nauja žinutė</h2>
          <Textarea placeholder="Rašykite žinutę..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} rows={3} className="mb-3" />
          <Button onClick={handlePost} className="gap-1.5"><Send className="h-4 w-4" /> Paskelbti</Button>
        </div>

        <div className="space-y-4">
          {messages.length === 0 && <div className="text-center py-12 text-muted-foreground">Kol kas nėra žinučių.</div>}
          {messages.map(msg => (
            <div key={msg.id} className="glass-card rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{msg.author}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(msg.created_at)}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(msg.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-foreground whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Bulletin;
