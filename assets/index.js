import './app.scss';

const secondHand = document.querySelector('.clock__hand-seconds');
const minsHand = document.querySelector('.clock__hand-minutes');
const hourHand = document.querySelector('.clock__hand-hours');

let rotations = [0, 0, 0] // [second, minutes, hours]

function setTime() {
  const now = new Date();

  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12;

  if (seconds === 0) {
    rotations[0]++;
  }

  if (minutes === 0 && seconds === 0) {
    rotations[1]++;
  }

  if (hours === 0 && minutes === 0 && seconds === 0) {
    rotations[2]++;
  }

  const secondsDeg = (seconds / 60 * 360) + (rotations[0] * 360);
  const minutesDeg = (minutes / 60 * 360) + (rotations[1] * 360);
  const hoursDeg = (hours / 12 * 360) + (minutes / 60 * 30) + (rotations[2] * 360);

  secondHand.style.transform = `rotate(${secondsDeg}deg)`;
  minsHand.style.transform = `rotate(${minutesDeg - 60}deg)`;
  hourHand.style.transform = `rotate(${hoursDeg + 60}deg)`;
}

setTime();
setInterval(setTime, 1000);

const trackList = [
  // David Guetta - I Can Only Imagine ft. Chris Brown, Lil Wayne (Official Video)
  'https://www.youtube.com/watch?v=TSNerxNwWtU',

  // Gandalf Sax Guy 10 Hours HD
  'https://www.youtube.com/watch?v=G1IbRujko-A',

  // 10 Hours of Nothing
  'https://www.youtube.com/watch?v=fx2Z5ZD_Rbo',

  // Counting To 100,000 In One Video
  'https://www.youtube.com/watch?v=xWcldHxHFpo&t=20',

  // Tom Cruise Running for 10 HOURS
  'https://www.youtube.com/watch?v=-2aU5Yq0u3E',

  // 10 Hours of *ODDLY SATISFYING* Videos - Compilation / Loop
  'https://www.youtube.com/watch?v=fwYEREqQCHc',
];

document.querySelector('[data-play-video]').addEventListener('click', () => {
  document.querySelector('[data-play-video]').href = trackList[Math.floor(Math.random() * trackList.length)];
});

/**
 * Listen for clicks on testimonial.
 * If it's not expanded -> expand, if expanded -> go back to compact.
 */
document.querySelectorAll('.testimonials__testimonial').forEach(v => {
  v.addEventListener('click', (ev) => {
    let el = ev.currentTarget;
    let parent = el.parentNode;

    // if it's expanded -> reset
    if (el.classList.contains('testimonials__testimonial--expanded')) {
      el.classList.remove('testimonials__testimonial--expanded');
      parent.classList.remove('expanded');
      
      // hide full text and show short text
      el.querySelector('div:nth-child(2)').style.display = 'none';
      el.querySelector('div:nth-child(1)').removeAttribute('style');
      return;
    }

    el.classList.add('testimonials__testimonial--expanded');
    parent.classList.add('expanded');

    // hide short text and show full text
    el.querySelector('div:nth-child(1)').style.display = 'none';
    el.querySelector('div:nth-child(2)').removeAttribute('style');
  });
});
