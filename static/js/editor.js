const backgroundUpload = document.querySelector('#backgroundUpload');
const saveUpload = document.querySelector('#saveUpload');
const exportBtn = document.querySelector('#export');

backgroundUpload.addEventListener('change', updateBg);
saveUpload.addEventListener('change', restoreSave);

let background = '';

function updateBg() {
    const uploadedImg = backgroundUpload.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
        background = reader.result;
        updateBgInDom();
    }

    reader.readAsDataURL(uploadedImg);
}

function updateBgInDom() {
    const pages = document.querySelectorAll('.page');

    for (const page of pages) {
        page.style.backgroundImage = `url("/noise.e486a8eb.png"), linear-gradient(0deg, rgba(43, 30, 62, 0.6), rgba(43, 30, 62, 0.6)), linear-gradient(180deg, rgba(51, 0, 102, 0) 0%, rgba(51, 0, 102, 0.85) 61.46%, rgba(51, 0, 102, 0.933954) 79.69%, #330066 99.99%, #330066 100%, #330066 100%), url("${background}")`;
    }
}

function updatePagination() {
    const pages = document.querySelectorAll('.page.content');
    const pageNumber = pages.length;
    let i = 1;

    for (const page of pages) {
        page.querySelector('.pagination').innerHTML = `${i}/${pageNumber}`;
        i++
    }
}

function newPageAfter(el) {
    const newPage = document.createElement('div');
    newPage.classList.add('page');
    newPage.classList.add('textOnly');
    newPage.classList.add('content');

    const ilLogo = document.createElement('img');
    ilLogo.src = '/il-logo.33af7e0c.png';
    ilLogo.classList.add('ilearned-logo');

    const checkoutLogo = document.createElement('img');
    checkoutLogo.src = '/checkout-logo.4e9aeb64.png';
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
    deleteBtn.addEventListener('click', () => deletePage(deleteBtn.parentNode.parentNode))
    deleteBtn.innerHTML = '🗑️ Supprimer';

    const newPageBtn = document.createElement('button');
    newPageBtn.classList.add('btn');
    newPageBtn.classList.add('btn-secondary');
    newPageBtn.addEventListener('click', () => newPageAfter(newPageBtn.parentNode.parentNode));
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

function deletePage(el) {
    el.parentNode.removeChild(el)
}

exportBtn.addEventListener('click',  () => {
    const pages = document.querySelectorAll('.page');
    let i = 0;

    for (const page of pages) {
        htmlToImage.toPng(page)
          .then(function (dataUrl) {
              download(dataUrl, `${document.querySelector('.page.titlePost span').innerHTML.toLowerCase().replace(/\s/g, '-')}-${i}.png`);
              i++
          });
    }
})

function exportSave() {
    const pages = document.querySelectorAll('.page:not(.titlePost)');
    const save = {
        background: background,
        title: document.querySelector('.page.titlePost span').innerHTML,
        pages: [],
    }

    for (const page of pages) {
        const object = {
            type: page.classList[1],
            content: encodeURI(page.querySelector('.editableSpan').innerHTML),
            location: page.querySelector('.location').innerHTML,
        }

        save.pages.push(object);
    }

    download(JSON.stringify(save), `${document.querySelector('.page.titlePost span').innerHTML.toLowerCase().replace(/\s/g, '-')}.json`);
}

function restoreSave() {
    const uploadedSave = saveUpload.files[0];
    const saveReader = new FileReader();

    saveReader.onloadend = () => {
        const save = JSON.parse(saveReader.result.toString());

        background = save.background
        document.querySelector('.page.titlePost span').innerHTML = save.title;

        for (const pageData of save.pages) {
            const actualPages = document.querySelectorAll('.page');
            newPageAfter(actualPages[actualPages.length - 1].parentNode);

            const page = document.querySelectorAll('.page')[actualPages.length];
            page.querySelector('.editableSpan').innerHTML = decodeURI(pageData.content);
            page.querySelector('.location').innerHTML = pageData.location;
        }

        updateBgInDom();
    }
    saveReader.readAsText(uploadedSave);
}

