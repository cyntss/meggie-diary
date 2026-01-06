import { useEffect, useMemo, useRef, useState } from 'react';
import { Dog, Pill, Utensils } from 'lucide-react';
import type { Route } from './+types/home';
import PageNav from '~/components/page-nav';
import { useTranslation } from '~/i18n';

type Food = {
  name: string;
  grams: number;
  photo: string;
};

type Schedule = {
  id: string;
  title: string;
  startMinutes: number;
  endMinutes: number;
  portionLabel: string;
  kind: 'meal' | 'pills' | 'walk';
  priority: number;
  foods: Food[];
};

const STORAGE_PREFIX = 'meggie-diary-done';

const scheduleSorter = (first: Schedule, second: Schedule) =>
  first.startMinutes - second.startMinutes ||
  first.priority - second.priority ||
  first.title.localeCompare(second.title);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Meggie's Diary" },
    {
      name: 'description',
      content: 'Daily meal schedule for Meggie in Berlin time.',
    },
  ];
}

function getBerlinTimeParts() {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(new Date());
  const getPart = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  const year = getPart('year');
  const month = String(getPart('month')).padStart(2, '0');
  const day = String(getPart('day')).padStart(2, '0');
  const hour = getPart('hour');
  const minute = getPart('minute');

  return {
    hour,
    minute,
    dateKey: `${year}-${month}-${day}`,
  };
}

function formatTime(minutes: number) {
  const normalizedMinutes = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalizedMinutes / 60);
  const mins = normalizedMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}`;
}

const getStorageKey = (dateKey: string, scheduleId: string) =>
  `${STORAGE_PREFIX}:${dateKey}:${scheduleId}`;

export default function Home() {
  const { t } = useTranslation();
  const schedules = useMemo<Schedule[]>(
    () => [
      {
        id: 'breakfast',
        title: t('scheduleBreakfast'),
        startMinutes: 9 * 60 + 30,
        endMinutes: 11 * 60,
        portionLabel: t('schedulePortions2'),
        kind: 'meal',
        priority: 2,
        foods: [
          {
            name: t('scheduleFoodRegularHorse'),
            grams: 60,
            photo:
              'https://hundefutter-vergleich24.de/wp-content/uploads/2023/03/Vet-Concept.png',
          },
          {
            name: t('scheduleFoodDiet'),
            grams: 20,
            photo:
              'https://static.zoomalia.com/cdn-cgi/image/width=800,height=800,format=auto/prod_img/59843/lm_58246922a0880a8f11f8f69cbb52b1396be1763543904.jpg',
          },
        ],
      },
      {
        id: 'morning-treats',
        title: t('scheduleTreats'),
        startMinutes: 10 * 60 + 30,
        endMinutes: 11 * 60,
        portionLabel: t('scheduleTreats2'),
        kind: 'meal',
        priority: 4,
        foods: [
          {
            name: t('scheduleFoodGelenke'),
            grams: 1,
            photo: '/gelenke.jpg',
          },
          {
            name: t('scheduleFoodTeethClean'),
            grams: 1,
            photo: '/teethcleaning.jpg',
          },
        ],
      },
      {
        id: 'thyroid-pills-am',
        title: t('scheduleThyroidPills'),
        startMinutes: 10 * 60,
        endMinutes: 10 * 60 + 30,
        portionLabel: t('scheduleDoseQuarter'),
        kind: 'pills',
        priority: 3,
        foods: [
          {
            name: t('scheduleThyroidPills'),
            grams: 0,
            photo: 'https://openclipart.org/download/309835/1541553679.svg',
          },
        ],
      },
      {
        id: 'second-meal',
        title: t('scheduleSecondMeal'),
        startMinutes: 14 * 60,
        endMinutes: 16 * 60,
        portionLabel: t('schedulePortions2'),
        kind: 'meal',
        priority: 2,
        foods: [
          {
            name: t('scheduleFoodRegularHorse'),
            grams: 60,
            photo:
              'https://hundefutter-vergleich24.de/wp-content/uploads/2023/03/Vet-Concept.png',
          },
          {
            name: t('scheduleFoodDiet'),
            grams: 20,
            photo:
              'https://static.zoomalia.com/cdn-cgi/image/width=800,height=800,format=auto/prod_img/59843/lm_58246922a0880a8f11f8f69cbb52b1396be1763543904.jpg',
          },
        ],
      },
      {
        id: 'dinner',
        title: t('scheduleDinner'),
        startMinutes: 19 * 60,
        endMinutes: 20 * 60,
        portionLabel: t('schedulePortions1'),
        kind: 'meal',
        priority: 1,
        foods: [
          {
            name: t('scheduleFoodDry'),
            grams: 15,
            photo: '/dryfood.jpg',
          },
        ],
      },
      {
        id: 'thyroid-pills-pm',
        title: t('scheduleThyroidPills'),
        startMinutes: 22 * 60,
        endMinutes: 22 * 60 + 30,
        portionLabel: t('scheduleDoseQuarter'),
        kind: 'pills',
        priority: 1,
        foods: [
          {
            name: t('scheduleThyroidPills'),
            grams: 0,
            photo: 'https://openclipart.org/download/309835/1541553679.svg',
          },
        ],
      },
      {
        id: 'evening-treats',
        title: t('scheduleTreats'),
        startMinutes: 22 * 60 + 30,
        endMinutes: 23 * 60 + 30,
        portionLabel: t('scheduleTreats1'),
        kind: 'meal',
        priority: 2,
        foods: [
          {
            name: t('scheduleFoodTeethClean'),
            grams: 1,
            photo: '/teethcleaning.jpg',
          },
        ],
      },
      {
        id: 'first-walk',
        title: t('scheduleFirstWalk'),
        startMinutes: 8 * 60,
        endMinutes: 10 * 60,
        portionLabel: t('scheduleWalkTime'),
        kind: 'walk',
        priority: 1,
        foods: [
          {
            name: t('scheduleFoodMorningFirst'),
            grams: 0,
            photo:
              'https://scontent-ber1-1.cdninstagram.com/v/t51.75761-15/479925449_18066979456857358_4458961641504129436_n.webp?_nc_cat=107&ig_cache_key=MzU2NzgxMjY5MzgwOTM3NzkzMA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=UAfsfjda3cQQ7kNvwFMztVA&_nc_oc=AdkBvf8PaVv8bXeOT8YM6ZJhMymPMIIAyDQoaBx0w-LqQBK-DRDSEfWAqMzhcdK8Bu7_PNM-Z5EKW9n3zNGCYLN-&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-ber1-1.cdninstagram.com&_nc_gid=SO45FfAIFu8qSe5Ew74JIA&oh=00_AfpW_kq-kDBO_UZs7GO7FfZskjQxkCDmWtkicCB9agvgng&oe=69609FBD',
          },
        ],
      },
      {
        id: 'last-walk',
        title: t('scheduleLastWalk'),
        startMinutes: 14 * 60,
        endMinutes: 15 * 60 + 30,
        portionLabel: t('scheduleWalkTime'),
        kind: 'walk',
        priority: 1,
        foods: [
          {
            name: t('scheduleFoodPoopGoal'),
            grams: 0,
            photo:
              'https://scontent-ber1-1.cdninstagram.com/v/t51.75761-15/479925449_18066979456857358_4458961641504129436_n.webp?_nc_cat=107&ig_cache_key=MzU2NzgxMjY5MzgwOTM3NzkzMA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=UAfsfjda3cQQ7kNvwFMztVA&_nc_oc=AdkBvf8PaVv8bXeOT8YM6ZJhMymPMIIAyDQoaBx0w-LqQBK-DRDSEfWAqMzhcdK8Bu7_PNM-Z5EKW9n3zNGCYLN-&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-ber1-1.cdninstagram.com&_nc_gid=SO45FfAIFu8qSe5Ew74JIA&oh=00_AfpW_kq-kDBO_UZs7GO7FfZskjQxkCDmWtkicCB9agvgng&oe=69609FBD',
          },
        ],
      },
    ],
    [t]
  );
  const berlinTimer = useRef<number | undefined>(undefined);
  const [timeParts, setTimeParts] = useState(() => getBerlinTimeParts());
  const [doneStatus, setDoneStatus] = useState<Record<string, boolean>>({});
  const [expandedScheduleIds, setExpandedScheduleIds] = useState<
    Record<string, boolean>
  >({});

  const berlinNowLabel = useMemo(
    () => `${formatTime(timeParts.hour * 60 + timeParts.minute)}`,
    [timeParts]
  );

  const sortedSchedules = useMemo(() => {
    return schedules.slice().sort(scheduleSorter);
  }, [schedules]);

  const activeSchedules = useMemo(() => {
    const currentMinutes = timeParts.hour * 60 + timeParts.minute;
    return sortedSchedules.filter(
      (schedule) =>
        currentMinutes >= schedule.startMinutes &&
        currentMinutes <= schedule.endMinutes
    );
  }, [sortedSchedules, timeParts]);

  const isBlocked = (schedule: Schedule) =>
    activeSchedules.some(
      (activeSchedule) =>
        activeSchedule.priority < schedule.priority &&
        !doneStatus[activeSchedule.id]
    );

  const isToggleAllowed = (schedule: Schedule) => {
    const nowMinutes = timeParts.hour * 60 + timeParts.minute;
    return (
      nowMinutes >= schedule.startMinutes && nowMinutes <= schedule.endMinutes
    );
  };

  const getTotalGrams = (schedule: Schedule) =>
    schedule.foods.reduce((sum, food) => sum + food.grams, 0);

  useEffect(() => {
    const currentTimeParts = getBerlinTimeParts();
    setTimeParts(currentTimeParts);

    const storedStatus: Record<string, boolean> = {};
    schedules.forEach((schedule) => {
      const key = getStorageKey(currentTimeParts.dateKey, schedule.id);
      storedStatus[schedule.id] = localStorage.getItem(key) === 'true';
    });
    setDoneStatus(storedStatus);

    const timer = window.setInterval(() => {
      const nextTimeParts = getBerlinTimeParts();
      setTimeParts(nextTimeParts);

      if (nextTimeParts.dateKey !== currentTimeParts.dateKey) {
        schedules.forEach((schedule) => {
          const oldKey = getStorageKey(currentTimeParts.dateKey, schedule.id);
          localStorage.removeItem(oldKey);
        });
      }
    }, 30_000);

    berlinTimer.current = timer;

    return () => {
      if (berlinTimer.current) {
        window.clearInterval(berlinTimer.current);
      }
    };
  }, [schedules]);

  const handleToggleDone = (scheduleId: string) => {
    setDoneStatus((prev) => {
      const currentTimeParts = getBerlinTimeParts();
      if (currentTimeParts.dateKey !== timeParts.dateKey) {
        setTimeParts(currentTimeParts);
      }
      const schedule = schedules.find((item) => item.id === scheduleId);
      if (schedule && !isToggleAllowed(schedule)) {
        return prev;
      }
      const nextValue = !(prev[scheduleId] ?? false);
      const key = getStorageKey(currentTimeParts.dateKey, scheduleId);
      localStorage.setItem(key, String(nextValue));
      return { ...prev, [scheduleId]: nextValue };
    });
  };

  const handleToggleDetails = (scheduleId: string) => {
    setExpandedScheduleIds((prev) => ({
      ...prev,
      [scheduleId]: !prev[scheduleId],
    }));
  };

  return (
    <main className='min-h-screen bg-slate-50 text-slate-900'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-5'>
        <PageNav />
        <header className='flex flex-col items-start gap-4'>
          <div className='flex items-center gap-6'>
            <img
              src='https://scontent-ber1-1.cdninstagram.com/v/t51.82787-15/532915064_18083694682857358_3567004977730663315_n.webp?_nc_cat=109&ig_cache_key=MzY5OTgzNTA4OTM1NjY2MzYwMQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=mzR1ABECet4Q7kNvwH21L3z&_nc_oc=AdkF5hpeJf8Eqpl6CMCYtPQzlF5qjBRPiXzowQHBBYk51-205TjGDNhJ4RWAGL9Q0LN25lwA1EZGNTlLiVbGOQ4J&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-ber1-1.cdninstagram.com&_nc_gid=sGqkJtssEJcVOoQkqktnsg&oh=00_AfqVJxabhUhzOVkQDe_PBmUdILKjttbxVYl61kUvKR6DDA&oe=69605E15'
              alt='Meggie'
              className='h-24 w-24 rounded-full object-cover shadow-sm'
            />
            <div className='space-y-2'>
              <p className='text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500'>
                {t('homeDiary')}
              </p>
              <h1 className='text-3xl font-semibold text-slate-900 sm:text-4xl'>
                {t('homeTitle')}
              </h1>
            </div>
          </div>
          <div className='space-y-2'>
            <p className='text-base text-slate-600'>{t('homeIntro')}</p>
            <p className='text-base text-slate-600'>
              {t('homeBerlinTime')}{' '}
              <span className='font-semibold'>{berlinNowLabel}</span>
            </p>
          </div>
        </header>

        <section className='grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <p className='text-sm font-semibold text-slate-500'>
                {t('homeRightNow')}
              </p>
              <h2 className='text-2xl font-semibold text-slate-900'>
                {activeSchedules.length > 0
                  ? t('homeActiveItems', { count: activeSchedules.length })
                  : t('homeNoActive')}
              </h2>
            </div>
          </div>

          {activeSchedules.length > 0 ? (
            <div className='grid gap-8'>
              {activeSchedules.map((schedule) => (
                <details
                  key={schedule.id}
                  open={
                    activeSchedules.length <= 1 ||
                    (!doneStatus[schedule.id] && !isBlocked(schedule))
                  }
                  className='grid gap-6'
                >
                  <summary className='list-none'>
                    <div className='flex flex-wrap items-center justify-between gap-4'>
                      <div>
                        <div className='flex flex-wrap items-center gap-3'>
                          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500'>
                            {schedule.title}
                          </p>
                          <span className='rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700'>
                            {t('homePriority')} {schedule.priority}
                          </span>
                          {isBlocked(schedule) ? (
                            <span className='rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700'>
                              {t('homeWaiting')}
                            </span>
                          ) : null}
                        </div>
                        <p className='text-base font-semibold text-slate-900'>
                          {formatTime(schedule.startMinutes)} -{' '}
                          {formatTime(schedule.endMinutes)}
                        </p>
                      </div>
                      <button
                        type='button'
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          handleToggleDone(schedule.id);
                        }}
                        disabled={!isToggleAllowed(schedule)}
                        className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                          doneStatus[schedule.id]
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {doneStatus[schedule.id]
                          ? t('homeMarkedAsDone')
                          : t('homeMarkAsDone')}
                      </button>
                    </div>
                  </summary>
                  {(!doneStatus[schedule.id] && !isBlocked(schedule)) ||
                  activeSchedules.length <= 1 ? (
                    <>
                      <div className='rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900 mb-4'>
                        <div className='flex flex-wrap items-center justify-between gap-3'>
                          <div>
                            <p className='font-semibold'>
                              {t('homeServingWindow')}
                            </p>
                            <p>
                              {formatTime(schedule.startMinutes)} -{' '}
                              {formatTime(schedule.endMinutes)}
                            </p>
                          </div>
                          <div>
                            <p className='font-semibold'>
                              {t('homeTotalGrams')}
                            </p>
                            <p>
                              {getTotalGrams(schedule)} g •{' '}
                              {schedule.portionLabel}
                            </p>
                          </div>
                          <div>
                            <p className='font-semibold'>{t('homePriority')}</p>
                            <p>{schedule.priority}</p>
                          </div>
                        </div>
                      </div>

                      <div className='grid gap-4 sm:grid-cols-2'>
                        {schedule.foods.map((food) => (
                          <article
                            key={food.name}
                            className='flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'
                          >
                            <div className='schedule-image-wrapper'>
                              <img
                                src={food.photo}
                                alt={food.name}
                                className='schedule-image'
                                loading='lazy'
                              />
                            </div>
                            <div className='flex flex-1 flex-col gap-2 p-4'>
                              <h3 className='text-lg font-semibold text-slate-900'>
                                {food.name}
                              </h3>
                              <p className='text-sm text-slate-600'>
                                {food.grams} {t('homeGrams')}
                              </p>
                            </div>
                          </article>
                        ))}
                      </div>
                    </>
                  ) : null}
                </details>
              ))}
            </div>
          ) : (
            <p className='text-base text-slate-600'>{t('homeScheduleEmpty')}</p>
          )}
        </section>

        <section className='grid gap-4'>
          <h2 className='text-xl font-semibold text-slate-900'>
            {t('homePlanTitle')}
          </h2>
          <div className='grid gap-4'>
            {sortedSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'
              >
                <div className='flex flex-wrap items-center justify-between gap-4'>
                  <div>
                    <p className='text-sm text-slate-500'>
                      {schedule.kind === 'meal' ? (
                        <Utensils
                          className='mr-2 inline-block h-4 w-4 text-slate-400'
                          aria-label={t('labelFood')}
                        />
                      ) : null}
                      {schedule.kind === 'pills' ? (
                        <Pill
                          className='mr-2 inline-block h-4 w-4 text-slate-400'
                          aria-label={t('labelMedication')}
                        />
                      ) : null}
                      {schedule.kind === 'walk' ? (
                        <Dog
                          className='mr-2 inline-block h-4 w-4 text-slate-400'
                          aria-label={t('labelDogWalking')}
                        />
                      ) : null}
                      {schedule.title}
                    </p>
                    <p className='text-base font-semibold text-slate-900'>
                      {formatTime(schedule.startMinutes)} -{' '}
                      {formatTime(schedule.endMinutes)}
                    </p>
                  </div>
                  <div className='flex flex-wrap items-center gap-3'>
                    <button
                      type='button'
                      onClick={() => handleToggleDetails(schedule.id)}
                      className='rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50'
                    >
                      {expandedScheduleIds[schedule.id]
                        ? t('homeHideDetails')
                        : t('homeShowDetails')}
                    </button>
                    <button
                      type='button'
                      onClick={() => handleToggleDone(schedule.id)}
                      disabled={!isToggleAllowed(schedule)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        doneStatus[schedule.id]
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      {doneStatus[schedule.id]
                        ? t('homeDone')
                        : t('homeMarkDone')}
                    </button>
                  </div>
                </div>
                <div className='mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600'>
                  <span className='rounded-full bg-slate-100 px-3 py-1'>
                    {schedule.foods.reduce((sum, item) => sum + item.grams, 0)}{' '}
                    {t('homeTotalLabel')}
                  </span>
                  <span className='rounded-full bg-slate-100 px-3 py-1'>
                    {schedule.portionLabel}
                  </span>
                  <span className='rounded-full bg-slate-100 px-3 py-1'>
                    {t('homePriority')} {schedule.priority}
                  </span>
                </div>
                {expandedScheduleIds[schedule.id] ? (
                  <div className='mt-4 grid gap-4'>
                    <div className='rounded-2xl bg-slate-50 p-4 text-sm text-slate-700'>
                      <div className='flex flex-wrap items-center justify-between gap-3'>
                        <div>
                          <p className='font-semibold'>
                            {t('homeServingWindow')}
                          </p>
                          <p>
                            {formatTime(schedule.startMinutes)} -{' '}
                            {formatTime(schedule.endMinutes)}
                          </p>
                        </div>
                        <div>
                          <p className='font-semibold'>{t('homeTotalGrams')}</p>
                          <p>
                            {getTotalGrams(schedule)} g •{' '}
                            {schedule.portionLabel}
                          </p>
                        </div>
                        <div>
                          <p className='font-semibold'>{t('homePriority')}</p>
                          <p>{schedule.priority}</p>
                        </div>
                      </div>
                    </div>
                    <div className='grid gap-4 sm:grid-cols-2'>
                      {schedule.foods.map((food) => (
                        <article
                          key={food.name}
                          className='flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'
                        >
                          <div className='schedule-image-wrapper'>
                            <img
                              src={food.photo}
                              alt={food.name}
                              className='schedule-image'
                              loading='lazy'
                            />
                          </div>
                          <div className='flex flex-1 flex-col gap-2 p-4'>
                            <h3 className='text-lg font-semibold text-slate-900'>
                              {food.name}
                            </h3>
                            <p className='text-sm text-slate-600'>
                              {food.grams} {t('homeGrams')}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
