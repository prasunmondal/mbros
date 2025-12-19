function switchLang(lang){
    localStorage.setItem("siteLang", lang);

    document.querySelectorAll("[data-translate]").forEach(el => {
        let key = el.getAttribute("data-translate");
        el.innerHTML = translations[lang][key];
    });

    document.querySelectorAll("[data-translate-placeholder]").forEach(el => {
        let key = el.getAttribute("data-translate-placeholder");
        el.placeholder = translations[lang][key];
    });

    updateWhatsAppText(lang);

    document.querySelector("#btnLangEn").style.opacity = lang==="en"?1:0.5;
    document.querySelector("#btnLangBn").style.opacity = lang==="bn"?1:0.5;
}

function updateWhatsAppText(lang){
    document.querySelector(".btn-whatsapp").href =
        lang === "bn" ?
        "https://wa.me/919734075801?text=আমি নতুন দোকান হিসেবে রেজিস্টার করতে চাই" :
        "https://wa.me/919734075801?text=I want to register as a new shop"
}

window.onload = ()=>{
    let lang = localStorage.getItem("siteLang") || "en";
    switchLang(lang);
}
