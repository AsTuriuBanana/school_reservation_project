import Navbar from '@/components/Navbar';
import { QrCode, Search, CalendarDays, LogIn } from 'lucide-react';

const features = [
  {
    icon: QrCode,
    title: 'QR kodo skenavimas',
    description: 'Kiekvienas kabinetas turi unikalų QR kodą. Nuskenaavę jį, iš karto matote to kabineto tvarkaraštį.',
  },
  {
    icon: Search,
    title: 'Paieška',
    description: 'Įveskite kabineto numerį arba žodį „laisva" ir raskite laisvus kabinetus akimirksniu.',
  },
  {
    icon: CalendarDays,
    title: 'Tvarkaraščiai',
    description: 'Peržiūrėkite visų mokyklos kabinetų užimtumą vienoje vietoje – patogu ir greita.',
  },
  {
    icon: LogIn,
    title: 'Mokytojų rezervacija',
    description: 'Prisijungę mokytojai gali rezervuoti laisvus kabinetus pasirinktu laiku.',
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-12 max-w-3xl">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          Apie sistemą
        </h1>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          Ši sistema skirta mokyklų kabinetų užimtumui sekti ir valdyti. 
          Ji leidžia greitai sužinoti, ar kabinetas laisvas, peržiūrėti tvarkaraščius 
          ir mokytojams rezervuoti patalpas.
        </p>

        <div className="grid gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="glass-card rounded-xl p-6 flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground mb-1">
                  {feature.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default About;
