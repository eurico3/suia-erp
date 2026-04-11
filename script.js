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
      rows[0].forEach(col => {
        const th = document.createElement("th");
        th.innerText = col;
        header.appendChild(th);
      });

      // Dados
      rows.slice(1).forEach(row => {
        if (row.length > 1) {
          const tr = document.createElement("tr");

          row.forEach(col => {
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
      location.reload();
    }

    function abrirLista() {
      carregarAlunos();
      document.getElementById("overlayLista").style.display = "flex";
    }

    function fecharLista() {
      document.getElementById("overlayLista").style.display = "none";
    }
