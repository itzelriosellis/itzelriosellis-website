class MenuHeader extends HTMLElement {
    connectedCallback() {
        setTimeout(() => {
        const currentPage = document.body.dataset.page; 

        this.innerHTML = `
            <header>
                <div class="headerInner">
                    <link rel="stylesheet" href="components/header.css">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <div class="mobMenu">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <a href="/" id="mLogo">

                    <div class="menuLogo" id="menuLogo"></div>
                    </a>
                    <div class="right">
                        <div class="menu">
                            <div id="paintings" class="menuButton ${currentPage === 'paintings' ? 'active' : ''}">PAINTINGS</div>
                            <div id="illustrations" class="menuButton ${currentPage === 'illustrations' ? 'active' : ''}">ILLUSTRATIONS</div>
                            <div id="sculptures" class="menuButton ${currentPage === 'sculptures' ? 'active' : ''}">SCULPTURES</div>
                            <div id="about" class="menuButton ${currentPage === 'about' ? 'active' : ''}">ABOUT</div>
                            </div>
                        <div id="subText"> all art by Itzél Rios-Ellis.</div>
                    </div>
               </div>
        </header>
    `;
    let paintingsButton = document.getElementById('paintings');
    let animButton = document.getElementById('illustrations');
    let illusButton = document.getElementById('sculptures');
    let aboutButton = document.getElementById('about');
    let menuButton = document.getElementById('menuLogo');
function checkSize(){
    if (window.innerWidth <= 800) {
        document.getElementById('mLogo').addEventListener('click', e => {
            e.preventDefault();
        });
        document.querySelector('header').addEventListener('click', () => {
            link(`/index.html?from=${currentPage}`);
        });
    }
}
checkSize()
window.addEventListener('resize', () => {
    checkSize()
});
    paintingsButton.addEventListener("click", function() {
        link("/paintings.html");
    });
    animButton.addEventListener("click", function() {
        link("/illustrations.html");
    });
    illusButton.addEventListener("click", function() {
        link("/sculptures.html");
    });
    aboutButton.addEventListener("click", function() {
        link("/about.html");
    });
    menuButton.addEventListener("click", function() {
        const currentPage = document.body.dataset.page;
        link(`/index.html?from=${currentPage}`);
    });
    function link(link){
        document.getElementById('loader').classList.remove("loader-hidden");
        document.getElementById('loader').classList.add('show')
        window.location.href = link;
    }
    

    }, 0);

    }
}
customElements.define('menu-header', MenuHeader)
window.addEventListener("load", ()=>{
    const loader = document.querySelector(".loader");
    setTimeout(() => {
        loader.classList.remove('show');
        loader.classList.add("loader-hidden");

      }, 200); // 0.5 seconds
})
class FooterMain extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer id="footer">
            
            <link rel="stylesheet" href="components/footer.css">

                <a href="https://www.instagram.com/xinguitas" target="_blank">
                    <div class="footerIcon" style="background-image: url('../assets/images/icons/insta.png');"></div>
                </a>
                <h1>Itzél Rios-Ellis – 2026</h1>
                 

                </footer>
                
    `
    }
}
customElements.define('footer-main', FooterMain)


  //if (window.location.href.endsWith(".html")) {
    //window.location.href = window.location.href.replace(".html", "");
  //}
