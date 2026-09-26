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
    return Promise.all([
      doc.embedFont(PDFLib.StandardFonts.Helvetica),
      doc.embedFont(PDFLib.StandardFonts.HelveticaBold)
    ]).then(function (fonts) {
      var font = fonts[0];
      var bold = fonts[1];
      var page = null;
      var y = 800;
      var left = 40;
      var tableWidth = 515;
      var bottom = 48;
      var repeatHeader = null;
      var figures = reportFigures(report.income, report.expense, report.typedSaldoAwal);
      var openingRow = null;
      if (report.income) {
        for (var i = 0; i < report.income.rows.length; i++) {
          if (report.income.rows[i].saldoAwal) openingRow = report.income.rows[i];
        }
      }

      var navy = PDFLib.rgb(36 / 255, 62 / 255, 90 / 255);
      var white = PDFLib.rgb(1, 1, 1);
      var ink = PDFLib.rgb(0.11, 0.11, 0.11);
      var group = PDFLib.rgb(107 / 255, 79 / 255, 50 / 255);
      var wash = PDFLib.rgb(232 / 255, 237 / 255, 244 / 255);
      var paper = PDFLib.rgb(1, 1, 1);
      var grid = PDFLib.rgb(0.72, 0.76, 0.8);

      function newPage() {
        page = doc.addPage([595, 842]);
        y = 790;
        if (repeatHeader) repeatHeader();
      }

      function fit(value, usedFont, size, maxWidth) {
        var text = String(value);
        if (usedFont.widthOfTextAtSize(text, size) <= maxWidth) return text;
        while (text.length > 1 && usedFont.widthOfTextAtSize(text + "...", size) > maxWidth) {
          text = text.slice(0, -1);
        }
        return text + "...";
      }

      function center(value, size, color, usedFont) {
        var width = usedFont.widthOfTextAtSize(String(value), size);
        page.drawText(String(value), {
          x: (595 - width) / 2,
          y: y,
          size: size,
          font: usedFont,
          color: color
        });
      }

      function paintRow(cells, fill, textColor, usedFont, size) {
        var height = 22;
        if (y - height < bottom) newPage();
        var rowBottom = y - height;
        page.drawRectangle({
          x: left,
          y: rowBottom,
          width: tableWidth,
          height: height,
          color: fill,
          borderColor: grid,
          borderWidth: 0.6
        });
        var x = left;
        for (var c = 0; c < cells.length; c++) {
          if (c > 0) {
            page.drawLine({
              start: { x: x, y: rowBottom },
              end: { x: x, y: rowBottom + height },
              thickness: 0.6,
              color: grid
            });
          }
          var label = fit(cells[c].text, usedFont, size, cells[c].width - 12);
          var textX = cells[c].align === "right"
            ? x + cells[c].width - 8 - usedFont.widthOfTextAtSize(label, size)
            : x + 6;
          page.drawText(label, {
            x: textX,
            y: rowBottom + 6,
            size: size,
            font: usedFont,
            color: textColor
          });
          x += cells[c].width;
        }
        y = rowBottom;
      }

      function columns(noWidth) {
        var amountWidth = 120;
        return [
          { width: noWidth, align: "left" },
          { width: tableWidth - noWidth - amountWidth, align: "left" },
          { width: amountWidth, align: "right" }
        ];
      }

      function headerRow(labels, cols) {
        var cells = [];
        for (var i = 0; i < cols.length; i++) {
          cells.push({ text: labels[i], width: cols[i].width, align: cols[i].align });
        }
        paintRow(cells, navy, white, bold, 10);
      }

      function dataRow(values, cols, fill, textColor, usedFont) {
        var cells = [];
        for (var i = 0; i < cols.length; i++) {
          cells.push({ text: values[i], width: cols[i].width, align: cols[i].align });
        }
        paintRow(cells, fill || paper, textColor || ink, usedFont || font, 10);
      }

      function spanRow(value, fill, textColor, usedFont) {
        paintRow([{ text: value, width: tableWidth, align: "left" }], fill, textColor, usedFont, 10);
      }

      function beginTable(labels, cols) {
        repeatHeader = function () { headerRow(labels, cols); };
        headerRow(labels, cols);
      }

      function titleBlock(title, subtitles) {
        repeatHeader = null;
        newPage();
        center(title, 18, navy, bold);
        y -= 26;
        for (var s = 0; s < subtitles.length; s++) {
          if (!subtitles[s]) continue;
          center(subtitles[s], 11, ink, font);
          y -= 16;
        }
        y -= 8;
      }

      var incomeCols = columns(42);
      titleBlock("Money in", [report.eventName || "", report.eventDate || ""]);
      beginTable(["No.", "Nama", "Jumlah"], incomeCols);

      var groups = report.income ? incomeGroups(report.income.rows) : [];
      for (var g = 0; g < groups.length; g++) {
        var label = groups[g].rt ? "RT " + groups[g].rt : "No RT";
        var subtotal = 0;
        if (y - 66 < bottom) newPage();
        spanRow(label, group, white, bold);
        for (var r = 0; r < groups[g].rows.length; r++) {
          var donor = groups[g].rows[r];
          subtotal += donor.amount;
          dataRow([String(r + 1), donor.name, formatRp(donor.amount)], incomeCols, r % 2 ? wash : paper);
        }
        dataRow(["", "Subtotal", formatRp(subtotal)], incomeCols, wash);
      }

      var expenseCols = columns(42);
      var expenses = report.expense ? countedRows(report.expense.rows) : [];
      var expenseTotal = 0;
      titleBlock("Money out", []);
      beginTable(["No.", "Uraian", "Jumlah"], expenseCols);
      for (var e = 0; e < expenses.length; e++) {
        expenseTotal += expenses[e].amount;
        dataRow([String(e + 1), expenses[e].item, formatRp(expenses[e].amount)], expenseCols, e % 2 ? wash : paper);
      }
      dataRow(["", "Total", formatRp(expenseTotal)], expenseCols, navy, white, bold);

      var summaryCols = [
        { width: tableWidth - 120, align: "left" },
        { width: 120, align: "right" }
      ];
      titleBlock("Summary", [report.eventName || "", report.eventDate || ""]);
      beginTable(["Keterangan", "Jumlah"], summaryCols);
      for (var s = 0; s < groups.length; s++) {
        var sum = 0;
        for (var n = 0; n < groups[s].rows.length; n++) sum += groups[s].rows[n].amount;
        var rtLabel = groups[s].rt ? "RT " + groups[s].rt : "No RT";
        dataRow([rtLabel, formatRp(sum)], summaryCols, s % 2 ? wash : paper);
      }
      dataRow(["Opening balance", formatRp(figures.saldoAwal)], summaryCols, wash);
      if (openingRow) spanRow(openingRow.raw, paper, ink, font);
      for (var x = 0; x < expenses.length; x++) {
        dataRow([expenses[x].item, formatRp(expenses[x].amount)], summaryCols, paper);
      }
      dataRow(["Closing balance", formatRp(figures.saldoAkhir)], summaryCols, navy, white, bold);

      if (report.signatures && report.signatures.length) {
        repeatHeader = null;
        y -= 28;
        if (y < 80) newPage();
        center("Signatures", 12, navy, bold);
        y -= 20;
        for (var k = 0; k < report.signatures.length; k++) {
          if (y < bottom + 16) newPage();
          var sign = report.signatures[k].role + "   " + report.signatures[k].name;
          page.drawText(sign, { x: left, y: y, size: 11, font: font, color: ink });
          y -= 18;
        }
      }

      return doc.save();
    });
  });
}
