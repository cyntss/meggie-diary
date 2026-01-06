import { NavLink } from 'react-router';

import { useTranslation } from '~/i18n';

const links = [
  { to: '/', labelKey: 'navHome' },
  { to: '/faq', labelKey: 'navFaq' },
  { to: '/emergency-contacts', labelKey: 'navEmergency' },
];

export default function PageNav() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div className='flex flex-wrap items-center justify-between gap-3'>
      <nav aria-label={t('navAriaLabel')} className='flex flex-wrap gap-3'>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:text-slate-900'
              }`
            }
          >
            {t(link.labelKey)}
          </NavLink>
        ))}
      </nav>
      <div className='flex items-center gap-2 text-sm font-semibold text-slate-500'>
        <button
          type='button'
          onClick={() => setLanguage('en')}
          className={`transition hover:text-slate-900 ${
            language === 'en' ? 'text-slate-900' : ''
          }`}
        >
          {t('languageEnglish')}
        </button>
        <span className='text-slate-300'>|</span>
        <button
          type='button'
          onClick={() => setLanguage('es')}
          className={`transition hover:text-slate-900 ${
            language === 'es' ? 'text-slate-900' : ''
          }`}
        >
          {t('languageSpanish')}
        </button>
      </div>
    </div>
  );
}
