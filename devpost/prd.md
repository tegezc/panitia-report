---
doc: prd
status: approved
---

# Panitia Report — Product Requirements

A phone page for a neighborhood-event treasurer. She pastes the two WhatsApp money messages she already sent, the page checks every line against the totals she wrote, and she downloads a PDF only when the figures match and every line that needs her is settled.

Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > The POC Boundary`.

## The Core Journey

1. She opens one phone page. The title is Panitia Report. Under it, one line: "Paste the two WhatsApp messages you already sent." Two empty boxes are stacked: "Money in", then "Money out". Each hint says "Paste a message here". One button, "Read messages", sits under both. There is no download button, no account, and no form for typing transactions one by one.
2. She pastes each broadcast as she already sent it and taps **Read messages**. The title stays. The boxes collapse into two lines she can reopen, "Money in" and "Money out", each showing how many lines were read. Event name and date come from the income header and are editable. The page shows Opening balance, Donations, Expenses, and Closing balance.
3. Income is grouped by RT. Each group shows its name and subtotal. Each donor is one closed tile, a single line with the name and the amount, and a closed tile has no buttons. She taps one tile and its detail opens directly under that tile only: the original WhatsApp line, the reading, and the fix actions for that row. Other tiles stay closed. Tapping another tile closes the previous detail. Expenses use the same closed-tile pattern. A clear line needs nothing. A yellow line is a guess still in the sum, and she accepts it or replaces it. A red line is missing from the sum until she types an amount or marks it not a transaction. A header, footer, divider, or bank-account line is set aside, still visible as a closed tile, and she can pull it back from its detail. Kas sisa is Opening balance and is not a donor tile.
4. At the top of each message's list is the total used for the match. If she wrote one, it reads "Written total: Rp X" and she taps **Edit** to change the number. That total line is not also a row she can count. The paste does not change. If a message has no total line, the page asks once whether the computed total is right. If a pasted message does not match, the difference stays pinned and names which total is short, and by how much. Kas sisa counts in the Money in total that is compared with Written total.
5. **Download PDF** stays on the page and does nothing useful until every pasted message matches its total, every yellow line is settled, and every red line has an amount or is marked **Not a transaction**. Set-aside lines do not block it. While it is blocked the button stays labeled **Download PDF** and disabled. A yellow or red row still open puts "Rows still need a check:" under the button, followed by that row's name. Kas sisa, already Opening balance and hidden from the tiles, does not count as a row still to check. A total that does not match names which total is short and by how much, for example "Money in is short Rp 500.000." or "Written total Money out is short Rp 10.000."
6. She can skip signatures. If she adds any, they are a role and a name, up to three. The PDF is the laporan the committee keeps, in three parts. Money in has the event name and date, columns No., Nama, and Jumlah, numbering that restarts in each RT, and a subtotal after each group. Money out is a table of item and amount, then the total. The summary is one line per RT subtotal, then Opening balance with the Kas sisa wording when it came from a line, then the expenses, then Closing balance. Donor names do not appear on the summary. Kas sisa is not repeated as a donation. The signature block is last, and only if she added one.
7. If she leaves and comes back on the same phone, that report is still there. **New report**, after she confirms, clears the page back to the two empty boxes. Another phone does not have the report.

## Screens and Layout

One phone page, stacked. It is never two columns.

**Before a reading.** Title, the one instruction line, the two paste boxes, **Read messages**. Nothing else.

**After a reading.** Title, then the two collapsed message lines. Under those, the editable event name and date. Then the four numbers in one bordered table. If a rupiah gap remains, a line pinned at the top names which total is short and by how much. Directly under the four numbers, **New report**, so a long income list does not push it off the screen. Under that, "Signatures", empty until she adds someone. Income is grouped by RT, each group with its name and subtotal, then one closed tile per donor. Expenses are closed tiles. A real income message is 100–200 rows, and expenses stay under 30, so a closed tile is one line and the fix actions appear only under the tile she tapped. **Download PDF** is on the page. **New report** is on the page once a report is open.

She reopens a collapsed line to see the paste again. Row edits never change that paste.

There is no second screen. The PDF is a file she downloads, not a page in the app.

## Look and Feel

The page should feel like the paper laporan kas a print shop will photocopy. Not like a chat. Not like a banking app.

Off-white paper, near-black ink, thin ruled lines. The phone uses the device font. No custom font, no gradient, no illustration.

A clear tile has no fill. A yellow tile is pale amber. A red tile is pale red. A set-aside tile is grey. That color stays on the one-line tile. The open detail is a separate panel directly under that tile, with its own background, a border, and padding, so the original WhatsApp line and the reading are not another row. The fix buttons sit in that panel.

Money in has one background. Money out has a different background. "Written total" and the expense total are heavier than a donor tile, so a total is not read as another name. Written total in both sections and the Money out Total share one color, and that color is not the button color. An RT group header is a different color from those totals and from the buttons. The four numbers stay in a plain bordered table, large enough to read in sunlight.

**Download PDF** stays labeled **Download PDF**. It is solid dark green when it works, and the same button greyed out and disabled while a line under it says why. "Rows still need a check." is only for a yellow or red row. A total mismatch names which total is short and by how much. It sits with **New report** directly under the four numbers.

The PDF is a colored table in three parts: Money in by RT, Money out, then the summary. Each part's title is centered. It is not a one-page list titled Panitia Report.

## Features and Behavior

### Paste

She pastes the income broadcast into "Money in" and the expense broadcast into "Money out", as written. She does not type transactions one by one.

- [ ] Before any reading, the page shows the title, "Paste the two WhatsApp messages you already sent.", the two labeled boxes with "Paste a message here", and **Read messages**, and it does not show **Download PDF**.
- [ ] If both boxes are empty, **Read messages** does not build a list. The page stays as it was and says "Paste at least one message."
- [ ] If only one box is filled, that message becomes the list. The empty side shows "Not pasted" and a total of zero.

Source: `scope.md > The Core Loop`, `scope.md > Explicitly Cut`.

### Reading the messages

**Read messages** reads the paste. The original WhatsApp message is never rewritten.

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

**Clear.** The reading needs nothing from her. The amount is in the sum. She can still tap **Edit**.

**Yellow, ambiguous amount.** She can see a proposed amount next to her original words. That amount is already in the sum, and the writing could mean something else. `Rp.2000.0000` proposed as 2.000.000 is yellow. The row has **Confirm** and **Edit**. **Confirm** keeps the proposed amount and clears the question. **Edit** lets her change the amount, the name, the RT, or the expense group.

**Yellow, multiplication.** When the product does not equal the amount at the end of her line, the row is yellow. She sees her original line, then "Calculated: 400 × Rp 11.000 = Rp A" and "Written: Rp B." The sum uses Written, the amount at the end of her line, so the check against her own total still uses the numbers she wrote. **Use written** keeps Rp B and clears the question. **Use calculated** puts Rp A in the sum instead and clears the question. If the multiplication already equals the amount she wrote, the row is clear and that amount is in the sum.

**Red.** The page will not count any amount. Her original text is still there, the sum skips that line, and the amount is empty. She types an amount, and that amount enters the sum, or she taps **Not a transaction** and the line becomes set aside.

**Set aside.** A header, a footer, a divider, or the bank-account line sits in the same list, marked as not counted, with **This is a transaction**. These lines do not block the download. **This is a transaction** asks her for the amount, then counts it.

Once a question is cleared, the row is clear. A clear row can still be changed with **Edit**.

- [ ] `Rp.2000.0000` shows a proposed 2.000.000 in a pale amber row, that 2.000.000 is in the sum, and **Download PDF** stays blocked until she taps **Confirm** or changes it with **Edit**.
- [ ] A line whose multiplication does not equal the amount at the end shows Calculated and Written, the sum contains Written, and **Use calculated** swaps the sum to the product.
- [ ] A matching multiplication is a clear row, with no amber fill, and that amount is in the sum.
- [ ] A red row adds nothing to the sum until she types an amount, and **Not a transaction** removes it from the lines that need her.
- [ ] A bank-account line is visible, uncounted, and does not block **Download PDF**. **This is a transaction** asks for an amount and then counts that line.

Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`.

### The four numbers

The bordered table shows:

- **Opening balance**
- **Donations**
- **Expenses**
- **Closing balance**

The same four labels are used on the phone and on page one of the PDF.

Donations is the income total minus Opening balance. Opening balance plus Donations still equals the income total. Closing balance is Opening balance plus Donations minus Expenses. Closing balance is computed. It is never copied from a message.

The Money in total compared with Written total includes Kas sisa. If a rupiah gap remains, a line stays pinned at the top and names which total is short, and by how much. A difference of zero is not enough to download. A yellow line is still a guess she has not accepted, and a red line is still missing from the sum, so the match can be false.

The download waits until every pasted message matches its total. A side that shows "Not pasted" is not a pasted message.

There is only one Opening balance. She cannot type a Opening balance larger than the income total.

- [ ] The four labels read Opening balance, Donations, Expenses, and Closing balance, on the phone and on PDF page one.
- [ ] With a rupiah gap, the pinned line names which total is short and by how much, and **Download PDF** does not download.
- [ ] With a difference of zero and one yellow or red row still open, **Download PDF** stays grey and disabled, still labeled **Download PDF**, and the line under it says "Rows still need a check."
- [ ] With no yellow or red row and a total that does not match, the line under the button names which total is short and by how much, and does not say "Rows still need a check."
- [ ] After every yellow row is settled and every red row has an amount or is **Not a transaction**, and every pasted message matches its total, the button is dark green and the PDF downloads.
- [ ] Set-aside rows do not keep the button grey.
- [ ] Closing balance changes when Opening balance, the donations, or the expenses change, and it is not a number she pasted.

Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

### The total at the top of a list

When a message already has a total line, that total sits at the top of that message's list, the same place as the question when a total is missing. It reads "Written total: Rp X". She taps **Edit** to change the number used for the match. The paste itself does not change. That total line is not also a row she can count.

If a message has no total, the question sits in that same place, above its rows: "There is no TOTAL line. Read as Rp X. Is that right?"

One question per message that lacks a total. **Yes** makes Rp X the total the check uses. **No** leaves that total empty and editable, and the download stays blocked until the numbers match. Yellow and red lines on that message still need her.

- [ ] A message that contains a total shows "Written total: Rp X" at the top of its list, and that total line is not also a counted row.
- [ ] **Edit** on that total changes the number used for the match and leaves the pasted message unchanged.
- [ ] A message with no TOTAL line shows the question once, with **Yes** and **No**, and does not invent a silent total.
- [ ] **Yes** uses Rp X for the match. **No** leaves the total empty, and **Download PDF** stays blocked until she supplies a total the lines match.

Source: `scope.md > The Core Loop`.

### Opening balance

Opening balance is not a third paste, and it is not invented.

If the income message has a leftover-cash line, such as "Kas sisa 2024", the page lifts that line out of the donations and uses it as Opening balance. If it has no line like that, Opening balance is zero.

There is only one Opening balance. The amounts do not add.

She can tap the Opening balance figure and type an amount. Donations becomes the income total minus what she typed. She cannot type a Opening balance larger than the income total.

Marking a line **Opening balance** replaces a figure she typed: that line's amount becomes Opening balance, and the typed figure is discarded. Typing a Opening balance replaces a marked line: that line goes back into the donations, and the typed figure is the new Opening balance. A second line marked **Opening balance** sends the first line back into the donations.

Closing balance updates from those figures.

- [ ] A "Kas sisa 2024" line becomes Opening balance and is not left inside Donations as a donation.
- [ ] With no such line, Opening balance shows zero, and tapping it lets her type an amount that updates Donations and Closing balance.
- [ ] A typed Opening balance larger than the income total is refused, and the previous Opening balance stays.
- [ ] Marking a line **Opening balance** discards a figure she had typed, and that line's amount is the only Opening balance.
- [ ] Typing a new Opening balance sends a previously marked line back into the donations.
- [ ] Marking a second line **Opening balance** sends the first marked line back into the donations.

Source: `scope.md > The Core Loop`.

### Signatures

Under the four numbers, "Signatures" starts empty. Skip means she does nothing, and the PDF has no signature block.

**Add a signatory** adds one role and one name, up to three. She can remove any of them. The people who sign do not enter the money.

- [ ] Doing nothing leaves "Signatures" empty and leaves the signature block out of the PDF.
- [ ] She can add up to three role-and-name pairs and remove any pair she added.
- [ ] A fourth pair cannot be added.

Source: `scope.md > Who It's For`, `scope.md > The POC Boundary`.

### The PDF

**Download PDF** downloads one PDF only when the button works, as defined under **The four numbers**.

Money in comes first: the event name, the date, and columns No., Nama, and Jumlah. Numbering restarts in each RT. A subtotal follows each group. A line lifted into Opening balance is not a donation row.

Money out is a table of item and amount, then the total.

The summary is one line per RT subtotal, then Opening balance. If Opening balance came from a line, that line's original wording sits with it. Then the expenses, then Closing balance. Donor names do not appear on the summary.

The signature block is last, and only if she added one.

- [ ] The file does not download while the button is grey.
- [ ] Money in shows the event name, the date, columns No., Nama, and Jumlah, numbering that restarts in each RT, and a subtotal after each group.
- [ ] When Opening balance came from a line, the summary shows that amount together with the line's original wording, and that line is absent from Money in.
- [ ] Money out is a table of item and amount, then the total.
- [ ] The summary lists one line per RT subtotal, then Opening balance, then the expenses, then Closing balance, and it does not list donor names.
- [ ] Names she added appear at the end. No added names means no signature block.

Source: `scope.md > The POC Boundary`, `scope.md > What "Working" Looks Like`.

### Reading a message again

If she reopens a paste, changes it, and taps **Read messages** again, the page asks first: "This message will be read again. Corrections on this message will be lost."

**Confirm** rebuilds only that message from scratch. Every confirmation and correction on that message is gone. **Cancel** keeps her work. The other message stays as she left it. The signature names stay.

If the income message was the one rebuilt, the event name, the date, and the opening balance are read again from that new text.

- [ ] **Read messages** on an already read message does not rebuild until she taps **Confirm**.
- [ ] **Confirm** on Money out clears only that message's row decisions. Money in, the signatures, the event name, the date, and Opening balance stay.
- [ ] **Confirm** on Money in rebuilds that message and reads the event name, the date, and Opening balance from the new text. Signatures stay.
- [ ] **Cancel** leaves every row decision in place.

### Coming back and New report

If she leaves and comes back on the same phone, the report she was working on is still there: both messages, every row decision, the event name and date, the opening balance, the signature names, and the four numbers.

Another phone does not have it.

It stays until she taps **New report** and confirms. That clears the page back to the two empty boxes.

- [ ] Leaving and returning on the same phone shows the same report, including row decisions and signature names.
- [ ] Opening the page on another phone does not show that report.
- [ ] **New report** does not clear the page until she confirms. After she confirms, the two boxes are empty and there is no reading.

## States and Boundaries

- **First visit** — the paste page, both boxes empty, no PDF button.
- **Both pastes empty** — no list, the paste page stays, "Paste at least one message."
- **One paste** — one list, the other side "Not pasted" with a total of zero.
- **Rupiah gap** — pinned line names which total is short and by how much, download blocked.
- **Yellow or red still open** — download blocked even when the difference is zero, and the line under the button says "Rows still need a check."
- **No total line** — one **Yes** / **No** question at the top of that message's list.
- **Ready** — dark-green **Download PDF**, and the file downloads.
- **Same phone, later** — the working report is still on the page.
- **Other phone** — no report.
- **New report, confirmed** — back to the two empty boxes.
- **Who it is for** — she is the only person who enters money. The neighborhood reads page one. Signers sign. They do not get a way to edit the report.

Source: `scope.md > Who It's For`.

## Product Decisions

- One stacked phone page — that is the whole app she uses.
- English words for every control and label — she reads the page on her phone, and the neighborhood reads Opening balance, Donations, Expenses, and Closing balance. The pasted WhatsApp text stays Indonesian.
- Paper, not a chat and not a bank — the print shop photocopies a laporan kas, so the screen should look like that paper.
- Yellow stays in the sum and still blocks the PDF — a difference of zero can be a false match.
- A multiplication mismatch proposes nothing over her written amount — Written stays in the sum until she taps **Use calculated**.
- Set-aside lines stay visible and do not block the download — a header or a bank line might still be a donation, but it is not a guess about a number.
- There is only one Opening balance, and the amounts do not add — marking a line replaces a typed figure, typing replaces a marked line, and a second mark sends the first line back into the donations. She cannot type a Opening balance larger than the income total.
- A written total sits at the top of that message's list as "Written total: Rp X" — she taps **Edit**, the paste stays unchanged, and that total line is not a row she can count.
- A line lifted into Opening balance is not repeated in Money in — the list is only the donations, and the line's original wording sits with Opening balance on the summary.
- The report remains on the same phone — she may leave and come back — and **New report** is how she throws it away.
- Reading again asks first, and only the message she rebuilds loses its corrections — the other message and the signature names survive.
- Skip signatures by doing nothing — the block is optional.

## What We're Building

- The paste page and **Read messages**, including both-empty and one-empty.
- Line-by-line reading with the original text kept beside it.
- Clear, yellow, red, and set-aside rows, and the actions named above.
- The multiplication check, including a mismatch that stays yellow.
- The four numbers, the pinned rupiah gap, and the blocked and working **Download PDF**.
- The one-time question when a total line is missing.
- One Opening balance, from a leftover-cash line, a typed figure, or a line she marks, with the later action replacing the earlier one.
- "Written total: Rp X" at the top of a message that already has a total, edited with **Edit**, and not counted as a row.
- Editable event name and date.
- Optional signature names, up to three.
- One PDF in three parts: Money in grouped by RT in a colored table, Money out as a table, and a summary without donor names, then signatures only if added. Each title is centered.
- The report still there on the same phone, and **New report** after confirmation.
- A confirm-before-rebuild when she reads a paste again.

## Deferred From the POC

- A Word file, so the print shop can edit the layout. A second layout does not fit this proof of concept. Source: `scope.md > Later`.
- A separate per-group section in the PDF. Money in is already grouped by RT. Source: `scope.md > Later`.

## Possible Later Enhancements

A Word file of the same report, for a print shop that wants to change the layout.

A later PDF section that groups expenses by expense group. Money in is already grouped by RT.

## Non-Goals

- A form where she types each transaction. She already wrote the messages. Source: `scope.md > Explicitly Cut`.
- A photo of a notebook. Source: `scope.md > Explicitly Cut`.
- Accounts. The report stays on one phone without a login. Source: `scope.md > Explicitly Cut`.
- Shared editing. The neighborhood and the committee read or sign. Source: `scope.md > Explicitly Cut`.
- A chatbot that guesses an amount she did not accept. She confirms the line. Source: `scope.md > Explicitly Cut`.
- Word or Excel as the thing she uses. Source: `scope.md > Explicitly Cut`.

## Open Questions

- **New report confirmation.** She must confirm before the page clears. The question is "Delete this report?" **Delete** clears the page. **Cancel** keeps the report.
- **Two sentences.** A collapsed line reads "Money in · N rows read." A short total reads "Money in is short Rp X." or "Written total Money in is short Rp X." Money out uses the same pattern.
