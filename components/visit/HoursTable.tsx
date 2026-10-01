'use client';

import { useEffect, useState } from 'react';
import { weeklyHours, computeOpenStatus, type OpenStatus } from '@/lib/hours';

export function HoursTable() {
  const days = weeklyHours();
  const [status, setStatus] = useState<OpenStatus | null>(null);
  const [todayIdx, setTodayIdx] = useState<number | null>(null);

  useEffect(() => {
    setStatus(computeOpenStatus());
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short' });
    const wd = fmt.format(new Date());
    const idx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(wd);
    setTodayIdx(idx);
  }, []);

  return (
    <div>
      <p className="mb-2 text-[13px] text-ink-2" aria-live="polite">
        {status ? (
          <>
            <span className={status.isOpen ? 'font-medium text-[rgb(var(--ok))]' : 'font-medium'}>
              {status.isOpen ? '\u25CF Open now' : '\u25CF Closed'}
            </span>{' '}
            {status.detail}
          </>
        ) : (
          'Weekly hours (IST)'
        )}
      </p>
      <table className="w-full text-sm">
        <caption className="sr-only">Weekly opening hours (IST)</caption>
        <tbody>
          {days.map((d) => (
            <tr key={d.dayIndex} className={todayIdx === d.dayIndex ? 'font-medium text-ink' : 'text-ink-2'}>
              <th scope="row" className="py-1.5 text-left font-medium">
                {d.label}
                {todayIdx === d.dayIndex ? <span className="sr-only"> (today)</span> : null}
              </th>
              <td className="py-1.5 text-right">{d.range ? `${d.range} IST` : 'Closed'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
