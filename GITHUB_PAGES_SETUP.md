# GitHub Pages Setup

Use this if you want the student-facing URL to come from GitHub instead of Vercel.

## 1. Add The Apps Script Secret

In the GitHub repository, go to:

`Settings -> Secrets and variables -> Actions -> New repository secret`

Create this secret:

```text
Name: VITE_GOOGLE_SHEETS_WEB_APP_URL
Value: https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

## 2. Enable GitHub Pages

In the GitHub repository, go to:

`Settings -> Pages`

Set:

- `Source`: `GitHub Actions`

## 3. Deploy

Push to the `main` branch. The workflow in `.github/workflows/deploy-pages.yml` will build and publish the app.

The student-facing URL will look like this:

```text
https://cmolina3141516-ux.github.io/sat-math-practice-test-2-Simulacro-2/
```

Do not share the Google Sheet link with students.
