import { Link, useNavigate } from 'react-router-dom';
import { Home, Info, CalendarDays, LogIn, Search, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface NavbarProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Navbar = ({ isLoggedIn = false, onLogout }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/90 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary transition-colors hover:text-primary/80">
            <Home className="h-5 w-5" />
            <span className="hidden sm:inline">Kabinetai</span>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="flex flex-1 max-w-md items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder='Ieškoti kabineto ar "laisva"...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/50 border-border/50"
            />
          </div>
        </form>

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/about" className="gap-1.5">
              <Info className="h-4 w-4" />
              <span className="hidden md:inline">Apie</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden md:inline">Tvarkaraščiai</span>
            </Link>
          </Button>
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard" className="gap-1.5">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Valdymas</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin" className="gap-1.5">
                  <Shield className="h-4 w-4" />
                  <span className="hidden md:inline">Admin</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout}>
                Atsijungti
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link to="/login" className="gap-1.5">
                <LogIn className="h-4 w-4" />
                <span className="hidden md:inline">Prisijungti</span>
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
