---
doc: spec
status: approved
---

# Panitia Report — Technical Spec

## How This Works, In Plain Language

One file in a browser. She pastes two WhatsApp messages, taps **Read messages**, and the page reads each line in place. Nothing is sent to a server. The original paste is kept beside each reading and is never rewritten.

A normal amount uses dots as thousands. `Rp.2000.0000` is not that shape, so the page proposes Rp 2.000.000, puts that figure in the sum, and leaves the row yellow until she taps **Confirm**. A multiplication that does not match stays yellow and keeps the amount she wrote until she chooses otherwise. A line with no amount is red until she types one or marks it **Not a transaction**. `75. Kas sisa 2024 : Rp. 500.000` is an income row. A description matching Kas sisa marks that row as Opening balance and keeps it out of Donations. The bank line is set aside. Closing balance is opening balance plus donations minus expenses. It is not copied from a message.

The whole report is stored in the browser's storage for this site on this phone. Leave and come back, and it is still there. Another phone does not have it. **Download PDF** builds the file in the browser, from those figures, only when every pasted message matches and every yellow or red line is settled. Hosting waits. This afternoon the demo is a page opened locally and recorded.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`.

1. She opens `index.html`. The page reads this site's storage. Empty storage shows the paste page: title, the instruction line, **Money in**, **Money out**, **Read messages**. No **Download PDF**.
2. She pastes a message and taps **Read messages**. `parse.js` splits that paste into rows, a written total if one exists, and, from the income header only, the event name and date. `app.js` draws the rows. The original paste is stored unchanged.
3. The page writes the report into storage. The four numbers are calculated from the rows. A rupiah gap is pinned. Yellow and red rows stay visible.
4. She settles rows, edits a total, edits Opening balance, or adds up to three signatures. Each change updates the four numbers and is written to storage again. The paste text does not change.
5. When the gate in **The four numbers** passes, **Download PDF** calls `pdf.js`. pdf-lib builds the bytes. The browser downloads the file. The PDF is not a page in the app.
6. She can reopen a paste, change it, and tap **Read messages** again. The page asks first. **Confirm** re-reads only that message. **Cancel** keeps her work.
7. **New report**, after she confirms, deletes the storage entry and returns to the two empty boxes.
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

1. Paste **Money in** and **Money out** as written. Tap **Read messages**.
2. Show the yellow `Rp.2000.0000` row proposing Rp 2.000.000, the yellow panitia multiplication (Calculated Rp 110.000, Written Rp 100.000), "Kas sisa 2024" as Opening balance, and the bank line set aside.
3. Show the four numbers: Opening balance Rp 500.000, Donations Rp 11.350.000, Expenses Rp 4.611.000, Closing balance Rp 7.239.000. The button stays labeled **Download PDF** and is disabled. Under it: "Rows still need a check."
4. Tap **Confirm** on the amount and **Use written** on the multiplication. The button turns dark green and the PDF downloads.
5. Reload the tab. The same report is still there.

The full private broadcasts stay out of the repo. These excerpts are the corpus. Their totals match these lines only.

## Look and Feel

Carried from `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`.

Off-white page, near-black text, thin ruled lines. The device font. No custom font file, no gradient, no illustration. A clear tile has no fill. A yellow tile is pale amber. A red tile is pale red. A set-aside tile is grey. That color stays on the one-line tile. The open detail is a separate panel under the tile, with its own background, a border, and padding. Money in and Money out use different block backgrounds. "Written total" and the expense total are heavier than a donor tile. Written total in both sections and the Money out Total share one color, and that color is not the button color. An RT group header is a different color from those totals and from the buttons. The four numbers sit in one bordered table, large enough to read in sunlight. **Download PDF** stays labeled **Download PDF**. It is solid dark green when it works, and greyed out and disabled while a line under it says why. "Rows still need a check." is only for a yellow or red row. A total mismatch names which total is short and by how much. It sits with **New report** directly under the four numbers.

The PDF is a colored table in three parts: Money in by RT, Money out, then the summary. Each part's title is centered. It is not a one-page list titled Panitia Report. CSS does the screen. pdf-lib draws the file. The stack can honor this direction without a design system.

The screen's own labels are the English named in the PRD. The pasted WhatsApp text stays Indonesian, including Kas sisa, RT, TOTAL, and the bank line.

## Components

### The page

`index.html` plus `app.js`. One stacked phone page. It is never two columns. Before a reading: title "Panitia Report", the line "Paste the two WhatsApp messages you already sent.", the two boxes, **Read messages**. After a reading: title, two collapsed lines, editable event name and date, the gap line if any, the four-number table, **New report** directly under that table, "Signatures", income grouped by RT into closed tiles, expenses as closed tiles, **Download PDF**, **New report**. A closed tile is one line, name and amount, with no buttons. Tap opens that tile's detail only. A real income message is 100–200 rows. Expenses stay under 30.

There is no second screen.

PRD ref: `prd.md > Screens and Layout`, `prd.md > The Core Journey`.

### Paste

Two text areas, **Money in** then **Money out**, each hint "Paste a message here". **Read messages** with both empty does not build a list and says "Paste at least one message." One filled box builds that list. The empty side shows "Not pasted" and a total of zero, and it is not a pasted message for the download gate.

After a reading, the boxes collapse into two lines she can reopen onto the original text. Each line shows how many lines were read, for example "Money in · 6 rows read." **Show message** opens that paste.

PRD ref: `prd.md > Paste`.

### Reading the messages

`parse.js`. **Read messages** reads the paste. The stored original is never rewritten. Event name and date come from the income header. She can edit both. The header row stays set aside unless she pulls it back.

A row keeps her original line, unchanged, beside the reading. An income line shows amount, name, and RT. An expense line shows item, expense group, and amount. A formula line also shows the multiplication.

On these excerpts the expense group starts empty. The words before the amount are the item. Line 102 has no RT, so RT is empty until she edits it.

PRD ref: `prd.md > Reading the messages`.

#### Lines, in order

Blank lines are skipped. They are not rows.

1. **Header.** The income line that contains `LAPORAN DANA MASUK` is set aside. Strip one surrounding `*` on each end if present. Split on `|`. The date is the trimmed right side: `Senin, 17 Agustus 2026`. The fixture header is `*LAPORAN DANA MASUK—PERINGATAN HARI KEMERDEKAAN RI | Senin, 17 Agustus 2026*`. The mark between `LAPORAN DANA MASUK` and `PERINGATAN` is an em dash (`—`, U+2014), not a hyphen-minus (`-`, U+002D). Remove `LAPORAN DANA MASUK` and that mark. The stored event name is `PERINGATAN HARI KEMERDEKAAN RI`. It does not contain the mark. An expense line that is only `DANA KELUAR` is a set-aside header. It does not set the event name or the date.
2. **Total.** A line whose trimmed text starts with `TOTAL` is the written total, not a row. The amount is the rupiah token on that line. `TOTAL DANA MASUK : Rp. 9.500.000` and `TOTAL                         Rp. 4.611.000` are both this case.
3. **Bank.** A line containing `Rekening` is set aside. `Rekening panitia 1234567890` is this case.
4. **Divider.** A line with no letters and no digits is set aside.
5. **Income row.** A line shaped like a number, a dot, a description, an optional `RT` plus digits, a colon, and an amount. Examples: `1. Bpk. H. Warga A RT.01  : Rp 1.000.000`, `2. Warga B RT.02 : Rp 6.000.000`, `75. Kas sisa 2024 : Rp. 500.000`, `102. Bpk H. Warga F : Rp.2000.0000`. `2. Warga B RT.02 : Rp 6.000.000` is a clear donation: amount Rp 6.000.000, RT `02`. It sits between the Rp 1.000.000 line and the Kas sisa line. With `Rp.2000.0000` read as Rp 2.000.000, these income lines sum to Rp 9.500.000. The leading number is not the name. `RT.01` stores RT `01`. No `RT` stores an empty RT. On that row, a description matching `Kas sisa` sets `saldoAwal`. The row stays an income row. It is kept out of Donations. Its amount still counts toward the income total. This is not a later rule for lines that failed to match an income row.
6. **Expense formula.** A line containing `x`, `@`, and `=` with a quantity, a unit price, and a written amount. `Konsumsi warga 400x @Rp.11.000 = 4.400.000` matches: 400 × 11.000 = 4.400.000, so the row is clear. `Konsumsi panitia 10x @Rp.11.000 = 100.000` does not: 10 × 11.000 = 110.000, the line says 100.000, so the row is yellow and the sum uses 100.000.
7. **Expense amount.** Any other line with one rupiah amount. `print proposal dan undangan     Rp. 111.000` is clear, item `print proposal dan undangan`, group empty.
8. **Anything else** with no amount is red. Her original text stays. The sum skips it.

#### Amounts

A normal amount is optional `Rp`, an optional dot, optional space, then thousands groups: one to three digits, then groups of exactly three. `Rp 1.000.000`, `Rp. 500.000`, `Rp.11.000`, and `Rp. 4.611.000` are clear.

`Rp.2000.0000` is four digits, a dot, and four digits. That is not the normal shape. The page proposes Rp 2.000.000. That figure is in the sum. The row stays yellow until she taps **Confirm**. The strip-dots reading, Rp 20.000.000, is not the proposal. The page does not search for a number that would force the total to match.

Same shape, same proposal method: first digit, the next three digits, then the first three digits of the second group. `2000.0000` → `2` + `000` + `000`.

### Rows

Drawn by `app.js` from the parse result. Income donors are grouped by RT, each group showing its name and subtotal. Kas sisa is not a donor tile. Each donor or expense is a closed tile: one line, name and amount, no buttons. The open detail, under that tile only, shows the original line, the reading, and the actions that apply. Tapping another tile closes the previous detail. Once a question is cleared, the row is clear. A clear row can still be changed with **Edit** (amount, name, RT, or expense group) from its open detail.

- **Clear.** Amount is in the sum. No fill.
- **Yellow, ambiguous amount.** Proposed amount is in the sum. **Confirm** keeps it and clears the question. **Edit** edits the fields. `Rp.2000.0000` is this row.
- **Yellow, multiplication.** The row shows "Calculated: 10 × Rp 11.000 = Rp 110.000" and "Written: Rp 100.000." The sum uses Written until she taps **Use calculated**, which swaps the sum to the product and clears the question. **Use written** keeps Written and clears the question. A product that already equals the written amount is a clear row.
- **Red.** No amount in the sum. She types an amount, and it enters the sum, or she taps **Not a transaction** and the line becomes set aside.
- **Set aside.** Header, footer, divider, or bank line. Visible, uncounted, does not block **Download PDF**. **This is a transaction** asks for an amount, then counts the line.

PRD ref: `prd.md > Rows`.

### The four numbers

Calculated in `app.js`. Labels, on the phone and on PDF page one: Opening balance, Donations, Expenses, Closing balance.

Income total is the sum of counted income amounts, including the Opening balance line. Donations is the income total minus Opening balance. Closing balance is Opening balance plus Donations minus Expenses. Closing balance is computed.

For the excerpts, after the proposed Rp 2.000.000 is in the sum and the panitia line still uses Written: income total Rp 11.850.000, Opening balance Rp 500.000, Donations Rp 11.350.000, Expenses Rp 4.611.000, Closing balance Rp 7.239.000.

The Money in total compared with Written total includes Kas sisa, so a written Rp 11.850.000 matches the donations plus Kas sisa Rp 500.000. A rupiah gap stays pinned at the top and names which total is short, and by how much: "Money in is short Rp X." when the counted total is short, or "Written total Money in is short Rp X." when the written total is short. The same pattern is used for Money out. A difference of zero is not enough to download while a yellow or red row is still open.

**Download PDF** works only when every pasted message matches its total, every yellow line is settled, and every red line has an amount or is **Not a transaction**. "Not pasted" is not a pasted message. Set-aside rows do not keep the button grey. While blocked, the button stays labeled **Download PDF** and disabled. The line under it says "Rows still need a check:" followed by the row's name only when a yellow or red row is still open. A hidden Opening balance row does not count. A total mismatch names which total is short and by how much. When it works, it is dark green and the file downloads.

There is only one Opening balance. She cannot type a Opening balance larger than the income total.

PRD ref: `prd.md > The four numbers`.

### The written total

When a `TOTAL` line was read, that message's list starts with "Written total: Rp X". **Edit** changes the number used for the match. The paste does not change. That line is not also a counted row.

When no `TOTAL` line was read, the same place asks once: "There is no TOTAL line. Read as Rp X. Is that right?" **Yes** uses Rp X for the match. **No** leaves the total empty and editable, and the download stays blocked until the numbers match. Yellow and red lines on that message still need her.

The excerpts both have a total line, so the demo takes the **Edit** path. The question still has to exist.

PRD ref: `prd.md > The total at the top of a list`.

### Opening balance

Not a third paste. `75. Kas sisa 2024 : Rp. 500.000` matches an income row. A description matching `Kas sisa` on that row marks it as Opening balance and keeps it out of Donations. Its amount still counts toward the income total. If no income row is marked that way, Opening balance is zero until she types one.

She can tap the Opening balance figure and type an amount. Donations becomes the income total minus what she typed. A typed amount larger than the income total is refused, and the previous Opening balance stays.

Marking a line **Opening balance** discards a figure she had typed. That line's amount is the only Opening balance. Typing a new Opening balance sends a previously marked line back into the donations. Marking a second line **Opening balance** sends the first marked line back into the donations.

PRD ref: `prd.md > Opening balance`.

### Signatures

Under the four numbers, "Signatures" starts empty. Doing nothing leaves the signature block out of the PDF. **Add a signatory** adds one role and one name, up to three. She can remove any pair. A fourth pair cannot be added. Signers do not enter the money.

PRD ref: `prd.md > Signatures`.

### The PDF

`pdf.js`, using `PDFLib.PDFDocument`. **Download PDF** calls `save()`, wraps the bytes in a `Blob`, and clicks a temporary link with the `download` attribute. The file name is `laporan-kas.pdf`. A grey button does not call this.

Three parts, not a flat list titled Panitia Report. `pdf.js` draws the stored event name. It must not be asked to draw the em dash from the header.

Money in: the title is centered, then the event name and date. The body is a table with columns No., Nama, Jumlah. Numbering restarts in each RT. The RT name is a colored row, and a subtotal row follows each group. A line lifted into Opening balance is absent here.

Money out: a centered title, then a table of No., Uraian, and Jumlah, then a Total row.

Summary: a centered title, then a table of Keterangan and Jumlah. One row per RT subtotal, then Opening balance. If it came from a line, that line's original wording sits with Opening balance. For the excerpts that wording is `75. Kas sisa 2024 : Rp. 500.000`. Then the expenses, then Closing balance. Donor names do not appear on this part.

The signature block is last, and only if she added one. A real income message is 100–200 rows, so Money in continues onto the next page. Expenses stay under 30.

PRD ref: `prd.md > The PDF`.

### Saving on this phone

`app.js` writes one JSON value to `localStorage` under `panitia-report` after every reading and every edit. On load, that value is the page. It holds both original pastes, every row decision, the event name and date, Opening balance and whether it came from a line or a typed figure, the signature names, and the totals used for the match.

**New report** asks her to confirm, then removes the key and shows the two empty boxes. The confirm words are open. Until she confirms, nothing is cleared.

Another phone has no key. Quitting the browser on this phone does not remove it.

PRD ref: `prd.md > Coming back and New report`.

### Reading a message again

Reopening a collapsed line shows the paste. If she changes it and taps **Read messages**, the page asks: "This message will be read again. Corrections on this message will be lost."

**Confirm** runs `parse.js` on that paste only and drops that message's row decisions. The other message stays. Signatures stay. **Confirm** on Money in also re-reads the event name, the date, and Opening balance from the new text. **Cancel** leaves every decision in place.

PRD ref: `prd.md > Reading a message again`.

## Data Model

Stored as one JSON object. Amounts are integer rupiah. `1500000` is Rp 1.500.000 on screen and in the PDF.

```
{
  eventName: string,
  eventDate: string,
  signatures: [ { role: string, name: string } ],  // 0 to 3
  income: Message or null,    // null means "Not pasted"
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
    product: number,           // Calculated
    written: number            // Written
  }
}
```

`total.state` is `written` when a TOTAL line was parsed, `unasked` until she answers a missing-total question, `accepted` after **Yes**, and `empty` after **No** until she types a total that the lines match.

Opening balance's amount is the row with `saldoAwal: true`, or a typed figure kept beside the messages when no row is marked. A typed figure and a marked row are not both active. The last action wins, as in `prd.md > Opening balance`.

Leave and come back: the page loads this object. **New report** deletes it. Row edits change `Row` fields and leave `Message.raw` as pasted.

## File Structure

```
panitia-report/
├── index.html                 # the one phone page
├── styles.css                 # paper look from prd.md > Look and Feel
├── app.js                     # paste, rows, four numbers, storage, re-read, signatures
├── parse.js                   # Read messages: lines, amounts, totals, header; Kas sisa is a mark on an income row
├── pdf.js                     # Download PDF via window.PDFLib
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
- **A line has no amount the reader can use** → red row, original text kept, sum skips it, **Download PDF** stays blocked until she types an amount or taps **Not a transaction**.
- **This browser will not keep storage for a local file** → the report still works until she closes the tab. The page says "Laporan ini belum tersimpan di ponsel ini." A reload will not bring it back. Chrome on `file://` is the path the demo uses, where storage does work.

## What Was Simplified and Why

- **A local `index.html` and a demo video** instead of a hosted link — she does not need a URL for this proof of concept. Hosting can wait. The fuller version would need a static host and a phone check.
- **These two anonymized excerpts** instead of the 102-line private broadcasts — the private messages include residents' names and a bank account. The kernel is on these lines: `Rp.2000.0000`, the panitia multiplication, Kas sisa, and the bank line. The fuller reader would be tested on the real broadcasts, which stay off this repo.
- **Helvetica inside pdf-lib** instead of an embedded font — the excerpts do not need glyphs outside WinAnsi. A custom font would be another file and another failure point.
- **Browser storage for one site** instead of accounts — already cut in `scope.md > Explicitly Cut`. Another phone does not have the report.
- **Empty expense group and empty RT when the line has none** instead of guessing a group or an RT — she can fill both with **Edit**.

Word output and a per-group expense section stay deferred, as in `prd.md > Deferred From the POC`. Money in in the PDF is grouped by RT.

## Decisions and Open Issues

Learner choices:

- One static page: HTML, CSS, and JavaScript. No framework, no server, no build step for the running page, no accounts. The report stays in the browser's storage for this site on this phone.
- pdf-lib, one library file in the repo, script tag, layout written by us. Recording works with the network off. Tradeoff: no live URL this afternoon.
- The demo corpus is the two anonymized excerpts. The full broadcasts stay private.
- `Rp.2000.0000` is not the normal thousands shape. The page proposes Rp 2.000.000, puts that figure in the sum, and the row stays yellow until **Confirm**.
- Event name `PERINGATAN HARI KEMERDEKAAN RI`. Date `Senin, 17 Agustus 2026`. The rest of the header line stays set aside. She can edit both. The mark between `LAPORAN DANA MASUK` and the event name in the fixture is an em dash (U+2014), not a hyphen. The stored event name has that mark removed. The PDF is not asked to draw it.
- `75. Kas sisa 2024 : Rp. 500.000` is an income row. A description matching Kas sisa marks that row as Opening balance and keeps it out of Donations. Its amount still counts toward the income total. Kas sisa is not a separate rule for lines that failed the income-row match.
- The four numbers for these excerpts are Opening balance Rp 500.000, Donations Rp 11.350.000, Expenses Rp 4.611.000, Closing balance Rp 7.239.000.

Derived from those choices: classic scripts so `file://` works; one `localStorage` key; integer rupiah; Helvetica; blank lines skipped; expense group and missing RT start empty; the four-and-four proposal method above.

Nothing in this approach was unclear to the learner. No open technical question was left for a build-time investigation.

Carried from `prd.md > Open Questions`:

- **New report** asks "Delete this report?" **Delete** clears the page. **Cancel** keeps the report.
- A collapsed line reads "Money in · N rows read." A short total reads "Money in is short Rp X." or "Written total Money in is short Rp X." Money out uses the same pattern.
