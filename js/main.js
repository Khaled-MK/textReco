"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const filesInput = document.getElementById("inputFile");
const loader = document.getElementById("loader");
const emailsDiv = document.getElementById("emailsDiv");
const compteur = document.getElementById("compteur");
const copySvg = document.getElementById("copySvg");
const downSvg = document.getElementById("downSvg");
const parentDiv = emailsDiv.parentElement;
const notif = document.getElementById("notif");
const reg = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/gi;
const caractList = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzéèêëàâäôöùûüç0123456789.,!? '@ ";
filesInput.addEventListener("change", (e) => __awaiter(void 0, void 0, void 0, function* () {
    loader.style.display = "flex";
    const target = e.target;
    if (target.files) {
        const files = target.files;
        let emails = [];
        for (let i = 0; i < files.length; i++) {
            compteur.innerText = `${i + 1}/${files.length}`;
            yield Tesseract.recognize(files[i], "fra")
                .then((data) => {
                const textBrut = data.data.text;
                let arr = textBrut.replace(/\n/g, " ").split(" ");
                arr.map((tx, index) => {
                    if (tx === "fi" || tx === "fr") {
                    }
                    if (tx === "æ") {
                    }
                    if (/^0\d{9}/.test(tx)) {
                    }
                    if (reg.test(tx)) {
                        emails.push(tx);
                        const para = document.createElement("p");
                        para.innerText = tx;
                        emailsDiv.append(para);
                        parentDiv.style.display = "flex";
                    }
                });
            })
                .catch((err) => console.log(err));
        }
        loader.style.display = "none";
    }
}));
copySvg.addEventListener("click", () => {
    const textToCopy = Array.from(emailsDiv.querySelectorAll("p"))
        .map((el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; })
        .filter((text) => text !== "")
        .join("\n");
    navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
        notif.style.display = "flex";
        setTimeout(() => {
            notif.style.display = "none";
        }, 1000);
    })
        .catch((err) => {
        console.error("Erreur lors de la copie :", err);
    });
});
downSvg.addEventListener("click", () => {
    let cellsData = [
        [
            { value: "N°", type: "string" },
            { value: "Email", type: "string" },
        ],
    ];
    const cells = Array.from(emailsDiv.querySelectorAll("p")).map((el, index) => {
        var _a;
        const email = (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim();
        const cell = [
            { value: index + 1, type: "number" },
            { value: email, type: "string" },
        ];
        cellsData.push(cell);
    });
    const config = {
        filename: "emails",
        sheet: {
            data: cellsData,
        },
    };
    zipcelx(config);
});
