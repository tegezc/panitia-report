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
    signatures: [],
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
var openTile = null;
var reopenList = null;

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

function tileTitle(row, kind) {
  if (row.status === "aside") {
    var raw = row.raw.replace(/\s+/g, " ");
    return raw.length > 48 ? raw.slice(0, 48) + "…" : raw;
  }
  var amount = row.amount === null ? "Belum ada jumlah" : formatRp(row.amount);
  var name = kind === "income" ? (row.name || "Tanpa nama") : (row.item || "Tanpa item");
  return name + "  " + amount;
}

function renderDetail(row, kind) {
  var item = document.createElement("div");
  item.className = "detail";
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

function renderTile(row, kind, index) {
  var key = kind + ":" + index;
  var wrap = document.createElement("li");
  wrap.className = "tile-wrap";
  var tile = document.createElement("button");
  tile.type = "button";
  tile.className = "tile";
  if (row.status === "yellow-amount" || row.status === "yellow-multiply") tile.className += " row-yellow";
  if (row.status === "red") tile.className += " row-red";
  if (row.status === "aside") tile.className += " row-aside";
  tile.textContent = tileTitle(row, kind);
  tile.addEventListener("click", function () {
    openTile = openTile === key ? null : key;
    drawReport();
  });
  wrap.appendChild(tile);
  if (openTile === key) wrap.appendChild(renderDetail(row, kind));
  return wrap;
}

function groupSubtotal(entries) {
  var sum = 0;
  for (var i = 0; i < entries.length; i++) {
    var row = entries[i].row;
    if (row.amount !== null && row.status !== "aside" && row.status !== "red") sum += row.amount;
  }
  return sum;
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
  total.className = "written-total total-line";
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
  host.className = label === "Dana masuk" ? "section-income" : "section-expense";
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
  var reopenSlot = document.createElement("div");
  reopenSlot.className = "reopen-slot";
  addButton(host, "Lihat pesan", function () {
    reopenList = reopenList === label ? null : label;
    drawReport();
  });
  host.appendChild(reopenSlot);
  if (reopenList === label) {
    var box = document.createElement("div");
    box.className = "reopen";
    var area = document.createElement("textarea");
    area.value = message.raw;
    box.appendChild(area);
    addButton(box, "Baca pesan", function () {
      if (area.value === message.raw) return;
      askConfirm("Pesan ini akan dibaca ulang. Koreksi pada pesan ini hilang.", function () {
        rereadMessage(label === "Dana masuk" ? "income" : "expense", area.value);
      });
    });
    reopenSlot.appendChild(box);
  }
  renderTotal(host, label, message, computed);
  var list = document.createElement("ul");
  list.className = "rows";
  var kind = label === "Dana masuk" ? "income" : "expense";
  if (kind === "income") {
    var groups = [];
    var aside = [];
    for (var i = 0; i < message.rows.length; i++) {
      var row = message.rows[i];
      if (row.saldoAwal) continue;
      if (row.status === "aside") {
        aside.push({ row: row, index: i });
        continue;
      }
      var found = null;
      for (var g = 0; g < groups.length; g++) {
        if (groups[g].rt === row.rt) found = groups[g];
      }
      if (!found) {
        found = { rt: row.rt, entries: [] };
        groups.push(found);
      }
      found.entries.push({ row: row, index: i });
    }
    for (var n = 0; n < groups.length; n++) {
      var head = document.createElement("li");
      head.className = "group-head total-line";
      head.textContent = (groups[n].rt ? "RT " + groups[n].rt : "Tanpa RT") + "  " + formatRp(groupSubtotal(groups[n].entries));
      list.appendChild(head);
      for (var t = 0; t < groups[n].entries.length; t++) {
        list.appendChild(renderTile(groups[n].entries[t].row, kind, groups[n].entries[t].index));
      }
    }
    if (aside.length) {
      var asideHead = document.createElement("li");
      asideHead.className = "group-head";
      asideHead.textContent = "Tidak dihitung";
      list.appendChild(asideHead);
      for (var a = 0; a < aside.length; a++) list.appendChild(renderTile(aside[a].row, kind, aside[a].index));
    }
  } else {
    var expenseEntries = [];
    for (var e = 0; e < message.rows.length; e++) {
      expenseEntries.push({ row: message.rows[e], index: e });
      list.appendChild(renderTile(message.rows[e], kind, e));
    }
    var expenseTotal = document.createElement("li");
    expenseTotal.className = "total-line";
    expenseTotal.textContent = "Total  " + formatRp(groupSubtotal(expenseEntries));
    list.appendChild(expenseTotal);
  }
  host.appendChild(list);
}

function renderSignatures(host, report) {
  host.innerHTML = "";
  var title = document.createElement("p");
  title.textContent = "Tanda tangan";
  host.appendChild(title);
  for (var i = 0; i < report.signatures.length; i++) {
    (function (index) {
      var line = document.createElement("p");
      line.textContent = report.signatures[index].role + " · " + report.signatures[index].name;
      addButton(line, "Hapus", function () {
        report.signatures.splice(index, 1);
        drawReport();
      });
      host.appendChild(line);
    })(i);
  }
  if (report.signatures.length >= 3) return;
  addButton(host, "Tambah penandatangan", function () {
    var role = document.createElement("input");
    role.type = "text";
    role.placeholder = "Jabatan";
    var name = document.createElement("input");
    name.type = "text";
    name.placeholder = "Nama";
    host.appendChild(role);
    host.appendChild(name);
    addButton(host, "Simpan", function () {
      if (report.signatures.length >= 3) return;
      if (!role.value.trim() || !name.value.trim()) return;
      report.signatures.push({ role: role.value.trim(), name: name.value.trim() });
      drawReport();
    });
  });
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
  renderSignatures(document.getElementById("signatures"), report);
  renderMessage(document.getElementById("income-list"), "Dana masuk", report.income, figures.incomeTotal);
  renderMessage(document.getElementById("expense-list"), "Dana keluar", report.expense, figures.totalPengeluaran);

  var download = document.getElementById("download");
  var ready = gateOpen(report);
  download.disabled = !ready;
  download.textContent = ready ? "Unduh PDF" : "Masih ada baris yang perlu dicek.";
  download.className = ready ? "download ready" : "download";
  saveReport();
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

var STORAGE_KEY = "panitia-report";
var confirmAction = null;

function saveReport() {
  var note = document.getElementById("storage-note");
  if (!pageReport) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pageReport));
    if (note) note.hidden = true;
  } catch (error) {
    if (note) {
      note.hidden = false;
      note.textContent = "Laporan ini belum tersimpan di ponsel ini.";
    }
  }
}

function loadReport() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function askConfirm(message, onYes) {
  confirmAction = onYes;
  document.getElementById("confirm-text").textContent = message;
  document.getElementById("confirm-yes").textContent = "Lanjut";
  document.getElementById("confirm").hidden = false;
}

function rereadMessage(kind, text) {
  var parsed = text.trim() ? parseMessage(text, kind) : null;
  if (kind === "income") {
    pageReport.income = parsed;
    pageReport.eventName = parsed && parsed.eventName ? parsed.eventName : "";
    pageReport.eventDate = parsed && parsed.eventDate ? parsed.eventDate : "";
    pageReport.typedSaldoAwal = null;
    document.getElementById("income-paste").value = text;
  } else {
    pageReport.expense = parsed;
    document.getElementById("expense-paste").value = text;
  }
  drawReport();
}

function clearReport() {
  pageReport = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {}
  document.getElementById("income-paste").value = "";
  document.getElementById("expense-paste").value = "";
  showPaste("");
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
    if (!pageReport) return;
    pageReport.eventName = event.target.value;
    saveReport();
  });
  document.getElementById("event-date").addEventListener("input", function (event) {
    if (!pageReport) return;
    pageReport.eventDate = event.target.value;
    saveReport();
  });
  document.getElementById("new-report").addEventListener("click", function () {
    document.getElementById("confirm-yes").textContent = "Hapus";
    confirmAction = clearReport;
    document.getElementById("confirm-text").textContent = "Hapus laporan ini?";
    document.getElementById("confirm").hidden = false;
  });
  document.getElementById("confirm-no").addEventListener("click", function () {
    confirmAction = null;
    document.getElementById("confirm").hidden = true;
  });
  document.getElementById("confirm-yes").addEventListener("click", function () {
    var action = confirmAction;
    confirmAction = null;
    document.getElementById("confirm").hidden = true;
    if (action) action();
  });
  var saved = loadReport();
  if (saved && (saved.income || saved.expense)) {
    pageReport = saved;
    if (!pageReport.signatures) pageReport.signatures = [];
    if (saved.income) document.getElementById("income-paste").value = saved.income.raw;
    if (saved.expense) document.getElementById("expense-paste").value = saved.expense.raw;
    drawReport();
  }
  document.getElementById("saldo-awal").addEventListener("click", editOpening);
  document.getElementById("download").addEventListener("click", function (event) {
    event.preventDefault();
    var error = document.getElementById("pdf-error");
    if (!pageReport || !gateOpen(pageReport)) return;
    error.hidden = true;
    buildPdfBytes(pageReport).then(function (bytes) {
      var blob = new Blob([bytes], { type: "application/pdf" });
      var link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "laporan-kas.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }).catch(function () {
      error.hidden = false;
      error.textContent = "PDF gagal dibuat.";
    });
  });
}
