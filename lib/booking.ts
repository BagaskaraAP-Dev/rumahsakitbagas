export const doctors = [
  { id: 'nadia', name: 'dr. Nadia Putri', specialty: 'Dokter umum', category: 'umum', initials: 'NP', color: 'blue', description: 'Konsultasi awal & pemeriksaan rutin', slots: ['09:00', '10:00', '11:00'] },
  { id: 'arya', name: 'dr. Arya Wicaksono, Sp.JP', specialty: 'Spesialis jantung', category: 'jantung', initials: 'AW', color: 'green', description: 'Konsultasi kesehatan jantung', slots: ['10:00', '13:00', '15:00'] },
  { id: 'maya', name: 'dr. Maya Kirana, Sp.A', specialty: 'Spesialis anak', category: 'keluarga', initials: 'MK', color: 'peach', description: 'Kesehatan & tumbuh kembang anak', slots: ['09:00', '11:00', '14:00'] },
  { id: 'ratih', name: 'dr. Ratih Anindya, Sp.OG', specialty: 'Spesialis kandungan', category: 'keluarga', initials: 'RA', color: 'lilac', description: 'Konsultasi kesehatan ibu', slots: ['10:00', '12:00', '15:00'] },
];

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function bookingRange(now = new Date()) {
  const first = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const last = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30);
  return { min: dateKey(first), max: dateKey(last) };
}

export type BookingInput = { doctorId: string; alias: string; date: string; time: string };
export function validateBooking(input: BookingInput, now = new Date()): string | null {
  const doctor = doctors.find(d => d.id === input.doctorId);
  if (!doctor) return 'Pilih dokter yang tersedia.';
  if (input.alias.trim().length < 2 || input.alias.trim().length > 60) return 'Gunakan nama contoh sepanjang 2–60 karakter.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) return 'Pilih tanggal kunjungan.';
  const parsed = new Date(`${input.date}T12:00:00`);
  if (Number.isNaN(parsed.getTime()) || dateKey(parsed) !== input.date) return 'Tanggal kunjungan tidak valid.';
  const range = bookingRange(now);
  if (input.date < range.min || input.date > range.max) return 'Pilih tanggal mulai besok hingga 30 hari ke depan.';
  if (!doctor.slots.includes(input.time)) return 'Pilih salah satu jam yang tersedia untuk dokter ini.';
  return null;
}
