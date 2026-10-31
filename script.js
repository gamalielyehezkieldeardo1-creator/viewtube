const API_KEY = 'AIzaSyADIDC2SfwUeWi9fwGCassnVYeWChDpuQ8'; 

document.getElementById('searchBtn').addEventListener('click', searchVideos);
document.getElementById('searchQuery').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchVideos();
});

window.addEventListener('DOMContentLoaded', loadPopularVideos);

function loadPopularVideos() {
  const url = 'https://googleapis.com' + API_KEY;
  fetchVideos(url);
}

function searchVideos() {
  const query = document.getElementById('searchQuery').value;
  if (!query.trim()) return;
  
  const url = 'https://googleapis.com' + encodeURIComponent(query) + '&type=video&key=' + API_KEY;
  fetchVideos(url);
}

function fetchVideos(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.items) {
        renderVideos(data.items);
      } else {
        console.error('Data tidak ditemukan atau kuota API harian Google Cloud Anda telah habis.');
      }
    })
    .catch(error => console.error('Gagal memproses data API:', error));
}

function renderVideos(items) {
  const grid = document.getElementById('videoGrid');
  grid.innerHTML = ''; 

  items.forEach(item => {
    const videoId = item.id.videoId || item.id; 
    const snippet = item.snippet;

    if (!videoId || !snippet) return;

    const card = document.createElement('div');
    card.className = 'cursor-pointer bg-zinc-950/40 border border-zinc-800/40 p-2.5 rounded-2xl transition-all duration-300 group hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-1';
    card.innerHTML = `
      <div class="overflow-hidden rounded-xl aspect-video bg-zinc-800 relative">
        <img src="${snippet.thumbnails.medium.url}" alt="${snippet.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
      </div>
      <div class="mt-3 px-1">
        <h3 class="font-semibold text-sm line-clamp-2 text-zinc-200 group-hover:text-white leading-tight transition-colors">${snippet.title}</h3>
        <p class="text-xs text-zinc-400 mt-1.5 font-medium">${snippet.channelTitle}</p>
      </div>
    `;

    card.addEventListener('click', () => playVideo(videoId, snippet.title));
    grid.appendChild(card);
  });
}

function playVideo(videoId, title) {
  const container = document.getElementById('playerContainer');
  const player = document.getElementById('videoPlayer');
  const titleEl = document.getElementById('playerTitle');

  player.src = 'https://youtube.com' + videoId + '?autoplay=1';
  titleEl.textContent = title;
  container.classList.remove('hidden');
  container.scrollIntoView({ behavior: 'smooth' });
}

// Inisialisasi Service Worker PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('PWA Service Worker terdaftar dengan aman:', reg.scope))
      .catch(err => console.error('PWA Service Worker gagal dikonfigurasi:', err));
  });
}
