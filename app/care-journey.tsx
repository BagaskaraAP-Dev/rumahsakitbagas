'use client';
import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowUpRight, CalendarDays, Check, Clock3, Info, Stethoscope, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { bookingRange, doctors, validateBooking, type BookingInput } from '@/lib/booking';

const categories = [{ id: 'semua', label: 'Semua dokter' }, { id: 'umum', label: 'Umum' }, { id: 'jantung', label: 'Jantung' }, { id: 'keluarga', label: 'Ibu & anak' }];
type ModelTool = { name: string; title: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean }; execute: (input: unknown) => unknown };

export default function CareJourney() {
  const [tab, setTab] = useState('semua');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<BookingInput>({ doctorId: 'nadia', alias: '', date: '', time: '' });
  const [range, setRange] = useState({ min: '', max: '' });
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const doctor = doctors.find(d => d.id === form.doctorId) ?? doctors[0];
  const startBooking = useCallback((doctorId = 'nadia') => {
    if (!doctors.some(d => d.id === doctorId)) throw new Error('Dokter tidak ditemukan.');
    const nextRange = bookingRange();
    setRange(nextRange); setForm({ doctorId, alias: '', date: nextRange.min, time: '' }); setError(''); setComplete(false); setOpen(true);
  }, []);
  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: ModelTool, options: { signal: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tools: ModelTool[] = [
      { name: 'list_demo_doctors', title: 'Lihat dokter contoh', description: 'Daftar profil dokter ilustrasi dan jam simulasi. Bukan ketersediaan medis nyata.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: () => ({ demo: true, doctors }) },
      { name: 'start_appointment_simulation', title: 'Buka simulasi janji temu', description: 'Membuka formulir simulasi untuk dokter contoh. Tidak membuat atau mengirim janji temu.', inputSchema: { type: 'object', properties: { doctorId: { type: 'string', enum: doctors.map(d => d.id) } }, required: ['doctorId'], additionalProperties: false }, annotations: { readOnlyHint: false }, execute: input => {
        if (!input || typeof input !== 'object' || !('doctorId' in input) || typeof input.doctorId !== 'string' || !doctors.some(d => d.id === input.doctorId)) throw new Error('doctorId tidak valid.');
        const id = input.doctorId;
        flushSync(() => startBooking(id));
        return { demo: true, status: 'form_opened', doctorId: id, appointmentCreated: false };
      } },
    ];
    for (const tool of tools) { try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); } catch { /* Optional browser capability. */ } }
    return () => lifecycle.abort();
  }, [startBooking]);

  function changeDoctor(id: string) { setForm(f => ({ ...f, doctorId: id, time: '' })); setError(''); }
  function submit(e: React.SubmitEvent<HTMLFormElement>) { e.preventDefault(); const issue = validateBooking(form); if (issue) { setError(issue); return; } setError(''); setComplete(true); }
  const formattedDate = form.date ? new Date(`${form.date}T12:00:00`).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
  return <>
    <section id="dokter" className="section doctors-section wrap">
      <div className="section-head"><div><div className="eyebrow">DOKTER KAMI</div><h2>Keahlian yang merawat.<br /><span>Perhatian yang menguatkan.</span></h2></div><span className="example-label"><Info size={14} /> Profil dokter ilustrasi</span></div>
      <Tabs value={tab} onValueChange={value => setTab(String(value))}>
        <TabsList className="doctor-tabs" aria-label="Pilih bidang dokter">{categories.map(c => <TabsTrigger key={c.id} value={c.id}>{c.label}</TabsTrigger>)}</TabsList>
        {categories.map(category => <TabsContent key={category.id} value={category.id}><div className="doctor-grid">{doctors.filter(d => category.id === 'semua' || d.category === category.id).map(d => <article className="doctor-card" key={d.id}>
          <div className={`doctor-avatar ${d.color}`} aria-hidden="true">{d.initials}<span><Stethoscope size={14} /></span></div><div className="doctor-info"><span className="doctor-specialty">{d.specialty}</span><h3>{d.name}</h3><p>{d.description}</p><button onClick={() => startBooking(d.id)} className="schedule-link">Lihat jadwal contoh <ArrowUpRight size={17} /></button></div>
        </article>)}</div></TabsContent>)}
      </Tabs>
    </section>
    <section className="visit-banner wrap" id="janji-temu"><div><div className="eyebrow">LANGKAH KECIL, ARTI BESAR</div><h2>Mulai perjalanan<br />sehat Anda.</h2><p>Pilih dokter dan waktu yang nyaman untuk Anda.</p></div><div className="visit-action"><button className="button button-white" onClick={() => startBooking()}>Coba buat janji temu <ArrowUpRight size={20} /></button><span>Simulasi • Tidak mengirim pendaftaran</span></div></section>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="booking-dialog" showCloseButton={false}>
        <DialogClose className="dialog-close" aria-label="Tutup simulasi janji temu"><X size={20} /></DialogClose>
        <DialogHeader><span className="eyebrow">RS BAGAS · SIMULASI</span><DialogTitle className="booking-title">{complete ? 'Simulasi selesai.' : 'Waktu untuk kesehatan Anda.'}</DialogTitle><DialogDescription className="booking-description">{complete ? 'Berikut ringkasan pilihan kunjungan Anda.' : 'Coba alur janji temu menggunakan nama contoh. Formulir ini tidak dikirim ke rumah sakit.'}</DialogDescription></DialogHeader>
        {complete ? <div className="booking-success"><span className="success-icon"><Check size={28} /></span><h3>Terima kasih, {form.alias.trim()}.</h3><dl><div><dt>Dokter</dt><dd>{doctor.name}</dd></div><div><dt>Tanggal</dt><dd>{formattedDate}</dd></div><div><dt>Jam</dt><dd>{form.time} WIB</dd></div></dl><p className="demo-notice"><Info size={18} /> Ini hanya simulasi, bukan bukti janji temu. Data tidak disimpan atau dikirim.</p><button className="button button-blue full-width" onClick={() => { setComplete(false); setForm(f => ({ ...f, alias: '', time: '' })); }}>Coba jadwal lain <ArrowUpRight size={18} /></button></div> :
          <form className="booking-form" onSubmit={submit}>
            <div className="form-field"><label htmlFor="booking-doctor">Dokter</label><Select value={form.doctorId} onValueChange={value => { if (value) changeDoctor(String(value)); }} items={doctors.map(d => ({ value: d.id, label: d.name }))}><SelectTrigger id="booking-doctor" className="form-select"><SelectValue /></SelectTrigger><SelectContent className="booking-select-menu">{doctors.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="form-field"><label htmlFor="booking-alias">Nama panggilan contoh</label><Input id="booking-alias" placeholder="Misalnya: Budi" required minLength={2} maxLength={60} value={form.alias} onChange={e => setForm(f => ({ ...f, alias: e.target.value }))} autoComplete="off" className="form-input" /></div>
            <div className="form-field"><label htmlFor="booking-date"><CalendarDays size={15} /> Tanggal kunjungan</label><Input id="booking-date" type="date" required min={range.min} max={range.max} value={form.date} onChange={e => { setForm(f => ({ ...f, date: e.target.value })); setError(''); }} className="form-input" /><small>Jadwal contoh tersedia mulai besok hingga 30 hari ke depan.</small></div>
            <fieldset className="form-field"><legend><Clock3 size={15} /> Pilih jam (WIB)</legend><RadioGroup value={form.time} onValueChange={value => { setForm(f => ({ ...f, time: String(value) })); setError(''); }} className="time-options" aria-label="Jam kunjungan contoh">{doctor.slots.map(time => <label className={`time-option ${form.time === time ? 'selected' : ''}`} key={time}><RadioGroupItem value={time} />{time}</label>)}</RadioGroup></fieldset>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit" className="button button-blue full-width">Lihat ringkasan simulasi <ArrowUpRight size={18} /></button>
          </form>}
      </DialogContent>
    </Dialog>
  </>;
}
