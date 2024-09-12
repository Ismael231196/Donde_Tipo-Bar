let slideIndex = 0;
let slides = document.querySelectorAll('.slide');
showSlides();

// Función para mostrar los slides
function showSlides() {
  slides.forEach(slide => {
    slide.style.display = 'none'; // Ocultar todos los slides
  });

  slideIndex++;
  
  if (slideIndex > slides.length) {
    slideIndex = 1; // Reiniciar el índice cuando se llega al final
  }
  
  slides[slideIndex - 1].style.display = 'block'; // Mostrar el slide actual
  setTimeout(showSlides, 3000); // Cambiar slide cada 3 segundos
}

// Función para ir al siguiente slide
function nextSlide() {
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  updateSlides();
}

// Función para ir al slide anterior
function prevSlide() {
  slideIndex--;
  if (slideIndex < 1) {
    slideIndex = slides.length;
  }
  updateSlides();
}

// Actualizar y mostrar el slide correcto
function updateSlides() {
  slides.forEach(slide => {
    slide.style.display = 'none';
  });
  slides[slideIndex - 1].style.display = 'block';
}

// Detener el cambio automático de diapositivas cuando se hace clic en los botones
document.querySelector('.prev').onclick = function() {
  clearTimeout(sliderTimeout);
  prevSlide();
}

document.querySelector('.next').onclick = function() {
  clearTimeout(sliderTimeout);
  nextSlide();
}

let sliderTimeout = setTimeout(showSlides, 3000);
