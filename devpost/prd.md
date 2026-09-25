---
doc: prd
status: approved
---

# Panitia Report — Product Requirements

A phone page for a neighborhood-event treasurer. She pastes the two WhatsApp money messages she already sent, the page checks every line against the totals she wrote, and she downloads a PDF only when the figures match and every line that needs her is settled.

Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > The POC Boundary`.

## The Core Journey

1. She opens one phone page. The title is Panitia Report. Under it, one line: "Tempel dua pesan WhatsApp yang sudah kamu kirim." Two empty boxes are stacked: "Dana masuk", then "Dana keluar". Each hint says "Tempel pesan di sini". One button, "Baca pesan", sits under both. There is no download button, no account, and no form for typing transactions one by one.
2. She pastes each broadcast as she already sent it and taps **Baca pesan**. The title stays. The boxes collapse into two lines she can reopen, "Dana masuk" and "Dana keluar", each showing how many lines were read. Event name and date come from the income header and are editable. The page shows Saldo awal, Total donasi, Total pengeluaran, and Saldo akhir.
3. Each message is a list of rows. Her original line stays unchanged beside the reading. A clear line needs nothing. A yellow line is a guess still in the sum, and she accepts it or replaces it. A red line is missing from the sum until she types an amount or marks it not a transaction. A header, footer, divider, or bank-account line is set aside, still visible, and she can pull it back.
4. At the top of each message's list is the total used for the match. If she wrote one, it reads "TOTAL tertulis: Rp X" and she taps **Ubah** to change the number. That total line is not also a row she can count. The paste does not change. If a message has no total line, the page asks once whether the computed total is right. If a pasted message does not match, the difference stays pinned: which message, and the difference in rupiah.
5. **Unduh PDF** stays on the page and does nothing useful until every pasted message matches its total, every yellow line is settled, and every red line has an amount or is marked **Bukan transaksi**. Set-aside lines do not block it. While it is blocked it says "Masih ada baris yang perlu dicek."
6. She can skip signatures. If she adds any, they are a role and a name, up to three. The PDF's first page is the event name, the date, and the four numbers. If Saldo awal came from a line, that line's original wording sits with Saldo awal on page one, and the line is not repeated in the income list. The pages after are the donations, then the expenses. The signature block is last, and only if she added one.
7. If she leaves and comes back on the same phone, that report is still there. **Laporan baru**, after she confirms, clears the page back to the two empty boxes. Another phone does not have the report.

## Screens and Layout

One phone page, stacked. It is never two columns.

**Before a reading.** Title, the one instruction line, the two paste boxes, **Baca pesan**. Nothing else.

**After a reading.** Title, then the two collapsed message lines. Under those, the editable event name and date. Then the four numbers in one bordered table. If a rupiah gap remains, a line pinned at the top names the message and the difference. Under the four numbers, "Tanda tangan", empty until she adds someone. Each message is a list of rows under its collapsed line. **Unduh PDF** is on the page. **Laporan baru** is on the page once a report is open.

She reopens a collapsed line to see the paste again. Row edits never change that paste.

There is no second screen. The PDF is a file she downloads, not a page in the app.

## Look and Feel

The page should feel like the paper laporan kas a print shop will photocopy. Not like a chat. Not like a banking app.

Off-white paper, near-black ink, thin ruled lines. The phone uses the device font. No custom font, no gradient, no illustration.

A clear line has no fill. A yellow line is a pale amber row. A red line is a pale red row. A set-aside line is grey. The four numbers sit in a plain bordered table, large enough to read in sunlight.

**Unduh PDF** is a solid dark-green button when it works, and the same button greyed out while it shows "Masih ada baris yang perlu dicek."

The PDF is the same document in black text on white. Its title is centered, then the four-number table.

## Features and Behavior

### Paste

She pastes the income broadcast into "Dana masuk" and the expense broadcast into "Dana keluar", as written. She does not type transactions one by one.

- [ ] Before any reading, the page shows the title, "Tempel dua pesan WhatsApp yang sudah kamu kirim.", the two labeled boxes with "Tempel pesan di sini", and **Baca pesan**, and it does not show **Unduh PDF**.
- [ ] If both boxes are empty, **Baca pesan** does not build a list. The page stays as it was and says "Tempel minimal satu pesan."
- [ ] If only one box is filled, that message becomes the list. The empty side shows "Tidak ditempel" and a total of zero.

Source: `scope.md > The Core Loop`, `scope.md > Explicitly Cut`.

### Reading the messages

**Baca pesan** reads the paste. The original WhatsApp message is never rewritten.

The two boxes collapse into two lines she can reopen. Each line shows how many lines were read.

Event name and date are taken from the income header. She can edit both. The header is still a set-aside row, not a counted amount, unless she pulls it back.

A row shows her original line, unchanged, and beside it the reading:

- An income line shows the amount, the name, and the RT.
- An expense line shows the item and the expense group, and the amount.
- A formula line also shows the multiplication.

- [ ] After a reading, the paste boxes are gone and the two summary lines can be opened again onto the original text.
- [ ] Changing a row does not change the paste.
- [ ] Event name and date are visible and editable, and they came from the header.

### Rows

**Clear.** The reading needs nothing from her. The amount is in the sum. She can still tap **Ubah**.

**Yellow, ambiguous amount.** She can see a proposed amount next to her original words. That amount is already in the sum, and the writing could mean something else. `Rp.2000.0000` proposed as 2.000.000 is yellow. The row has **Benar** and **Ubah**. **Benar** keeps the proposed amount and clears the question. **Ubah** lets her change the amount, the name, the RT, or the expense group.

**Yellow, multiplication.** When the product does not equal the amount at the end of her line, the row is yellow. She sees her original line, then "Hitung: 400 × Rp 11.000 = Rp A" and "Tertulis: Rp B." The sum uses Tertulis, the amount at the end of her line, so the check against her own total still uses the numbers she wrote. **Pakai tertulis** keeps Rp B and clears the question. **Pakai hitungan** puts Rp A in the sum instead and clears the question. If the multiplication already equals the amount she wrote, the row is clear and that amount is in the sum.

**Red.** The page will not count any amount. Her original text is still there, the sum skips that line, and the amount is empty. She types an amount, and that amount enters the sum, or she taps **Bukan transaksi** and the line becomes set aside.

**Set aside.** A header, a footer, a divider, or the bank-account line sits in the same list, marked as not counted, with **Ini transaksi**. These lines do not block the download. **Ini transaksi** asks her for the amount, then counts it.

Once a question is cleared, the row is clear. A clear row can still be changed with **Ubah**.

- [ ] `Rp.2000.0000` shows a proposed 2.000.000 in a pale amber row, that 2.000.000 is in the sum, and **Unduh PDF** stays blocked until she taps **Benar** or changes it with **Ubah**.
- [ ] A line whose multiplication does not equal the amount at the end shows Hitung and Tertulis, the sum contains Tertulis, and **Pakai hitungan** swaps the sum to the product.
- [ ] A matching multiplication is a clear row, with no amber fill, and that amount is in the sum.
- [ ] A red row adds nothing to the sum until she types an amount, and **Bukan transaksi** removes it from the lines that need her.
- [ ] A bank-account line is visible, uncounted, and does not block **Unduh PDF**. **Ini transaksi** asks for an amount and then counts that line.

Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`.

### The four numbers

The bordered table shows:

- **Saldo awal**
- **Total donasi**
- **Total pengeluaran**
- **Saldo akhir**

The same four labels are used on the phone and on page one of the PDF.

Total donasi is the income total minus Saldo awal. Saldo awal plus Total donasi still equals the income total. Saldo akhir is Saldo awal plus Total donasi minus Total pengeluaran. Saldo akhir is computed. It is never copied from a message.

If a rupiah gap remains, a line stays pinned at the top: which message, and the difference in rupiah. A difference of zero is not enough to download. A yellow line is still a guess she has not accepted, and a red line is still missing from the sum, so the match can be false.

The download waits until every pasted message matches its total. A side that shows "Tidak ditempel" is not a pasted message.

There is only one Saldo awal. She cannot type a Saldo awal larger than the income total.

- [ ] The four labels read Saldo awal, Total donasi, Total pengeluaran, and Saldo akhir, on the phone and on PDF page one.
- [ ] With a rupiah gap, the pinned line names the message and the difference, and **Unduh PDF** does not download.
- [ ] With a difference of zero and one yellow or red row still open, **Unduh PDF** stays grey and says "Masih ada baris yang perlu dicek."
- [ ] After every yellow row is settled and every red row has an amount or is **Bukan transaksi**, and every pasted message matches its total, the button is dark green and the PDF downloads.
- [ ] Set-aside rows do not keep the button grey.
- [ ] Saldo akhir changes when Saldo awal, the donations, or the expenses change, and it is not a number she pasted.

Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

### The total at the top of a list

When a message already has a total line, that total sits at the top of that message's list, the same place as the question when a total is missing. It reads "TOTAL tertulis: Rp X". She taps **Ubah** to change the number used for the match. The paste itself does not change. That total line is not also a row she can count.

If a message has no total, the question sits in that same place, above its rows: "Tidak ada baris TOTAL. Yang terbaca Rp X. Apakah benar?"

One question per message that lacks a total. **Ya** makes Rp X the total the check uses. **Tidak** leaves that total empty and editable, and the download stays blocked until the numbers match. Yellow and red lines on that message still need her.

- [ ] A message that contains a total shows "TOTAL tertulis: Rp X" at the top of its list, and that total line is not also a counted row.
- [ ] **Ubah** on that total changes the number used for the match and leaves the pasted message unchanged.
- [ ] A message with no TOTAL line shows the question once, with **Ya** and **Tidak**, and does not invent a silent total.
- [ ] **Ya** uses Rp X for the match. **Tidak** leaves the total empty, and **Unduh PDF** stays blocked until she supplies a total the lines match.

Source: `scope.md > The Core Loop`.

### Opening balance

Saldo awal is not a third paste, and it is not invented.

If the income message has a leftover-cash line, such as "Kas sisa 2024", the page lifts that line out of the donations and uses it as Saldo awal. If it has no line like that, Saldo awal is zero.

There is only one Saldo awal. The amounts do not add.

She can tap the Saldo awal figure and type an amount. Total donasi becomes the income total minus what she typed. She cannot type a Saldo awal larger than the income total.

Marking a line **Saldo awal** replaces a figure she typed: that line's amount becomes Saldo awal, and the typed figure is discarded. Typing a Saldo awal replaces a marked line: that line goes back into the donations, and the typed figure is the new Saldo awal. A second line marked **Saldo awal** sends the first line back into the donations.

Saldo akhir updates from those figures.

- [ ] A "Kas sisa 2024" line becomes Saldo awal and is not left inside Total donasi as a donation.
- [ ] With no such line, Saldo awal shows zero, and tapping it lets her type an amount that updates Total donasi and Saldo akhir.
- [ ] A typed Saldo awal larger than the income total is refused, and the previous Saldo awal stays.
- [ ] Marking a line **Saldo awal** discards a figure she had typed, and that line's amount is the only Saldo awal.
- [ ] Typing a new Saldo awal sends a previously marked line back into the donations.
- [ ] Marking a second line **Saldo awal** sends the first marked line back into the donations.

Source: `scope.md > The Core Loop`.

### Signatures

Under the four numbers, "Tanda tangan" starts empty. Skip means she does nothing, and the PDF has no signature block.

**Tambah penandatangan** adds one role and one name, up to three. She can remove any of them. The people who sign do not enter the money.

- [ ] Doing nothing leaves "Tanda tangan" empty and leaves the signature block out of the PDF.
- [ ] She can add up to three role-and-name pairs and remove any pair she added.
- [ ] A fourth pair cannot be added.

Source: `scope.md > Who It's For`, `scope.md > The POC Boundary`.

### The PDF

**Unduh PDF** downloads one PDF only when the button works, as defined under **The four numbers**.

Page one is the event name, the date, and the four numbers, with the title centered above the table. On page one, Saldo awal shows the amount. If it came from a line, that line's original wording sits with Saldo awal.

The pages after that are a flat list of the lines she counted, income first, then expenses, in the order she pasted them. The income list is only the donations. A line lifted into Saldo awal does not appear again there. Each line shows the name and RT, or the item and expense group, and the amount. There is no per-RT section and no per-group section.

The signature block is last, and only if she added one.

- [ ] The file does not download while the button is grey.
- [ ] Page one shows the event name, the date, and the four labeled numbers, and nothing grouped by RT or by expense group.
- [ ] When Saldo awal came from a line, page one shows that amount together with the line's original wording, and that line is absent from the income list.
- [ ] Later pages list donation lines, then expense lines, in paste order, each with the reading and the amount.
- [ ] Names she added appear at the end. No added names means no signature block.

Source: `scope.md > The POC Boundary`, `scope.md > What "Working" Looks Like`.

### Reading a message again

If she reopens a paste, changes it, and taps **Baca pesan** again, the page asks first: "Pesan ini akan dibaca ulang. Koreksi pada pesan ini hilang."

**Lanjut** rebuilds only that message from scratch. Every confirmation and correction on that message is gone. **Batal** keeps her work. The other message stays as she left it. The signature names stay.

If the income message was the one rebuilt, the event name, the date, and the opening balance are read again from that new text.

- [ ] **Baca pesan** on an already read message does not rebuild until she taps **Lanjut**.
- [ ] **Lanjut** on Dana keluar clears only that message's row decisions. Dana masuk, the signatures, the event name, the date, and Saldo awal stay.
- [ ] **Lanjut** on Dana masuk rebuilds that message and reads the event name, the date, and Saldo awal from the new text. Signatures stay.
- [ ] **Batal** leaves every row decision in place.

### Coming back and Laporan baru

If she leaves and comes back on the same phone, the report she was working on is still there: both messages, every row decision, the event name and date, the opening balance, the signature names, and the four numbers.

Another phone does not have it.

It stays until she taps **Laporan baru** and confirms. That clears the page back to the two empty boxes.

- [ ] Leaving and returning on the same phone shows the same report, including row decisions and signature names.
- [ ] Opening the page on another phone does not show that report.
- [ ] **Laporan baru** does not clear the page until she confirms. After she confirms, the two boxes are empty and there is no reading.

## States and Boundaries

- **First visit** — the paste page, both boxes empty, no PDF button.
- **Both pastes empty** — no list, the paste page stays, "Tempel minimal satu pesan."
- **One paste** — one list, the other side "Tidak ditempel" with a total of zero.
- **Rupiah gap** — pinned difference, download blocked.
- **Yellow or red still open** — download blocked even when the difference is zero, button text "Masih ada baris yang perlu dicek."
- **No total line** — one **Ya** / **Tidak** question at the top of that message's list.
- **Ready** — dark-green **Unduh PDF**, and the file downloads.
- **Same phone, later** — the working report is still on the page.
- **Other phone** — no report.
- **Laporan baru, confirmed** — back to the two empty boxes.
- **Who it is for** — she is the only person who enters money. The neighborhood reads page one. Signers sign. They do not get a way to edit the report.

Source: `scope.md > Who It's For`.

## Product Decisions

- One stacked phone page — that is the whole app she uses.
- Indonesian words for every control and label she named — she reads the page on her phone, and the neighborhood reads the same four words on page one.
- Paper, not a chat and not a bank — the print shop photocopies a laporan kas, so the screen should look like that paper.
- Yellow stays in the sum and still blocks the PDF — a difference of zero can be a false match.
- A multiplication mismatch proposes nothing over her written amount — Tertulis stays in the sum until she taps **Pakai hitungan**.
- Set-aside lines stay visible and do not block the download — a header or a bank line might still be a donation, but it is not a guess about a number.
- There is only one Saldo awal, and the amounts do not add — marking a line replaces a typed figure, typing replaces a marked line, and a second mark sends the first line back into the donations. She cannot type a Saldo awal larger than the income total.
- A written total sits at the top of that message's list as "TOTAL tertulis: Rp X" — she taps **Ubah**, the paste stays unchanged, and that total line is not a row she can count.
- A line lifted into Saldo awal is not repeated in the PDF income list — the list is only the donations, and the line's original wording sits with Saldo awal on page one.
- The report remains on the same phone — she may leave and come back — and **Laporan baru** is how she throws it away.
- Reading again asks first, and only the message she rebuilds loses its corrections — the other message and the signature names survive.
- Skip signatures by doing nothing — the block is optional.

## What We're Building

- The paste page and **Baca pesan**, including both-empty and one-empty.
- Line-by-line reading with the original text kept beside it.
- Clear, yellow, red, and set-aside rows, and the actions named above.
- The multiplication check, including a mismatch that stays yellow.
- The four numbers, the pinned rupiah gap, and the blocked and working **Unduh PDF**.
- The one-time question when a total line is missing.
- One Saldo awal, from a leftover-cash line, a typed figure, or a line she marks, with the later action replacing the earlier one.
- "TOTAL tertulis: Rp X" at the top of a message that already has a total, edited with **Ubah**, and not counted as a row.
- Editable event name and date.
- Optional signature names, up to three.
- One PDF: page one as specified, including the original wording when Saldo awal came from a line, then the donation lines and the expense lines, then signatures only if added.
- The report still there on the same phone, and **Laporan baru** after confirmation.
- A confirm-before-rebuild when she reads a paste again.

## Deferred From the POC

- A Word file, so the print shop can edit the layout. A second layout does not fit this proof of concept. Source: `scope.md > Later`.
- A separate per-RT or per-group section in the PDF. Page one stays the four numbers. Source: `scope.md > Later`.

## Possible Later Enhancements

A Word file of the same report, for a print shop that wants to change the layout.

A later PDF section that groups lines by RT or by expense group, after page one.

## Non-Goals

- A form where she types each transaction. She already wrote the messages. Source: `scope.md > Explicitly Cut`.
- A photo of a notebook. Source: `scope.md > Explicitly Cut`.
- Accounts. The report stays on one phone without a login. Source: `scope.md > Explicitly Cut`.
- Shared editing. The neighborhood and the committee read or sign. Source: `scope.md > Explicitly Cut`.
- A chatbot that guesses an amount she did not accept. She confirms the line. Source: `scope.md > Explicitly Cut`.
- Word or Excel as the thing she uses. Source: `scope.md > Explicitly Cut`.

## Open Questions

- **Laporan baru confirmation.** She must confirm before the page clears. The confirm words were not named. Can wait until the build.
- **Two unnamed sentences.** The collapsed line must show how many lines were read, and the pinned gap must name the message and the rupiah difference. The exact Indonesian for those two was not chosen. Can wait until the build.
