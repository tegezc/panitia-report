function formatRp(amount) {
  var sign = amount < 0 ? "-" : "";
  var digits = String(Math.abs(amount));
  var grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return sign + "Rp " + grouped;
}

function rowCountLabel(label, count) {
  return label + " · " + count + " baris terbaca";
}

function gapLabel(label, difference) {
  return "Selisih " + label + " " + formatRp(Math.abs(difference));
}

function readingText(row, kind) {
  if (row.status === "aside") return "Tidak dihitung";
  if (row.status === "red") return "Belum ada jumlah";
  if (kind === "income") {
    var rt = row.rt ? " RT " + row.rt : "";
    return row.name + rt + " · " + formatRp(row.amount);
  }
  var group = row.group ? " · " + row.group : "";
  var text = row.item + group + " · " + formatRp(row.amount);
  if (row.multiply) {
    text += " · Hitung: " + row.multiply.qty + " × " + formatRp(row.multiply.unit) + " = " + formatRp(row.multiply.product);
    text += " · Tertulis: " + formatRp(row.multiply.written);
  }
  return text;
}

function renderRow(row, kind) {
  var item = document.createElement("li");
  item.className = "row";
  if (row.status === "yellow-amount" || row.status === "yellow-multiply") item.className += " row-yellow";
  if (row.status === "red") item.className += " row-red";
  if (row.status === "aside") item.className += " row-aside";
  var original = document.createElement("p");
  original.className = "raw";
  original.textContent = row.raw;
  var reading = document.createElement("p");
  reading.className = "reading";
  reading.textContent = readingText(row, kind);
  item.appendChild(original);
  item.appendChild(reading);
  return item;
}

function renderMessage(host, label, message) {
  host.innerHTML = "";
  var summary = document.createElement("p");
  summary.className = "summary";
  if (!message) {
    summary.textContent = label + " · Tidak ditempel";
    host.appendChild(summary);
    var zero = document.createElement("p");
    zero.textContent = "TOTAL tertulis: " + formatRp(0);
    host.appendChild(zero);
    return;
  }
  summary.textContent = rowCountLabel(label, message.rows.length);
  host.appendChild(summary);
  var total = document.createElement("p");
  total.className = "written-total";
  if (message.total.state === "written") {
    total.textContent = "TOTAL tertulis: " + formatRp(message.total.amount);
  } else {
    total.textContent = "Tidak ada baris TOTAL.";
  }
  host.appendChild(total);
  var list = document.createElement("ul");
  list.className = "rows";
  for (var i = 0; i < message.rows.length; i++) {
    list.appendChild(renderRow(message.rows[i], label === "Dana masuk" ? "income" : "expense"));
  }
  host.appendChild(list);
}

function showPaste(message) {
  document.getElementById("paste-view").hidden = false;
  document.getElementById("report-view").hidden = true;
  document.getElementById("paste-note").textContent = message || "";
}

function showReport(income, expense) {
  document.getElementById("paste-view").hidden = true;
  document.getElementById("report-view").hidden = false;
  var eventName = income && income.eventName ? income.eventName : "";
  var eventDate = income && income.eventDate ? income.eventDate : "";
  document.getElementById("event-name").value = eventName;
  document.getElementById("event-date").value = eventDate;
  var figures = reportFigures(income, expense);
  document.getElementById("saldo-awal").textContent = formatRp(figures.saldoAwal);
  document.getElementById("total-donasi").textContent = formatRp(figures.totalDonasi);
  document.getElementById("total-pengeluaran").textContent = formatRp(figures.totalPengeluaran);
  document.getElementById("saldo-akhir").textContent = formatRp(figures.saldoAkhir);

  var gaps = [];
  if (income && income.total.state === "written" && income.total.amount !== figures.incomeTotal) {
    gaps.push(gapLabel("Dana masuk", income.total.amount - figures.incomeTotal));
  }
  if (expense && expense.total.state === "written" && expense.total.amount !== figures.totalPengeluaran) {
    gaps.push(gapLabel("Dana keluar", expense.total.amount - figures.totalPengeluaran));
  }
  var gap = document.getElementById("gap");
  gap.hidden = gaps.length === 0;
  gap.textContent = gaps.join(" · ");

  renderMessage(document.getElementById("income-list"), "Dana masuk", income);
  renderMessage(document.getElementById("expense-list"), "Dana keluar", expense);
}

function readPasted() {
  var incomeText = document.getElementById("income-paste").value;
  var expenseText = document.getElementById("expense-paste").value;
  if (!incomeText.trim() && !expenseText.trim()) {
    showPaste("Tempel minimal satu pesan.");
    return;
  }
  var income = incomeText.trim() ? parseMessage(incomeText, "income") : null;
  var expense = expenseText.trim() ? parseMessage(expenseText, "expense") : null;
  showReport(income, expense);
}

if (typeof document !== "undefined") {
  document.getElementById("read-button").addEventListener("click", readPasted);
}
