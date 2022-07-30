const plusBtn = document.querySelector("#plus")
const backgroundUpload = document.querySelector("#backgroundUpload")
const saveUpload = document.querySelector("#saveUpload")
const pagesList = document.querySelector(".pagesList")
const exportBtn = document.querySelector("#export")

backgroundUpload.addEventListener("change", updateBg)
saveUpload.addEventListener("change", restoreSave)

background = ""

function updateBg() {
    uploadedImg = backgroundUpload.files[0]
    reader = new FileReader()
    reader.onloadend = function() {
        background = reader.result
        updateBgInDom()
    }
    reader.readAsDataURL(uploadedImg);
}

function updateBgInDom() {
    pages = document.querySelectorAll(".page")
    for (page of pages) {
        page.style.backgroundImage = `url("/noise.e486a8eb.png"), linear-gradient(0deg, rgba(43, 30, 62, 0.6), rgba(43, 30, 62, 0.6)), linear-gradient(180deg, rgba(51, 0, 102, 0) 0%, rgba(51, 0, 102, 0.85) 61.46%, rgba(51, 0, 102, 0.933954) 79.69%, #330066 99.99%, #330066 100%, #330066 100%), url("${background}")`
    }
}

function updatePagination() {
    pages = document.querySelectorAll(".page.content")
    pageNumber = pages.length
    i = 1
    for (page of pages) {
        page.querySelector(".pagination").innerHTML = i + "/" + pageNumber
        i++
    }
}

function newPageAfter(el) {
    newPage = document.createElement("div")
    newPage.classList.add("page")
    newPage.classList.add("textOnly")
    newPage.classList.add("content")

    ilLogo = document.createElement("img")
    ilLogo.src = "/il-logo.33af7e0c.png"
    ilLogo.classList.add("ilearned-logo")

    checkoutLogo = document.createElement("img")
    checkoutLogo.src = "/checkout-logo.4e9aeb64.png"
    checkoutLogo.classList.add("checkout-logo")

    editableSpan = document.createElement("span")
    editableSpan.setAttribute("role", "textbox")
    editableSpan.setAttribute("contenteditable", "true")
    editableSpan.classList.add("editableSpan")
    editableSpan.innerHTML = "You gotta modify this"

    pagination = document.createElement("a")
    pagination.classList.add("pagination")

    locationIndicator = document.createElement("span")
    locationIndicator.classList.add("location")
    locationIndicator.setAttribute("contenteditable", "true")

    newPage.appendChild(ilLogo)
    newPage.appendChild(checkoutLogo)
    newPage.appendChild(editableSpan)
    newPage.appendChild(pagination)
    newPage.appendChild(locationIndicator)

    toolbox = document.createElement("div")
    toolbox.classList.add("toolbox")

    deleteBtn = document.createElement("button")
    deleteBtn.classList.add("btn")
    deleteBtn.classList.add("btn-secondary")
    deleteBtn.setAttribute("onclick", "deletePage(this.parentNode.parentNode)")
    deleteBtn.innerHTML = "🗑️ Supprimer"

    newPageBtn = document.createElement("button")
    newPageBtn.classList.add("btn")
    newPageBtn.classList.add("btn-secondary")
    newPageBtn.setAttribute("onclick", "newPageAfter(this.parentNode.parentNode)")
    newPageBtn.innerHTML = "📄 Nouvelle page après"

    toolbox.appendChild(deleteBtn)
    toolbox.appendChild(newPageBtn)

    pageContainer = document.createElement("div")
    pageContainer.classList.add("pageContainer")

    pageContainer.appendChild(newPage)
    pageContainer.appendChild(toolbox)

    el.parentNode.insertBefore(pageContainer, el.nextSibling)
    updatePagination()
    updateBgInDom()
}

function deletePage(el) {
    el.parentNode.removeChild(el)
}

exportBtn.addEventListener("click", function() {
    pages = document.querySelectorAll(".page")
    for (page of pages) {
        htmlToImage.toPng(page)
        .then(function (dataUrl) {
            download(dataUrl, 'page.png');
          });
    }
})

function exportSave() {
    pages = document.querySelectorAll(".page:not(.titlePost)")
    save = {
        "background": background, 
        "title": document.querySelector(".page.titlePost span").innerHTML,
        "pages": []
    }

    for (page of pages) {
        object = {
            "type": page.classList[1],
            "content": encodeURI(page.querySelector(".editableSpan").innerHTML),
            "location": page.querySelector(".location").innerHTML
        }
        save.pages.push(object)
    }

    download(JSON.stringify(save), document.querySelector(".page.titlePost span").innerHTML.toLowerCase + ".json")
}

function restoreSave() {
    uploadedSave = saveUpload.files[0]
    saveReader = new FileReader()
    saveReader.onloadend = function() {
        save = JSON.parse(saveReader.result)
        background = save.background
        document.querySelector(".page.titlePost span").innerHTML = save.title

        for (pageData of save.pages) {
            actualPages = document.querySelectorAll(".page")
            newPageAfter(actualPages[actualPages.length - 1].parentNode)
            page = document.querySelectorAll(".page")[actualPages.length]
            page.querySelector(".editableSpan").innerHTML = decodeURI(pageData.content)
            page.querySelector(".location").innerHTML = pageData.location
        }

        updateBgInDom()
    }
    saveReader.readAsText(uploadedSave);
}

