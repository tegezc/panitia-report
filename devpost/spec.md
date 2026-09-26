---
doc: spec
status: approved
---

# Panitia Report — Technical Spec

## How This Works, In Plain Language

One file in a browser. She pastes two WhatsApp messages, taps **Baca pesan**, and the page reads each line in place. Nothing is sent to a server. The original paste is kept beside each reading and is never rewritten.

A normal amount uses dots as thousands. `Rp.2000.0000` is not that shape, so the page proposes Rp 2.000.000, puts that figure in the sum, and leaves the row yellow until she taps **Benar**. A multiplication that does not match stays yellow and keeps the amount she wrote until she chooses otherwise. A line with no amount is red until she types one or marks it **Bukan transaksi**. `75. Kas sisa 2024 : Rp. 500.000` is an income row. A description matching Kas sisa marks that row as Saldo awal and keeps it out of Total donasi. The bank line is set aside. Saldo akhir is opening balance plus donations minus expenses. It is not copied from a message.

The whole report is stored in the browser's storage for this site on this phone. Leave and come back, and it is still there. Another phone does not have it. **Unduh PDF** builds the file in the browser, from those figures, only when every pasted message matches and every yellow or red line is settled. Hosting waits. This afternoon the demo is a page opened locally and recorded.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`.

1. She opens `index.html`. The page reads this site's storage. Empty storage shows the paste page: title, the instruction line, **Dana masuk**, **Dana keluar**, **Baca pesan**. No **Unduh PDF**.
2. She pastes a message and taps **Baca pesan**. `parse.js` splits that paste into rows, a written total if one exists, and, from the income header only, the event name and date. `app.js` draws the rows. The original paste is stored unchanged.
3. The page writes the report into storage. The four numbers are calculated from the rows. A rupiah gap is pinned. Yellow and red rows stay visible.
4. She settles rows, edits a total, edits Saldo awal, or adds up to three signatures. Each change updates the four numbers and is written to storage again. The paste text does not change.
5. When the gate in **The four numbers** passes, **Unduh PDF** calls `pdf.js`. pdf-lib builds the bytes. The browser downloads the file. The PDF is not a page in the app.
6. She can reopen a paste, change it, and tap **Baca pesan** again. The page asks first. **Lanjut** re-reads only that message. **Batal** keeps her work.
7. **Laporan baru**, after she confirms, deletes the storage entry and returns to the two empty boxes.
8. A reload on the same phone reads storage and shows the same report. Another browser profile, or another phone, has empty storage.

## Stack

Plain HTML, CSS, and JavaScript. No framework, no bundler, no package install, no server. Scripts are classic `script` tags, not modules, so the page runs from a local file.

- **pdf-lib 1.17.1** — one file, `vendor/pdf-lib.min.js`, loaded with a script tag. The UMD build sets `window.PDFLib`. Docs: [pdf-lib.js.org](https://pdf-lib.js.org/). UMD notes: [GitHub — UMD module](https://github.com/Hopding/pdf-lib#umd-module). npm: [pdf-lib 1.17.1](https://www.npmjs.com/package/pdf-lib) (MIT). Checked against the npm page on 25 Sep 2026: 1.17.1 is the published version; the package date there is 12 May 2022. No API key, no account, no usage fee. The demo does not call the network.
- **Browser storage** — `localStorage`, one key, `panitia-report`. This is the browser's storage for this site on this phone.

Learner choice: one static page, pdf-lib in the repo, layout written by us, recording works with the network off. Tradeoff accepted: she cannot open it on her phone until it is hosted, and hosting is not this afternoon.

The PDF uses pdf-lib's built-in Helvetica (WinAnsi). The anonymized excerpts are covered by that font once the header mark is left out of the stored event name. A character outside that font is a failure mode below, not a second font file.

## Where It Runs and How Someone Tries It

A local browser page. Open `index.html` in Chrome. No install, no server, no API key. Chrome is the recording browser because storage on a `file://` page is reliable there.

Submission needs a short demo video and a public GitHub repository. Deployment is not part of this proof of concept. A live URL can wait until `6-ship` if it is wanted then. It does not replace the video.

What to record, using `fixtures/excerpts.txt`:

1. Paste **Dana masuk** and **Dana keluar** as written. Tap **Baca pesan**.
2. Show the yellow `Rp.2000.0000` row proposing Rp 2.000.000, the yellow panitia multiplication (Hitung Rp 110.000, Tertulis Rp 100.000), "Kas sisa 2024" as Saldo awal, and the bank line set aside.
3. Show the four numbers: Saldo awal Rp 500.000, Total donasi Rp 9.000.000, Total pengeluaran Rp 4.611.000, Saldo akhir Rp 4.889.000. The button says "Masih ada baris yang perlu dicek."
4. Tap **Benar** on the amount and **Pakai tertulis** on the multiplication. The button turns dark green and the PDF downloads.
5. Reload the tab. The same report is still there.

The full private broadcasts stay out of the repo. These excerpts are the corpus. Their totals match these lines only.

## Look and Feel

Carried from `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`.

Off-white page, near-black text, thin ruled lines. The device font. No custom font file, no gradient, no illustration. A clear tile has no fill. A yellow tile is pale amber. A red tile is pale red. A set-aside tile is grey. That color stays on the one-line tile. The open detail is a separate panel under the tile, with its own background, a border, and padding. Dana masuk and Dana keluar use different block backgrounds. "TOTAL tertulis", each RT subtotal, and the expense total are heavier than a donor tile. The four numbers sit in one bordered table, large enough to read in sunlight. **Unduh PDF** is solid dark green when it works, and the same button greyed out while it shows "Masih ada baris yang perlu dicek."

The PDF is black text on white, in three parts: Dana masuk by RT, Dana keluar, then the ringkasan. It is not a one-page list titled Panitia Report. CSS does the screen. pdf-lib draws the file. The stack can honor this direction without a design system.

Copy she sees is the Indonesian already named in the PRD. Two sentences and the **Laporan baru** confirm words are still open; see **Decisions and Open Issues**.

## Components

### The page

`index.html` plus `app.js`. One stacked phone page. It is never two columns. Before a reading: title "Panitia Report", the line "Tempel dua pesan WhatsApp yang sudah kamu kirim.", the two boxes, **Baca pesan**. After a reading: title, two collapsed lines, editable event name and date, the gap line if any, the four-number table, **Laporan baru** directly under that table, "Tanda tangan", income grouped by RT into closed tiles, expenses as closed tiles, **Unduh PDF**, **Laporan baru**. A closed tile is one line, name and amount, with no buttons. Tap opens that tile's detail only. A real income message is 100–200 rows. Expenses stay under 30.

There is no second screen.

PRD ref: `prd.md > Screens and Layout`, `prd.md > The Core Journey`.

### Paste

Two text areas, **Dana masuk** then **Dana keluar**, each hint "Tempel pesan di sini". **Baca pesan** with both empty does not build a list and says "Tempel minimal satu pesan." One filled box builds that list. The empty side shows "Tidak ditempel" and a total of zero, and it is not a pasted message for the download gate.

After a reading, the boxes collapse into two lines she can reopen onto the original text. Each line shows how many lines were read. The exact Indonesian for that count is open.

PRD ref: `prd.md > Paste`.

### Reading the messages

`parse.js`. **Baca pesan** reads the paste. The stored original is never rewritten. Event name and date come from the income header. She can edit both. The header row stays set aside unless she pulls it back.

A row keeps her original line, unchanged, beside the reading. An income line shows amount, name, and RT. An expense line shows item, expense group, and amount. A formula line also shows the multiplication.

On these excerpts the expense group starts empty. The words before the amount are the item. Line 102 has no RT, so RT is empty until she edits it.

PRD ref: `prd.md > Reading the messages`.

#### Lines, in order

Blank lines are skipped. They are not rows.

1. **Header.** The income line that contains `LAPORAN DANA MASUK` is set aside. Strip one surrounding `*` on each end if present. Split on `|`. The date is the trimmed right side: `Senin, 17 Agustus 2026`. The fixture header is `*LAPORAN DANA MASUK—PERINGATAN HARI KEMERDEKAAN RI | Senin, 17 Agustus 2026*`. The mark between `LAPORAN DANA MASUK` and `PERINGATAN` is an em dash (`—`, U+2014), not a hyphen-minus (`-`, U+002D). Remove `LAPORAN DANA MASUK` and that mark. The stored event name is `PERINGATAN HARI KEMERDEKAAN RI`. It does not contain the mark. An expense line that is only `DANA KELUAR` is a set-aside header. It does not set the event name or the date.
2. **Total.** A line whose trimmed text starts with `TOTAL` is the written total, not a row. The amount is the rupiah token on that line. `TOTAL DANA MASUK : Rp. 9.500.000` and `TOTAL                         Rp. 4.611.000` are both this case.
3. **Bank.** A line containing `Rekening` is set aside. `Rekening panitia 1234567890` is this case.
4. **Divider.** A line with no letters and no digits is set aside.
5. **Income row.** A line shaped like a number, a dot, a description, an optional `RT` plus digits, a colon, and an amount. Examples: `1. Bpk. H. Warga A RT.01  : Rp 1.000.000`, `2. Warga B RT.02 : Rp 6.000.000`, `75. Kas sisa 2024 : Rp. 500.000`, `102. Bpk H. Warga F : Rp.2000.0000`. `2. Warga B RT.02 : Rp 6.000.000` is a clear donation: amount Rp 6.000.000, RT `02`. It sits between the Rp 1.000.000 line and the Kas sisa line. With `Rp.2000.0000` read as Rp 2.000.000, these income lines sum to Rp 9.500.000. The leading number is not the name. `RT.01` stores RT `01`. No `RT` stores an empty RT. On that row, a description matching `Kas sisa` sets `saldoAwal`. The row stays an income row. It is kept out of Total donasi. Its amount still counts toward the income total. This is not a later rule for lines that failed to match an income row.
6. **Expense formula.** A line containing `x`, `@`, and `=` with a quantity, a unit price, and a written amount. `Konsumsi warga 400x @Rp.11.000 = 4.400.000` matches: 400 × 11.000 = 4.400.000, so the row is clear. `Konsumsi panitia 10x @Rp.11.000 = 100.000` does not: 10 × 11.000 = 110.000, the line says 100.000, so the row is yellow and the sum uses 100.000.
7. **Expense amount.** Any other line with one rupiah amount. `print proposal dan undangan     Rp. 111.000` is clear, item `print proposal dan undangan`, group empty.
8. **Anything else** with no amount is red. Her original text stays. The sum skips it.

#### Amounts

A normal amount is optional `Rp`, an optional dot, optional space, then thousands groups: one to three digits, then groups of exactly three. `Rp 1.000.000`, `Rp. 500.000`, `Rp.11.000`, and `Rp. 4.611.000` are clear.

`Rp.2000.0000` is four digits, a dot, and four digits. That is not the normal shape. The page proposes Rp 2.000.000. That figure is in the sum. The row stays yellow until she taps **Benar**. The strip-dots reading, Rp 20.000.000, is not the proposal. The page does not search for a number that would force the total to match.

Same shape, same proposal method: first digit, the next three digits, then the first three digits of the second group. `2000.0000` → `2` + `000` + `000`.

### Rows

Drawn by `app.js` from the parse result. Income donors are grouped by RT, each group showing its name and subtotal. Kas sisa is not a donor tile. Each donor or expense is a closed tile: one line, name and amount, no buttons. The open detail, under that tile only, shows the original line, the reading, and the actions that apply. Tapping another tile closes the previous detail. Once a question is cleared, the row is clear. A clear row can still be changed with **Ubah** (amount, name, RT, or expense group) from its open detail.

- **Clear.** Amount is in the sum. No fill.
- **Yellow, ambiguous amount.** Proposed amount is in the sum. **Benar** keeps it and clears the question. **Ubah** edits the fields. `Rp.2000.0000` is this row.
- **Yellow, multiplication.** The row shows "Hitung: 10 × Rp 11.000 = Rp 110.000" and "Tertulis: Rp 100.000." The sum uses Tertulis until she taps **Pakai hitungan**, which swaps the sum to the product and clears the question. **Pakai tertulis** keeps Tertulis and clears the question. A product that already equals the written amount is a clear row.
- **Red.** No amount in the sum. She types an amount, and it enters the sum, or she taps **Bukan transaksi** and the line becomes set aside.
- **Set aside.** Header, footer, divider, or bank line. Visible, uncounted, does not block **Unduh PDF**. **Ini transaksi** asks for an amount, then counts the line.

PRD ref: `prd.md > Rows`.

### The four numbers

Calculated in `app.js`. Labels, on the phone and on PDF page one: Saldo awal, Total donasi, Total pengeluaran, Saldo akhir.

Income total is the sum of counted income amounts, including the Saldo awal line. Total donasi is the income total minus Saldo awal. Saldo akhir is Saldo awal plus Total donasi minus Total pengeluaran. Saldo akhir is computed.

For the excerpts, after the proposed Rp 2.000.000 is in the sum and the panitia line still uses Tertulis: income total Rp 9.500.000, Saldo awal Rp 500.000, Total donasi Rp 9.000.000, Total pengeluaran Rp 4.611.000, Saldo akhir Rp 4.889.000.

A rupiah gap stays pinned at the top: which message, and the difference. The exact Indonesian is open. A difference of zero is not enough to download while a yellow or red row is still open.

**Unduh PDF** works only when every pasted message matches its total, every yellow line is settled, and every red line has an amount or is **Bukan transaksi**. "Tidak ditempel" is not a pasted message. Set-aside rows do not keep the button grey. While blocked, the button says "Masih ada baris yang perlu dicek." When it works, it is dark green and the file downloads.

There is only one Saldo awal. She cannot type a Saldo awal larger than the income total.

PRD ref: `prd.md > The four numbers`.

### The written total

When a `TOTAL` line was read, that message's list starts with "TOTAL tertulis: Rp X". **Ubah** changes the number used for the match. The paste does not change. That line is not also a counted row.

When no `TOTAL` line was read, the same place asks once: "Tidak ada baris TOTAL. Yang terbaca Rp X. Apakah benar?" **Ya** uses Rp X for the match. **Tidak** leaves the total empty and editable, and the download stays blocked until the numbers match. Yellow and red lines on that message still need her.

The excerpts both have a total line, so the demo takes the **Ubah** path. The question still has to exist.

PRD ref: `prd.md > The total at the top of a list`.

### Opening balance

Not a third paste. `75. Kas sisa 2024 : Rp. 500.000` matches an income row. A description matching `Kas sisa` on that row marks it as Saldo awal and keeps it out of Total donasi. Its amount still counts toward the income total. If no income row is marked that way, Saldo awal is zero until she types one.

She can tap the Saldo awal figure and type an amount. Total donasi becomes the income total minus what she typed. A typed amount larger than the income total is refused, and the previous Saldo awal stays.

Marking a line **Saldo awal** discards a figure she had typed. That line's amount is the only Saldo awal. Typing a new Saldo awal sends a previously marked line back into the donations. Marking a second line **Saldo awal** sends the first marked line back into the donations.

PRD ref: `prd.md > Opening balance`.

### Signatures

Under the four numbers, "Tanda tangan" starts empty. Doing nothing leaves the signature block out of the PDF. **Tambah penandatangan** adds one role and one name, up to three. She can remove any pair. A fourth pair cannot be added. Signers do not enter the money.

PRD ref: `prd.md > Signatures`.

### The PDF

`pdf.js`, using `PDFLib.PDFDocument`. **Unduh PDF** calls `save()`, wraps the bytes in a `Blob`, and clicks a temporary link with the `download` attribute. The file name is `laporan-kas.pdf`. A grey button does not call this.

Three parts, not a flat list titled Panitia Report. `pdf.js` draws the stored event name. It must not be asked to draw the em dash from the header.

Dana masuk: event name and date, columns No., Nama, Jumlah. Numbering restarts in each RT. A subtotal follows each group. A line lifted into Saldo awal is absent here.

Dana keluar: a numbered list of item and amount, then the total.

Ringkasan: one line per RT subtotal, then Saldo awal. If it came from a line, that line's original wording sits with Saldo awal. For the excerpts that wording is `75. Kas sisa 2024 : Rp. 500.000`. Then the expenses, then Saldo akhir. Donor names do not appear on this part.

The signature block is last, and only if she added one. A real income message is 100–200 rows, so Dana masuk continues onto the next page. Expenses stay under 30.

PRD ref: `prd.md > The PDF`.

### Saving on this phone

`app.js` writes one JSON value to `localStorage` under `panitia-report` after every reading and every edit. On load, that value is the page. It holds both original pastes, every row decision, the event name and date, Saldo awal and whether it came from a line or a typed figure, the signature names, and the totals used for the match.

**Laporan baru** asks her to confirm, then removes the key and shows the two empty boxes. The confirm words are open. Until she confirms, nothing is cleared.

Another phone has no key. Quitting the browser on this phone does not remove it.

PRD ref: `prd.md > Coming back and Laporan baru`.

### Reading a message again

Reopening a collapsed line shows the paste. If she changes it and taps **Baca pesan**, the page asks: "Pesan ini akan dibaca ulang. Koreksi pada pesan ini hilang."

**Lanjut** runs `parse.js` on that paste only and drops that message's row decisions. The other message stays. Signatures stay. **Lanjut** on Dana masuk also re-reads the event name, the date, and Saldo awal from the new text. **Batal** leaves every decision in place.

PRD ref: `prd.md > Reading a message again`.

## Data Model

Stored as one JSON object. Amounts are integer rupiah. `1500000` is Rp 1.500.000 on screen and in the PDF.

```
{
  eventName: string,
  eventDate: string,
  signatures: [ { role: string, name: string } ],  // 0 to 3
  income: Message or null,    // null means "Tidak ditempel"
  expense: Message or null
}

Message {
  raw: string,                 // original paste, never edited by row actions
  total: {
    state: "written" | "accepted" | "empty" | "unasked",
    amount: number or null     // null when state is "empty"
  },
  rows: [ Row ]
}

Row {
  raw: string,
  status: "clear" | "yellow-amount" | "yellow-multiply" | "red" | "aside",
  amount: number or null,      // null when red or aside; this is what the sum uses
  name: string,                // income
  rt: string,                  // income, "" if absent
  item: string,                // expense
  group: string,               // expense, "" on these excerpts
  saldoAwal: boolean,          // at most one true across income rows
  multiply: null or {
    qty: number,
    unit: number,
    product: number,           // Hitung
    written: number            // Tertulis
  }
}
```

`total.state` is `written` when a TOTAL line was parsed, `unasked` until she answers a missing-total question, `accepted` after **Ya**, and `empty` after **Tidak** until she types a total that the lines match.

Saldo awal's amount is the row with `saldoAwal: true`, or a typed figure kept beside the messages when no row is marked. A typed figure and a marked row are not both active. The last action wins, as in `prd.md > Opening balance`.

Leave and come back: the page loads this object. **Laporan baru** deletes it. Row edits change `Row` fields and leave `Message.raw` as pasted.

## File Structure

```
panitia-report/
├── index.html                 # the one phone page
├── styles.css                 # paper look from prd.md > Look and Feel
├── app.js                     # paste, rows, four numbers, storage, re-read, signatures
├── parse.js                   # Baca pesan: lines, amounts, totals, header; Kas sisa is a mark on an income row
├── pdf.js                     # Unduh PDF via window.PDFLib
├── vendor/
│   └── pdf-lib.min.js         # pdf-lib 1.17.1 UMD, no network at runtime
├── fixtures/
│   └── excerpts.txt           # the two anonymized pastes, totals for these lines only
├── README.md                  # open index.html in Chrome; what the video shows
└── devpost/                   # planning docs, not loaded by the page
```

`parse.js` does not touch the page. `pdf.js` does not parse messages. `app.js` holds the report object and is the only writer of `localStorage`.

## External Services and Dependencies

No server, no database, no account, no paid API.

**pdf-lib 1.17.1.** Vendored at `vendor/pdf-lib.min.js`. Copied once, during the build, from `https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js`. After that the page loads the local file. Runtime calls: `PDFLib.PDFDocument.create()`, `addPage`, `drawText`, `save()`. Response: a `Uint8Array` of PDF bytes, then a browser download. No key. No rate limit. No fee. License MIT. Docs: https://pdf-lib.js.org/ and https://github.com/Hopding/pdf-lib#umd-module.

The build step that copies this file is a one-time download by the developer. The running page does not do it. If that URL fails when the file is first saved, stop and record the failure. Do not swap in another library.

## Important Failure Modes

- **pdf-lib did not load, or `save()` throws** (missing vendor file, or a character Helvetica cannot draw) → no file is downloaded. The page says "PDF gagal dibuat." The report on screen stays as it was.
- **A line has no amount the reader can use** → red row, original text kept, sum skips it, **Unduh PDF** stays blocked until she types an amount or taps **Bukan transaksi**.
- **This browser will not keep storage for a local file** → the report still works until she closes the tab. The page says "Laporan ini belum tersimpan di ponsel ini." A reload will not bring it back. Chrome on `file://` is the path the demo uses, where storage does work.

## What Was Simplified and Why

- **A local `index.html` and a demo video** instead of a hosted link — she does not need a URL for this proof of concept. Hosting can wait. The fuller version would need a static host and a phone check.
- **These two anonymized excerpts** instead of the 102-line private broadcasts — the private messages include residents' names and a bank account. The kernel is on these lines: `Rp.2000.0000`, the panitia multiplication, Kas sisa, and the bank line. The fuller reader would be tested on the real broadcasts, which stay off this repo.
- **Helvetica inside pdf-lib** instead of an embedded font — the excerpts do not need glyphs outside WinAnsi. A custom font would be another file and another failure point.
- **Browser storage for one site** instead of accounts — already cut in `scope.md > Explicitly Cut`. Another phone does not have the report.
- **Empty expense group and empty RT when the line has none** instead of guessing a group or an RT — she can fill both with **Ubah**.

Word output and a per-group expense section stay deferred, as in `prd.md > Deferred From the POC`. Dana masuk in the PDF is grouped by RT.

## Decisions and Open Issues

Learner choices:

- One static page: HTML, CSS, and JavaScript. No framework, no server, no build step for the running page, no accounts. The report stays in the browser's storage for this site on this phone.
- pdf-lib, one library file in the repo, script tag, layout written by us. Recording works with the network off. Tradeoff: no live URL this afternoon.
- The demo corpus is the two anonymized excerpts. The full broadcasts stay private.
- `Rp.2000.0000` is not the normal thousands shape. The page proposes Rp 2.000.000, puts that figure in the sum, and the row stays yellow until **Benar**.
- Event name `PERINGATAN HARI KEMERDEKAAN RI`. Date `Senin, 17 Agustus 2026`. The rest of the header line stays set aside. She can edit both. The mark between `LAPORAN DANA MASUK` and the event name in the fixture is an em dash (U+2014), not a hyphen. The stored event name has that mark removed. The PDF is not asked to draw it.
- `75. Kas sisa 2024 : Rp. 500.000` is an income row. A description matching Kas sisa marks that row as Saldo awal and keeps it out of Total donasi. Its amount still counts toward the income total. Kas sisa is not a separate rule for lines that failed the income-row match.
- The four numbers for these excerpts are Saldo awal Rp 500.000, Total donasi Rp 9.000.000, Total pengeluaran Rp 4.611.000, Saldo akhir Rp 4.889.000.

Derived from those choices: classic scripts so `file://` works; one `localStorage` key; integer rupiah; Helvetica; blank lines skipped; expense group and missing RT start empty; the four-and-four proposal method above.

Nothing in this approach was unclear to the learner. No open technical question was left for a build-time investigation.

Carried from `prd.md > Open Questions`, still unresolved, safe to decide in the build:

- The confirm words for **Laporan baru**. She must confirm before the page clears. The words were not named.
- The Indonesian for the collapsed line's count of lines read, and for the pinned gap that names the message and the rupiah difference.
