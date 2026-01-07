import PageNav from '~/components/page-nav';
import { useTranslation } from '~/i18n';

export default function Faq() {
  const { t } = useTranslation();
  const faqItems = [
    {
      question: t('faqQuestionFeedingOrder'),
      answer: t('faqAnswerFeedingOrder'),
    },
    {
      question: t('faqQuestionWalkLength'),
      answer: t('faqAnswerWalkLength'),
    },
    {
      question: t('faqQuestionPillsRefill'),
      answer: t('faqAnswerPillsRefill'),
    },
    {
      question: t('faqQuestionBags'),
      answer: t('faqAnswerBags'),
    },
    {
      question: t('faqQuestionSnowPlay'),
      answer: t('faqAnswerSnowPlay'),
    },
    {
      question: t('faqQuestionPoopColor'),
      answer: t('faqAnswerPoopColor'),
    },
  ];

  return (
    <main className='min-h-screen bg-slate-50 text-slate-900'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-5'>
        <PageNav />
        <header className='space-y-3'>
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500'>
            {t('faqEyebrow')}
          </p>
          <h1 className='text-3xl font-semibold text-slate-900 sm:text-4xl'>
            {t('faqTitle')}
          </h1>
          <p className='text-base text-slate-600'>{t('faqIntro')}</p>
        </header>

        <section className='grid gap-4'>
          {faqItems.map((item) => (
            <article
              key={item.question}
              className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'
            >
              <h2 className='text-lg font-semibold text-slate-900'>
                {item.question}
              </h2>
              <p className='mt-2 whitespace-pre-line text-sm text-slate-600'>
                {item.answer}
              </p>
            </article>
          ))}
        </section>

        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8'>
          <h2 className='text-xl font-semibold text-slate-900'>
            {t('faqChecklistTitle')}
          </h2>
          <ul className='mt-4 grid gap-3 text-sm text-slate-600'>
            <li className='rounded-2xl bg-slate-50 px-4 py-3'>
              {t('faqChecklistItemTime')}
            </li>
            <li className='rounded-2xl bg-slate-50 px-4 py-3'>
              {t('faqChecklistItemTasks')}
            </li>
            <li className='rounded-2xl bg-slate-50 px-4 py-3'>
              {t('faqChecklistItemWhatsApp')}
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
