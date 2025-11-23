
import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': require('date-fns/locale/en-US') };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date()), getDay, locales });

export default function CalendarView({ events }) {
  const mapped = (events || []).map(e => ({
    id: e.id,
    title: e.title,
    start: new Date(e.start_at),
    end: new Date(e.end_at || e.start_at),
    resource: e,
  }));
  const eventStyleGetter = (event) => {
    const color = event.resource?.color || '#1E90FF';
    return { style: { backgroundColor: color, borderRadius: '8px', border: 'none' } };
  };
  return (
    <Calendar
      localizer={localizer}
      events={mapped}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 520 }}
      views={['month','week','day']}
      popup
      eventPropGetter={eventStyleGetter}
    />
  );
}
