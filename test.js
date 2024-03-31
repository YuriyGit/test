'use strict'

const month = document.getElementById('month');
const day = document.getElementById('day');
const hour = document.getElementById('hour');
const minute = document.getElementById('minute');
const second = document.getElementById('second');

const timer = setInterval(() => {
    const dateNow = new Date();
    const newYear = new Date('2025-01-01 00:00:00');
    const timer = newYear - dateNow;

    const months = new Intl.DateTimeFormat('ru-RU',{month: "numeric"} ).format(timer)
    const days = new Intl.DateTimeFormat('ru-RU', {day: "numeric"}).format(timer)
    const hours = new Intl.DateTimeFormat('ru-RU', {hour: "numeric"}).format(timer)
    const minutes = new Intl.DateTimeFormat('ru-RU', {minute: "numeric"}).format(timer)
    const seconds = new Intl.DateTimeFormat('ru-RU', {second: "numeric"}).format(timer)


    month.innerHTML = months;
    day.innerHTML = days;
    hour.innerHTML = hours;
    minute.innerHTML = minutes;
    second.innerHTML = seconds;
}, 1000)

setTimeout(() => {
    clearInterval(timer)
}, 5000)
