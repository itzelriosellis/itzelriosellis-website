let FS = false;
let currentOrderNum = 1;
let maxOrder = 1;
let zoomed = false;
let exitable = false;

const page = document.body.dataset.page;

const FSimageObj = document.getElementById('fsImage');
const leftButton = document.getElementById('arrowLeft');
const rightButton = document.getElementById('arrowRight');
const closeButton = document.getElementById('closeButton');

let cachedPieces = null;

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- FULLSCREEN IMAGE ---------------- */

  function loadFsImage(orderNumber) {
    exitable = false;
    zoomOut();
    currentOrderNum = orderNumber;

    fetch(`data/${page}.json`)
      .then(res => res.json())
      .then(pieces => {

        const sorted = Object.entries(pieces)
          .sort((a, b) => a[1].order - b[1].order);

        const [title, data] = sorted.find(
          ([, d]) => d.order === orderNumber
        );

        const imgFileName = title.toLowerCase().replace(/ /g, "_").replace(/[?<>:*"\/|\\\[\]]/g, '');
const imgExt = page === "sculptures" ? "gif" : "jpg";
const imgLoc = `assets/images/${page}/${imgFileName}.${imgExt}`;
        const bottomText = document.getElementById('overlayBottom');
        const fsContainer = document.getElementById('fsContainer');

        bottomText.style.display = 'none';
        leftButton.style.display = 'none';
        rightButton.style.display = 'none';

        FSimageObj.src = '';
        fsContainer.classList.add('loading');

        const imgFS = new Image();
        imgFS.onload = () => {
          FSimageObj.src = imgFS.src;
          fsContainer.classList.remove('loading');
          bottomText.style.display = 'block';
          exitable = true;

          if (orderNumber > 1) leftButton.style.display = 'block';
          if (orderNumber < maxOrder) rightButton.style.display = 'block';
        };
        imgFS.src = imgLoc;

        document.getElementById('title').textContent = title;
        document.getElementById('year').textContent = ` (${data.year})`;
         if (data.canvas === "none"){
          document.getElementById('medium').textContent = `${data.medium}`;
         }
         else{
          document.getElementById('medium').textContent = `${data.medium} on ${data.canvas}`;
         }
        if (data.width === "none" || data.height === "none") {
          document.getElementById('size').textContent = ''
      }
      else{
                document.getElementById('size').textContent = `${data.width} x ${data.height}"`;

      }
  });
  }

  /* ---------------- COLUMN COUNT ---------------- */

  function getNumColumns() {
    if (window.innerWidth < 800) return 1;
    if (window.innerWidth < 1500) return 2;
    return 3;
  }

  /* ---------------- GALLERY RENDER ---------------- */

  function renderGallery(pieces) {
  const columns = [
    document.getElementById('column1'),
    document.getElementById('column2'),
    document.getElementById('column3')
  ];

  columns.forEach(col => col.innerHTML = '');

  const numColumns = getNumColumns();

  // hide unused columns
  columns.forEach((col, i) => {
    col.style.display = "flex";
    col.style.flex = i < numColumns ? "1" : "0";
    col.style.visibility = i < numColumns ? "visible" : "hidden";
  });

  const sortedPieces = Object.entries(pieces).sort((a, b) => a[1].order - b[1].order);

  // Distribute pieces evenly across columns
  sortedPieces.forEach(([title, data], index) => {
    const imgFileName = title.toLowerCase().replace(/ /g, "_").replace(/[?<>:*"\/|\\\[\]]/g, '');
const imgExt = page === "sculptures" ? "gif" : "jpg";
const imgLoc = `assets/images/${page}/${imgFileName}.${imgExt}`;

    const photo = document.createElement('div');
    photo.className = 'photo loading';

    const imgO = document.createElement('img');
    imgO.className = 'img';
    photo.appendChild(imgO);

    const img = new Image();
    img.onload = () => {
      imgO.src = img.src;
      photo.classList.remove('loading');
    };
    img.src = imgLoc;

    photo.addEventListener('click', () => {
      if (!FS) {
        document.getElementById('overlay').style.display = 'flex';
        document.getElementById('pageContent').classList.add('fs-blur');
        FS = true;
        loadFsImage(data.order);
      }
    });

    // Column-first distribution
    const colIndex = index % numColumns;
    columns[colIndex].appendChild(photo);
  });
}


  /* ---------------- INITIAL LOAD ---------------- */

  fetch(`data/${page}.json`)
    .then(res => res.json())
    .then(pieces => {
      cachedPieces = pieces;
      maxOrder = Object.keys(pieces).length;
      renderGallery(pieces);
    });

  /* ---------------- RESIZE UPDATE ---------------- */

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (cachedPieces) renderGallery(cachedPieces);
    }, 50);
  });

  /* ---------------- ZOOM ---------------- */

  FSimageObj.addEventListener('click', (e) => {
    const rect = FSimageObj.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (!zoomed) {
      FSimageObj.style.transformOrigin = `${x}% ${y}%`;
      FSimageObj.style.transform = 'scale(2.25)';
      FSimageObj.style.cursor = 'zoom-out';
      leftButton.style.display = 'none';
      rightButton.style.display = 'none';
      zoomed = true;
    } else {
      zoomOut();
    }
  });

  function zoomOut() {
    FSimageObj.style.transformOrigin = 'center center';
    FSimageObj.style.transform = 'scale(1)';
    FSimageObj.style.cursor = 'zoom-in';
    zoomed = false;

    if (currentOrderNum > 1) leftButton.style.display = 'block';
    if (currentOrderNum < maxOrder) rightButton.style.display = 'block';
  }

  /* ---------------- NAVIGATION ---------------- */

  function closeFS() {
    FSimageObj.src = '';
    FS = false;
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('pageContent').classList.remove('fs-blur');
    zoomOut();
  }

  function previousPhoto() {
    if (currentOrderNum > 1) loadFsImage(currentOrderNum - 1);
  }

  function nextPhoto() {
    if (currentOrderNum < maxOrder) loadFsImage(currentOrderNum + 1);
  }

  leftButton.addEventListener('click', previousPhoto);
  rightButton.addEventListener('click', nextPhoto);
  closeButton.addEventListener('click', closeFS);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') previousPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'Escape') closeFS();
  });

  document.getElementById('overlay').addEventListener('click', (e) => {
    if (
      FS &&
      exitable &&
      !FSimageObj.contains(e.target) &&
      !leftButton.contains(e.target) &&
      !rightButton.contains(e.target)
    ) {
      closeFS();
    }
  });

});
