 function playVideo(videoId) {
      const player = document.getElementById('videoPlayer');
      const placeholder = document.getElementById('placeholder');
      
      // Загружаем видео с автозапуском
      player.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
      
      // Скрываем заглушку
      placeholder.style.display = 'none';
 }