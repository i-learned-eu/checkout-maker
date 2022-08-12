const backgroundUpload = document.querySelector('#backgroundUpload');
const saveUpload = document.querySelector('#saveUpload');
const exportBtn = document.querySelector('#export');
const exportSaveBtn = document.querySelector('#exportSave');
let background = '';

function updateBgInDom() {
  const pages = document.querySelectorAll('.page');

  pages.forEach((page) => {
    page.style.backgroundImage = `url('/static/img/noise.png'), linear-gradient(0deg, rgba(43, 30, 62, 0.6), rgba(43, 30, 62, 0.6)), linear-gradient(180deg, rgba(51, 0, 102, 0) 0%, rgba(51, 0, 102, 0.85) 61.46%, rgba(51, 0, 102, 0.933954) 79.69%, #330066 99.99%, #330066 100%, #330066 100%), url('${background}')`;
  });
}

function updateBg() {
  const uploadedImg = backgroundUpload.files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    background = reader.result;
    updateBgInDom();
  };
  reader.readAsDataURL(uploadedImg);
}

function updatePagination() {
  const pages = document.querySelectorAll('.page.content');
  const pageNumber = pages.length;
  let i = 1;

  pages.forEach((page) => {
    page.querySelector('.pagination').innerHTML = `${i}/${pageNumber}`;
    i += 1;
  });
}

function removeElement() {
  this.parentNode.parentNode.remove();
}

function newPageAfter(el) {
  const newPage = document.createElement('div');
  newPage.classList.add('page');
  newPage.classList.add('textOnly');
  newPage.classList.add('content');

  const ilLogo = document.createElement('img');
  ilLogo.src = '/static/img/il-logo.png';
  ilLogo.classList.add('ilearned-logo');

  const checkoutLogo = document.createElement('img');
  checkoutLogo.src = '/static/img/checkout-logo.png';
  checkoutLogo.classList.add('checkout-logo');

  const editableSpan = document.createElement('span');
  editableSpan.setAttribute('role', 'textbox');
  editableSpan.setAttribute('contenteditable', 'true');
  editableSpan.classList.add('editableSpan');
  editableSpan.innerHTML = 'You gotta modify this';

  const pagination = document.createElement('a');
  pagination.classList.add('pagination');

  const locationIndicator = document.createElement('span');
  locationIndicator.classList.add('location');
  locationIndicator.setAttribute('contenteditable', 'true');

  newPage.appendChild(ilLogo);
  newPage.appendChild(checkoutLogo);
  newPage.appendChild(editableSpan);
  newPage.appendChild(pagination);
  newPage.appendChild(locationIndicator);

  const toolbox = document.createElement('div');
  toolbox.classList.add('toolbox');

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('btn');
  deleteBtn.classList.add('btn-secondary');
  deleteBtn.addEventListener('click', removeElement);
  deleteBtn.innerHTML = '🗑️ Supprimer';

  const newPageBtn = document.createElement('button');
  newPageBtn.classList.add('btn');
  newPageBtn.classList.add('btn-secondary');
  newPageBtn.setAttribute('onclick', 'newPageAfter(this.parentNode.parentNode)');
  newPageBtn.innerHTML = '📄 Nouvelle page après';

  toolbox.appendChild(deleteBtn);
  toolbox.appendChild(newPageBtn);

  const pageContainer = document.createElement('div');
  pageContainer.classList.add('pageContainer');

  pageContainer.appendChild(newPage);
  pageContainer.appendChild(toolbox);

  el.parentNode.insertBefore(pageContainer, el.nextSibling);
  updatePagination();
  updateBgInDom();
}

function exportAsImages() {
  const pages = document.querySelectorAll('.page');
  let i = 0;

  pages.forEach((page) => {
    htmlToImage.toPng(page)
      .then((dataUrl) => {
        download(dataUrl, `${document.querySelector('.page.titlePost span').innerHTML.toLowerCase().replace(/\s/g, '-')}-${i}.png`);
        i += 1;
      });
  });
}

exportBtn.addEventListener('click', exportAsImages);

function surround(elementType) {
  let selection = window.getSelection();
  const allText = selection.focusNode.parentNode.textContent;
  const selectedAnNext = selection.toString() + selection.focusNode.textContent;
  const isSelectingBInFirefox = !allText.includes(selectedAnNext);
  if (isSelectingBInFirefox) {
    selection.focusNode.splitText(selection.anchorOffset);
    selection.focusNode.splitText(selection.focusOffset);
    selection = window.getSelection();
    const bolded = document.createElement(elementType);
    bolded.innerHTML = selection.toString();
    selection.focusNode.parentNode.insertBefore(bolded, selection.focusNode.nextSibling);
    selection.focusNode.remove();
  } else {
    const el = selection.focusNode.previousSibling;
    const parent = el.parentNode;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
    parent.normalize();
  }
}

if (navigator.userAgent.includes('Firefox')) {
  document.onkeydown = (event) => {
    const ev = event || window.ev;
    if (ev.ctrlKey && ev.code === 'KeyB') {
      ev.preventDefault();
      surround('b');
    } else if (ev.ctrlKey && ev.code === 'KeyI') {
      ev.preventDefault();
      surround('i');
    }
  };
}

function exportSave() {
  const pages = document.querySelectorAll('.page:not(.titlePost)');
  const save = {
    title: encodeURI(document.querySelector('.page.titlePost span').innerHTML),
    pages: [],
    background,
  };

  pages.forEach((page) => {
    const object = {
      type: page.classList[1],
      content: encodeURI(page.querySelector('.editableSpan').innerHTML),
      location: page.querySelector('.location').innerHTML,
    };
    save.pages.push(object);
  });

  download(JSON.stringify(save), `${document.querySelector('.page.titlePost span').innerHTML.toLowerCase().replace(/\s/g, '-')}.json`);
}

function restoreSave() {
  const uploadedSave = saveUpload.files[0];
  const saveReader = new FileReader();
  saveReader.onloadend = () => {
    const save = JSON.parse(saveReader.result);
    background = save.background;
    document.querySelector('.page.titlePost span').innerHTML = decodeURI(save.title);

    save.pages.forEach((pageData) => {
      const actualPages = document.querySelectorAll('.page');
      newPageAfter(actualPages[actualPages.length - 1].parentNode);
      const page = document.querySelectorAll('.page')[actualPages.length];
      page.querySelector('.editableSpan').innerHTML = decodeURI(pageData.content);
      page.querySelector('.location').innerHTML = pageData.location;
    });

    updateBgInDom();
  };
  saveReader.readAsText(uploadedSave);
}

backgroundUpload.addEventListener('change', updateBg);
saveUpload.addEventListener('change', restoreSave);
exportSaveBtn.addEventListener('click', exportSave);
