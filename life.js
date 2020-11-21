const birthday = new Date("2000-12-19")
const end_date = new Date("2070-12-19")
const birthday_color = '#F89542'
const default_color = '#1AA9FF'

let events = [];

const event_end_date = (e) => {
  if (e.date_end) return new Date(e.date_end)
  else return new Date(e.date_start);
}

const get_end = () => {
  return end_date
}

const date_to_string = (date) => {
  var d = date.getDate();
  var month = date.getMonth() + 1;
  var day = d < 10 ? '0' + d : '' + d;
  if (month < 10) month = '0' + month;
  return day + '/' + month + '/' + date.getFullYear()
}

const get_events_in_week = (week_start, week_end) => {
  const date = date_to_string(week_start)
  let color = default_color;
  let _events = events.filter((e) => {
    let estart = new Date(e.date_start);
    let eend = event_end_date(e)
    // let eend = new Date(e.date_end);
    let start_in_week = estart >= week_start && estart < week_end;
    let end_in_week = eend >= week_start && eend < week_end;
    let event_spans_week = estart <= week_start && eend >= week_end;
    let in_week = start_in_week || end_in_week || event_spans_week;
    if (in_week) {
      if (e.color) color = e.color;
    }
    return in_week;
  });

  _events = _events.map(value => value.title)

  if (birthday) {
    let age = 0;
    let bd_in_week = false;
    while (week_start < week_end) {
      if (week_start.getMonth() == birthday.getMonth() && week_start.getDate() == birthday.getDate()) {
        bd_in_week = true;
        age = week_start.getFullYear() - birthday.getFullYear();
        break;
      }
      week_start.setDate(week_start.getDate() + 1);
    }
    if (bd_in_week) {
      color = birthday_color;
      let title;
      if (age == 0) {
        title = `I was born!`;
      } else {
        title = `I turn ${age} on ${birthday.getDate()}/${birthday.getMonth() + 1}`;
      }
      _events.push(title);
    }
  }
  const tooltip = [date].concat(_events).join(', ')
  return {
    'tooltip': tooltip,
    'color': color,
  };
}

const all_weeks = (fn) => {
  let end = get_end();
  let cursor = new Date(birthday.getTime());
  while (cursor <= end) {
    let d = new Date(cursor.getTime());
    cursor.setDate(cursor.getDate() + 7);
    fn(d, new Date(cursor.getTime()));
  }
}

const render_all_weeks = (list_event) => {
  events = list_event.map(event => ({
    date_start: new Date(event.date_start),
    date_end: new Date(event.date_end),
    title: event.title,
    color: event.color
  }));
  events = events.sort((e1, e2) => {
    let e1ref = event_end_date(e1);
    let e2ref = event_end_date(e2);
    if (e2ref > e1ref) return 1;
    else if (e2ref < e1ref) return -1;
    else return 0;
  });
  let weeks = [];
  all_weeks((start, end) => {
    weeks.push(get_events_in_week(start, end));
  });
  return weeks;
}

module.exports = {
  render_all_weeks
};
