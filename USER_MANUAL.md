# 🖨️ PrintFlow Pro - Shop Operations Manual

Welcome to your new shop management system! This guide explains how to use the software daily.

---

## 🛑 CRITICAL: The "Google Drive" Rule
This software runs in your browser and does not have a central server. 
**You must follow this rule to save your data:**

1. **MORNING**: Download the latest Excel file from Google Drive -> Upload to Software.
2. **EVENING**: Download Backup from Software -> Upload to Google Drive.

---

## 1. Daily Start-up (Admin/Manager)
1. Open the website on your computer.
2. Log in (Default Admin: `admin` / `123`).
3. Go to the **Admin & Finance** tab.
4. Click **"Restore from Drive"**.
5. Select the `.xlsx` file you saved yesterday.
6. **Result**: All your jobs, customers, and revenue history will appear.

---

## 2. Managing Jobs (The Workflow)

### Step A: The Counter (New Customer)
1. Click **New Job**.
2. Type the Customer Name.
   - *Tip*: If they visited before, their name will appear. Click it to auto-fill phone number.
3. Enter Description (e.g., "1000 Visiting Cards, Matte Finish").
4. Select Priority:
   - **Normal**: Standard jobs.
   - **Urgent**: Turns the card RED so everyone notices it.
5. Assign to: Usually "Designer" or "Production".
6. Click **Create**.

### Step B: The Team (Designers, Printers, Finishers)
1. Go to the **Job Board**.
2. Find the card in your column (e.g., "Design").
3. Do your work.
4. When finished, click the **"Move to..."** button (e.g., "Move to Production").
5. The card instantly jumps to the next person's column.

### Step C: The Cashier (Payment)
1. The job arrives in the **Cashier** column.
2. Check the price on the card.
3. Collect payment from customer.
4. Click **"Completed"**.
5. The job moves to the "Completed" list and the money is added to the **Daily Dashboard**.

---

## 3. The Dashboard (Owner's View)
Go to the **Dashboard** tab to see:
- **Pending Revenue**: Money stuck in unfinished jobs.
- **Shop TAT**: Average time it takes to finish a job (aim for lower days).
- **Staff Load**: See who has too many active jobs (e.g., if Bob has 10 jobs and Alice has 2, help Bob).
- **AI Report**: Click "Generate AI Report" for a smart summary of bottlenecks.

---

## 4. Closing the Shop (End of Day)
1. Go to **Admin & Finance**.
2. Click **"Backup to Excel"**.
3. A file named `PrintFlow_DB_202X-XX-XX.xlsx` will download to your computer.
4. **Open your Google Drive** (or a shared folder).
5. Drag and drop this new file there.
6. You can now close the browser safely.

---

## 5. FAQ

**Q: Can I use this on my phone?**
A: Yes! If you hosted it on GitHub, just open the link on your phone. You can view the dashboard or add jobs while walking around the shop.

**Q: What if I forget to backup?**
A: Data is saved in the browser's "Local Storage" temporarily. If you open the same computer tomorrow, data might still be there. But do not rely on this! Always backup to Excel.

**Q: How do I add a new employee?**
A: Go to Admin > User Management > Create New User. Give them a role (e.g., "Finisher").
