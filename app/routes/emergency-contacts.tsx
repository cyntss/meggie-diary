import PageNav from '~/components/page-nav';
import { useTranslation } from '~/i18n';

export default function EmergencyContacts() {
  const { t } = useTranslation();
  const contactCards = [
    {
      title: t('emergencyPrimaryVet'),
      name: 'Kleintierpraxis am Uhlenhorst (Dr. Petra Kattinger & Dr. Volker Lammerschmidt)',
      phone: '033203 70884',
      location: 'Uhlenhorst 8, 14532 Kleinmachnow',
      notes: t('emergencyPrimaryNotes'),
    },
    {
      title: t('emergencyClinic'),
      name: 'Haustier Docs',
      phone: t('emergencyOnline'),
      location: t('emergencyOnline'),
      notes: t('emergencyClinicNotes'),
    },
  ];

  return (
    <main className='min-h-screen bg-slate-50 text-slate-900'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-5'>
        <PageNav />
        <header className='space-y-3'>
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500'>
            {t('emergencyEyebrow')}
          </p>
          <h1 className='text-3xl font-semibold text-slate-900 sm:text-4xl'>
            {t('emergencyTitle')}
          </h1>
          <p className='text-base text-slate-600'>{t('emergencyIntro')}</p>
        </header>

        <section className='grid gap-5 md:grid-cols-2'>
          {contactCards.map((card) => (
            <article
              key={card.title}
              className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'
            >
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>
                {card.title}
              </p>
              <h2 className='mt-2 text-xl font-semibold text-slate-900'>
                {card.name}
              </h2>
              <div className='mt-4 space-y-2 text-sm text-slate-600'>
                <p>
                  <span className='font-semibold text-slate-700'>
                    {t('emergencyPhoneLabel')}
                  </span>{' '}
                  {card.phone}
                </p>
                <p>
                  <span className='font-semibold text-slate-700'>
                    {t('emergencyLocationLabel')}
                  </span>{' '}
                  {card.location}
                </p>
                <p>{card.notes}</p>
              </div>
            </article>
          ))}
        </section>

        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8'>
          <h2 className='text-xl font-semibold text-slate-900'>
            {t('emergencyNotesTitle')}
          </h2>
          <div className='mt-4 grid gap-3 text-sm text-slate-600'>
            <p className='rounded-2xl bg-slate-50 px-4 py-3'>
              {t('emergencyNoteBleeding')}
            </p>
            <p className='rounded-2xl bg-slate-50 px-4 py-3'>
              {t('emergencyNoteCleaning')}
            </p>
            <div className='rounded-2xl bg-slate-50 px-4 py-3'>
              <p className='font-semibold text-slate-700'>
                {t('emergencyNotePoopTitle')}
              </p>
              <ul className='mt-2 list-disc space-y-2 pl-5'>
                <li>{t('emergencyNotePoopSignificant')}</li>
                <li>{t('emergencyNotePoopSmall')}</li>
              </ul>
              <p className='mt-3'>{t('emergencyNotePoopContact')}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
