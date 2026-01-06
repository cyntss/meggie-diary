import PageNav from "~/components/page-nav";

const contactCards = [
  {
    title: "Primary veterinarian",
    name: "Kleintierpraxis am Uhlenhorst (Dr. Petra Kattinger & Dr. Volker Lammerschmidt)",
    phone: "033203 70884",
    location: "Uhlenhorst 8, 14532 Kleinmachnow",
    notes: "Website: kleintierpraxis-uhlenhorst.de",
  },
  {
    title: "24/7 emergency clinic",
    name: "Tierklinik Nord",
    phone: "+49 30 555 0200",
    location: "Ringstraße 12, Berlin",
    notes: "Call ahead before arriving after hours. More info: https://haustierdocs.de/?utm_source=print&utm_medium=HaustierDocs_Visitenkarte_85x55mm&utm_campaign=dfh1&utm_term=dfh&utm_content=home",
  },
];

export default function EmergencyContacts() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
        <PageNav />
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Support network
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Emergency contacts
          </h1>
          <p className="text-base text-slate-600">
            Keep these numbers handy in case Meggie needs urgent help. Replace
            placeholders with verified contacts.
          </p>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          {contactCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {card.title}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                {card.name}
              </h2>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-700">Phone:</span>{" "}
                  {card.phone}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Location:</span>{" "}
                  {card.location}
                </p>
                <p>{card.notes}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Emergency notes
          </h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <p className="rounded-2xl bg-slate-50 px-4 py-3">
              If there is bleeding, vomiting, or unusual lethargy, call the
              emergency clinic immediately.
            </p>
            <p className="rounded-2xl bg-slate-50 px-4 py-3">
              If she&apos;s cleaning herself too much, please check her vagina
              area to make sure she doesn&apos;t cause irritation to her skin.
            </p>
            <p className="rounded-2xl bg-slate-50 px-4 py-3">
              If she ate something she shouldn&apos;t and there&apos;s blood in her
              poop, if there is too much blood, take her to the vet. If
              there&apos;s only a small trace, switch to 100% Diet food and NO dry
              food. Get in touch with me also if this happens, but it&apos;s very
              unlikely that it will happen.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
