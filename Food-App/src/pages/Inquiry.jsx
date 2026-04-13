import { useState } from "react";
import { inquiries } from "@/data/foodData";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionLabel from "../components/SectionLabel";
import RevealSection from "../components/RevealSection";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/data/translations";

const ROLES = [
  { value: "family", label: "Family in Need" },
  { value: "donor", label: "Donor" },
  { value: "volunteer", label: "Volunteer" },
  { value: "organization", label: "Organization" },
  { value: "other", label: "Other" },
];

export default function Inquiry() {
  const { lang } = useLanguage();
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
            <h1 className="font-heading text-3xl uppercase tracking-tight text-foreground">{t(lang, "thankYou")}</h1>
            <p className="font-body text-base text-muted-foreground mt-4 leading-relaxed">{t(lang, "submitted")}</p>
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
          <h1 className="font-heading text-3xl md:text-5xl leading-tight text-foreground">{t(lang, "getInTouch")}</h1>
          <p className="font-body text-base text-muted-foreground mt-4 max-w-xl leading-relaxed">{t(lang, "inquiryDesc")}</p>
          <div className="mt-4 p-4 bg-card border border-border rounded-md max-w-xl">
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              <span className="font-heading text-foreground">{t(lang, "immediateHelp")}</span> Call <a href="tel:211" className="text-accent underline">2-1-1</a> (Maryland's free social services hotline) or visit <a href="https://www.capitalareafoodbank.org/find-food/" target="_blank" rel="noopener noreferrer" className="text-accent underline">capitalareafoodbank.org</a> to find food near you right now.
            </p>
          </div>
        </RevealSection>
      </section>
      <section className="px-[8vw] pb-24 md:pb-40">
        <RevealSection delay={0.2}>
          <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
            <div>
              <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground block mb-2">{t(lang, "name")} *</label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-secondary border-border text-foreground h-12" />
            </div>
            <div>
              <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground block mb-2">{t(lang, "email")} *</label>
              <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-secondary border-border text-foreground h-12" />
            </div>
            <div>
              <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground block mb-2">{t(lang, "iAmA")} *</label>
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
              <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground block mb-2">{t(lang, "zipCode")}</label>
              <Input value={form.zip_code} onChange={(e) => setForm({ ...form, zip_code: e.target.value })} className="bg-secondary border-border text-foreground h-12 max-w-[200px]" />
            </div>
            <div>
              <label className="font-heading text-xs uppercase tracking-widest text-muted-foreground block mb-2">{t(lang, "message")} *</label>
              <Textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-secondary border-border text-foreground min-h-[120px]" />
            </div>
            <button type="submit" disabled={submitting || !form.role}
              className="font-heading text-xs uppercase tracking-widest px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/80 transition-all disabled:opacity-50">
              {submitting ? t(lang, "sending") : t(lang, "submit")}
            </button>
          </form>
        </RevealSection>
      </section>
    </div>
  );
}
