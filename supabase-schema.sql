-- Run this in Supabase SQL Editor

-- 1. Rooms table
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  floor INTEGER NOT NULL,
  type TEXT NOT NULL DEFAULT 'Klasė',
  subject TEXT,
  schedule JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Teachers table
CREATE TABLE teachers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bulletin messages
CREATE TABLE bulletin_messages (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Reservations
CREATE TABLE reservations (
  id TEXT PRIMARY KEY,
  room TEXT NOT NULL,
  day TEXT NOT NULL,
  lesson INTEGER NOT NULL,
  comment TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable RLS (Row Level Security)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulletin_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- 6. Policies — public access for now (auth will be added later)
CREATE POLICY "rooms_read_all" ON rooms FOR SELECT USING (true);
CREATE POLICY "rooms_insert_all" ON rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "rooms_update_all" ON rooms FOR UPDATE USING (true);
CREATE POLICY "rooms_delete_all" ON rooms FOR DELETE USING (true);

CREATE POLICY "teachers_read_all" ON teachers FOR SELECT USING (true);
CREATE POLICY "teachers_insert_all" ON teachers FOR INSERT WITH CHECK (true);
CREATE POLICY "teachers_update_all" ON teachers FOR UPDATE USING (true);
CREATE POLICY "teachers_delete_all" ON teachers FOR DELETE USING (true);

CREATE POLICY "bulletin_read_all" ON bulletin_messages FOR SELECT USING (true);
CREATE POLICY "bulletin_insert_all" ON bulletin_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "bulletin_delete_all" ON bulletin_messages FOR DELETE USING (true);

CREATE POLICY "reservations_read_all" ON reservations FOR SELECT USING (true);
CREATE POLICY "reservations_insert_all" ON reservations FOR INSERT WITH CHECK (true);

-- 7. Seed initial rooms (your rooms with subjects)
INSERT INTO rooms (id, number, floor, type, subject, schedule) VALUES
('101','101',1,'Klasė','Matematika','{}'),
('102','102',1,'Klasė','Anglų kalba','{}'),
('103','103',1,'Klasė','Vokiečių kalba','{}'),
('105','105',1,'Klasė','Matematika','{}'),
('106','106',1,'Klasė','Anglų kalba','{}'),
('110','110',1,'Klasė','Matematika','{}'),
('115','115',1,'Klasė','Matematika','{}'),
('121','121',1,'Klasė','Muzika','{}'),
('201','201',2,'Klasė','Lietuvių kalba','{}'),
('202','202',2,'Klasė','Matematika','{}'),
('203','203',2,'Klasė','Matematika','{}'),
('204','204',2,'Klasė','Istorija','{}'),
('205','205',2,'Klasė','Tikyba','{}'),
('207','207',2,'Klasė','Lietuvių kalba','{}'),
('209','209',2,'Klasė','Chemija','{}'),
('210','210',2,'Klasė','Ekonomika','{}'),
('211','211',2,'Klasė','Dailė/technologijos','{}'),
('212','212',2,'Klasė','Lietuvių kalba','{}'),
('214','214',2,'Klasė','Lietuvių kalba','{}'),
('217','217',2,'Klasė','Rusų kalba','{}'),
('302','302',3,'Klasė','Biologija','{}'),
('303','303',3,'Klasė','Anglų kalba','{}'),
('305','305',3,'Klasė','Geografija','{}'),
('306','306',3,'Klasė','Biologija','{}'),
('308','308',3,'Klasė','Chemija','{}'),
('309','309',3,'Klasė','Dailė','{}'),
('310','310',3,'Klasė','Anglų kalba','{}'),
('312','312',3,'Klasė','Anglų kalba','{}'),
('313','313',3,'Klasė','IT','{}'),
('314','314',3,'Klasė','Technologijos','{}'),
('315','315',3,'Klasė','Fizika','{}');

-- Seed default teachers
INSERT INTO teachers (id, name, email, subject, active) VALUES
('1','J. Kazlauskienė','j.kazlauskiene@mokykla.lt','Matematika',true),
('2','R. Petrauskas','r.petrauskas@mokykla.lt','Fizika',true),
('3','A. Jonaitis','a.jonaitis@mokykla.lt','Informatika',true),
('4','V. Stankevičienė','v.stankeviciene@mokykla.lt','Lietuvių k.',false),
('5','D. Rimkus','d.rimkus@mokykla.lt','Anglų k.',true);
