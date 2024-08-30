let galleries = [];
let activeGallery;
let galleryPreview;
let galleryPreviewHeader;
let galleryPreviewImages;
let galleryPreviewCurrent;

function initGallery() {
    galleryPreview = document.getElementById("gallery-preview");
    if (!galleryPreview) {
        console.error("No #gallery-preview element detected");
        return;
    }
    galleryPreviewImages = galleryPreview.querySelector(".wrapper").querySelector(".image-wrapper");
    if (!galleryPreviewImages) {
        console.error("The #gallery-preview element must have a sub element .wrapper containing a sub element .image-wrapper");
        return;
    }
    galleryPreviewHeader = galleryPreview.querySelector(".wrapper").querySelector("h1");
    if (!galleryPreviewHeader) {
        console.error("The #gallery-preview element must have a sub element .wrapper containing a sub element h1");
        return;
    }
    /*for (const gallery of document.getElementsByClassName("gallery")) {
        galleries.push(new Gallery(gallery));
    }*/
}

function openGallery(gallery) {
    if (activeGallery) {
        return;
    }
    activeGallery = gallery;
    while (galleryPreviewImages.firstChild) {
        galleryPreviewImages.removeChild(galleryPreviewImages.lastChild);
    }
    for (const image of gallery.images) {
        let current = document.createElement("img");
        current.setAttribute("src", image.source);
        showElement(current, false);
        galleryPreviewImages.appendChild(current);
    }
    galleryPreviewCurrent = 0;
    document.querySelector("body").classList.add("gallery-no-scroll-document");
    showElement(galleryPreview, true);
    showElement(galleryPreviewImages.firstChild, true);
    galleryPreviewHeader.textContent = activeGallery.images[0].title;
}

function closeGallery() {
    if (!activeGallery) {
        return;
    }
    document.querySelector("body").classList.remove("gallery-no-scroll-document");
    activeGallery = null;
    showElement(galleryPreview, false);
}

function nextImage() {
    if (!activeGallery) {
        return;
    }
    let next = galleryPreviewCurrent + 1;
    if (next >= activeGallery.images.length) {
        next = 0;
    }
    showElement(galleryPreviewImages.children[galleryPreviewCurrent], false);
    showElement(galleryPreviewImages.children[next], true);
    galleryPreviewCurrent = next;
    galleryPreviewHeader.textContent = activeGallery.images[galleryPreviewCurrent].title;
}

function previousImage() {
    if (!activeGallery) {
        return;
    }
    let prev = galleryPreviewCurrent - 1;
    if (prev < 0) {
        prev = activeGallery.images.length - 1;
    }
    showElement(galleryPreviewImages.children[galleryPreviewCurrent], false);
    showElement(galleryPreviewImages.children[prev], true);
    galleryPreviewCurrent = prev;
    galleryPreviewHeader.textContent = activeGallery.images[galleryPreviewCurrent].title;
}

function Gallery(container) {
    this.container = container;
    this.images = [];
    let imgs = container.querySelectorAll("img");
    for (const img of imgs) {
        this.images.push(new GalleryImage(img)); 
    }
    this.container.addEventListener("click", () => {
        openGallery(this);
    });
}

function GalleryImage(element) {
    this.element = element;
    this.source = element.getAttribute("src");
    this.title = element.getAttribute("alt");
}