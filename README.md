# Parkinson’s Symptom Tracker — Developer Guide

A web application for tracking, analyzing, and visualizing Parkinson’s symptoms over time using Python, Django, and modern web tooling.

---

## Getting Started (Development Mode)

### Clone the repository
```bash
git clone https://github.com/<your-username>/parkinsons-symptom-tracker.git
cd parkinsons-symptom-tracker
```

### Set up your Python environment
```bash
Create and activate a virtual environment
python3.11 -m venv .venv311
source .venv311/bin/activate
```

(Windows PowerShell)
```bash
python -m venv .venv311
.venv311\Scripts\activate
```
Upgrade pip and tools
```bash
pip install --upgrade pip setuptools wheel
```
### Install dependencies
```bash
pip install -r requirements.txt
```

If you’re using the ML model components, make sure these are installed as well:

```bash
pip install torch keras tensorflow
```
### Set up environment variables

Create a .env file in the project root (same level as manage.py):

DEBUG=True
SECRET_KEY=devsecretkey
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3


If using PostgreSQL, replace the last line with something like:

DATABASE_URL=postgres://user:password@localhost:5432/parkinsons_dev

### Apply migrations
```bash
python manage.py migrate
```
### Run the development server
```bash
python manage.py runserver
```

Then open:

http://127.0.0.1:8000/


or, if you’re using a Flask-based frontend:

http://127.0.0.1:5000/

## Optional Frontend (React/Vite)

If your project includes a React/Vite frontend:

```bash
cd frontend
npm install
npm run dev
```

This runs the frontend at http://localhost:5173
 and proxies API calls to Django (http://localhost:8000
).

## Common Commands
Action	Command
Create superuser	python manage.py createsuperuser
Run tests	pytest or python manage.py test
Collect static files	python manage.py collectstatic
Lint code	flake8 or ruff check .
Format code	black .

## Useful Tools
Security & dependency checks
```bash
pip install safety pip-audit
safety check
pip-audit
```
Handle large model files
git lfs install
git lfs track "*.pt" "*.h5"

## Notes

Don’t commit .venv311/ or model checkpoints — they should be in .gitignore.

For reproducibility, re-freeze dependencies when updating:

```bash
pip freeze > requirements.txt
```
## Example .gitignore
### Virtual environments
.venv/
.venv311/
venv/
env/

### Django/Flask files
__pycache__/
*.py[cod]
*.sqlite3
db.sqlite3
*.log

### Node
node_modules/
dist/

# Models / Data
*.pt
*.h5
*.csv

## Summary

Clone the repo

Create & activate .venv311

Install dependencies

Configure .env

Run migrations

Launch the dev server (runserver or flask run)

(Optional) Run frontend via npm run dev

Visit http://localhost:8000 or http://localhost:5173


