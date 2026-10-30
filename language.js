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

    document.querySelectorAll(".lang-opt").forEach(el => {
        el.style.opacity = el.dataset.lang === lang ? 1 : 0.5;
    });
}

function updateWhatsAppText(lang){
    const btn = document.querySelector(".btn-whatsapp");
    if (!btn) return; // Not present on every page

    btn.href =
        lang === "bn" ?
        "https://wa.me/919734075801?text=আমি নতুন দোকান হিসেবে রেজিস্টার করতে চাই" :
        "https://wa.me/919734075801?text=I want to register as a new shop"
}

document.addEventListener("DOMContentLoaded", () => {

    let saved = localStorage.getItem("siteLang");

    if (!saved) {
        // Default first-time language = Bengali
        saved = "bn";
        localStorage.setItem("siteLang", "bn");
    }

    switchLang(saved);
});
