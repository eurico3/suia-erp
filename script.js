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
    const obs = document.getElementById("obs").value;

    const url = "https://docs.google.com/forms/d/e/1FAIpQLScvsosVj5uN_l2rTX-cjRSCI_3WekK36uMNpEm1iBslcFaXYg/formResponse";

    const formData = new FormData();
    formData.append("entry.1204402971", nome);
    formData.append("entry.729881715", whatsapp);
    formData.append("entry.385541780", email);
    formData.append("entry.1350015782", obs);

    fetch(url, {
        method: "POST",
        mode: "no-cors",
        body: formData
    });

    alert("Aluno cadastrado!");

    fecharForm();
    }