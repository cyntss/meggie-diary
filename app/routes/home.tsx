import { useEffect, useMemo, useState } from 'react';
import { Dog, Pill, Utensils } from 'lucide-react';
import type { Route } from './+types/home';

const schedules = [
  {
    id: 'breakfast',
    title: 'Breakfast',
    startMinutes: 9 * 60 + 30,
    endMinutes: 11 * 60,
    portionLabel: '1 portion',
    kind: 'meal',
    priority: 2,
    foods: [
      {
        name: 'Regular horse meat wet food',
        grams: 50,
        photo:
          'https://hundefutter-vergleich24.de/wp-content/uploads/2023/03/Vet-Concept.png',
      },
      {
        name: 'Diet wet food',
        grams: 20,
        photo:
          'https://static.zoomalia.com/cdn-cgi/image/width=800,height=800,format=auto/prod_img/59843/lm_58246922a0880a8f11f8f69cbb52b1396be1763543904.jpg',
      },
    ],
  },
  {
    id: 'morning-treats',
    title: 'Treats',
    startMinutes: 9 * 60 + 30,
    endMinutes: 11 * 60,
    portionLabel: '2 portions',
    kind: 'meal',
    priority: 4,
    foods: [
      {
        name: 'Gelenke treat once per day',
        grams: 1,
        photo: '/gelenke.jpg',
      },
      {
        name: 'Teeth cleaning treat',
        grams: 1,
        photo: '/teethcleaning.jpg',
      },
    ],
  },
  {
    id: 'thyroid-pills-am',
    title: 'Thyroid pills',
    startMinutes: 10 * 60,
    endMinutes: 10 * 60 + 30,
    portionLabel: '1 dose',
    kind: 'pills',
    priority: 3,
    foods: [
      {
        name: 'Thyroid pills',
        grams: 0,
        photo: 'https://openclipart.org/download/309835/1541553679.svg',
      },
    ],
  },
  {
    id: 'second-meal',
    title: 'Second meal',
    startMinutes: 14 * 60,
    endMinutes: 16 * 60,
    portionLabel: '1 portion',
    kind: 'meal',
    priority: 2,
    foods: [
      {
        name: 'Regular horse meat wet food',
        grams: 50,
        photo:
          'https://hundefutter-vergleich24.de/wp-content/uploads/2023/03/Vet-Concept.png',
      },
      {
        name: 'Diet wet food',
        grams: 20,
        photo:
          'https://static.zoomalia.com/cdn-cgi/image/width=800,height=800,format=auto/prod_img/59843/lm_58246922a0880a8f11f8f69cbb52b1396be1763543904.jpg',
      },
    ],
  },
  {
    id: 'dinner',
    title: 'Dinner',
    startMinutes: 19 * 60,
    endMinutes: 20 * 60,
    portionLabel: '1 portion',
    kind: 'meal',
    priority: 2,
    foods: [
      {
        name: 'Regular horse meat wet food',
        grams: 50,
        photo:
          'https://hundefutter-vergleich24.de/wp-content/uploads/2023/03/Vet-Concept.png',
      },
      {
        name: 'Diet wet food',
        grams: 20,
        photo:
          'https://static.zoomalia.com/cdn-cgi/image/width=800,height=800,format=auto/prod_img/59843/lm_58246922a0880a8f11f8f69cbb52b1396be1763543904.jpg',
      },
    ],
  },
  {
    id: 'thyroid-pills-pm',
    title: 'Thyroid pills',
    startMinutes: 22 * 60,
    endMinutes: 22 * 60 + 30,
    portionLabel: '1 dose',
    kind: 'pills',
    priority: 3,
    foods: [
      {
        name: 'Thyroid pills',
        grams: 0,
        photo: 'https://openclipart.org/download/309835/1541553679.svg',
      },
    ],
  },
  {
    id: 'first-walk',
    title: 'First walk',
    startMinutes: 8 * 60,
    endMinutes: 10 * 60,
    portionLabel: 'Walk time',
    kind: 'walk',
    priority: 1,
    foods: [
      {
        name: 'Walk',
        grams: 0,
        photo: 'https://openclipart.org/download/309835/1541553679.svg',
      },
    ],
  },
  {
    id: 'last-walk',
    title: 'Last walk',
    startMinutes: 14 * 60,
    endMinutes: 15 * 60 + 30,
    portionLabel: 'Walk time',
    kind: 'walk',
    priority: 1,
    foods: [
      {
        name: 'Walk',
        grams: 0,
        photo: 'https://openclipart.org/download/309835/1541553679.svg',
      },
    ],
  },
];

const STORAGE_PREFIX = 'meggie-diary-done';
type Schedule = (typeof schedules)[number];

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
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${String(mins).padStart(2, '0')}`;
}

function formatBerlinDateTime() {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Berlin',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}:${String(remainingMinutes).padStart(2, '0')}`;
}

function getStorageKey(dateKey: string, scheduleId: string) {
  return `${STORAGE_PREFIX}:${dateKey}:${scheduleId}`;
}

export default function Home() {
  const [timeParts, setTimeParts] = useState(getBerlinTimeParts);
  const [doneStatus, setDoneStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeParts(getBerlinTimeParts());
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const nextDoneStatus: Record<string, boolean> = {};
    schedules.forEach((schedule) => {
      const key = getStorageKey(timeParts.dateKey, schedule.id);
      nextDoneStatus[schedule.id] = localStorage.getItem(key) === 'true';
    });
    setDoneStatus(nextDoneStatus);
  }, [timeParts.dateKey]);

  const minutesSinceMidnight = timeParts.hour * 60 + timeParts.minute;
  const berlinNowLabel = useMemo(() => formatBerlinDateTime(), [timeParts]);
  const sortedSchedules = useMemo(
    () => [...schedules].sort(scheduleSorter),
    []
  );

  const activeScheduleSorter = (
    first: (typeof schedules)[number],
    second: (typeof schedules)[number]
  ) =>
    first.priority - second.priority ||
    first.startMinutes - second.startMinutes ||
    first.title.localeCompare(second.title);

  const activeSchedules = schedules
    .filter(
      (schedule) =>
        minutesSinceMidnight >= schedule.startMinutes &&
        minutesSinceMidnight < schedule.endMinutes
    )
    .sort(activeScheduleSorter);
  const activeScheduleIds = new Set(
    activeSchedules.map((schedule) => schedule.id)
  );

  const getTotalGrams = (schedule: (typeof schedules)[number]) =>
    schedule.foods.reduce((sum, item) => sum + item.grams, 0);

  const isBlocked = (schedule: (typeof schedules)[number]) =>
    activeSchedules.length > 1 &&
    activeScheduleIds.has(schedule.id) &&
    !doneStatus[schedule.id] &&
    !isToggleAllowed(schedule);

  const isToggleAllowed = (schedule: (typeof schedules)[number]) => {
    if (activeSchedules.length <= 1) {
      return true;
    }

    if (!activeScheduleIds.has(schedule.id)) {
      return true;
    }

    const higherPrioritySchedules = activeSchedules.filter(
      (activeSchedule) => activeSchedule.priority < schedule.priority
    );

    return higherPrioritySchedules.every(
      (activeSchedule) => doneStatus[activeSchedule.id]
    );
  };

  const handleToggleDone = (scheduleId: string) => {
    setDoneStatus((prev) => {
      const schedule = schedules.find((item) => item.id === scheduleId);
      if (schedule && !isToggleAllowed(schedule)) {
        return prev;
      }
      const nextValue = !(prev[scheduleId] ?? false);
      const key = getStorageKey(timeParts.dateKey, scheduleId);
      localStorage.setItem(key, String(nextValue));
      return { ...prev, [scheduleId]: nextValue };
    });
  };

  return (
    <main className='min-h-screen bg-slate-50 text-slate-900'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12'>
        <header className='flex flex-col items-start gap-4'>
          <img
            src='https://scontent-ber1-1.cdninstagram.com/v/t51.82787-15/532915064_18083694682857358_3567004977730663315_n.webp?_nc_cat=109&ig_cache_key=MzY5OTgzNTA4OTM1NjY2MzYwMQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=mzR1ABECet4Q7kNvwH21L3z&_nc_oc=AdkF5hpeJf8Eqpl6CMCYtPQzlF5qjBRPiXzowQHBBYk51-205TjGDNhJ4RWAGL9Q0LN25lwA1EZGNTlLiVbGOQ4J&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-ber1-1.cdninstagram.com&_nc_gid=sGqkJtssEJcVOoQkqktnsg&oh=00_AfqVJxabhUhzOVkQDe_PBmUdILKjttbxVYl61kUvKR6DDA&oe=69605E15'
            alt='Meggie'
            className='h-24 w-24 rounded-full object-cover shadow-sm'
          />
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500'>
            Meggie&apos;s diary
          </p>
          <div className='space-y-2'>
            <h1 className='text-3xl font-semibold text-slate-900 sm:text-4xl'>
              Gaby &amp; Steve&apos;s sweet Meggie guide
            </h1>
            <p className='text-base text-slate-600'>
              Thanks for looking after Meggie — here&apos;s her Berlin-time
              routine at a glance.
            </p>
            <p className='text-base text-slate-600'>
              Current time in Berlin:{' '}
              <span className='font-semibold'>{berlinNowLabel}</span>
            </p>
          </div>
        </header>

        <section className='grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <p className='text-sm font-semibold text-slate-500'>Right now</p>
              <h2 className='text-2xl font-semibold text-slate-900'>
                {activeSchedules.length > 0
                  ? `${activeSchedules.length} item${
                      activeSchedules.length > 1 ? 's' : ''
                    } happening now`
                  : 'No scheduled meal'}
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
                            Priority {schedule.priority}
                          </span>
                          {isBlocked(schedule) ? (
                            <span className='rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700'>
                              Waiting
                            </span>
                          ) : null}
                          {doneStatus[schedule.id] ? (
                            <span className='rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700'>
                              Done
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
                          ? 'Marked as done'
                          : 'Mark as done'}
                      </button>
                    </div>
                  </summary>
                  {(!doneStatus[schedule.id] && !isBlocked(schedule)) ||
                  activeSchedules.length <= 1 ? (
                    <>
                      <div className='rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900'>
                        <div className='flex flex-wrap items-center justify-between gap-3'>
                          <div>
                            <p className='font-semibold'>Serving window</p>
                            <p>
                              {formatTime(schedule.startMinutes)} -{' '}
                              {formatTime(schedule.endMinutes)}
                            </p>
                          </div>
                          <div>
                            <p className='font-semibold'>Total grams</p>
                            <p>
                              {getTotalGrams(schedule)} g •{' '}
                              {schedule.portionLabel}
                            </p>
                          </div>
                          <div>
                            <p className='font-semibold'>Priority</p>
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
                            <img
                              src={food.photo}
                              alt={food.name}
                              className='h-40 w-full object-cover'
                              loading='lazy'
                            />
                            <div className='flex flex-1 flex-col gap-2 p-4'>
                              <h3 className='text-lg font-semibold text-slate-900'>
                                {food.name}
                              </h3>
                              <p className='text-sm text-slate-600'>
                                {food.grams} grams
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
            <p className='text-base text-slate-600'>
              Nothing on Meggie&apos;s schedule right now. We&apos;ll show the
              next item as soon as it begins.
            </p>
          )}
        </section>

        <section className='grid gap-4'>
          <h2 className='text-xl font-semibold text-slate-900'>
            Today&apos;s plan
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
                          aria-label='Food'
                        />
                      ) : null}
                      {schedule.kind === 'pills' ? (
                        <Pill
                          className='mr-2 inline-block h-4 w-4 text-slate-400'
                          aria-label='Medication'
                        />
                      ) : null}
                      {schedule.kind === 'walk' ? (
                        <Dog
                          className='mr-2 inline-block h-4 w-4 text-slate-400'
                          aria-label='Dog walking'
                        />
                      ) : null}
                      {schedule.title}
                    </p>
                    <p className='text-base font-semibold text-slate-900'>
                      {formatTime(schedule.startMinutes)} -{' '}
                      {formatTime(schedule.endMinutes)}
                    </p>
                  </div>
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
                    {doneStatus[schedule.id] ? 'Done' : 'Mark done'}
                  </button>
                </div>
                <div className='mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600'>
                  <span className='rounded-full bg-slate-100 px-3 py-1'>
                    {schedule.foods.reduce((sum, item) => sum + item.grams, 0)}{' '}
                    g total
                  </span>
                  <span className='rounded-full bg-slate-100 px-3 py-1'>
                    {schedule.portionLabel}
                  </span>
                  <span className='rounded-full bg-slate-100 px-3 py-1'>
                    Priority {schedule.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
