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

    month.innerHTML = Math.floor(timer / 1000 / 60 / 60 / 24 / 30);
    day.innerHTML = Math.floor(timer / 1000 / 60 / 60 / 24) % 30;
    hour.innerHTML = Math.floor((timer / 1000 / 60 / 60) % 24);
    minute.innerHTML = Math.floor((timer / 1000 / 60) % 60);
    second.innerHTML = Math.floor((timer / 1000) % 60);
}, 1000)

setTimeout(() => {
    clearInterval(timer)
}, 1000)
