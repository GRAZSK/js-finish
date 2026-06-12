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
        title: "candy store",           // Название трека
        artist: "heathers ",              // Исполнитель
        cover: "./pic/a4heathers.jpg",            // Путь к обложке (картинке)
        src: "./m/3nur1wzqn0p004e62xnl.m4a"              // Путь к аудиофайлу
      },
      {
        title: "Название песни 2",
        artist: "Исполнитель 2",
        cover: "./pic/cover2.jpg",
        src: "./music/song2.mp3"
      },
      {
        title: "Название песни 3",
        artist: "Исполнитель 2",
        cover: "./pic/cover2.jpg",
        src: "./music/song2.mp3"
    }
  ]
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