function formatRp(amount) {
  var sign = amount < 0 ? "-" : "";
  var digits = String(Math.abs(amount));
  var grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return sign + "Rp " + grouped;
}

function parseTypedAmount(text) {
  var digits = String(text).replace(/[^\d]/g, "");
  if (!digits) return null;
  return Number(digits);
}

function rowCountLabel(label, count) {
  return label + " · " + count + " baris terbaca";
}

function gapLabel(label, difference) {
  return "Selisih " + label + " " + formatRp(Math.abs(difference));
}

function createReport(income, expense) {
  return {
    eventName: income && income.eventName ? income.eventName : "",
    eventDate: income && income.eventDate ? income.eventDate : "",
    typedSaldoAwal: null,
    income: income,
    expense: expense
  };
}

function figuresOf(report) {
  return reportFigures(report.income, report.expense, report.typedSaldoAwal);
}

function openRows(message) {
  if (!message) return false;
  for (var i = 0; i < message.rows.length; i++) {
    var status = message.rows[i].status;
    if (status === "yellow-amount" || status === "yellow-multiply" || status === "red") return true;
  }
  return false;
}

function messageReady(message, computed) {
  if (!message) return true;
  if (message.total.state === "unasked" || message.total.state === "empty") return false;
  if (message.total.amount === null) return false;
  return message.total.amount === computed;
}

function gateOpen(report) {
  var figures = figuresOf(report);
  if (openRows(report.income) || openRows(report.expense)) return false;
  return messageReady(report.income, figures.incomeTotal) && messageReady(report.expense, figures.totalPengeluaran);
}

function acceptAmount(row) {
  if (row.status !== "yellow-amount") return;
  row.status = "clear";
}

function keepWritten(row) {
  if (row.status !== "yellow-multiply" || !row.multiply) return;
  row.amount = row.multiply.written;
  row.status = "clear";
}

function useProduct(row) {
  if (row.status !== "yellow-multiply" || !row.multiply) return;
  row.amount = row.multiply.product;
  row.status = "clear";
}

function setRowAmount(row, amount) {
  if (amount === null) return false;
  row.amount = amount;
  if (row.status === "red" || row.status === "yellow-amount" || row.status === "yellow-multiply") {
    row.status = "clear";
  }
  return true;
}

function markNotTransaction(row) {
  row.status = "aside";
  row.amount = null;
  row.saldoAwal = false;
}

function countSetAside(row, amount) {
  if (row.status !== "aside" || amount === null) return false;
  row.amount = amount;
  row.status = "clear";
  return true;
}

function setMatchTotal(message, amount) {
  if (!message || amount === null) return false;
  message.total = { state: "written", amount: amount };
  return true;
}

function acceptComputedTotal(message, amount) {
  if (!message || message.total.state !== "unasked") return false;
  message.total = { state: "accepted", amount: amount };
  return true;
}

function rejectComputedTotal(message) {
  if (!message || message.total.state !== "unasked") return false;
  message.total = { state: "empty", amount: null };
  return true;
}

function tryTypedOpening(report, amount) {
  if (amount === null || !report.income) return false;
  var incomeTotal = reportFigures(report.income, report.expense, null).incomeTotal;
  if (amount > incomeTotal) return false;
  for (var i = 0; i < report.income.rows.length; i++) report.income.rows[i].saldoAwal = false;
  report.typedSaldoAwal = amount;
  return true;
}

function markOpening(report, row) {
  if (!report.income || report.income.rows.indexOf(row) === -1) return false;
  if (row.amount === null) return false;
  for (var i = 0; i < report.income.rows.length; i++) report.income.rows[i].saldoAwal = false;
  row.saldoAwal = true;
  report.typedSaldoAwal = null;
  return true;
}

var pageReport = null;

function readingText(row, kind) {
  if (row.status === "aside") return "Tidak dihitung";
  if (row.status === "red") return "Belum ada jumlah";
  if (kind === "income") {
    var rt = row.rt ? " RT " + row.rt : "";
    var marked = row.saldoAwal ? " · Saldo awal" : "";
    return row.name + rt + " · " + formatRp(row.amount) + marked;
  }
  var group = row.group ? " · " + row.group : "";
  var text = row.item + group + " · " + formatRp(row.amount);
  if (row.multiply) {
    text += " · Hitung: " + row.multiply.qty + " × " + formatRp(row.multiply.unit) + " = " + formatRp(row.multiply.product);
    text += " · Tertulis: " + formatRp(row.multiply.written);
  }
  return text;
}

function addButton(parent, label, onClick) {
  var button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  parent.appendChild(button);
  return button;
}

function amountField(parent, onCommit) {
  var input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Jumlah";
  var save = document.createElement("button");
  save.type = "button";
  save.textContent = "Simpan";
  save.addEventListener("click", function () {
    var amount = parseTypedAmount(input.value);
    if (amount === null) return;
    onCommit(amount);
  });
  parent.appendChild(input);
  parent.appendChild(save);
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
  var actions = document.createElement("p");
  actions.className = "actions";

  if (row.status === "yellow-amount") {
    addButton(actions, "Benar", function () { acceptAmount(row); drawReport(); });
    addButton(actions, "Ubah", function () { showEdit(actions, row, kind); });
  } else if (row.status === "yellow-multiply") {
    addButton(actions, "Pakai tertulis", function () { keepWritten(row); drawReport(); });
    addButton(actions, "Pakai hitungan", function () { useProduct(row); drawReport(); });
  } else if (row.status === "red") {
    amountField(actions, function (amount) { setRowAmount(row, amount); drawReport(); });
    addButton(actions, "Bukan transaksi", function () { markNotTransaction(row); drawReport(); });
  } else if (row.status === "aside") {
    addButton(actions, "Ini transaksi", function () {
      actions.innerHTML = "";
      amountField(actions, function (amount) { countSetAside(row, amount); drawReport(); });
    });
  } else if (row.status === "clear") {
    addButton(actions, "Ubah", function () { showEdit(actions, row, kind); });
    if (kind === "income") {
      addButton(actions, "Saldo awal", function () { markOpening(pageReport, row); drawReport(); });
    }
  }

  if (actions.childNodes.length) item.appendChild(actions);
  return item;
}

function showEdit(actions, row, kind) {
  actions.innerHTML = "";
  var amount = document.createElement("input");
  amount.type = "text";
  amount.value = row.amount === null ? "" : formatRp(row.amount).replace("Rp ", "");
  var name = document.createElement("input");
  name.type = "text";
  if (kind === "income") {
    name.value = row.name;
    name.placeholder = "Nama";
    var rt = document.createElement("input");
    rt.type = "text";
    rt.value = row.rt;
    rt.placeholder = "RT";
    actions.appendChild(amount);
    actions.appendChild(name);
    actions.appendChild(rt);
  } else {
    name.value = row.item;
    name.placeholder = "Item";
    var group = document.createElement("input");
    group.type = "text";
    group.value = row.group;
    group.placeholder = "Kelompok";
    actions.appendChild(amount);
    actions.appendChild(name);
    actions.appendChild(group);
  }
  addButton(actions, "Simpan", function () {
    var next = parseTypedAmount(amount.value);
    if (next === null) return;
    setRowAmount(row, next);
    if (kind === "income") {
      row.name = name.value;
      row.rt = rt.value;
    } else {
      row.item = name.value;
      row.group = group.value;
    }
    drawReport();
  });
}

function renderTotal(host, label, message, computed) {
  var total = document.createElement("p");
  total.className = "written-total";
  if (!message) {
    total.textContent = "TOTAL tertulis: " + formatRp(0);
    host.appendChild(total);
    return;
  }
  if (message.total.state === "unasked") {
    total.textContent = "Tidak ada baris TOTAL. Yang terbaca " + formatRp(computed) + ". Apakah benar?";
    host.appendChild(total);
    var ask = document.createElement("p");
    ask.className = "actions";
    addButton(ask, "Ya", function () { acceptComputedTotal(message, computed); drawReport(); });
    addButton(ask, "Tidak", function () { rejectComputedTotal(message); drawReport(); });
    host.appendChild(ask);
    return;
  }
  if (message.total.state === "empty") {
    total.textContent = "TOTAL tertulis: belum diisi";
  } else {
    total.textContent = "TOTAL tertulis: " + formatRp(message.total.amount);
  }
  host.appendChild(total);
  var edit = document.createElement("p");
  edit.className = "actions";
  addButton(edit, "Ubah", function () {
    edit.innerHTML = "";
    amountField(edit, function (amount) { setMatchTotal(message, amount); drawReport(); });
  });
  host.appendChild(edit);
}

function renderMessage(host, label, message, computed) {
  host.innerHTML = "";
  var summary = document.createElement("p");
  summary.className = "summary";
  if (!message) {
    summary.textContent = label + " · Tidak ditempel";
    host.appendChild(summary);
    renderTotal(host, label, null, 0);
    return;
  }
  summary.textContent = rowCountLabel(label, message.rows.length);
  host.appendChild(summary);
  renderTotal(host, label, message, computed);
  var list = document.createElement("ul");
  list.className = "rows";
  var kind = label === "Dana masuk" ? "income" : "expense";
  for (var i = 0; i < message.rows.length; i++) list.appendChild(renderRow(message.rows[i], kind));
  host.appendChild(list);
}

function drawReport() {
  var report = pageReport;
  document.getElementById("paste-view").hidden = true;
  document.getElementById("report-view").hidden = false;
  document.getElementById("event-name").value = report.eventName;
  document.getElementById("event-date").value = report.eventDate;
  var figures = figuresOf(report);
  var saldo = document.getElementById("saldo-awal");
  saldo.textContent = formatRp(figures.saldoAwal);
  document.getElementById("total-donasi").textContent = formatRp(figures.totalDonasi);
  document.getElementById("total-pengeluaran").textContent = formatRp(figures.totalPengeluaran);
  document.getElementById("saldo-akhir").textContent = formatRp(figures.saldoAkhir);

  var gaps = [];
  if (report.income && (report.income.total.state === "written" || report.income.total.state === "accepted") && report.income.total.amount !== figures.incomeTotal) {
    gaps.push(gapLabel("Dana masuk", report.income.total.amount - figures.incomeTotal));
  }
  if (report.expense && (report.expense.total.state === "written" || report.expense.total.state === "accepted") && report.expense.total.amount !== figures.totalPengeluaran) {
    gaps.push(gapLabel("Dana keluar", report.expense.total.amount - figures.totalPengeluaran));
  }
  var gap = document.getElementById("gap");
  gap.hidden = gaps.length === 0;
  gap.textContent = gaps.join(" · ");
  renderMessage(document.getElementById("income-list"), "Dana masuk", report.income, figures.incomeTotal);
  renderMessage(document.getElementById("expense-list"), "Dana keluar", report.expense, figures.totalPengeluaran);

  var download = document.getElementById("download");
  var ready = gateOpen(report);
  download.disabled = !ready;
  download.textContent = ready ? "Unduh PDF" : "Masih ada baris yang perlu dicek.";
  download.className = ready ? "download ready" : "download";
}

function showPaste(message) {
  document.getElementById("paste-view").hidden = false;
  document.getElementById("report-view").hidden = true;
  document.getElementById("paste-note").textContent = message || "";
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
  var rawIncome = income ? income.raw : null;
  var rawExpense = expense ? expense.raw : null;
  pageReport = createReport(income, expense);
  drawReport();
  if (income && income.raw !== rawIncome) income.raw = rawIncome;
  if (expense && expense.raw !== rawExpense) expense.raw = rawExpense;
}

function editOpening() {
  var cell = document.getElementById("saldo-awal");
  var input = document.createElement("input");
  input.type = "text";
  input.value = cell.textContent.replace("Rp ", "");
  cell.textContent = "";
  cell.appendChild(input);
  input.focus();
  input.addEventListener("change", function () {
    var amount = parseTypedAmount(input.value);
    tryTypedOpening(pageReport, amount);
    drawReport();
  });
}

if (typeof document !== "undefined") {
  document.getElementById("read-button").addEventListener("click", readPasted);
  document.getElementById("event-name").addEventListener("input", function (event) {
    if (pageReport) pageReport.eventName = event.target.value;
  });
  document.getElementById("event-date").addEventListener("input", function (event) {
    if (pageReport) pageReport.eventDate = event.target.value;
  });
  document.getElementById("saldo-awal").addEventListener("click", editOpening);
  document.getElementById("download").addEventListener("click", function (event) {
    event.preventDefault();
  });
}
