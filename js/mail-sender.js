let formElement;

function initMailSender() {
    emailjs.init({
        publicKey: "bamynrPBhbxBJCVrb",
    });
    formElement = document.querySelector("form");
    formElement.reset();
}

function sendMail(event) {
    if (Cookies.get("form-sent")) {
        alert("Možete poslati maksimalno jedan upit dnevno. Ukoliko imate dodatnih pitanja molim Vas da pozovete na naš kontakt telefon ili nam pošaljite e-mail.");
        formElement.reset();
        event.preventDefault();
        return;
    }
    let params;
    try {
        params = gatherParameters();
    } catch (e) {
        alert(e);
        event.preventDefault();
        return;
    }
    emailjs.send("service_elektro", "template_elektro", params).then(
        (response) => {
            Cookies.set("form-sent", "sent", { expires: 1 });
            formElement.reset();
            alert('Upit je uspešno poslat. Hvala Vam!');
        },
        (error) => {
            alert("Upit nije poslat. Molimo Vas da probate ponovo kasnije ili da nas kontaktirate direktno.");
        });
    event.preventDefault();
}

function gatherParameters() {
    let checkedServices = document.querySelectorAll("input[name='extra']:checked");
    if (checkedServices.length == 0) {
        throw new Error("Niste odabrali ni jednu uslugu.");
    }
    let theServices = [];
    for (let i = 0; i < checkedServices.length; i++) {
        theServices[i] = checkedServices[i].value;
    }
    let params = {
        from_name: document.getElementById("form-name").value,
        from_mail: document.getElementById("form-email").value,
        from_number: document.getElementById("form-phone").value,
        desc: document.geteElementById("form-desc").value,
        object_type: "/",
        services: theServices
    };
    return params;
}