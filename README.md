# Paathshala Navoday — Website

Static website for **Paathshala Navoday**, an Indian school of art, culture, and language based in Wellington, New Zealand. The site covers programs, membership, enrolment, contact, and general information about Hindi, art, drama, and cultural classes for all ages.

## What’s in this repo

- **HTML pages** at the project root and in subfolders (`about/`, `programs/`, `members/`, `landing/`, `contact/`).
- **Shared assets** under `assets/` — global styles, page-specific CSS, JavaScript (navigation, footer injection, forms), and images.
- **No build step** — open the site with any static file server so asset paths (especially `/assets/...` on inner pages) resolve correctly.
- **Docker** — `Dockerfile`, `docker-compose.yml`, and `.dockerignore` for running the site in an nginx container (see below).

## View the site locally (Python HTTP server)

Run the server from the **project root** (the folder that contains `index.html`).

1. Open a terminal and go to the project directory:

   ```bash
   cd /path/to/paathshala_website
   ```

2. Start Python’s built-in HTTP server (pick any free port; `8768` is fine):

   ```bash
   python3 -m http.server 8768
   ```

3. In your browser, open:

   - **Home:** [http://localhost:8768/](http://localhost:8768/)  
   - Or explicitly: [http://localhost:8768/index.html](http://localhost:8768/index.html)

4. Browse other sections via the navigation (About, Programs, Members, Enrol, Contact).

5. Stop the server when you’re done: in the terminal, press **Ctrl+C**.

**Note:** Inner pages load CSS and scripts from `/assets/...`, which assumes the site is served from the server root for that port. Starting `python3 -m http.server` from this repo’s root matches that layout. The same idea applies in production: the site should be served from the **domain root** (not a subfolder), unless you later add a `<base href>` or path prefix.

## Run and deploy with Docker

The repo includes a **`Dockerfile`** that copies the static site into the official [**nginx**](https://hub.docker.com/_/nginx) image (Alpine-based, small image). A **`docker-compose.yml`** file is provided for a one-command local stack. **`.dockerignore`** keeps Git metadata and Docker metadata out of the image layer.

### Prerequisites

1. Install [**Docker Desktop**](https://www.docker.com/products/docker-desktop/) (macOS / Windows) or **Docker Engine** + [**Docker Compose**](https://docs.docker.com/compose/install/) (Linux).
2. Start the Docker daemon (Docker Desktop must be running before you use the CLI).

### Option A — Docker Compose (simplest)

From the project root (where `docker-compose.yml` lives):

1. Build the image and start a container in the background:

   ```bash
   cd /path/to/paathshala_website
   docker compose up --build -d
   ```

2. Open a browser at **[http://localhost:8080/](http://localhost:8080/)**  
   Compose maps host port **8080** to nginx port **80** inside the container.

3. View logs (optional):

   ```bash
   docker compose logs -f web
   ```

4. Stop and remove the container when finished:

   ```bash
   docker compose down
   ```

To use a different host port (for example **3000**), edit `docker-compose.yml` and change the mapping from `"8080:80"` to `"3000:80"`, then run `docker compose up --build -d` again.

### Option B — `docker build` and `docker run`

1. **Build** an image (choose any tag name):

   ```bash
   cd /path/to/paathshala_website
   docker build -t paathshala-website:latest .
   ```

2. **Run** a container from that image, publishing port 80 in the container to **8080** on your machine:

   ```bash
   docker run --rm -p 8080:80 paathshala-website:latest
   ```

3. Visit **[http://localhost:8080/](http://localhost:8080/)**.  
   Press **Ctrl+C** in the terminal to stop the container (`--rm` removes it after exit).

**Detached run** (container keeps running in the background):

```bash
docker run -d --name paathshala-web -p 8080:80 paathshala-website:latest
```

Stop and remove:

```bash
docker stop paathshala-web && docker rm paathshala-web
```

### Push to a registry (optional)

Use this when a server or platform pulls your image instead of building from Git.

1. Tag the image for your registry (examples use Docker Hub; replace `YOUR_USER`):

   ```bash
   docker tag paathshala-website:latest YOUR_USER/paathshala-website:latest
   ```

2. Log in and push:

   ```bash
   docker login
   docker push YOUR_USER/paathshala-website:latest
   ```

On the target host, run `docker pull YOUR_USER/paathshala-website:latest` then `docker run -d -p 80:80 ...` (or use your orchestrator’s UI to deploy the same image).

### Production notes (any host running Docker)

- **Port:** Map host **80** (or **443** behind a TLS terminator) to container **80**. Example: `docker run -d -p 80:80 paathshala-website:latest`
- **HTTPS:** Terminate TLS outside the container (reverse proxy, load balancer, or Cloudflare) and forward HTTP to the container, or add a custom nginx config and certificates inside the image — the stock image serves **HTTP** on port 80 only.
- **Updates:** Rebuild the image after content changes, redeploy the new tag, then restart the container (or roll your deployment) so nginx serves the updated files.

## Deploy to Vercel

This project is static HTML/CSS/JS — no build output folder is required.

### From Git (recommended)

1. Push this repository to **GitHub**, **GitLab**, or **Bitbucket** if it is not already there.
2. Go to [vercel.com](https://vercel.com), sign in, and choose **Add New… → Project**.
3. **Import** your Git repository.
4. Configure the project:
   - **Framework Preset:** Other (or leave as detected).
   - **Root Directory:** `.` (repository root, where `index.html` lives).
   - **Build Command:** leave **empty** (nothing to compile).
   - **Output Directory:** leave **empty** — Vercel will serve files from the project root.
5. Click **Deploy**. After the first deployment finishes, Vercel assigns a URL (for example `your-project.vercel.app`). Production updates happen on every push to your chosen branch (usually `main`).

### From the CLI

1. Install the Vercel CLI (requires [Node.js](https://nodejs.org/)): `npm i -g vercel`
2. In a terminal, `cd` into this project folder and run `vercel`. Answer the prompts (link to a Vercel account, scope, project name).
3. For a production deployment: `vercel --prod`

Custom domains: in the Vercel project → **Settings → Domains**, add your domain and follow the DNS instructions Vercel shows.

## Deploy to other hosting (e.g. Hostinger, cPanel, FTP)

Traditional shared hosting works by uploading files to the folder your domain uses as the **web root** (often `public_html` or `www`).

1. **No build step** — deploy the contents of this repo as they are on disk.
2. Log in to your provider (for **Hostinger**: [hpanel.hostinger.com](https://hpanel.hostinger.com) → **Websites** → your site → **Files** → **File Manager**).
3. Open the document root for your domain (commonly **`public_html`**, or **`domains/yourdomain.com/public_html`** depending on the plan).
4. Upload **all** project items into that folder, keeping the same structure:
   - `index.html` at the **same level** as the `assets` folder (not nested inside an extra folder unless that folder is your document root).
   - Folders: `assets/`, `about/`, `contact/`, `landing/`, `members/`, `programs/`, etc.
5. Confirm that opening `https://yourdomain.com/` loads the homepage and that a page like **About** still loads styles (URLs like `/assets/css/style.css` must resolve to `public_html/assets/...`).
6. If you use **FTP/SFTP** (FileZilla, Cyberduck, etc.), connect with the credentials from your host’s panel and upload the same structure into `public_html`.

**SSL:** Most hosts (including Hostinger) enable free HTTPS (Let’s Encrypt) from the control panel — turn it on so visitors get a secure `https://` URL.

## Git and GitHub

This project is a **Git** repository (default branch **`main`**). Creating the remote on GitHub must be done in your browser or with the [GitHub CLI](https://cli.github.com/) while logged in as you — that step cannot be completed automatically from here.

### Create the repository on GitHub

1. Sign in at [github.com](https://github.com) and click **+** → **New repository**.
2. Set **Repository name** (for example `paathshala_website`).
3. Choose **Public** or **Private**.
4. Leave **Add a README** / **.gitignore** / **license** unchecked (this folder already has commits and files).
5. Click **Create repository**.

### Push this folder to GitHub

In a terminal on your machine, from the project root (replace `YOUR_USER` and `YOUR_REPO` with your GitHub username and repository name):

```bash
cd /path/to/paathshala_website
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

If GitHub shows an **HTTPS** URL with `.git`, use that exact URL in `git remote add origin`.

**Authentication:** GitHub no longer accepts account passwords for `git push` over HTTPS. Use a [**Personal Access Token**](https://github.com/settings/tokens) as the password when prompted, or set up [**SSH keys**](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) and use the SSH remote instead:

```bash
git remote add origin git@github.com:YOUR_USER/YOUR_REPO.git
git push -u origin main
```

After the first successful push, refresh the repository page on GitHub to see your files.

## Requirements

- **Python 3** (for local preview only). No extra packages are required for that.
- **Node.js** (optional, only if you use the Vercel CLI).
- **Docker** + **Docker Compose** (optional, only if you run or deploy the site as a container).
