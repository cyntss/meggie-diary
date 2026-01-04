import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/home";

const schedules = [
  {
    id: "breakfast",
    title: "Breakfast",
    startMinutes: 8 * 60,
    endMinutes: 11 * 60,
    portionLabel: "1 portion",
    foods: [
      {
        name: "Regular horse meat wet food",
        grams: 50,
        photo:
          "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Diet wet food",
        grams: 20,
        photo:
          "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
];

const STORAGE_PREFIX = "meggie-diary-done";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Meggie's Diary" },
    {
      name: "description",
      content: "Daily meal schedule for Meggie in Berlin time.",
    },
  ];
}

function getBerlinTimeParts() {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(new Date());
  const getPart = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  const year = getPart("year");
  const month = String(getPart("month")).padStart(2, "0");
  const day = String(getPart("day")).padStart(2, "0");
  const hour = getPart("hour");
  const minute = getPart("minute");

  return {
    hour,
    minute,
    dateKey: `${year}-${month}-${day}`,
  };
}

function formatBerlinDateTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
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
      nextDoneStatus[schedule.id] = localStorage.getItem(key) === "true";
    });
    setDoneStatus(nextDoneStatus);
  }, [timeParts.dateKey]);

  const minutesSinceMidnight = timeParts.hour * 60 + timeParts.minute;
  const berlinNowLabel = useMemo(() => formatBerlinDateTime(), [timeParts]);

  const activeSchedule = schedules.find(
    (schedule) =>
      minutesSinceMidnight >= schedule.startMinutes &&
      minutesSinceMidnight < schedule.endMinutes,
  );

  const totalGrams = activeSchedule
    ? activeSchedule.foods.reduce((sum, item) => sum + item.grams, 0)
    : 0;

  const handleToggleDone = (scheduleId: string) => {
    setDoneStatus((prev) => {
      const nextValue = !(prev[scheduleId] ?? false);
      const key = getStorageKey(timeParts.dateKey, scheduleId);
      localStorage.setItem(key, String(nextValue));
      return { ...prev, [scheduleId]: nextValue };
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Meggie&apos;s diary
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Meal schedule for Berlin time
          </h1>
          <p className="text-base text-slate-600">
            Current time in Berlin: <span className="font-semibold">{berlinNowLabel}</span>
          </p>
        </header>

        <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">Right now</p>
              <h2 className="text-2xl font-semibold text-slate-900">
                {activeSchedule ? activeSchedule.title : "No scheduled meal"}
              </h2>
            </div>
            {activeSchedule ? (
              <button
                type="button"
                onClick={() => handleToggleDone(activeSchedule.id)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                  doneStatus[activeSchedule.id]
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {doneStatus[activeSchedule.id] ? "Marked as done" : "Mark as done"}
              </button>
            ) : null}
          </div>

          {activeSchedule ? (
            <div className="grid gap-6">
              <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">Serving window</p>
                    <p>
                      {Math.floor(activeSchedule.startMinutes / 60)}:00 - {Math.floor(
                        activeSchedule.endMinutes / 60,
                      )}:00
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Total grams</p>
                    <p>
                      {totalGrams} g • {activeSchedule.portionLabel}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {activeSchedule.foods.map((food) => (
                  <article
                    key={food.name}
                    className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <img
                      src={food.photo}
                      alt={food.name}
                      className="h-40 w-full object-cover"
                      loading="lazy"
                    />
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {food.name}
                      </h3>
                      <p className="text-sm text-slate-600">{food.grams} grams</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-base text-slate-600">
              There&apos;s no scheduled meal right now. We&apos;ll surface the next feeding window
              here as soon as it begins.
            </p>
          )}
        </section>

        <section className="grid gap-4">
          <h2 className="text-xl font-semibold text-slate-900">Today&apos;s plan</h2>
          <div className="grid gap-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">{schedule.title}</p>
                    <p className="text-base font-semibold text-slate-900">
                      {Math.floor(schedule.startMinutes / 60)}:00 - {Math.floor(
                        schedule.endMinutes / 60,
                      )}:00
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleDone(schedule.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      doneStatus[schedule.id]
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {doneStatus[schedule.id] ? "Done" : "Mark done"}
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    {schedule.foods.reduce((sum, item) => sum + item.grams, 0)} g total
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    {schedule.portionLabel}
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
