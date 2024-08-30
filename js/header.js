let header;
let headerFullOffsetHeight;

let peripheralPageNavigationLinks;
let pageNavigationLinks;
let activePageLink;

let responsiveWebsitesMenuOpen = false;
let responsiveWebsitesMenu;
let openResponsiveWebsitesMenuButton;
let closeResponsiveWebsitesMenuButton;

let responsivePageNavigationMenuOpen = false;
let responsivePageNavigationMenu;
let openResponsivePageNavigationMenuButton;
let closeResponsivePageNavigationMenuButton;

const websitesMenuMaxPageWidth = 800;
const pageNavigationMenuMaxPageWidth = 500;

function initHeader() {
    header = document.querySelector("header");

    initResponsivePageNavigationMenu();
    initResponsiveWebsitesMenu();
    initPageNavigationScrolling();
}

function initResponsivePageNavigationMenu() {
    responsivePageNavigationMenu = document.getElementById("page-navigation-menu");
    openResponsivePageNavigationMenuButton = document.getElementById("page-navigation-menu-open");
    closeResponsivePageNavigationMenuButton = document.getElementById("page-navigation-menu-close");
    let button = document.getElementById("page-navigation-menu-button");
    button.addEventListener("click", () => {
        openResponsivePageNavigationMenu(!responsiveWebsitesMenuOpen);
    });
    openResponsivePageNavigationMenu(false);
}

function openResponsivePageNavigationMenu(open) {
    responsiveWebsitesMenuOpen = open;
    if (open) {
        showElement(openResponsivePageNavigationMenuButton, false);
        showElement(closeResponsivePageNavigationMenuButton, true);
        showElement(responsivePageNavigationMenu, true);
    }
    else {
        showElement(openResponsivePageNavigationMenuButton, true);
        showElement(closeResponsivePageNavigationMenuButton, false);
        showElement(responsivePageNavigationMenu, false);
    }
}

function initResponsiveWebsitesMenu() {
    responsiveWebsitesMenu = document.getElementById("header-websites-menu");
    openResponsiveWebsitesMenuButton = document.getElementById("header-websites-menu-open");
    closeResponsiveWebsitesMenuButton = document.getElementById("header-websites-menu-close");

    let button = document.getElementById("header-websites-menu-button");
    button.addEventListener("click", () => {
        openResponsiveWebsitesMenu(!responsiveWebsitesMenuOpen);
    });
    openResponsiveWebsitesMenu(false);
}

function openResponsiveWebsitesMenu(open) {
    responsiveWebsitesMenuOpen = open;
    if (open) {
        showElement(openResponsiveWebsitesMenuButton, false);
        showElement(closeResponsiveWebsitesMenuButton, true);
        showElement(responsiveWebsitesMenu, true);
    }
    else {
        showElement(openResponsiveWebsitesMenuButton, true);
        showElement(closeResponsiveWebsitesMenuButton, false);
        showElement(responsiveWebsitesMenu, false);
    }
}

function initPageNavigationScrolling() {
    headerFullOffsetHeight = header.offsetHeight;
    let links = document.querySelectorAll("#page-navigation > a");
    pageNavigationLinks = [links.length];
    for (let i = 0; i < links.length; i++) {
        pageNavigationLinks[i] = new PageNavigationLink(links[i]);
    }
    let peripheralLinks = document.querySelectorAll("[data-page-scroll-target-peripheral]");
    peripheralPageNavigationLinks = [peripheralLinks.length];
    for (let i = 0; i < peripheralLinks.length; i++) {
        let navigationTarget = document.querySelector(peripheralLinks[i].getAttribute("data-page-scroll-target-peripheral"));
        let navigationLink;
        pageNavigationLinks.forEach((link) => {
            if (link.linkedElement == navigationTarget) {
                navigationLink = link;
            }
        });
        if (!navigationLink) {
            console.error("Peripheral link can't be linked to any page navigation link.");
            continue;
        }
        peripheralPageNavigationLinks[i] = new PeripheralPageNavigationLink(peripheralLinks[i], navigationLink);
    }
    registerCustomScrollHandler(new CustomScrollHandler(handlePageScrolling));
}

function handlePageScrolling() {
    if (window.scrollY < pageNavigationLinks[0].linkedElement.getBoundingClientRect().bottom) {
        showPageLink(pageNavigationLinks[0]);
    }
    else if (window.scrollY + window.innerHeight >= pageNavigationLinks[pageNavigationLinks.length - 1].linkedElement.offsetTop + pageNavigationLinks[pageNavigationLinks.length - 1].linkedElement.offsetHeight) {
        showPageLink(pageNavigationLinks[pageNavigationLinks.length - 1]);
    }
    else {
        if (pageNavigationLinks.length < 3) {
            return;
        }
        for (let i = 1; i < pageNavigationLinks.length; i++) {
            if (!pageNavigationLinks[i] || !pageNavigationLinks[i].linkedElement) {
                continue;
            }
            if (pageNavigationLinks[i] == activePageLink) {
                continue;
            }
            if (window.scrollY < pageNavigationLinks[i].linkedElement.offsetTop + pageNavigationLinks[i].linkedElement.offsetHeight/* - pageNavigationLinks[i + 1].offset*/ &&
                window.scrollY > pageNavigationLinks[i].linkedElement.offsetTop - pageNavigationLinks[i].offset) {
                showPageLink(pageNavigationLinks[i]);
                return;
            }
        }
    }
}

function showPageLink(pageLink) {
    if (activePageLink) {
        showElement(activePageLink.element, false);
    }
    activePageLink = pageLink;
    showElement(activePageLink.element, true);
}

function getHeaderHeightDifference() {
    return Math.abs(headerFullOffsetHeight - header.offsetHeight);
}

function scrollToPageNavigationLink(pageNavigationLink) {
    if (pageNavigationLink.linkedElement == header) {
        scrollTo(0, 0);
        return;
    }
    scrollTo(0, pageNavigationLink.linkedElement.offsetTop - pageNavigationLink.offset + getHeaderHeightDifference());
}

function PeripheralPageNavigationLink(element, pageNavigationLink) {
    this.element = element;
    this.pageNavigationLink = pageNavigationLink;
    this.element.addEventListener("click", () => {
        openResponsivePageNavigationMenu(false);
        scrollToPageNavigationLink(this.pageNavigationLink);
    });
}

function PageNavigationLink(element) {
    this.element = element;
    this.offset = parseInt(element.getAttribute("data-page-scroll-offset"));
    if (!this.offset) {
        this.offset = 0;
    }
    try {
        this.linkedElement = document.querySelector(element.getAttribute("data-page-scroll-target"));
        this.element.addEventListener("click", () => {
            scrollToPageNavigationLink(this); });
    } catch {
        console.error("Missing a target in page navigation.");
    }
}