# PrintFlow Pro - Shop Management Software

**[ 📖 READ THE USER MANUAL ](./USER_MANUAL.md)** - Detailed instructions for shop staff.

## How to Run This (For the Shop Owner)

### Option 1: Access from Anywhere (Recommended)
**Best for:** Accessing from home, phone, and shop computers.
1. Create a free account on [GitHub.com](https://github.com).
2. Create a new Repository and upload all the files in this folder.
3. Go to **Settings > Pages** in your repository.
4. Enable GitHub Pages.
5. You will get a link (e.g., `https://your-shop.github.io`). Share this link with your staff.

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

---

## Developer Guide: Saving to GitHub (CLI Method)

If you have Git installed on your computer, follow these steps to save your code to a new repository:

1.  **Initialize Git:**
    Open your terminal in this project folder and run:
    ```bash
    git init
    ```

2.  **Add Files:**
    This stages your files for saving. The `.gitignore` file ensures system folders like `node_modules` are skipped.
    ```bash
    git add .
    ```

3.  **Commit Changes:**
    ```bash
    git commit -m "Initial setup of PrintFlow Pro"
    ```

4.  **Connect to GitHub:**
    *   Go to GitHub.com and create a **New Repository**.
    *   **Do not** check "Add a README file" (you already have one).
    *   Copy the repository URL (it looks like `https://github.com/YOUR_USERNAME/REPO_NAME.git`).
    *   Run the following commands (replace the URL with yours):
    ```bash
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git push -u origin main
    ```
