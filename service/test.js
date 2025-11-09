import fetch from 'node-fetch';

const ref = 'Moroni 10:5';
const url = `https://api.nephi.org/scriptures/?q=${encodeURIComponent(ref)}`;

fetch(url)
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));