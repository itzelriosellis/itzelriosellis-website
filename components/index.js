window.addEventListener("load", ()=>{
    const loader = document.querySelector(".loader");
    setTimeout(() => {
        loader.classList.remove('show');
        loader.classList.add("loader-hidden");

      }, 200); // 0.5 seconds
})
const params = new URLSearchParams(window.location.search);
const lastPage = params.get('from'); // e.g., "paintings"
    console.log(lastPage)

if (lastPage) {
    const btn = document.getElementById(lastPage);
    btn.classList.add('active');
}
