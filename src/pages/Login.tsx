import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    if (email && password) {
      localStorage.setItem('teacher_logged_in', 'true');
      toast.success('Sėkmingai prisijungta!');
      navigate('/dashboard');
    } else {
      toast.error('Užpildykite visus laukus');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container flex items-center justify-center py-20">
        <div className="glass-card rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
              Mokytojo prisijungimas
            </h1>
            <p className="text-sm text-muted-foreground">
              Prisijunkite, kad galėtumėte rezervuoti kabinetus
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">El. paštas</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="mokytojas@mokykla.lt"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Slaptažodis</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Prisijungti
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo: įveskite bet kokį el. paštą ir slaptažodį
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
