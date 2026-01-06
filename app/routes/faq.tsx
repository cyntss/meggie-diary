import PageNav from "~/components/page-nav";

export default function Faq() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
        <PageNav />
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Care FAQ
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Frequently asked questions
          </h1>
          <p className="text-base text-slate-600">
            Quick answers to the most common questions about Meggie&apos;s daily
            routine. Replace these placeholders with updated guidance as needed.
          </p>
        </header>

        <section className="grid gap-4">
          {[
            {
              question: "What is the feeding order when schedules overlap?",
              answer:
                "Start with the highest priority item first. Use the schedule cards to confirm the time window before marking anything as done.",
            },
            {
              question: "How long should walks be?",
              answer:
                "Aim for 15-20 minutes per walk unless otherwise noted. Shorter walks are okay on hot afternoons.",
            },
            {
              question: "What should I do if her poop becomes yellow or soft?",
              answer:
                "Please increase the portion of Diet food immediately. You should essentially reverse the current ratios.\n\n- Current: 20g Diet / 60g Normal\n- Switch to: 60g Diet / 20g Normal\n\nPlease contact me if you need to make this switch so I can provide further guidance.",
            },
          ].map((item) => (
            <article
              key={item.question}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                {item.question}
              </h2>
              <p className="mt-2 whitespace-pre-line text-sm text-slate-600">
                {item.answer}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Quick checklist
          </h2>
          <ul className="mt-4 grid gap-3 text-sm text-slate-600">
            <li className="rounded-2xl bg-slate-50 px-4 py-3">
              Confirm Berlin time before giving meals or meds.
            </li>
            <li className="rounded-2xl bg-slate-50 px-4 py-3">
              Mark tasks done immediately to keep the schedule accurate.
            </li>
            <li className="rounded-2xl bg-slate-50 px-4 py-3">
              Send a quick update if anything changes or feels unusual.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
