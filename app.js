const navLinks = [
  { label: 'Why Canada Clinics Struggle', href: '#problems' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Why Merrick Global', href: '#why-merrick' },
  { label: 'Contact', href: '#contact' },
];

const problemCards = [
  'Shortage of suitable physicians',
  'Hard-to-fill locations',
  'Unclear international hiring process',
  'Candidate drop-off after initial interest',
];

const services = [
  {
    title: 'Clinic Hiring Readiness Review',
    copy: 'We assess your role, compensation model, clinic structure, location and candidate proposition so you understand how attractive your opportunity is before launching a search.',
  },
  {
    title: 'Recruitment Strategy',
    copy: 'We build a focused recruitment approach aligned to your clinic, province, patient demand and the type of physician you need.',
  },
  {
    title: 'Targeted Physician Sourcing',
    copy: 'We identify and engage suitable UK-trained physicians and internationally trained doctors who are actively or realistically open to practising in Canada.',
  },
  {
    title: 'Licensing and Relocation Support',
    copy: 'We help candidates understand the practical steps involved, including licensing expectations, relocation considerations and the wider decision-making process.',
  },
  {
    title: 'Ongoing Partnership and Retention',
    copy: 'We stay involved beyond the first introduction, supporting communication, offer management, onboarding and long-term retention.',
  },
];

const offers = [
  {
    title: 'International Physician Hiring Toolkit',
    price: '£495 / $895 CAD',
    bestFor: 'Clinics wanting structure before beginning an international hiring process.',
    includes: [
      'IMG hiring process guide',
      'Interview template and candidate scorecard',
      'Clinic profile template',
      'Offer checklist',
      'Candidate email templates',
      'Basic licensing pathway overview',
    ],
  },
  {
    title: 'Clinic Hiring Readiness Review',
    price: '£1,950 / $3,500 CAD',
    bestFor: 'Clinics unsure whether their role is positioned strongly enough to attract international physicians.',
    includes: [
      'Role and clinic review',
      'Compensation and location assessment',
      'Candidate attraction review',
      '90-minute strategy call',
      'Written recommendations',
      'Toolkit included',
    ],
  },
  {
    title: 'International Physician Recruitment Advisory',
    price: '£4,500 / $7,500 CAD for 3 months',
    bestFor: 'Clinics preparing to recruit internationally but not yet ready for full recruitment delivery.',
    includes: [
      'Hiring readiness review',
      'Clinic profile and advert support',
      'Interview process design',
      'Candidate communication templates',
      'Monthly strategy calls',
      'Email support',
      'Market feedback',
    ],
  },
  {
    title: 'Full Recruitment Partnership',
    price: 'Custom structure depending on role and requirement',
    bestFor: 'Clinics wanting end-to-end recruitment delivery.',
    includes: [
      'Search strategy',
      'Targeted sourcing',
      'Candidate screening',
      'Interview coordination',
      'Offer management',
      'Licensing and relocation support',
      'Ongoing support through start date',
    ],
  },
];

const processSteps = [
  'Understand your clinic, role and location',
  'Assess the strength of your candidate proposition',
  'Position the opportunity clearly',
  'Target suitable physicians',
  'Manage candidate engagement and interviews',
  'Support offer, licensing, relocation and onboarding',
];

const whyPoints = [
  'Focused Canada physician recruitment knowledge',
  'Direct access to UK-trained doctors',
  'Commercially aware advice',
  'Clear communication',
  'Support beyond candidate introduction',
  'Relationship-led approach',
];

const sectionClass = 'mx-auto max-w-7xl px-6 py-16 md:py-20';
const cardClass = 'rounded-2xl border border-white/15 bg-white/5 p-6 shadow-card';

function SectionTitle({ eyebrow, title, body }) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-turquoise">{eyebrow}</p>}
      <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">{title}</h2>
      {body && <p className="mt-5 text-base leading-7 text-white/85 md:text-lg">{body}</p>}
    </div>
  );
}

function App() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <div className="font-bold text-lg">
            {/* Placeholder: Merrick Global Talent logo */}
            <span className="rounded border border-turquoise/60 px-3 py-2 text-sm tracking-wide">MERRICK GLOBAL TALENT LOGO</span>
          </div>
          <nav className="hidden gap-6 text-sm lg:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-white/90 transition hover:text-turquoise">{link.label}</a>
            ))}
          </nav>
          <a href="#contact" className="rounded-lg bg-turquoise px-4 py-2 text-sm font-semibold text-navy transition hover:bg-white">Discuss Your Hiring Needs</a>
        </div>
      </header>

      <main>
        <section className={`${sectionClass} grid gap-12 pt-20 md:grid-cols-2 md:items-center`} id="top">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-turquoise">Canada physician recruitment support</p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Canada Physician Recruitment Partner</h1>
            <p className="mt-5 text-xl font-semibold text-white/90">Practical support for clinics hiring internationally trained physicians.</p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/85">Merrick Global Talent helps Canadian clinics attract, assess and hire UK-trained Family Physicians, GPs and Specialists through clear recruitment strategy, targeted sourcing and support across licensing and relocation.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#contact" className="rounded-lg bg-turquoise px-6 py-3 font-semibold text-navy transition hover:bg-white">Discuss Your Hiring Needs</a>
              <a href="#services" className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition hover:border-turquoise hover:text-turquoise">View Our Canada Services</a>
            </div>
            <p className="mt-4 text-sm text-grey">Confidential, practical and commercially focused support for Canadian clinics.</p>
          </div>
          <div className={`${cardClass} min-h-[320px] md:min-h-[380px]`}>
            {/* Placeholder: Optional Canada landscape image or abstract Canada-focused visual */}
            <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl border border-dashed border-turquoise/50 bg-navy/70 text-center text-white/75">
              Canada visual placeholder
            </div>
          </div>
        </section>

        <section id="problems" className={sectionClass}>
          <SectionTitle title="Hiring physicians in Canada is difficult. International recruitment adds another layer of complexity." body="Canadian clinics are facing patient demand, physician shortages and difficulty attracting doctors to hard-to-fill locations. Many clinics know internationally trained physicians could help, but are unsure how to position the opportunity, where to find suitable candidates, how to assess interest properly, and how to support doctors through licensing and relocation." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {problemCards.map((item) => <div key={item} className={cardClass}><p className="font-semibold">{item}</p></div>)}
          </div>
        </section>

        <section className={sectionClass}>
          <SectionTitle title="We help clinics become easier for international doctors to say yes to." body="Recruitment is not just about advertising a vacancy. International physicians need clarity on the clinic model, location, earnings, patient demand, licensing route, family considerations and long-term support. Merrick Global Talent helps clinics present the opportunity clearly and manage the process properly from first conversation to start date." />
          <div className="grid gap-4 rounded-2xl border border-white/15 bg-white/5 p-6 md:grid-cols-3">
            <div>
              <p className="text-sm uppercase tracking-wide text-grey">Commercial clarity</p>
              <p className="mt-2 font-semibold">Better role positioning and realistic market feedback.</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-grey">Process control</p>
              <p className="mt-2 font-semibold">Structured candidate engagement from first discussion to offer.</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-grey">Reduced hiring risk</p>
              <p className="mt-2 font-semibold">Support through licensing and relocation decision points.</p>
            </div>
          </div>
        </section>

        <section id="services" className={sectionClass}>
          <SectionTitle title="Canada physician recruitment support" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className={cardClass}>
                <h3 className="mb-3 text-xl font-bold">{service.title}</h3>
                <p className="text-white/85">{service.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={sectionClass}>
          <SectionTitle title="Choose the level of support your clinic needs" />
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-turquoise/30 bg-navy/60 px-5 py-4">
            <p className="text-sm text-white/90">Not sure which option fits your current hiring challenge?</p>
            <a href="#contact" className="rounded-lg bg-turquoise px-4 py-2 text-sm font-semibold text-navy transition hover:bg-white">Discuss Your Hiring Needs</a>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {offers.map((offer) => (
              <article key={offer.title} className={cardClass}>
                <h3 className="text-2xl font-bold">{offer.title}</h3>
                <p className="mt-2 text-lg font-semibold text-turquoise">{offer.price}</p>
                <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-white/70">Best for</p>
                <p className="mt-1 text-white/90">{offer.bestFor}</p>
                <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-white/70">Includes</p>
                <ul className="mt-2 space-y-2 text-white/85">
                  {offer.includes.map((line) => <li key={line}>• {line}</li>)}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-grey">Consultancy and advisory packages are separate from full recruitment delivery unless agreed otherwise.</p>
        </section>

        <section id="process" className={sectionClass}>
          <SectionTitle title="How we work with Canadian clinics" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step, idx) => (
              <div key={step} className={cardClass}>
                <p className="mb-2 text-turquoise font-bold">Step {idx + 1}</p>
                <p className="font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="why-merrick" className={sectionClass}>
          <SectionTitle title="Why Canadian clinics work with Merrick Global Talent" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
              {whyPoints.map((point) => <div key={point} className={cardClass}><p className="font-semibold">{point}</p></div>)}
            </div>
            <aside className={cardClass}>
              {/* Placeholder: Martin Merrick headshot */}
              <div className="mb-4 flex h-48 items-center justify-center rounded-xl border border-dashed border-turquoise/50 bg-navy/70 text-sm text-white/75">Martin Merrick headshot placeholder</div>
              <h3 className="text-xl font-bold">Martin Merrick</h3>
              <p className="text-white/80">Director, Merrick Global Talent</p>
              <p className="mt-3 text-white/85">Martin works directly with clinics and physicians to simplify international recruitment, improve candidate engagement and support long-term hiring outcomes.</p>
            </aside>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="rounded-2xl border border-turquoise/40 bg-white/5 p-8 md:p-10">
            <h2 className="text-3xl font-extrabold">Need help attracting physicians to your clinic?</h2>
            <p className="mt-4 max-w-4xl text-white/85">If your clinic is struggling to recruit Family Physicians, GPs or Specialists, we can help you understand whether international recruitment is realistic, how your opportunity is likely to be received, and what needs to be improved before going to market.</p>
            <a href="#contact" className="mt-6 inline-block rounded-lg bg-turquoise px-6 py-3 font-semibold text-navy transition hover:bg-white">Book a confidential conversation</a>
          </div>
        </section>

        <section id="contact" className={sectionClass}>
          <SectionTitle title="Discuss your Canada physician recruitment needs" />
          <form className="grid gap-4 rounded-2xl border border-white/15 bg-white/5 p-6 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
            {['Name', 'Organisation', 'Email', 'Phone', 'Province', 'Type of physician required', 'Current hiring challenge'].map((field) => (
              <label key={field} className="text-sm font-semibold">
                <span className="mb-2 block">{field}</span>
                <input type="text" className="w-full rounded-lg border border-white/20 bg-navy/70 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-turquoise" placeholder={field} />
              </label>
            ))}
            <label className="text-sm font-semibold md:col-span-2">
              <span className="mb-2 block">Message</span>
              <textarea rows="5" className="w-full rounded-lg border border-white/20 bg-navy/70 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-turquoise" placeholder="How can we help?"></textarea>
            </label>
            <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-grey">Your enquiry will be handled confidentially by Merrick Global Talent.</p>
              <button type="submit" className="rounded-lg bg-turquoise px-6 py-3 font-semibold text-navy transition hover:bg-white">Submit enquiry</button>
            </div>
            {/* Integration note: Connect this form submit action to email, HubSpot, Wix Forms, Zapier, or your CRM endpoint here. */}
            {/* Example: Replace onSubmit handler with async POST request to your selected form endpoint. */}
          </form>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-white/80">
          <p className="font-semibold text-white">Merrick Global Talent</p>
          <p className="mt-1">Hello@MerrickGlobal.com</p>
          <p>www.MerrickGlobal.com</p>
          <p className="mt-3 text-grey">Recruiting Exceptional Medical Talent Worldwide</p>
        </div>
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
