exports.getLastDayOccurence = (date, day) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
    if (days.includes(day)) {
        const modifier = (date.getDay() + days.length - days.indexOf(day)) % 7;
        //.getDay() returns integer between 0-6 (Sunday = 0, Monday = 1, etc.)
        date.setDate(date.getDate() - modifier);
    }
    //setting the hours and minutes to 00, so it's the start of the day
    date.setHours('00');
    date.setMinutes('00');
    date.setSeconds('00');

    //date is an object stored in GMT time (even though I set the hours and minutes above to 0)
    //when convert it to a string, it becomes EST time (hours and minutes set = 0)
    return date;
}

