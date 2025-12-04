# PrintFlow Pro - Shop Management Software

**[ 📖 READ THE USER MANUAL ](./USER_MANUAL.md)** - Detailed instructions for shop staff.

## How to Run This (For the Shop Owner)

### Option 1: Access from Anywhere (Recommended)
**Best for:** Accessing from home, phone, and shop computers.
1. Create a free account on [GitHub.com](https://github.com).
2. Create a new Repository.
3. **Upload ALL files** in this folder to the repository.
4. **Wait 2-3 Minutes.**
   - A generic "Action" will run automatically to build your website.
   - You can see the progress in the **Actions** tab of your repository.
5. Go to **Settings > Pages** in your repository.
6. Ensure the source is set to **"GitHub Actions"** (or if it asks for a branch, select `gh-pages` if created, but usually Actions handle it).
7. You will get a link (e.g., `https://your-shop.github.io`). Share this link with your staff.

### Option 2: Run Offline in Shop
**Best for:** Shops with no internet or strictly local use.
1. Download/Install [Node.js](https://nodejs.org/) on your main computer.
2. Open a command prompt in this folder.
3. Run `npm install`.
4. Run `npm run dev -- --host`.
5. The screen will show an IP address (e.g., `192.168.1.5`). Type this into the browser of other computers in the shop.

## Important: Data Safety
This software does not use a paid cloud database. 
- **Your Data = The Excel File.**
- Always **Export** the Excel file at the end of the day.
- Keep that file in your **Google Drive**.
