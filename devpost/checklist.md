---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Paste the two messages and see the kernel on the page**
  Becomes usable: She opens one phone page, pastes Dana masuk and Dana keluar, taps Baca pesan, and sees each original line beside its reading. `Rp.2000.0000` is a pale amber row proposing Rp 2.000.000, already in the sum. The panitia multiplication is amber, shows Hitung and Tertulis, and the sum uses Tertulis. Kas sisa is Saldo awal, not a donation. The bank line is grey and uncounted. The four numbers are on screen, including a Saldo akhir nobody wrote. Event name and date come from the income header. Each list starts with TOTAL tertulis. Both boxes empty stays on the paste page and says "Tempel minimal satu pesan." One empty side says "Tidak ditempel" and zero.
  Why now: This is the unique kernel, and the page has to exist for it to be visible. Scaffold, paper layout, parser, and the anonymized fixture live inside this slice. Later slices are worthless if this reading is wrong.
  PRD ref: `prd.md > The Core Journey` (steps 1–3), `prd.md > Paste`, `prd.md > Reading the messages`, `prd.md > Rows`, `prd.md > The four numbers`, `prd.md > The total at the top of a list`, `prd.md > Opening balance`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`, `spec.md > Components`, `spec.md > File Structure`, `spec.md > Data Model`, `spec.md > Look and Feel`
  Build: Add `index.html`, `styles.css`, `parse.js`, `app.js`, `fixtures/excerpts.txt`, and `README.md`. Parse lines in the order in `spec.md > Components` (Reading the messages). Draw the paste page, then the report: collapsed lines, editable-looking event name and date (editing waits), the four-number table, and the row lists. No row actions, no PDF, no storage. `fixtures/excerpts.txt` is the two excerpts from the spec, including `2. Warga B RT.02 : Rp 6.000.000` and no other added lines. Read `Rp.2000.0000` as Rp 2.000.000. Income is Rp 1.000.000, Rp 6.000.000, Kas sisa Rp 500.000, and Rp 2.000.000. Choose the Indonesian for the collapsed line's count and the pinned gap while building this slice.
  Verify (mechanical): Load `parse.js` and `fixtures/excerpts.txt` in Node. Confirm the Warga F line is `yellow-amount` with amount 2000000; the panitia line is `yellow-multiply` with written 100000 and product 110000; the warga formula line is clear; Kas sisa has `saldoAwal` and amount 500000; the bank line is `aside`; both TOTAL lines are totals, not rows; event name is `PERINGATAN HARI KEMERDEKAAN RI` and the date is `Senin, 17 Agustus 2026`; income total 9500000, Saldo awal 500000, Total donasi 9000000, Total pengeluaran 4611000, Saldo akhir 4889000. Open `index.html` and confirm the paste page, then the same reading after Baca pesan.
  Learner check: Open `index.html` in Chrome, paste both excerpts, tap Baca pesan, and look at the amber `Rp.2000.0000` row, the panitia Hitung/Tertulis row, Kas sisa as Saldo awal, and Saldo akhir Rp 4.889.000.
  Commit: `Show the pasted messages and the lines that need her`

- [x] **2. She can settle a line, and the download stays blocked until the check is honest**
  Becomes usable: She can tap Benar, Ubah, Pakai tertulis, Pakai hitungan, type an amount on a red row, mark Bukan transaksi, or pull a set-aside line back with Ini transaksi. She can change TOTAL tertulis, answer the one missing-total question, edit Saldo awal (including the replace rules), and edit the event name and date. The paste never changes. A rupiah gap stays pinned. Unduh PDF is on the page, grey, and says "Masih ada baris yang perlu dicek" until every pasted message matches and every yellow or red line is settled. Then the button is dark green. It still does not download a file.
  Why now: The kernel asks her to confirm instead of hiding the line. The gate has to be true before a PDF means anything. The demo path is Benar on the odd amount and Pakai tertulis on the multiplication.
  PRD ref: `prd.md > The Core Journey` (steps 4–5), `prd.md > Rows`, `prd.md > The four numbers`, `prd.md > The total at the top of a list`, `prd.md > Opening balance`
  Spec ref: `spec.md > Components` (Rows, The four numbers, The written total, Opening balance), `spec.md > Data Model`
  Build: In `app.js`, add the row actions, total editing, the missing-total question, Saldo awal editing, and event name and date editing. Compute the gate from `prd.md > The four numbers`. Leave `pdf.js` uncalled.
  Verify (mechanical): In Node, start from the excerpt parse. With either yellow row still open, the gate stays closed even when the rupiah difference is zero. After Benar on the amount and Pakai tertulis on the multiplication, the gate opens. A red row with no amount keeps it closed; Bukan transaksi or a typed amount clears that block. A Saldo awal larger than the income total is refused. Open `index.html`, settle the two excerpt rows, and confirm the button text and that no file downloads.
  Learner check: Paste the excerpts, tap Benar on `Rp.2000.0000` and Pakai tertulis on the panitia line, and confirm the button turns dark green and still does not download.
  Commit: `Settle lines and gate the PDF button`

- [x] **3. The PDF downloads only when that gate is open**
  Becomes usable: The dark-green button downloads `laporan-kas.pdf`. Page one is the event name, the date, and the four numbers. When Saldo awal came from a line, that line's original wording sits with Saldo awal and the line is not repeated in the income list. Later pages list donations, then expenses, in paste order. She can add up to three role-and-name signatures, or add none, and the block is last only if she added one. A grey button downloads nothing. If the file cannot be built, the page says "PDF gagal dibuat" and the report on screen stays.
  Why now: pdf-lib is the one vendored dependency, and the download is the moment the check becomes a document. Signatures exist only to appear at the end of that file. The kernel reading and the gate already work, so a PDF bug cannot hide them.
  PRD ref: `prd.md > The Core Journey` (step 6), `prd.md > The PDF`, `prd.md > Signatures`
  Spec ref: `spec.md > Components` (The PDF, Signatures), `spec.md > External Services and Dependencies`, `spec.md > Important Failure Modes`, `spec.md > File Structure`
  Build: Copy pdf-lib 1.17.1 once to `vendor/pdf-lib.min.js` from the URL in the spec. Add `pdf.js` and the signature block under the four numbers. Download only when the gate is open. Do not draw the header em dash.
  Verify (mechanical): With the gate closed, confirm no download. With the gate open on the excerpts, build the bytes and confirm they start with `%PDF`, include the four labels and Rp 500.000, Rp 9.000.000, Rp 4.611.000, and Rp 4.889.000, include `75. Kas sisa 2024 : Rp. 500.000` on the first page's saldo wording, and do not include U+2014. In the browser, the dark-green button downloads `laporan-kas.pdf`.
  Learner check: Settle the two yellow rows, tap Unduh PDF, and open the file. Page one should show the four numbers, and Kas sisa should not be listed again as a donation.
  Commit: `Download the laporan when the figures match`

- [x] **4. The same phone still has the report, and she can throw it away or re-read one message**
  Becomes usable: Leave and come back on this phone and the report is still there, including row decisions and signature names. Another empty storage does not have it. Laporan baru asks first and, after she confirms, returns to the two empty boxes. Reopening a paste and tapping Baca pesan asks first. Lanjut re-reads only that message. Batal keeps her work. If this browser will not keep storage for a local file, the page says "Laporan ini belum tersimpan di ponsel ini."
  Why now: The report she would actually leave and reopen is the one that already reads, settles, and downloads. Storage is the last journey step, and a storage failure must not be mistaken for a bad parse.
  PRD ref: `prd.md > The Core Journey` (steps 6–7), `prd.md > Reading a message again`, `prd.md > Coming back and Laporan baru`
  Spec ref: `spec.md > Components` (Saving on this phone, Reading a message again), `spec.md > Data Model`, `spec.md > Important Failure Modes`
  Build: `app.js` writes one JSON value to `localStorage` key `panitia-report` after every reading and edit, and loads it on open. Add the Laporan baru confirm and the re-read confirm. Choose the Laporan baru confirm words while building this slice.
  Verify (mechanical): Open `index.html` in Chrome, paste and read the excerpts, reload, and confirm the same rows and four numbers. Tap Laporan baru and cancel, then confirm, and confirm the paste page is empty and the storage key is gone. Re-read Dana keluar with Lanjut and confirm Dana masuk decisions remain. A fresh storage shows the empty paste page.
  Learner check: Read the excerpts, reload the tab, and confirm the report is still there. Then tap Laporan baru, confirm, and confirm both boxes are empty.
  Commit: `Keep the report on this phone`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 1, the paste page and the kernel reading
- [x] Final kick-the-tires exploration and feedback completed

## Final Review

- [x] Screen tiles and the three-part PDF — income grouped by RT, one open detail at a time, Dana masuk / Dana keluar / ringkasan, kernel unchanged
- [x] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Brief recap, not a hands-on tour. The download stayed grey after the Rp 500.000 gap disappeared, because Bpk H. Warga F was still yellow-amount. `prd.md > The four numbers` reserves "Rows still need a check." for a yellow or red row. `app.js` `incomeMatch` counts Kas sisa, and `blockNote` names the open row.
Route and stops: Reference route only, not walked in the editor. `index.html` `id="download"` and `id="download-note"` → `app.js` `gateOpen`, `blockNote`, `incomeMatch` → `parse.js` `kas sisa` and `reportFigures`.
Edit outcome: not applicable. No product change after the ready-to-ship confirmation.
Reflection: declined.
Activity mode: brief recap for a plan-first learner

## Revisions

- The learner confirmed the proof of concept is ready to ship. No further product changes.
- The screen's own labels are English. The pasted WhatsApp text stays Indonesian, including Rp.2000.0000, Kas sisa, RT, TOTAL, and the bank line. PDF columns stay No., Nama, Jumlah, Uraian, and Keterangan.
- The income fixture has 10 transaction lines and the expense fixture still has 3. The written income TOTAL is Rp 11.850.000.
- The PDF is a colored table in three parts, and each title is centered.
- Written total in both sections and the Money out Total share one color. That color is not the button color. RT group headers stay a different color.
- RT group headers are brown, separate from the black buttons and from the black TOTAL bars.
- While a yellow or red row is still open, the line under Unduh PDF names that row. On the excerpt, that row is Bpk H. Warga F until Benar. A hidden Kas sisa row does not keep the button grey. The yellow tile is darker than the Dana masuk background so it can be seen.
- Kas sisa counts in the Dana masuk total compared with TOTAL tertulis, so a written Rp 9.500.000 matches and the Rp 500.000 gap goes away. A total mismatch names which total is short and by how much. "Masih ada baris yang perlu dicek." is only for a yellow or red row. The tiles and the PDF stay as they were.
- The income fixture and `spec.md > Components` now include `2. Warga B RT.02 : Rp 6.000.000` between the Rp 1.000.000 line and Kas sisa. The spec named the Rp 9.500.000 total without writing that clear donation line.
- Unduh PDF sits with Laporan baru under the four-number table. The button is always labeled Unduh PDF. While the gate is closed it is disabled, and "Masih ada baris yang perlu dicek." is the line under it.
- Laporan baru sits directly under the four-number table, above Dana masuk, so a long income list does not push it off the first screen.
- Open detail is a bordered panel under the tile, not painted with the tile color. "Lihat pesan" opens directly under its button. Dana masuk and Dana keluar have different backgrounds, and totals are heavier than a donor tile.
- The screen lists income by RT as closed tiles, and the PDF is Dana masuk, Dana keluar, and a ringkasan without donor names. Per-RT moved from Later into the POC boundary. `parse.js` stays. The kernel stays: the odd amount stays yellow until Benar, the multiplication check stays, Kas sisa stays Saldo awal, and Unduh PDF stays grey until every yellow or red line is settled.
- Laporan baru asks "Hapus laporan ini?" and clears only after Hapus. Batal keeps the report. Re-reading a changed paste asks "Pesan ini akan dibaca ulang. Koreksi pada pesan ini hilang."
- The demo fixture is Independence Day. The income header is `*LAPORAN DANA MASUK—PERINGATAN HARI KEMERDEKAAN RI | Senin, 17 Agustus 2026*`, and the clear formula line is `Konsumsi warga 400x @Rp.11.000 = 4.400.000`. Amounts, parser rules, and the four numbers stay as they were.
