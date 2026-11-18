# The Boss — classroom website

A short, anonymous classroom game about how employee values can shape perceptions of the same leader.

## Included
- Student game with three randomly assigned employee-value profiles
- Identical boss dialogue and scenarios for all students
- Individual ratings after each scenario
- Server-signed session tokens; students cannot choose their own condition
- Supabase storage
- Password-protected teacher results endpoint and dashboard
- Group averages and CSV export

## Before publishing
This is a starter project. You must create your own Supabase and Vercel accounts, configure secrets, and test the deployment with dummy submissions before sharing it with a class.

## 1. Create Supabase database
1. Create a project at https://supabase.com.
2. Open SQL Editor and run `supabase/schema.sql`.
3. In Project Settings → API, copy the Project URL and `service_role` key. Keep the service-role key private; never put it in a `NEXT_PUBLIC_` variable.

## 2. Configure environment variables
Copy `.env.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: service-role key
- `GAME_CLASS_CODE`: a long, class-specific code students enter
- `TEACHER_PASSWORD`: a strong private dashboard password
- `SESSION_SECRET`: a long random secret (at least 32 random characters)

For a secret, generate one with a password manager or `openssl rand -hex 32`.

## 3. Run locally
Install Node.js 20 or later, then:
```bash
npm install
npm run dev
```
Open http://localhost:3000. The teacher dashboard is at `/teacher`.

## 4. Publish on Vercel
1. Create a GitHub repository and upload this project.
2. Import that repository at https://vercel.com.
3. Add all five environment variables in Vercel → Project Settings → Environment Variables.
4. Deploy. Vercel will provide a public URL.
5. Test the student flow and `/teacher` dashboard using test data before distributing the link.

## 5. Classroom use
- Share the public game URL and `GAME_CLASS_CODE` with students.
- Share `/teacher` and the `TEACHER_PASSWORD` only with the teacher.
- Ask students to play once, individually.
- Use the dashboard to compare the three profiles and export CSV.

## Important design and research notes
- Conditions are randomly assigned on the server, but this simple version uses equal-probability random assignment, not guaranteed balanced blocks. Small classes may have uneven group sizes.
- The value profiles are transparency, relationships, and achievement. All students see identical scenarios and leader dialogue.
- This version collects no names or email addresses. The optional reflection is stored with the response; do not ask students to include identifying details.
- The teacher password is a simple shared secret, not institutional single sign-on. Use a strong unique password and do not reuse an important password.
- This is a teaching demonstration, not a validated psychological instrument. If collecting data for formal research, obtain appropriate ethics approval and consent, and review applicable privacy rules (including GDPR where relevant).
- For a larger or formal study, add rate limiting, stronger teacher authentication, class-specific admin accounts, balanced randomization, retention/deletion controls, and a proper consent flow.
