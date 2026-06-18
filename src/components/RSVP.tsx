import { AnimatePresence, motion } from 'framer-motion';
import { type FormEvent, useState } from 'react';
import type { RSVPFormData } from '../types';
import ScrollReveal from './ScrollReveal';
import SectionDivider from './SectionDivider';
import { scrollRevealMotion } from '../utils/motion';

interface RSVPProps {
  dueDate: string;
}

const initialForm: RSVPFormData = {
  name: '',
  email: '',
  attendance: '',
  guests: '1',
  message: '',
};

export default function RSVP({ dueDate }: RSVPProps) {
  const [form, setForm] = useState<RSVPFormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof RSVPFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof RSVPFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof RSVPFormData, string>> = {};
    if (!form.name.trim()) nextErrors.name = 'Please enter your name.';
    if (!form.email.trim() || !form.email.includes('@')) nextErrors.email = 'Please enter a valid email.';
    if (!form.attendance) nextErrors.attendance = 'Please confirm your attendance.';
    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <ScrollReveal className="mb-12 text-center">
        <p className="section-eyebrow">Kindly Respond</p>
        <p className="section-script mt-3">We hope to see you there</p>
        <h2 className="section-title mt-4">Please RSVP by {dueDate}</h2>
        <div className="mt-8">
          <SectionDivider />
        </div>
      </ScrollReveal>
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="theme-card p-8 text-center sm:p-10"
          >
            <p className="section-script text-[#c5a059]">Thank you</p>
            <p className="mt-4 max-w-2xl mx-auto text-base leading-8 text-[#5c4a3d]">
              Your response has been recorded. We look forward to welcoming you to a celebration filled with light,
              music, and gentle coastal evenings.
            </p>
          </motion.div>
        ) : (
          <motion.form
            {...scrollRevealMotion(0)}
            className="theme-card space-y-8 p-6 sm:space-y-10 sm:p-10"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-8 md:grid-cols-2">
              <label className="space-y-3">
                <span className="block text-xs uppercase tracking-[0.32em] text-[#8a735c]">Full Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  className="w-full border-b border-[#d9c5b2] bg-transparent py-3 text-base text-[#3d2b1f] outline-none focus:border-[#6f4c2e]"
                />
                {errors.name && <span className="text-sm text-[#ba1a1a]">{errors.name}</span>}
              </label>
              <label className="space-y-3">
                <span className="block text-xs uppercase tracking-[0.32em] text-[#8a735c]">Email Address</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  className="w-full border-b border-[#d9c5b2] bg-transparent py-3 text-base text-[#3d2b1f] outline-none focus:border-[#6f4c2e]"
                />
                {errors.email && <span className="text-sm text-[#ba1a1a]">{errors.email}</span>}
              </label>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <fieldset className="space-y-4">
                <legend className="text-xs uppercase tracking-[0.32em] text-[#8a735c]">Attendance</legend>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-[#5c4a3d]">
                    <input
                      type="radio"
                      name="attendance"
                      value="yes"
                      checked={form.attendance === 'yes'}
                      onChange={(event) => handleChange('attendance', event.target.value)}
                      className="h-4 w-4 border-[#6f4c2e] text-[#6f4c2e] focus:ring-[#6f4c2e]"
                    />
                    Delighted to attend
                  </label>
                  <label className="flex items-center gap-3 text-[#5c4a3d]">
                    <input
                      type="radio"
                      name="attendance"
                      value="no"
                      checked={form.attendance === 'no'}
                      onChange={(event) => handleChange('attendance', event.target.value)}
                      className="h-4 w-4 border-[#6f4c2e] text-[#6f4c2e] focus:ring-[#6f4c2e]"
                    />
                    Regretfully decline
                  </label>
                </div>
                {errors.attendance && <span className="text-sm text-[#ba1a1a]">{errors.attendance}</span>}
              </fieldset>
              <label className="space-y-3">
                <span className="block text-xs uppercase tracking-[0.32em] text-[#8a735c]">Number of Guests</span>
                <select
                  value={form.guests}
                  onChange={(event) => handleChange('guests', event.target.value)}
                  className="w-full border-b border-[#d9c5b2] bg-transparent py-3 text-base text-[#3d2b1f] outline-none focus:border-[#6f4c2e]"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                </select>
              </label>
            </div>

            <label className="space-y-3">
              <span className="block text-xs uppercase tracking-[0.32em] text-[#8a735c]">A Message for the Couple</span>
              <textarea
                value={form.message}
                onChange={(event) => handleChange('message', event.target.value)}
                className="w-full border-b border-[#d9c5b2] bg-transparent py-3 text-base text-[#3d2b1f] outline-none focus:border-[#6f4c2e]"
                rows={4}
              />
            </label>

            <button type="submit" className="theme-btn-primary w-full">
              Submit RSVP
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
