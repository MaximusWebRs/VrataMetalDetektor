const numberCounterMutationObserverConfig = { attributes: true, attributeOldValue: true };
const numberCounterMutationObserverCallback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.type == "attributes" && mutation.attributeName == "class" && (mutation.oldValue && mutation.oldValue.includes("inactive"))) {
            if (mutation.target.classList.contains("active")) {
                observer.disconnect();
                startNumberCounter(getNumberCounterObjectByObserveTargetElement(mutation.target), 0);
            } else if (mutation.target.classList.contains("inactive")) {
                getNumberCounterObjectByObserveTargetElement(mutation.target).element.textContent = numberCounterToString(getNumberCounterObjectByObserveTargetElement(mutation.target).target, 0);
            }
        }
    }
};

const numberCounterFps = 15;
const defaultNumberCounterDurationMs = 4000;

let numberCounters;

function initNumberCounter() {
    let counters = document.querySelectorAll("[data-number-counter-target]");
    numberCounters = [counters.length];
    for (let i = 0; i < counters.length; i++) {
        numberCounters[i] = new NumberCounterObject(counters[i]);
    }
}

function getNumberCounterObjectByObserveTargetElement(element) {
    for (const counter of numberCounters) {
        if (counter.observeTargetElement == element) {
            return counter;
        }
    }
    return null;
}

function numberCounterToString(target, currentCount) {
    let stringCount = Math.ceil(currentCount).toString();
    while (target.toString().length > stringCount.length) {
        stringCount = "0" + stringCount;
    }
    return stringCount;
}

function startNumberCounter(counter, currentCount) {
    if (currentCount >= counter.target) {
        counter.element.textContent = counter.target;
        counter.observer.observe(counter.observeTargetElement, numberCounterMutationObserverConfig);
        return;
    }
    counter.element.textContent = numberCounterToString(counter.target, currentCount);
    currentCount += counter.stepCount;
    setTimeout(() => { startNumberCounter(counter, currentCount); }, counter.stepMs);
}

function NumberCounterObject(element) {
    this.element = element;
    this.target = parseInt(this.element.getAttribute("data-number-counter-target"));
    this.element.textContent = numberCounterToString(this.target, 0);
    this.durationMs = parseInt(this.element.getAttribute("data-number-counter-duration"));
    if (this.durationMs) {
        if (this.durationMs < 500) {
            console.error("Minimum number counter duration is 500ms. The duration will be set to the default value.");
            this.durationMs = defaultNumberCounterDurationMs;
        } else if (this.durationMs > 10000) {
            console.error("Maximum number counter duration is 10000ms. The duration will be set to the default value.");
            this.durationMs = defaultNumberCounterDurationMs;
        }
    } else {
        this.durationMs = defaultNumberCounterDurationMs;
    }
    let observeTarget = this.element.getAttribute("data-number-counter-observe-target");
    this.observeTargetElement;
    if (!observeTarget) {
        this.observeTargetElement = this.element;
    } else if (observeTarget != "self" && observeTarget != "parent") {
        this.observeTargetElement = this.element;
    } else if (observeTarget == "parent") {
        this.observeTargetElement = this.element.parentElement;
    } else {
        this.observeTargetElement = this.element;
    }
    let steps = Math.ceil(this.durationMs / 1000) * numberCounterFps;
    this.stepCount = this.target / steps;
    this.stepMs = Math.ceil(this.durationMs / steps);
    this.observer = new MutationObserver(numberCounterMutationObserverCallback);
    this.observer.observe(this.observeTargetElement, numberCounterMutationObserverConfig);
}