import { useState } from "react";
import { inquiries } from "@/data/foodData";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionLabel from "../components/SectionLabel";
import RevealSection from "../components/RevealSection";

const ROLES = [
  { value: "family", label: "Family in Need" },
  { value: "donor", label: "Donor" },
  { value: "volunteer", label: "Volunteer" },
  { value: "organization", label: "Organization" },
  { value: "other", label: "Other" },
];

export default function Inquiry() {
  const [form, setForm] = useState({ name: "", email: "", role: "", message: "", zip_code: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      inquiries.push({ ...form, id: String(Date.now()), status: "new" });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 md:pt-32 flex items-center justify-center px-[8vw]">
        <RevealSection>
          <div className="text-center max-w-md">
            <h1 className="font-heading text-3xl uppercase tracking-tight text-foreground">Thank You</h1>
            <p className="font-body text-base text-muted-foreground mt-4 leading-relaxed">Your inquiry has been submitted. We'll be in touch soon.</p>
          </div>
        </RevealSection>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      <section className="px-[8vw] pb-16 md:pb-24">
        <RevealSection>
          <SectionLabel label="Contact" number={1} />
          <h1 className="font-heading text-[10vw] md:text-[4vw] uppercase leading-[0.85] tracking-tighter text-foreground">Get in Touch</h1>
          <p className="font-body text-base text-muted-foreground mt-4 max-w-xl leading-relaxed">Whether you need food resources, want to donate, volunteer, or list your organization — we're here to help.</p>
        </RevealSection>
      </section>
      <section className="px-[8vw] pb-24 md:pb-40">
        <RevealSection delay={0.2}>
          <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
            <div>
              <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground block mb-2">Name *</label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-secondary border-border text-foreground h-12" />
            </div>
            <div>
              <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground block mb-2">Email *</label>
              <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-secondary border-border text-foreground h-12" />
            </div>
            <div>
              <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground block mb-2">I am a... *</label>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })}
                    className={`font-heading text-[10px] uppercase tracking-widest px-4 py-2 border transition-colors ${form.role === r.value ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground block mb-2">ZIP Code</label>
              <Input value={form.zip_code} onChange={(e) => setForm({ ...form, zip_code: e.target.value })} className="bg-secondary border-border text-foreground h-12 max-w-[200px]" />
            </div>
            <div>
              <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground block mb-2">Message *</label>
              <Textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-secondary border-border text-foreground min-h-[120px]" />
            </div>
            <button type="submit" disabled={submitting || !form.role}
              className="font-heading text-xs uppercase tracking-widest px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/80 transition-all disabled:opacity-50">
              {submitting ? "Sending..." : "Submit Inquiry"}
            </button>
          </form>
        </RevealSection>
      </section>
    </div>
  );
}
