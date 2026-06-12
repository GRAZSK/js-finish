var trailLength = 8;
var path = "./pic/cursor.gif";

var images = [];
var storage = [];
var d = 0;

function initTrail() {
  // Создаём элементы
  for (var i = 0; i < trailLength; i++) {
    var img = document.createElement("img");
    img.src = path;
    img.style.position = "absolute";
    img.style.zIndex = "9999";
    img.style.pointerEvents = "none"; // чтобы не мешал кликам
    document.body.appendChild(img);
    images.push(img);
  }
  
  // Подготавливаем хранилище координат
  for (var i = 0; i < trailLength * 2; i++) {
    storage.push(0);
  }
  
  trail();
}

function trail() {
  for (var i = 0; i < images.length; i++) {
    images[i].style.top = storage[d] + "px";
    images[i].style.left = storage[d + 1] + "px";
    d += 2;
  }
  
  // Сдвигаем координаты
  for (var i = storage.length - 1; i >= 2; i--) {
    storage[i] = storage[i - 2];
  }
  d = 0;
  
  setTimeout(trail, 10);
}

function processEvent(e) {
  storage[0] = e.clientY + window.scrollY + 10;
  storage[1] = e.clientX + window.scrollX + 10;
}

document.addEventListener("mousemove", processEvent);
window.addEventListener("load", initTrail);




function playVideo(videoId) {
      const player = document.getElementById('videoPlayer');
      const placeholder = document.getElementById('placeholder');
      
      // Загружаем видео с автозапуском
      player.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
      
      // Скрываем заглушку
      placeholder.style.display = 'none';

     
    
 }
 const playlist = [
  {
         title: "i'll do it",
        artist: "Ayesha Erotica",
        cover: "./pic/12631e00a2b87b36e005c4df04dd600f.jpg",
        src: "./m/NVaioe0knEwFyLFijbTb+xEBuDrCS51g.m4a"
      },
      {
        title: "candy store",           
        artist: "heathers ",              
        cover: "./pic/a4heathers.jpg",            
        src: "./m/3nur1wzqn0p004e62xnl.m4a"              
      },
      {
        title: "bimbo doll",
        artist: "Tila Tsoli",
        cover: "./pic/85f36310a735c1059e09cb84d8d4efb6.jpg",
        src: "./m/dpRljvtuLvAeUISuvWoz+Jjfhxs3dDWs.m4a"
    }
  ];
  const audio = new Audio();
    let currentTrackIndex = 0;
    let isPlaying = false;

    // Элементы DOM
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const progressBar = document.getElementById('progressBar');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const albumArt = document.getElementById('albumArt');
    const trackTitle = document.getElementById('trackTitle');
    const trackArtist = document.getElementById('trackArtist');

    // Загрузка трека
    function loadTrack(index) {
      const track = playlist[index];
      audio.src = track.src;
      albumArt.src = track.cover;
      trackTitle.textContent = track.title;
      trackArtist.textContent = track.artist;
      progress.style.width = '0%';
      currentTimeEl.textContent = '00:00';
    }

    // Форматирование времени
    function formatTime(seconds) {
      if (isNaN(seconds)) return '00:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Play/Pause
    function togglePlay() {
      if (isPlaying) {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      } else {
        audio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      }
      isPlaying = !isPlaying;
    }

    // Предыдущий трек
    function prevTrack() {
      currentTrackIndex--;
      if (currentTrackIndex < 0) {
        currentTrackIndex = playlist.length - 1;
      }
      loadTrack(currentTrackIndex);
      if (isPlaying) audio.play();
    }

    // Следующий трек
    function nextTrack() {
      currentTrackIndex++;
      if (currentTrackIndex >= playlist.length) {
        currentTrackIndex = 0;
      }
      loadTrack(currentTrackIndex);
      if (isPlaying) audio.play();
    }

    // Перемотка
    function seek(e) {
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audio.currentTime = percent * audio.duration;
    }

    // Обновление прогресса
    function updateProgress() {
      const percent = (audio.currentTime / audio.duration) * 100;
      progress.style.width = percent + '%';
      currentTimeEl.textContent = formatTime(audio.currentTime);
      durationEl.textContent = formatTime(audio.duration);
    }

    // Автопереключение на следующий трек
    function onTrackEnded() {
      nextTrack();
    }

    // События
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    progressBar.addEventListener('click', seek);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', onTrackEnded);

    // Инициализация первого трека
    loadTrack(currentTrackIndex);
  