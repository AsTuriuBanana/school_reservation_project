import { supabase } from './supabase'
import type { Room, Lesson } from '@/data/mockData'
import { DAYS_LIST } from '@/data/mockData'

// ===== ROOMS =====
export async function fetchRooms(): Promise<Room[]> {
  const { data } = await supabase.from('rooms').select('*')
  return (data || []).map(r => ({
    ...r,
    schedule: typeof r.schedule === 'string' ? JSON.parse(r.schedule) : r.schedule,
  }))
}

export async function saveRooms(rooms: Room[]) {
  const payload = rooms.map(r => ({
    id: r.id,
    number: r.number,
    floor: r.floor,
    type: r.type,
    subject: r.subject || null,
    schedule: JSON.stringify(r.schedule),
  }))
  const { error: delErr } = await supabase.from('rooms').delete().neq('id', '')
  if (delErr) throw delErr
  if (payload.length) {
    const { error: insErr } = await supabase.from('rooms').insert(payload)
    if (insErr) throw insErr
  }
}

// ===== TEACHERS =====
export interface Teacher {
  id: string
  name: string
  email: string
  subject: string
  active: boolean
}

export async function fetchTeachers(): Promise<Teacher[]> {
  const { data } = await supabase.from('teachers').select('*')
  return data || []
}

export async function saveTeachers(teachers: Teacher[]) {
  const { error: delErr } = await supabase.from('teachers').delete().neq('id', '')
  if (delErr) throw delErr
  if (teachers.length) {
    const { error: insErr } = await supabase.from('teachers').insert(teachers)
    if (insErr) throw insErr
  }
}

// ===== BULLETIN =====
export interface BulletinMessage {
  id: string
  author: string
  content: string
  created_at: string
}

export async function fetchBulletinMessages(): Promise<BulletinMessage[]> {
  const { data } = await supabase
    .from('bulletin_messages')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export async function addBulletinMessage(author: string, content: string) {
  const { data } = await supabase
    .from('bulletin_messages')
    .insert({ id: Date.now().toString(), author, content })
    .select()
    .single()
  return data
}

export async function deleteBulletinMessage(id: string) {
  await supabase.from('bulletin_messages').delete().eq('id', id)
}

// ===== RESERVATIONS =====
export interface Reservation {
  id: string
  room: string
  day: string
  lesson: number
  comment: string
  created_at: string
}

export async function addReservation(res: Omit<Reservation, 'id' | 'created_at'>) {
  const { data } = await supabase
    .from('reservations')
    .insert({ id: Date.now().toString(), ...res })
    .select()
    .single()
  return data
}
