function setLanguage(lang) {
    let url = "/public/";
    if (lang === "th") url += "index";
    else if (lang === "en") url += "en";
    else if (lang === "cn") url += "cn";

    window.location.href = url;
}
