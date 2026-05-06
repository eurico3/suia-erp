function carregarAlunos() {
fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQYxduuWfBf_F6cvcrdeF_4Dq0ycEhXDYP4cdtIuAzxYdn3hKa4VWYvQxvArETQckJ54dClZUe6oZnp/pub?output=csv&t=" + new Date().getTime())
  .then(response => response.text())
  .then(data => {
    const rows = data.split("\n").map(row => row.split(","));

    const header = document.getElementById("header");
    const body = document.getElementById("body");

    header.innerHTML = "";
    body.innerHTML = "";

    // Cabeçalho
    rows[0].slice(1).forEach(col => {
      const th = document.createElement("th");
      th.innerText = col;
      header.appendChild(th);
    });

    // Dados
    rows.slice(1).forEach(row => {
      if (row.length > 1) {
        const tr = document.createElement("tr");

        row.slice(1).forEach(col => {
          const td = document.createElement("td");
          td.innerText = col;
          tr.appendChild(td);
        });

        body.appendChild(tr);
      }
    });
  });
}

function abrirForm() {
  document.getElementById("overlayForm").style.display = "flex";
}

function fecharForm() {
document.getElementById("overlayForm").style.display = "none";

document.getElementById("nome").value = "";
document.getElementById("whatsapp").value = "";
document.getElementById("email").value = "";
document.getElementById("obs").value = "";
}

function abrirLista() {
  carregarAlunos();
  document.getElementById("overlayLista").style.display = "flex";
}

function fecharLista() {
  document.getElementById("overlayLista").style.display = "none";
}

function abrirPresenca() {
document.getElementById("overlayPresenca").style.display = "flex";
carregarAlunosPresenca();
}

function fecharPresenca() {
document.getElementById("overlayPresenca").style.display = "none";
}



function carregarAlunosPresenca() {
fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQYxduuWfBf_F6cvcrdeF_4Dq0ycEhXDYP4cdtIuAzxYdn3hKa4VWYvQxvArETQckJ54dClZUe6oZnp/pub?output=csv&t=" + new Date().getTime())
    .then(response => response.text())
    .then(data => {
    const rows = data.split("\n").map(row => row.split(","));

    const container = document.getElementById("listaAlunosPresenca");
    container.innerHTML = "";

    // 👇 MESMA lógica da lista de alunos
    const alunos = rows
        .slice(1)
        .map(row => row[1]) // coluna nome
        .filter(nome => nome && nome.length > 0)
        .sort();

    alunos.forEach(nome => {
        const div = document.createElement("div");
        div.className = "aluno-item";

    div.innerHTML = `
    <span>${nome}</span>
    <input type="checkbox" value="${nome}">
    `;

        div.onclick = function(e) {
        if (e.target.tagName !== "INPUT") {
            const checkbox = this.querySelector("input");
            checkbox.checked = !checkbox.checked;
        }
        };

        container.appendChild(div);
    });
    });
}


function guardarPresenca() {
const checkboxes = document.querySelectorAll("#listaAlunosPresenca input:checked");

const data = new Date();

const dataFormatada = data.toISOString().split("T")[0];
const horaFormatada = data.toTimeString().slice(0,5);

checkboxes.forEach(cb => {
    const nome = cb.value;

    const url = "https://docs.google.com/forms/d/e/1FAIpQLSf5qKlT6T58AhTtbBfKnqhyYdxwj3fsrvozlUW8i0wCRBeVMQ/formResponse";

    const formData = new FormData();
    formData.append("entry.6897522", dataFormatada);
    formData.append("entry.87385591", horaFormatada);
    formData.append("entry.2044052258", nome);
    formData.append("entry.551017303", "não");

    fetch(url, {
    method: "POST",
    mode: "no-cors",
    body: formData
    });
});

alert("Presença guardada!");
fecharPresenca();
}


function guardarAluno() {
const nome = document.getElementById("nome").value;
const whatsapp = document.getElementById("whatsapp").value;
const email = document.getElementById("email").value;
const turma = document.getElementById("turma").value;
const obs = document.getElementById("obs").value;

const url = "https://docs.google.com/forms/d/e/1FAIpQLScvsosVj5uN_l2rTX-cjRSCI_3WekK36uMNpEm1iBslcFaXYg/formResponse";

const formData = new FormData();
formData.append("entry.1204402971", nome);
formData.append("entry.729881715", whatsapp);
formData.append("entry.385541780", email);
formData.append("entry.2086269672", turma);
formData.append("entry.1350015782", obs);

fetch(url, {
    method: "POST",
    mode: "no-cors",
    body: formData
});

alert("Aluno cadastrado!");

  // 🔥 LIMPAR CAMPOS
document.getElementById("nome").value = "";
document.getElementById("whatsapp").value = "";
document.getElementById("email").value = "";
document.getElementById("turma").value = "";
document.getElementById("obs").value = "";

fecharForm();
}


function abrirRelatorio() {
document.getElementById("overlayRelatorio").style.display = "flex";
carregarRelatorio();
}

function fecharRelatorio() {
document.getElementById("overlayRelatorio").style.display = "none";
}

function carregarRelatorio() {
fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vT4MVh3khDwjUuR7GdX5oxB_UfDOE2PJ60YEJ8NHG0bWpwRadpHz2IPAVFVSsgWA67d3YBDFy_in5hD/pub?gid=1429041231&single=true&output=csv&t=" + new Date().getTime())
    .then(res => res.text())
    .then(data => {

    const rows = data.split("\n").map(r => r.split(","));

    const contagem = {};

    rows.slice(1).forEach(row => {
        const aluno = row[3]
        ?.replace(/\r/g, "")      // remove carriage return
        .trim()                   // remove espaços
        .replace(/\s+/g, " ");    // normaliza espaços

        if (aluno) {
        if (!contagem[aluno]) {
            contagem[aluno] = 0;
        }
        contagem[aluno]++;
        }
    });

    const container = document.getElementById("relatorio");
    container.innerHTML = "";

    Object.keys(contagem)
        .sort()
        .forEach(nome => {
        const div = document.createElement("div");
        div.className = "aluno-item";

        div.innerHTML = `
            <span>${nome}</span>
            <strong>${contagem[nome]} aulas</strong>
        `;

        container.appendChild(div);
        });
    });
}

function abrirCompras() {
  document.getElementById("overlayCompras").style.display = "flex";
  carregarAlunosDropdown(); // 🔥 aqui
}

function fecharCompras() {
  document.getElementById("overlayCompras").style.display = "none";
}


function guardarCompra() {
  const aluno = document.getElementById("alunoCompra").value;
  const tipo = document.getElementById("tipoCeramica").value;
  const peso = document.getElementById("peso").value;
  const data = document.getElementById("dataCompra").value;

    // 🔴 VALIDAÇÃO AQUI
  if (!aluno) {
    alert("Selecione um aluno");
    return;
  }

  if (!peso) {
    alert("Introduza o peso");
    return;
  }

  if (!tipo) {
    alert("Selecione o tipo de cerâmica");
    return;
  }

  const url = "https://docs.google.com/forms/d/e/1FAIpQLSdHdYkjM5vdycAyGry5_sy4Jr1p9tw-lYDbJ62P-7gX9KykRg/formResponse";

  const formData = new FormData();
  formData.append("entry.1408765256", data);
  formData.append("entry.312043259", aluno);
  formData.append("entry.834368407", tipo);
  formData.append("entry.1733717729", peso);

  fetch(url, {
    method: "POST",
    mode: "no-cors",
    body: formData
  });

    // 🔥 limpar campos
  document.getElementById("dataCompra").value = "";
  document.getElementById("alunoCompra").value = "";
  document.getElementById("tipoCeramica").value = "";
  document.getElementById("peso").value = "";

  alert("Compra registada!");
  fecharCompras();
}

function carregarAlunosDropdown() {
  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQYxduuWfBf_F6cvcrdeF_4Dq0ycEhXDYP4cdtIuAzxYdn3hKa4VWYvQxvArETQckJ54dClZUe6oZnp/pub?output=csv&t=" + new Date().getTime())
    .then(res => res.text())
    .then(data => {
      const rows = data.split("\n").map(r => r.split(","));

      const select = document.getElementById("alunoCompra");
      select.innerHTML = "";

      // 🔥 opção default
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Selecionar aluno";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      select.appendChild(defaultOption);

      // 🔥 lista de alunos
      const alunos = rows
        .slice(1)
        .map(r => r[1]?.trim())
        .filter(nome => nome)
        .sort((a, b) => a.localeCompare(b));

      alunos.forEach(nome => {
        const option = document.createElement("option");
        option.value = nome;
        option.textContent = nome;
        select.appendChild(option);
      });
    });
}

const precos = {
  "Barro Vermelho": 5,
  "Barro Branco": 6,
  "Grés": 8,
  "Porcelana": 10
};


function abrirRelatorioFinanceiro() {
  document.getElementById("overlayFinanceiro").style.display = "flex";
  carregarRelatorioFinanceiro();
}

function fecharRelatorioFinanceiro() {
  document.getElementById("overlayFinanceiro").style.display = "none";
}

function carregarRelatorioFinanceiro() {
  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRWjajYC5aS_6w70ercNuIHaTp-hecr8xB04VBKLFd0coGwDhRMWuMphWiXVWmpW_VOXd9Q6bt-JGJQ/pub?gid=727460563&single=true&output=csv&t=" + new Date().getTime())
    .then(res => res.text())
    .then(data => {

      const rows = data.split("\n").map(r => r.split(","));

      const totais = {};

      rows.slice(1).forEach(row => {
        const aluno = row[2]?.trim();
        const tipo = row[3]?.trim();
        const pesoGramas = parseFloat(row[4]);

        if (!aluno || !tipo || !pesoGramas) return;

        const pesoKg = pesoGramas / 1000;
        const precoKg = precos[tipo] || 0;

        const valor = pesoKg * precoKg;

        if (!totais[aluno]) totais[aluno] = 0;
        totais[aluno] += valor;
      });

      const container = document.getElementById("relatorioFinanceiro");
      container.innerHTML = "";

      Object.keys(totais)
        .sort()
        .forEach(nome => {
          const div = document.createElement("div");
          div.className = "aluno-item";

          div.innerHTML = `
            <span>${nome}</span>
            <strong>R$ ${totais[nome].toFixed(2)}</strong>
          `;

          container.appendChild(div);
        });
    });
}

function abrirCartela() {
  document.getElementById("overlayCartela").style.display = "flex";
  carregarAlunosDropdownCartela();
}

function fecharCartela() {
  document.getElementById("overlayCartela").style.display = "none";
}


function carregarAlunosDropdownCartela() {
  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQYxduuWfBf_F6cvcrdeF_4Dq0ycEhXDYP4cdtIuAzxYdn3hKa4VWYvQxvArETQckJ54dClZUe6oZnp/pub?output=csv&t=" + new Date().getTime())
    .then(res => res.text())
    .then(data => {
      const rows = data.split("\n").map(r => r.split(","));

      const select = document.getElementById("alunoCartela");
      select.innerHTML = "";

      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Selecionar aluno";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      select.appendChild(defaultOption);

      const alunos = rows
        .slice(1)
        .map(r => r[1]?.trim())
        .filter(nome => nome)
        .sort();

      alunos.forEach(nome => {
        const option = document.createElement("option");
        option.value = nome;
        option.textContent = nome;
        select.appendChild(option);
      });
    });
}


async function guardarCartela() {

  const data = document.getElementById("dataCartela").value;
  const aluno = document.getElementById("alunoCartela").value;

  const dados = await obterDadosAluno(aluno);

  const saldo = dados.saldo;
  const validade = dados.validade
    ? dados.validade.toLocaleDateString("pt-BR")
    : "—";

  // 🔴 validação básica
  if (!data || !aluno) {
    alert("Preencha todos os campos!");
    return;
  }

  // 🔍 buscar email na base
  const emailAluno = await buscarEmailAluno(aluno);

  if (!emailAluno) {
    alert("Este aluno não tem email cadastrado!");
    return;
  }

  // 📤 enviar para Google Forms (cartela)
  const url = "https://docs.google.com/forms/d/e/1FAIpQLSedwW3XEeK8QMd50pRMsB5cwY7YzMEIEJ1IvTwNNabNIfHjqw/formResponse";

  const formData = new FormData();
  formData.append("entry.182184715", data);   // Data
  formData.append("entry.587151450", aluno);  // Nome

  fetch(url, {
    method: "POST",
    mode: "no-cors",
    body: formData
  });

  // 📧 enviar email automático
  emailjs.send("service_hhz5mvm", "template_9t8rspj", {
    nome: aluno,
    saldo: saldo,
    validade: validade,
    to_email: emailAluno
  })
  .then(function(response) {
    console.log("Email enviado!", response.status, response.text);
  })
  .catch(function(error) {
    console.log("Erro ao enviar email:", error);
  });

  alert("Cartela registrada e email enviado!");

    // limpar
  document.getElementById("dataCartela").value = "";
  document.getElementById("alunoCartela").value = "";

  fecharCartela();
}

async function obterDadosAluno(nomeAluno) {

  const urlPresencas = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT4MVh3khDwjUuR7GdX5oxB_UfDOE2PJ60YEJ8NHG0bWpwRadpHz2IPAVFVSsgWA67d3YBDFy_in5hD/pub?gid=1429041231&single=true&output=csv";
  const urlCartelas = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRGel0sWWnNu6SlQRgiMMVo4oE9sdRhHGyvB11p7_HmYBHCGTCfk974DLNcXw4HR30tGKR-GMMVpET4/pub?gid=1707649825&single=true&output=csv";

  const [presencasData, cartelasData] = await Promise.all([
    fetch(urlPresencas).then(r => r.text()),
    fetch(urlCartelas).then(r => r.text())
  ]);

  const presencas = presencasData.split("\n").map(r => r.split(","));
  const cartelas = cartelasData.split("\n").map(r => r.split(","));

  let usadas = 0;
  let compradas = 0;
  let validadeFinal = null;

  // presenças
  presencas.slice(1).forEach(row => {
    const aluno = row[3]?.trim();
    if (aluno === nomeAluno) usadas++;
  });

  // cartelas
  cartelas.slice(1).forEach(row => {
    const dataCompra = row[1];
    const aluno = row[2]?.trim();

    if (aluno === nomeAluno && dataCompra) {

      compradas += 4;

      const data = new Date(dataCompra);
      const validade = new Date(data);
      validade.setDate(validade.getDate() + 50);

      if (!validadeFinal || validade > validadeFinal) {
        validadeFinal = validade;
      }
    }
  });

  return {
    saldo: compradas - usadas,
    validade: validadeFinal
  };
}




async function buscarEmailAluno(nomeAluno) {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQYxduuWfBf_F6cvcrdeF_4Dq0ycEhXDYP4cdtIuAzxYdn3hKa4VWYvQxvArETQckJ54dClZUe6oZnp/pub?output=csv&t=";

  const data = await fetch(url).then(r => r.text());
  const rows = data.split("\n").map(r => r.split(","));

  for (let i = 1; i < rows.length; i++) {
    const nome = rows[i][1]?.trim();
    const email = rows[i][3]?.trim();

    if (nome === nomeAluno) {
      return email;
    }
  }

  return null;
}





function abrirVouchers() {
  document.getElementById("overlayVouchers").style.display = "flex";
  carregarVouchers();
}

function fecharVouchers() {
  document.getElementById("overlayVouchers").style.display = "none";
}


function carregarVouchers() {

  const urlPresencas = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT4MVh3khDwjUuR7GdX5oxB_UfDOE2PJ60YEJ8NHG0bWpwRadpHz2IPAVFVSsgWA67d3YBDFy_in5hD/pub?gid=1429041231&single=true&output=csv";
  const urlCartelas = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRGel0sWWnNu6SlQRgiMMVo4oE9sdRhHGyvB11p7_HmYBHCGTCfk974DLNcXw4HR30tGKR-GMMVpET4/pub?gid=1707649825&single=true&output=csv";

  Promise.all([
    fetch(urlPresencas).then(r => r.text()),
    fetch(urlCartelas).then(r => r.text())
  ]).then(([presencasData, cartelasData]) => {

    const presencas = presencasData.split("\n").map(r => r.split(","));
    const cartelas = cartelasData.split("\n").map(r => r.split(","));

    const usadas = {};
    const compradas = {};
    const statusWhatsApp = {};

    // 🟢 CONTAR AULAS USADAS + STATUS WHATSAPP
    presencas.slice(1).forEach(row => {
      const aluno = row[3]?.replace(/\r/g, "").trim();
      const whatsapp = row[4]?.replace(/\r/g, "").trim();

      if (!aluno) return;

      if (!usadas[aluno]) usadas[aluno] = 0;
      usadas[aluno]++;

      // guarda estado mais recente
      statusWhatsApp[aluno] = whatsapp;
    });

    // 🟢 CONTAR CARTELAS + VALIDADE
    cartelas.slice(1).forEach(row => {
      const dataCompra = row[1];
      const aluno = row[2]?.replace(/\r/g, "").trim();

      if (!aluno || !dataCompra) return;

      const data = new Date(dataCompra);
      const validade = new Date(data);
      validade.setDate(validade.getDate() + 50);

      if (!compradas[aluno]) {
        compradas[aluno] = {
          aulas: 0,
          validade: validade
        };
      }

      compradas[aluno].aulas += 4;

      if (validade > compradas[aluno].validade) {
        compradas[aluno].validade = validade;
      }
    });

    const container = document.getElementById("relatorioVouchers");
    container.innerHTML = "";

    const alunos = new Set([
      ...Object.keys(usadas),
      ...Object.keys(compradas)
    ]);

    const hoje = new Date();

    alunos.forEach(nome => {

      const totalComprado = compradas[nome]?.aulas || 0;
      const totalUsado = usadas[nome] || 0;
      const saldo = totalComprado - totalUsado;

      const validade = compradas[nome]?.validade;

      let status = "";

      if (validade) {
        if (hoje > validade) {
          status = "❌ Expirado";
        } else {
          status = "Expira em " + validade.toLocaleDateString("pt-BR");
        }
      }

      // 🔴🟢 STATUS WHATSAPP
      const statusWhats = statusWhatsApp[nome];

      const bola = statusWhats === "não"
        ? '<span class="bola vermelha"></span>'
        : '<span class="bola verde"></span>';

      const div = document.createElement("div");
      div.className = "aluno-item";

      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
          
          <div>
            <div>${nome} ${bola}</div>
            <div style="font-size: 12px; color: gray;">${status}</div>
          </div>

          <div style="display:flex; align-items:center; gap:10px;">
            <strong>${saldo} aulas</strong>
            <button class="btn-whatsapp" onclick="clicarWhatsApp('${nome}', ${saldo})">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" />
            </button>
          </div>

        </div>
      `;

      container.appendChild(div);
    });

  });
}

function formatarTelefone(telefone) {
  return "55" + telefone.replace(/\D/g, "");
}

async function buscarTelefoneAluno(nomeAluno) {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQYxduuWfBf_F6cvcrdeF_4Dq0ycEhXDYP4cdtIuAzxYdn3hKa4VWYvQxvArETQckJ54dClZUe6oZnp/pub?output=csv&t=";

  const data = await fetch(url).then(r => r.text());
  const rows = data.split("\n").map(r => r.split(","));

  

  for (let i = 1; i < rows.length; i++) {
    const nome = rows[i][1]?.trim();
    const telefone = rows[i][2]?.trim();

    if (nome === nomeAluno) {
      return telefone;
    }
  }

  return null;
}


function abrirWhatsApp(aluno, telefone, saldo, validade) {

  if (!telefone) {
    alert("Aluno sem telefone cadastrado!");
    return;
  }

  const mensagem = `Olá ${aluno},

Sua presença foi confirmada 🏺

Saldo atual: ${saldo} aulas
Validade: ${validade}

Até a próxima 🙂
Suia Studio`;
  const telefoneFormatado = formatarTelefone(telefone);
  const url = `https://wa.me/${telefoneFormatado}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}


async function clicarWhatsApp(nome, saldo) {

  const telefone = await buscarTelefoneAluno(nome);

  const dados = await obterDadosAluno(nome);

  const validade = dados.validade
    ? dados.validade.toLocaleDateString("pt-BR")
    : "—";

  // abre WhatsApp
  abrirWhatsApp(nome, telefone, saldo, validade);

  const hoje = new Date().toLocaleDateString("pt-BR");

  fetch("https://script.google.com/macros/s/AKfycby9gQ1jua5lgOVs3RBMQPdHyxbNDQpQZ2Q-XevvZrsSZeXoGb9FKqUUOhlz1LVu7Nj3sQ/exec", {
    method: "POST",
    body: new URLSearchParams({
      nome: nome,
      data: hoje
    })
  })
  .then(res => res.text())
  .then(res => alert("Resposta: " + res))
  .catch(err => alert("Erro: " + err));

}