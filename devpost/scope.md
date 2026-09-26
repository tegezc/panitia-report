---
doc: scope
status: approved
---

# Panitia Report

A phone page for a neighborhood-event treasurer: she pastes the WhatsApp money messages she already sent, the app checks every line against the totals she wrote, and she downloads a PDF only when those numbers match.

## The Unique Kernel

Stop on the line a normal app would hide. In a real income message, one line says `Rp.2000.0000`. Strip the dots naively and it becomes 20 million, and the total blows up. Read as 2 million, it matches the total she wrote herself, `Rp 17.810.000`. The app stops on that line and asks her, instead of silently fixing it. An expense line like 400 portions times a unit price gets the multiplication checked, not just the number at the end. The report then shows a closing balance nobody wrote: opening balance plus donations minus expenses. That is the minute a judge should see.

## Who It's For

The learner's sibling is the treasurer of recurring neighborhood events (17 Agustus, Maulid Nabi). She only has a phone. She records money in and out as messy WhatsApp messages, and she cannot use Word or Excel. There is no printer at home. Today the learner turns those messages into the report and is the workaround.

After she is done, two groups touch the report and neither of them types the transactions. The neighborhood WhatsApp group reads it on their phones and should see the answer on the first page: opening balance, donations, expenses, closing balance. A printed copy is what the committee keeps. She takes the PDF to a print shop or sends it back to the group. An optional signature block at the end — usually the committee chair and the treasurer, sometimes the neighborhood head — is for people who sign. They do not enter the money.

## The Core Loop

She opens one page and pastes the income broadcast and the expense broadcast exactly as she already sent them. She sees a table. The original text stays next to each reading, so she can compare `Rp.. 200.000` with `200.000`. A clear line is fine. An ambiguous line asks her to confirm. An unreadable line is not counted until she types the amount or says it is not a transaction. Header, footer, and the bank-account line are ignored, but still visible, because one of them might actually be a donation. She can tap any line and fix it, including the RT and the expense group. The original WhatsApp message is never rewritten. Event name and date come from the header, and she can edit them. The total she wrote is editable too.

The opening balance is not invented and it is not a third paste. It is a line already inside the income message, leftover cash from the previous event, written like "Kas sisa 2024". The report lifts that line out of the donations. Donations are the income total minus that amount. If the message has no line like that, the opening balance is zero and she can correct it if the parser missed it. The closing balance is opening balance plus donations minus expenses.

If the sum matches the total she wrote, she only has to look at the suspicious lines. If it does not, the difference stays on screen. She fixes a line or she fixes that total. When the numbers match, the PDF downloads. If a message has no total line, the app asks her once whether the computed total is right. Yellow and red lines still need her. A yes becomes the total the rest of the check uses. A no leaves the download blocked until the numbers match.

## Inspiration & Identity

One phone page. The WhatsApp wording stays visible beside each reading. The PDF's first page is the answer the neighborhood reads. No separate look-and-feel direction yet.

## Why This Matters to the Learner

What excites the learner is the moment the money is wrong in a way a normal app would hide. The learner is the person who currently produces the report. The sibling should be able to do it on her phone.

## What "Working" Looks Like

In the first minute, a judge sees the `Rp.2000.0000` line stopped and asked, an expense multiplication checked, and a closing balance that appears in neither message. She can correct a line or the total she wrote. The PDF downloads only when the numbers match. Dana masuk is grouped by RT. The ringkasan has one line per RT, then Saldo awal, the expenses, and Saldo akhir. Donor names are not on that page.

## The POC Boundary

One phone page. Two pastes, as written. Line-by-line reading with the original text kept beside it. Ambiguous lines confirmed, unreadable lines left uncounted until she types an amount or marks them as not a transaction. Header, footer, and bank-account line shown but not counted until she says otherwise. Edits to a line — amount, name, RT, and expense group — plus the total she wrote, and the event name and date. Opening balance lifted from a leftover-cash line such as "Kas sisa 2024", or zero if that line is absent. Donations equal the income total minus that opening balance. Closing balance computed, never copied from a message. Download blocked while a gap remains. A missing total line asks once. One PDF the committee keeps. Dana masuk lists donors by RT, with numbering restarted in each RT and a subtotal after each group. Dana keluar is a numbered list of item and amount, then the total. The ringkasan is one line per RT subtotal, then Saldo awal with the leftover-cash wording, then the expenses, then Saldo akhir. Donor names do not appear on the ringkasan. A real income message is 100–200 rows. Expenses stay under 30. An optional signature block at the end.

## Later

A Word file, so the print shop can edit the layout. A second layout does not fit this afternoon.

A separate per-group section in the PDF. Dana masuk is already grouped by RT.

## Explicitly Cut

- A form where she types each transaction. She already wrote the messages; a form is a different product.
- A photo of a notebook. Different product.
- Accounts. Different product.
- Shared editing. The neighborhood and the committee read or sign; they do not enter the money.
- A chatbot that guesses the numbers. She confirms the line; the app does not invent it.
- Word or Excel as the thing she uses. Those are what she cannot use.
