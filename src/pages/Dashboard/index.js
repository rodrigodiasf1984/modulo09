import React, { useState, useMemo, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

import {
  format,
  subDays,
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  isBefore,
  parseISO,
  addHours,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import pt from 'date-fns/locale/pt';

import api from '~/services/api';

import { Container, Time } from './styles';

// horário de funcionamento das 8:00 - 20:00
const range = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export default function Dashboard() {
  const [date, setDate] = useState(new Date());

  const [schedule, setSchedule] = useState([]);
  const dateFormated = useMemo(
    () => format(date, "d 'de' MMMM ", { locale: pt }),
    [date]
  );
  useEffect(() => {
    async function loadSchedule() {
      const response = await api.get('schedules', {
        params: { date },
      });

      // console.tron.log(date);
      // console.tron.log(response.data);

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const data = range.map(hour => {
        const checkDate = setSeconds(setMinutes(setHours(date, hour), 0), 0);
        const compareDate = utcToZonedTime(checkDate, timezone);

        return {
          time: `${hour}:00h`,
          past: isBefore(compareDate, new Date()),
          appointment: response.data.find(
            a =>
              addHours(parseISO(a.date), 0).toString() ===
              compareDate.toString()
          ),
        };
      });

      setSchedule(data);
    }

    loadSchedule();
  }, [date]);

  function handlePrevDay() {
    setDate(subDays(date, 1));
  }

  function handleNextDay() {
    setDate(addDays(date, 1));
  }

  return (
    <Container>
      <header>
        <button type="button" onClick={handlePrevDay}>
          <MdChevronLeft size={36} color="#FFF" />
        </button>
        <strong>{dateFormated}</strong>
        <button type="button" onClick={handleNextDay}>
          <MdChevronRight size={36} color="#FFF" />
        </button>
      </header>
      <ul>
        {schedule.map(time => (
          <Time key={time.time} past={time.past} available={!time.appointment}>
            <strong>{time.time}</strong>
            <span>
              {time.appointment ? time.appointment.user.name : 'Em aberto'}
            </span>
          </Time>
        ))}
      </ul>
    </Container>
  );
}
