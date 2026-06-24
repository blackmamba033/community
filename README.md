# Sturt Sabres — Member Business Directory

A static member business directory for a community sporting club. Members who
run or work in a business pay an annual fee to be listed; other members browse
by category to find a fellow member. Built to run for free on GitHub Pages — no
server, no database.

## What's in here

```
index.html              The directory: search + category filters + roster cards
list-your-business.html The pitch, pricing, Stripe button and signup steps
businesses.json         ← the ONLY file you edit to manage listings
app.js                  Loads the JSON, builds filters, runs search
styles.css              Styling (sky-blue + navy, from your logo)
assets/logo.png         Your club logo (shown in the header)
```

## Step 1 — Make it yours

Open the files in any text editor and replace the placeholders:

- **Branding.** The site already says **Sturt Sabres** and uses your logo
  (`assets/logo.png`). To swap the logo later, replace that file.
- **Stripe link.** In `list-your-business.html`, replace
  `REPLACE_WITH_YOUR_STRIPE_PAYMENT_LINK` (see Step 3).
- **Signup form link.** Replace `REPLACE_WITH_YOUR_GOOGLE_FORM_LINK` (see Step 4).
- **Contact email.** Replace `admin@sturtsabres.com.au`.
- **Sample listings.** Edit `businesses.json` — delete the examples and add real ones.

## Step 2 — Put it on GitHub Pages

1. Create a new repository on GitHub (e.g. `member-directory`).
2. Upload these files to the repo root (drag-and-drop in the browser works).
3. In the repo: **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Pick branch `main` and folder `/ (root)`, then **Save**.
6. Wait a minute. Your site appears at
   `https://YOUR-USERNAME.github.io/member-directory/`.

> Heads-up: opening `index.html` by double-clicking it on your computer will
> show an empty directory, because browsers block loading `businesses.json`
> from disk. That's expected — it works once it's on GitHub Pages. To preview
> locally, run `python3 -m http.server` in this folder and open
> `http://localhost:8000`.

## Step 3 — Create the Stripe payment link (club's Stripe account)

1. Log in to the **club's** Stripe dashboard.
2. **Product catalogue → Add product**: name it e.g. "Directory listing —
   annual", price **$120**, billing **recurring, yearly**.
3. Go to **Payment links → New**, select that product, create the link.
4. Copy the link (looks like `https://buy.stripe.com/xxxxxxxx`) and paste it
   into `list-your-business.html` where the placeholder is.

That button now takes members to Stripe's own secure checkout. The money lands
in the club's Stripe account — nothing sensitive ever touches this website.

## Step 4 — Create the signup form

1. Make a **Google Form** (free) asking for: business name, category, owner
   name, member number, blurb, suburb, phone, email, website.
2. Form **Send → link icon → Copy**.
3. Paste it into `list-your-business.html` where the form placeholder is.

Responses collect in a Google Sheet you can review.

## Step 5 — Adding a member to the directory

When a member has filled the form **and** paid:

1. Open `businesses.json`.
2. Copy an existing block and edit the values. `id` must be unique (lowercase,
   hyphens). `paid_until` (YYYY-MM-DD) is how you track renewals — set it one
   year out.
3. Categories are automatic: type any `category` and a matching filter chip
   appears on the site. Reuse exact spelling to group businesses together.
4. Save, commit, push. The site updates in about a minute.

Tip: paste the member's raw details to Claude and ask for a formatted JSON
entry — it'll match the structure for you.

## Renewals

Once a year, scan `businesses.json` for `paid_until` dates that have passed,
chase those members, and either update the date (renewed) or delete the block
(lapsed).

## A few real-world notes

- The club needs its own Stripe (and bank) account for the funds. That's an
  admin setup, separate from this site.
- Only publish contact details members have agreed to show. Prefer business
  numbers/emails over personal ones.
- This site doesn't process payments or store personal data itself — it just
  links out to Stripe and the form — which keeps your obligations light.
