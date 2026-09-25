function stripStars(line) {
  var text = line.trim();
  if (text.charAt(0) === "*") text = text.slice(1).trim();
  if (text.charAt(text.length - 1) === "*") text = text.slice(0, -1).trim();
  return text;
}

function readAmount(source) {
  var text = String(source).trim();
  var odd = text.match(/(\d{4})\.(\d{4})/);
  if (odd) {
    var head = odd[1];
    var tail = odd[2];
    var proposed = Number(head.charAt(0) + head.slice(1) + tail.slice(0, 3));
    return { amount: proposed, ambiguous: true };
  }
  var normal = text.match(/(\d{1,3}(?:\.\d{3})+)/);
  if (!normal) return null;
  return { amount: Number(normal[1].replace(/\./g, "")), ambiguous: false };
}

function isDivider(line) {
  return line.length > 0 && !/[0-9A-Za-z]/.test(line);
}

function emptyRow(raw) {
  return {
    raw: raw,
    status: "aside",
    amount: null,
    name: "",
    rt: "",
    item: "",
    group: "",
    saldoAwal: false,
    multiply: null
  };
}

function parseMessage(raw, kind) {
  var lines = String(raw).split(/\r?\n/);
  var rows = [];
  var total = { state: "unasked", amount: null };
  var eventName = "";
  var eventDate = "";

  for (var i = 0; i < lines.length; i++) {
    var original = lines[i];
    var line = original.trim();
    if (!line) continue;

    var stripped = stripStars(line);

    if (kind === "income" && line.indexOf("LAPORAN DANA MASUK") !== -1) {
      var parts = stripped.split("|");
      var left = parts[0].trim();
      eventDate = parts.slice(1).join("|").trim();
      eventName = left.replace(/^LAPORAN DANA MASUK\s*—\s*/, "").trim();
      var header = emptyRow(original);
      rows.push(header);
      continue;
    }

    if (kind === "expense" && stripped === "DANA KELUAR") {
      rows.push(emptyRow(original));
      continue;
    }

    if (stripped.indexOf("TOTAL") === 0) {
      var totalAmount = readAmount(stripped);
      total = {
        state: "written",
        amount: totalAmount ? totalAmount.amount : null
      };
      continue;
    }

    if (line.indexOf("Rekening") !== -1) {
      rows.push(emptyRow(original));
      continue;
    }

    if (isDivider(line)) {
      rows.push(emptyRow(original));
      continue;
    }

    var incomeMatch = line.match(/^(\d+)\.\s+(.+?)\s*:\s*(.+)$/);
    if (incomeMatch) {
      var description = incomeMatch[2].trim();
      var rt = "";
      var rtMatch = description.match(/\s+RT\.(\d+)\s*$/);
      if (rtMatch) {
        rt = rtMatch[1];
        description = description.slice(0, rtMatch.index).trim();
      }
      var incomeAmount = readAmount(incomeMatch[3]);
      var incomeRow = emptyRow(original);
      incomeRow.name = description;
      incomeRow.rt = rt;
      incomeRow.saldoAwal = /kas sisa/i.test(description);
      if (!incomeAmount) {
        incomeRow.status = "red";
      } else if (incomeAmount.ambiguous) {
        incomeRow.status = "yellow-amount";
        incomeRow.amount = incomeAmount.amount;
      } else {
        incomeRow.status = "clear";
        incomeRow.amount = incomeAmount.amount;
      }
      rows.push(incomeRow);
      continue;
    }

    var formulaMatch = line.match(/^(.+?)(\d+)\s*x\s*@\s*(.+?)\s*=\s*(.+)$/i);
    if (formulaMatch) {
      var unit = readAmount(formulaMatch[3]);
      var written = readAmount(formulaMatch[4]);
      var qty = Number(formulaMatch[2]);
      var product = unit ? qty * unit.amount : null;
      var formulaRow = emptyRow(original);
      formulaRow.item = formulaMatch[1].trim();
      formulaRow.group = "";
      if (written && product !== null && product === written.amount) {
        formulaRow.status = "clear";
        formulaRow.amount = written.amount;
      } else if (written) {
        formulaRow.status = "yellow-multiply";
        formulaRow.amount = written.amount;
      } else {
        formulaRow.status = "red";
      }
      formulaRow.multiply = {
        qty: qty,
        unit: unit ? unit.amount : null,
        product: product,
        written: written ? written.amount : null
      };
      rows.push(formulaRow);
      continue;
    }

    var expenseAmount = readAmount(line);
    if (expenseAmount && /Rp/i.test(line)) {
      var expenseRow = emptyRow(original);
      expenseRow.item = line.replace(/Rp\.?\s*[\d.]+/i, "").trim();
      expenseRow.group = "";
      if (expenseAmount.ambiguous) {
        expenseRow.status = "yellow-amount";
      } else {
        expenseRow.status = "clear";
      }
      expenseRow.amount = expenseAmount.amount;
      rows.push(expenseRow);
      continue;
    }

    var red = emptyRow(original);
    red.status = "red";
    rows.push(red);
  }

  if (total.state !== "written") total = { state: "unasked", amount: null };

  return {
    raw: raw,
    total: total,
    rows: rows,
    eventName: eventName,
    eventDate: eventDate
  };
}

function sumCounted(rows) {
  var sum = 0;
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].amount !== null && rows[i].status !== "aside" && rows[i].status !== "red") {
      sum += rows[i].amount;
    }
  }
  return sum;
}

function openingBalance(incomeRows) {
  for (var i = 0; i < incomeRows.length; i++) {
    if (incomeRows[i].saldoAwal && incomeRows[i].amount !== null) return incomeRows[i].amount;
  }
  return 0;
}

function reportFigures(income, expense) {
  var incomeRows = income ? income.rows : [];
  var expenseRows = expense ? expense.rows : [];
  var incomeTotal = sumCounted(incomeRows);
  var saldoAwal = income ? openingBalance(incomeRows) : 0;
  var totalDonasi = incomeTotal - saldoAwal;
  var totalPengeluaran = sumCounted(expenseRows);
  return {
    incomeTotal: incomeTotal,
    saldoAwal: saldoAwal,
    totalDonasi: totalDonasi,
    totalPengeluaran: totalPengeluaran,
    saldoAkhir: saldoAwal + totalDonasi - totalPengeluaran
  };
}
