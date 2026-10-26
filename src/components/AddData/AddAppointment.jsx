import { useContext, useState } from "react";
import DatesContext from "../../context/DatesContext";
import InteractiveContext from "../../context/InteractiveContext";
import { useModalActions } from "../../context/ContextHooks/ModalContext";

// Server integration point: replace this adapter once appointment routes exist.
// The form intentionally never claims that a draft was persisted.
export const createAppointment = async (payload) => {
  throw new Error("Appointment API is not connected yet.");
};

const toLocalDateTime = (value) => {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const AddAppointment = () => {
  const { string } = useContext(DatesContext);
  const { setType, setAddNewEvent } = useContext(InteractiveContext);
  const { closeModal } = useModalActions();
  const initial = new Date(string);
  const start = Number.isFinite(initial.getTime()) ? initial : new Date();
  start.setHours(9, 0, 0, 0);
  const end = new Date(start.getTime() + 30 * 60000);
  const [form, setForm] = useState({
    title: "", description: "", start: toLocalDateTime(start), end: toLocalDateTime(end),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    location: "", meetingUrl: "", attendees: "", organizer: "", contact: "",
    status: "confirmed", visibility: "private", reminderMinutes: "30",
    recurrence: "none", notes: ""
  });
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const update = (key, value) => { setForm((prev) => ({ ...prev, [key]: value })); setPreview(null); setError(""); };
  const buildAppointmentPayload = () => ({
    title: form.title.trim(), description: form.description.trim(),
    startTime: new Date(form.start).toISOString(), endTime: new Date(form.end).toISOString(),
    timezone: form.timezone, location: form.location.trim(), meetingUrl: form.meetingUrl.trim(),
    attendees: form.attendees.split(/[\n,;]/).map((s) => s.trim()).filter(Boolean),
    organizer: form.organizer.trim(), contact: form.contact.trim(),
    status: form.status, visibility: form.visibility,
    reminderMinutes: Number(form.reminderMinutes), recurrence: form.recurrence, notes: form.notes.trim()
  });
  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Appointment title is required.");
    const from = new Date(form.start), to = new Date(form.end);
    if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || to <= from) return setError("End time must be later than start time.");
    if (form.meetingUrl) {
      try { const url = new URL(form.meetingUrl); if (!["https:", "http:"].includes(url.protocol)) throw new Error(); }
      catch { return setError("Enter a valid meeting URL."); }
    }
    setPreview(buildAppointmentPayload());
  };
  const input = "w-full rounded-xl border border-current/20 bg-transparent px-3 py-2 text-sm";
  const field = (label, key, type = "text", required = false) => <label className="block text-sm space-y-1" key={key}><span>{label}</span><input className={input} type={type} required={required} value={form[key]} onChange={(e) => update(key, e.target.value)} /></label>;
  return <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
    <h2 className="text-2xl font-semibold mb-1">New appointment</h2>
    <p className="text-sm opacity-60 mb-6">Prepare an appointment. Server saving is not connected yet.</p>
    <form onSubmit={submit} className="space-y-5">
      {field("Appointment title", "title", "text", true)}
      <div className="grid sm:grid-cols-2 gap-3">{field("Start", "start", "datetime-local", true)}{field("End", "end", "datetime-local", true)}</div>
      <p className="text-xs opacity-60">Time zone: {form.timezone}</p>
      <div className="grid sm:grid-cols-2 gap-3">{field("Location", "location")}{field("Meeting link", "meetingUrl", "url")}</div>
      <div className="grid sm:grid-cols-2 gap-3">{field("Organizer", "organizer")}{field("Contact", "contact")}</div>
      <label className="block text-sm space-y-1"><span>Attendees (emails or names, separated by commas)</span><textarea className={input} rows={2} value={form.attendees} onChange={(e) => update("attendees", e.target.value)} /></label>
      <label className="block text-sm space-y-1"><span>Description / agenda</span><textarea className={input} rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} /></label>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block text-sm space-y-1"><span>Status</span><select className={input} value={form.status} onChange={(e) => update("status", e.target.value)}><option value="confirmed">Confirmed</option><option value="tentative">Tentative</option><option value="cancelled">Cancelled</option></select></label>
        <label className="block text-sm space-y-1"><span>Visibility</span><select className={input} value={form.visibility} onChange={(e) => update("visibility", e.target.value)}><option value="private">Private</option><option value="public">Public</option></select></label>
        <label className="block text-sm space-y-1"><span>Reminder</span><select className={input} value={form.reminderMinutes} onChange={(e) => update("reminderMinutes", e.target.value)}><option value="0">At start</option><option value="5">5 minutes before</option><option value="15">15 minutes before</option><option value="30">30 minutes before</option><option value="60">1 hour before</option><option value="1440">1 day before</option></select></label>
        <label className="block text-sm space-y-1"><span>Repeat</span><select className={input} value={form.recurrence} onChange={(e) => update("recurrence", e.target.value)}><option value="none">Does not repeat</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select></label>
      </div>
      <label className="block text-sm space-y-1"><span>Internal notes</span><textarea className={input} rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)} /></label>
      {error && <p role="alert" className="text-red-500 text-sm">{error}</p>}
      {preview && <div className="rounded-xl border border-current/20 p-4"><p className="font-semibold">Appointment draft ready</p><p className="text-xs opacity-60 mt-1">Validated payload available for future API integration. Nothing has been saved or sent.</p><pre className="text-xs overflow-auto mt-3 max-h-48">{JSON.stringify(preview, null, 2)}</pre></div>}
      <div className="flex gap-3"><button type="button" onClick={() => { setType(null); setAddNewEvent(false); closeModal(); }} className="rounded-xl border px-4 py-2">Cancel</button><button type="submit" className="rounded-xl bg-cyan-600 text-white px-5 py-2">Prepare appointment</button></div>
    </form>
  </div>;
};

export default AddAppointment;
