import { format } from 'date-fns';

interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
}

export function createGoogleCalendarUrl(event: CalendarEvent): string {
  const { title, description, location, startDate, endDate } = event;

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', title);
  url.searchParams.append('dates', `${start}/${end}`);
  
  if (description) {
    url.searchParams.append('details', description);
  }
  
  if (location) {
    url.searchParams.append('location', location);
  }

  return url.toString();
}
