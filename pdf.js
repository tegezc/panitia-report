function countedRows(rows) {
  var kept = [];
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    if (row.amount === null || row.status === "aside" || row.status === "red") continue;
    kept.push(row);
  }
  return kept;
}

function lineLabel(row, kind) {
  if (kind === "income") {
    return row.name + (row.rt ? " RT " + row.rt : "");
  }
  return row.item + (row.group ? " · " + row.group : "");
}

function buildPdfBytes(report) {
  var docPromise = PDFLib.PDFDocument.create();
  return docPromise.then(function (doc) {
    return doc.embedFont(PDFLib.StandardFonts.Helvetica).then(function (font) {
      var page = doc.addPage([595, 842]);
      var y = 790;
      var figures = reportFigures(report.income, report.expense, report.typedSaldoAwal);
      var openingRow = null;
      if (report.income) {
        for (var i = 0; i < report.income.rows.length; i++) {
          if (report.income.rows[i].saldoAwal) openingRow = report.income.rows[i];
        }
      }

      function newPage() {
        page = doc.addPage([595, 842]);
        y = 790;
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

      function center(value, size) {
        var width = font.widthOfTextAtSize(String(value), size);
        text(value, (595 - width) / 2, size);
      }

      center("Panitia Report", 18);
      y -= 28;
      center(report.eventName || "", 12);
      y -= 18;
      center(report.eventDate || "", 12);
      y -= 28;

      var rows = [
        ["Saldo awal", formatRp(figures.saldoAwal)],
        ["Total donasi", formatRp(figures.totalDonasi)],
        ["Total pengeluaran", formatRp(figures.totalPengeluaran)],
        ["Saldo akhir", formatRp(figures.saldoAkhir)]
      ];
      ensure(140);
      var tableTop = y + 16;
      for (var r = 0; r < rows.length; r++) {
        text(rows[r][0], 70, 12);
        text(rows[r][1], 320, 12);
        y -= 22;
      }
      page.drawRectangle({
        x: 60,
        y: y + 8,
        width: 475,
        height: tableTop - (y + 8),
        borderColor: PDFLib.rgb(0, 0, 0),
        borderWidth: 1
      });
      if (openingRow) {
        y -= 8;
        ensure(40);
        text(openingRow.raw, 70, 10);
        y -= 16;
      }

      function section(title, lines) {
        y -= 20;
        ensure(40);
        text(title, 50, 13);
        y -= 18;
        for (var n = 0; n < lines.length; n++) {
          ensure(36);
          text(lines[n], 50, 11);
          y -= 16;
        }
      }

      var donations = [];
      if (report.income) {
        var incomeRows = countedRows(report.income.rows);
        for (var d = 0; d < incomeRows.length; d++) {
          if (incomeRows[d].saldoAwal) continue;
          donations.push(lineLabel(incomeRows[d], "income") + "  " + formatRp(incomeRows[d].amount));
        }
      }
      var expenses = [];
      if (report.expense) {
        var expenseRows = countedRows(report.expense.rows);
        for (var e = 0; e < expenseRows.length; e++) {
          expenses.push(lineLabel(expenseRows[e], "expense") + "  " + formatRp(expenseRows[e].amount));
        }
      }
      section("Donasi", donations);
      section("Pengeluaran", expenses);

      if (report.signatures && report.signatures.length) {
        y -= 28;
        ensure(40);
        text("Tanda tangan", 50, 13);
        y -= 18;
        for (var s = 0; s < report.signatures.length; s++) {
          ensure(36);
          text(report.signatures[s].role + "  " + report.signatures[s].name, 50, 11);
          y -= 16;
        }
      }

      return doc.save();
    });
  });
}
