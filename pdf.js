function countedRows(rows) {
  var kept = [];
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    if (row.saldoAwal) continue;
    if (row.amount === null || row.status === "aside" || row.status === "red") continue;
    kept.push(row);
  }
  return kept;
}

function incomeGroups(rows) {
  var groups = [];
  var donors = countedRows(rows);
  for (var i = 0; i < donors.length; i++) {
    var found = null;
    for (var g = 0; g < groups.length; g++) {
      if (groups[g].rt === donors[i].rt) found = groups[g];
    }
    if (!found) {
      found = { rt: donors[i].rt, rows: [] };
      groups.push(found);
    }
    found.rows.push(donors[i]);
  }
  return groups;
}

function buildPdfBytes(report) {
  return PDFLib.PDFDocument.create().then(function (doc) {
    return doc.embedFont(PDFLib.StandardFonts.Helvetica).then(function (font) {
      var page = null;
      var y = 800;
      var figures = reportFigures(report.income, report.expense, report.typedSaldoAwal);
      var openingRow = null;
      if (report.income) {
        for (var i = 0; i < report.income.rows.length; i++) {
          if (report.income.rows[i].saldoAwal) openingRow = report.income.rows[i];
        }
      }

      function newPage() {
        page = doc.addPage([595, 842]);
        y = 800;
      }

      function ensure(height) {
        if (y < height) newPage();
      }

      function text(value, x, size) {
        page.drawText(String(value), {
          x: x,
          y: y,
          size: size,
          font: font,
          color: PDFLib.rgb(0, 0, 0)
        });
      }

      function line(value, x, size) {
        ensure(36);
        text(value, x, size);
        y -= 16;
      }

      function heading(value) {
        newPage();
        text(value, 50, 16);
        y -= 26;
      }

      heading("Dana masuk");
      line(report.eventName || "", 50, 12);
      line(report.eventDate || "", 50, 12);
      y -= 6;
      text("No.", 50, 11);
      text("Nama", 90, 11);
      text("Jumlah", 430, 11);
      y -= 18;

      var groups = report.income ? incomeGroups(report.income.rows) : [];
      for (var g = 0; g < groups.length; g++) {
        var label = groups[g].rt ? "RT " + groups[g].rt : "Tanpa RT";
        var subtotal = 0;
        line(label, 50, 12);
        for (var r = 0; r < groups[g].rows.length; r++) {
          var donor = groups[g].rows[r];
          subtotal += donor.amount;
          ensure(36);
          text(String(r + 1), 50, 11);
          text(donor.name, 90, 11);
          text(formatRp(donor.amount), 430, 11);
          y -= 16;
        }
        line("Subtotal  " + formatRp(subtotal), 90, 11);
        y -= 6;
      }

      heading("Dana keluar");
      var expenses = report.expense ? countedRows(report.expense.rows) : [];
      var expenseTotal = 0;
      for (var e = 0; e < expenses.length; e++) {
        expenseTotal += expenses[e].amount;
        ensure(36);
        text(String(e + 1), 50, 11);
        text(expenses[e].item, 90, 11);
        text(formatRp(expenses[e].amount), 430, 11);
        y -= 16;
      }
      line("Total  " + formatRp(expenseTotal), 90, 12);

      heading("Ringkasan");
      for (var s = 0; s < groups.length; s++) {
        var sum = 0;
        for (var n = 0; n < groups[s].rows.length; n++) sum += groups[s].rows[n].amount;
        var rtLabel = groups[s].rt ? "RT " + groups[s].rt : "Tanpa RT";
        ensure(36);
        text(rtLabel, 50, 11);
        text(formatRp(sum), 430, 11);
        y -= 16;
      }
      y -= 6;
      line("Saldo awal  " + formatRp(figures.saldoAwal), 50, 12);
      if (openingRow) line(openingRow.raw, 50, 10);
      y -= 6;
      for (var x = 0; x < expenses.length; x++) {
        ensure(36);
        text(expenses[x].item, 50, 11);
        text(formatRp(expenses[x].amount), 430, 11);
        y -= 16;
      }
      y -= 6;
      line("Saldo akhir  " + formatRp(figures.saldoAkhir), 50, 12);

      if (report.signatures && report.signatures.length) {
        y -= 12;
        line("Tanda tangan", 50, 12);
        for (var k = 0; k < report.signatures.length; k++) {
          line(report.signatures[k].role + "  " + report.signatures[k].name, 50, 11);
        }
      }

      return doc.save();
    });
  });
}
