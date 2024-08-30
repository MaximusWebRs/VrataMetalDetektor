const slideDuration = 10000;
const imageRatio = 3;
const imageRatioVertical = 0.8;
const verticalSwitch = 800;

let imagesContainer;
let slideDragController;
let slideImages;
let slideTransitionDuration;

let slideTimeoutId = 0;
let slideCurrentImage = 0;
let slideTransitioning = false;

function SlideDragController(element) {
    this.element = element;
    this.startX = 0;
    this.element.addEventListener("touchstart", (event) => {
        this.startX = event.touches[0].clientX;
    });
    this.element.addEventListener("touchend", (event) => {
        if (this.startX > event.changedTouches[0].clientX) {
            setActiveImage(getIncrementedSlideCurrentImage());
        } else if (event.changedTouches[0].clientX > this.startX) {
            setActiveImage(getDecrementedSlideCurrentImage());
        }
    });
}

function initSlideshow()
{
    imagesContainer = document.getElementById("slideshow-images");
    slideDragController = new SlideDragController(document.getElementById("slideshow-images-dragger"));
    slideTransitionDuration = parseInt(window.getComputedStyle(imagesContainer).getPropertyValue("--slideshow-transition-duration"));
    let images = imagesContainer.querySelectorAll("picture");
    slideImages = [images.length];
    for (let i = 0; i < images.length; i++) {
        slideImages[i] = new SlideImage(images[i], createSlideshowControl(i));
        if (i == 0) {
            showElement(slideImages[i].element, true);
            showElement(slideImages[i].control, true);
        }
        else {
            showElement(slideImages[i].element, false);
            showElement(slideImages[i].control, false);
        }
    }
    determineSlideshowHeight();
    window.addEventListener("resize", determineSlideshowHeight);
    startLoop();
}

function determineSlideshowHeight() {
    if (window.innerWidth > verticalSwitch) {
        imagesContainer.style.height = Math.floor(window.innerWidth / imageRatio);
        return;
    }
    imagesContainer.style.height = Math.floor(window.innerWidth / imageRatioVertical);
}

function createSlideshowControl(imageIndex) {
    let control = document.createElement("div");
    document.getElementById("slideshow-controls").appendChild(control);
    control.classList.add("slideshow-control");
    control.onclick = () => { setActiveImage(imageIndex); };
    return control;
}

function setActiveImage(index) {
    if (slideTransitioning) {
        return;
    }
    if (index >= slideImages.length || index < 0) {
        return;
    }
    if (index == slideCurrentImage) {
        return;
    }
    clearTimeout(slideTimeoutId);
    slideTransitioning = true;
    showElement(slideImages[index].element, true);
    showElement(slideImages[index].control, true);
    showElement(slideImages[slideCurrentImage].element, false);
    showElement(slideImages[slideCurrentImage].control, false);
    slideCurrentImage = index;
    setTimeout(() => {
        slideTransitioning = false;
        startLoop();
    }, slideTransitionDuration);
}

function startLoop()
{
    if (slideTransitioning) {
        return;
    }
    slideTimeoutId = setTimeout(() => {
        setActiveImage(getIncrementedSlideCurrentImage());
    }, slideDuration);
}

function getIncrementedSlideCurrentImage() {
    if (slideCurrentImage + 1 >= slideImages.length) {
        return 0;
    }
    return slideCurrentImage + 1;
}

function getDecrementedSlideCurrentImage() {
    if (slideCurrentImage - 1 < 0) {
        return slideImages.length - 1;
    }
    return slideCurrentImage - 1;
}

function SlideImage(element, control) 
{
    this.element = element;
    this.control = control;
}