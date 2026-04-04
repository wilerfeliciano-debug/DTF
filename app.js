let posX = 0;
let posY = 0;
let linhaAlturaGlobal = 0;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let elementos = [];
let carregando = 0;

// ===== CARREGAR IMAGENS =====
document.getElementById("imagens").addEventListener("change", function(e) {

  const input = e.target;
  const files = input.files;

  const larguraImg = parseFloat(document.getElementById("imgLargura").value);
  const alturaImg = parseFloat(document.getElementById("imgAltura").value);
  const quantidade = parseInt(document.getElementById("quantidade").value) || 1;

  Array.from(files).forEach(file => {

    const reader = new FileReader();

    reader.onload = function(event) {

      let img = new Image();

      carregando++;

      img.onload = function() {

        for (let i = 0; i < quantidade; i++) {
          elementos.push({
            img: img,
            w: larguraImg,
            h: alturaImg
          });
        }

        carregando--;
        console.log("Imagem adicionada x" + quantidade);
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });

  input.value = "";
});

// ===== GERAR =====
function gerar() {

  const largura = parseFloat(document.getElementById("largura").value);
  const altura = parseFloat(document.getElementById("altura").value);

  const escala = 800 / largura;

  if (carregando > 0) {
    alert("Aguarde as imagens terminarem de carregar");
    return;
  }

  if (!canvas.dataset.iniciado) {
    canvas.width = 800;
    canvas.height = altura * escala;
    canvas.dataset.iniciado = "true";
  }

  if (elementos.length === 0) {
    alert("Nenhuma imagem carregada!");
    return;
  }

  desenharElementos(escala);
}

// ===== DESENHO =====
function desenharElementos(escala) {

  const espaco = 0.2 * escala;

  for (let i = 0; i < elementos.length; i++) {

    const el = elementos[i];

    const w = el.w * escala;
    const h = el.h * escala;

    // quebra linha
    if (posX + w > canvas.width) {
      posX = 0;
      posY += linhaAlturaGlobal + espaco;
      linhaAlturaGlobal = 0;
    }

    // limite da folha
    if (posY + h > canvas.height) {
      alert("Folha cheia!");
      break;
    }

    ctx.drawImage(el.img, posX, posY, w, h);

    posX += w + espaco;

    if (h > linhaAlturaGlobal) linhaAlturaGlobal = h;
  }

  elementos = [];
}

// ===== PDF =====
function exportarPDF() {

  const { jsPDF } = window.jspdf;

  const largura = parseFloat(document.getElementById("largura").value);
  const altura = parseFloat(document.getElementById("altura").value);

  const pdf = new jsPDF({
    orientation: largura > altura ? "landscape" : "portrait",
    unit: "cm",
    format: [largura, altura]
  });

  const imgData = canvas.toDataURL("image/png");

  pdf.addImage(imgData, "PNG", 0, 0, largura, altura);
  pdf.save("layout.pdf");
}

// ===== NOVA FOLHA =====
function novaFolha() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  posX = 0;
  posY = 0;
  linhaAlturaGlobal = 0;
  canvas.dataset.iniciado = "";
}

// ===== SALVAR =====
function salvar() {
  const projeto = {
    largura: document.getElementById("largura").value,
    altura: document.getElementById("altura").value
  };

  localStorage.setItem("projeto", JSON.stringify(projeto));
  alert("Projeto salvo!");
}

function carregar() {
  const projeto = JSON.parse(localStorage.getItem("projeto"));

  if (!projeto) return alert("Nada salvo");

  document.getElementById("largura").value = projeto.largura;
  document.getElementById("altura").value = projeto.altura;

  gerar();
}