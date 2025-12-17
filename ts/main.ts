/** @format */
// const tesseract = (window as any).Tesseract;
const filesInput = document.getElementById("inputFile") as HTMLInputElement;
const loader = document.getElementById("loader") as HTMLDivElement;
const emailsDiv = document.getElementById("emailsDiv") as HTMLDivElement;
const textArea = document.getElementById("text") as HTMLTextAreaElement;
const compteur = document.getElementById("compteur") as HTMLSpanElement;
const copySvg = document.getElementById("copySvg") as HTMLImageElement;
const downSvg = document.getElementById("downSvg") as HTMLImageElement;
const parentDiv = emailsDiv.parentElement as HTMLDivElement;
const notif = document.getElementById("notif") as HTMLDivElement;
const reg = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/gi;
const caractList = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzéèêëàâäôöùûüç0123456789.,!? '@ ";

type Data = { data: { text: string }; jobId: string };

textArea.addEventListener("change", () => {
   console.log("Changed");
   textArea.style.display = "none";
   loader.style.display = "flex";
   const textBrut = textArea.value.replace(/"/gi, "").replace(/,/gi, " ").replace(/;/gi, " ");
   let arr = textBrut.replace(/\n/g, " ").split(" ");
   let emails: string[] = [];
   // emailsDiv.innerHTML = "";
   arr.map((tx) => {
      if (reg.test(tx)) {
         // console.log(tx);
         emails.push(tx);
         const para = document.createElement("p");
         para.innerText = tx;
         emailsDiv.append(para);
         parentDiv.style.display = "flex";
      }
   });
   parentDiv.style.display = "flex";
   loader.style.display = "none";
});

filesInput.addEventListener("change", async (e) => {
   loader.style.display = "flex";
   const target = e.target as HTMLInputElement;
   if (target.files) {
      const files = target.files;
      let emails: string[] = [];
      for (let i = 0; i < files.length; i++) {
         compteur.innerText = `${i + 1}/${files.length}`;
         await Tesseract.recognize(files[i], "fra")

            .then((data: any) => {
               // console.log(data);
               const textBrut = data.data.text as string;
               // console.log(textBrut);
               let arr = textBrut.replace(/\n/g, " ").split(" ");
               arr.map((tx, index) => {
                  if (tx === "fi" || tx === "fr") {
                     // console.log("Adresse : ", arr[index + 1]);
                  }

                  // if (tx === "") {
                  if (tx === "æ") {
                     // console.log("Nom : ", arr[index + 1]);
                  }
                  if (/^0\d{9}/.test(tx)) {
                     // console.log("portable :", tx);
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
            .catch((err: any) => console.log(err));
      }

      loader.style.display = "none";
   }
});

copySvg.addEventListener("click", () => {
   const textToCopy = Array.from(emailsDiv.querySelectorAll("p"))
      .map((el) => el.textContent?.trim() || "")
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
   let cellsData: Cell[][] = [
      [
         { value: "N°", type: "string" },
         { value: "Email", type: "string" },
      ],
   ];
   const cells = Array.from(emailsDiv.querySelectorAll("p")).map((el, index) => {
      const email = el.textContent?.trim() as string;
      const cell: Cell[] = [
         { value: index + 1, type: "number" },
         { value: email, type: "string" },
      ];
      cellsData.push(cell);
   });

   // console.log(cellsData);
   const config = {
      filename: "emails",
      sheet: {
         data: cellsData,
      },
   };

   zipcelx(config);
});

type Cell = {
   value: string | number;
   type: "string" | "number";
};

type Row = Array<Cell>;

type Sheet = {
   data: Array<Row>;
};

type Config = {
   filename: string;
   sheet: Sheet;
};
