document.getElementById('copy').addEventListener('click', () => {

  navigator.clipboard.writeText("itzelriosellis@gmail.com");

 const flash = document.getElementById("flash");
  flash.classList.add("active");
  setTimeout(() => flash.classList.remove("active"), 150);
} )