// https://stackoverflow.com/questions/64008348/audio-on-scroll-in-a-div
// play sound files for divs
// const soundfiles = ["forest.m4a", "sound2.wav", "sound.wav"];
const soundfiles = ["/daintree_forest/assets/audio/forest.mp3"];
//  const divIds = ["dinosaurs", "d2", "d3"];
const divIds = ["dinosaurs"];

const els = soundfiles.map((filename, index) => {
    const el = document.createElement("audio");
    // el.src = "/" + filename;
    el.src = filename;
    document.body.appendChild(el);
    console.log('el', el);
    return el;
});

const playing = new Array(divIds.length).fill(false);
window.addEventListener('scroll', (e) => {
const scroll = e.target.body.scrollTop;
const rects = divIds.map(id => document.getElementById(id).getBoundingClientRect());
const tops = rects.map(rect => rect.top);
tops.forEach((top, ind) => {
 if (!playing[ind] && top <= rects[ind].height * 2 / 3 && top > - rects[ind].height * 1 / 3) {
   els[ind].play();
   playing[ind] = true;
 } else if (playing[ind] && (top > rects[ind].height * 2 / 3 || top < -rects[ind].height * 1 / 3)) {
   els[ind].pause();
   playing[ind] = false;
 }
});
});