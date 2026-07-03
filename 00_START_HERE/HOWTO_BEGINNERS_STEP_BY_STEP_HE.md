# מדריך HOWTO מלא למתחילים
## QA Release Command Center Kit v2.1 FULL

מדריך זה נועד למשתמש שאין לו ניסיון קודם במכירת מוצר דיגיטלי, בניהול Command Center, או בהפעלת כלי HTML מקומי.

---

# 1. מה יש בחבילה

החבילה כוללת שלושה חלקים מרכזיים:

1. **מערכת Command Center מקומית**
   - קובץ HTML שנפתח בדפדפן.
   - מאפשר ניהול פרויקטים, גרסאות, סיכונים, באגים, Sign-Offs וסטטוס Release.
   - שומר מידע מקומית בדפדפן באמצעות IndexedDB.
   - מאפשר ייצוא וייבוא JSON.
   - מאפשר ייצוא CSV לבאגים וסיכונים.

2. **ספריית תבניות QA / Release**
   - Release Readiness Checklist
   - Go / No-Go Template
   - Risk Register
   - Bug Triage Matrix
   - Regression Scope Matrix
   - Production Readiness Checklist
   - Post-Release Retrospective
   - תבניות מיוחדות ל־Mobile, API/Backend, Data/SQL, AI/Agent

3. **תיקיית שיווק**
   - טקסטים לדף מכירה.
   - פוסט LinkedIn.
   - טקסטים בעברית.
   - תמונות שיווקיות.
   - Captions ו־CTA.

---

# 2. פתיחה ראשונה של הפרויקט

לאחר הורדת ה־ZIP:

1. לחץ קליק ימני על הקובץ.
2. בחר **Extract All / חלץ הכל**.
3. פתח את התיקייה שחולצה.
4. היכנס אל:

```text
02_COMMAND_CENTER/
```

5. לחץ פעמיים על:

```text
index.html
```

6. הקובץ ייפתח בדפדפן.

מומלץ להשתמש ב־Chrome או Edge.

---

# 3. איך להתחיל לעבוד עם ה־Command Center

כאשר ה־Command Center נפתח, תראה:

- שם Workspace.
- רשימת פרויקטים.
- Dashboard עם Widgets.
- טבלאות Releases, Risks, Bugs, Sign-Offs.
- כפתורי Save / Export / Import.

## שלב 1 — הגדרת Workspace

1. בשדה **Workspace Name**, כתוב שם לדוגמה:

```text
Company QA Releases
```

2. לחץ:

```text
Save Workspace
```

---

## שלב 2 — יצירת פרויקט חדש

1. בצד שמאל, תחת **Projects**, כתוב שם פרויקט.
2. בחר סוג פרויקט:
   - Web
   - Mobile
   - API
   - Data/SQL
   - AI/Agent
3. לחץ:

```text
Add Project
```

דוגמה:

```text
Project Name: Mobile App
Project Type: Mobile
```

---

## שלב 3 — הוספת גרסה

1. תחת אזור **Releases**, בחר פרויקט.
2. הזן מספר גרסה, לדוגמה:

```text
3.8.0
```

3. הזן כותרת Release, לדוגמה:

```text
Login and Payment Improvements
```

4. בחר סוג Release:
   - Major
   - Minor
   - Patch
   - Hotfix
   - Emergency
   - Beta

5. בחר תאריך יעד.
6. לחץ:

```text
Add Release
```

---

## שלב 4 — הוספת סיכון

1. באזור **Add Risk**, בחר פרויקט.
2. כתוב סיכון ברור, לדוגמה:

```text
Payment confirmation may fail on retry
```

3. בחר Probability:
   - Low
   - Medium
   - High

4. בחר Impact:
   - Low
   - Medium
   - High

5. כתוב Owner.
6. לחץ:

```text
Add Risk
```

המערכת תחשב רמת סיכון בצורה בסיסית:
- High + High = Critical
- High + Medium / Medium + High = High
- Low + Low = Low
- כל השאר = Medium

---

## שלב 5 — הוספת Bug

1. באזור **Add Bug**, בחר פרויקט.
2. כתוב כותרת Bug.
3. בחר Severity:
   - Low
   - Medium
   - High
   - Critical

4. בחר Priority:
   - P4
   - P3
   - P2
   - P1
   - P0

5. בחר אם הוא Blocker:
   - Yes
   - No

6. כתוב Owner.
7. לחץ:

```text
Add Bug
```

---

## שלב 6 — הוספת Sign-Off

1. באזור **Sign-Offs**, בחר פרויקט.
2. בחר Role:
   - QA
   - Product
   - R&D
   - Support
   - DevOps

3. כתוב Owner.
4. בחר סטטוס:
   - Pending
   - Approved
   - Rejected

5. לחץ:

```text
Add Sign-Off
```

---

# 4. איך לשמור מידע

המערכת שומרת מידע מקומית בדפדפן.

## שמירה רגילה

לחץ:

```text
Save Workspace
```

## גיבוי מלא

לחץ:

```text
Export JSON
```

המערכת תוריד קובץ JSON עם כל הנתונים.

שמור אותו בתיקייה בטוחה, לדוגמה:

```text
Documents/QA Release Command Center Backups/
```

## שחזור מגיבוי

1. לחץ:

```text
Import JSON
```

2. בחר קובץ JSON שייצאת בעבר.
3. הנתונים ייטענו למערכת.

---

# 5. איך לייצא נתונים

כרגע קיימים ייצואי CSV בסיסיים:

## ייצוא סיכונים

לחץ:

```text
Export Risks CSV
```

## ייצוא באגים

לחץ:

```text
Export Bugs CSV
```

קבצים אלה נפתחים ב־Excel / Google Sheets.

---

# 6. איך להשתמש ב־Widgets

ה־Dashboard בנוי מ־Widgets מודולריים.

כל Widget יכול להציג:
- כמות פרויקטים.
- כמות גרסאות.
- באגים חוסמים.
- סיכונים קריטיים.
- Sign-Offs ממתינים.
- מצב Portfolio.

## שינוי גודל Widget

בכל Widget יש Dropdown של Size:

```text
small / medium / large / full
```

בחר גודל אחר כדי לשנות את רוחב התצוגה.

## שינוי צבע Widget

בכל Widget יש בורר צבע.

בחר צבע חדש כדי להדגיש אזור מסוים.

## הסתרת Widget

לחץ:

```text
Hide
```

## החזרת כל ה־Widgets

בצד שמאל לחץ:

```text
Reset Widgets
```

---

# 7. איך להשתמש בתבניות

התבניות נמצאות תחת:

```text
04_TEMPLATES/
```

מומלץ להתחיל לפי הסדר הבא:

1. `Release_Readiness/Release_Readiness_Checklist.md`
2. `Risk_Management/Risk_Register.md`
3. `Bug_Triage/Bug_Triage_Matrix.md`
4. `Regression/Regression_Scope_Matrix.md`
5. `Go_NoGo/Go_NoGo_Template.md`
6. `Production_Readiness/Production_Deployment_Checklist.md`
7. `Post_Release/Post_Release_Retrospective.md`

אם מדובר בפרויקט מיוחד, השתמש בתיקייה:

```text
04_TEMPLATES/Specialized/
```

שם תמצא:
- Mobile
- API_Backend
- Data_SQL
- AI_Agent

---

# 8. איך להשתמש ב־AI Prompts

התיקייה נמצאת כאן:

```text
05_AI_PROMPTS/
```

דוגמה לשימוש:

1. פתח Prompt בשם:

```text
Release_Readiness_Analysis.md
```

2. העתק אותו ל־ChatGPT / Claude / Gemini.
3. הדבק מתחתיו נתוני Release מתוך המערכת.
4. בקש מה־AI להחזיר:
   - Executive Summary
   - Blockers
   - Critical Risks
   - Missing Information
   - Go / Conditional Go / No-Go recommendation

---

# 9. תהליך עבודה מומלץ ל־QA Manager

## לפני Sprint / Release

1. צור Project.
2. צור Release.
3. הוסף Scope.
4. הוסף Risks ראשוניים.
5. הגדר Owners.

## במהלך הבדיקות

1. עדכן Bugs.
2. עדכן Regression.
3. עדכן Risks.
4. הוסף Evidence.
5. בדוק Dashboard יומי.

## לפני Go / No-Go

1. יצא JSON Backup.
2. יצא CSV של Bugs ו־Risks.
3. השתמש בתבנית Go / No-Go.
4. השתמש ב־AI Prompt לניתוח Release.
5. קבל החלטה:
   - Go
   - Conditional Go
   - No-Go
   - Partial Go
   - Postpone

## אחרי Release

1. עדכן Post-Release Retrospective.
2. תעד Escaped Defects.
3. תעד Lessons Learned.
4. צור Action Items לגרסה הבאה.

---

# 10. איך לשווק את המוצר

תיקיית השיווק נמצאת כאן:

```text
06_MARKETING/
```

## קבצי טקסט

```text
06_MARKETING/Copy/
```

כוללת:
- Product Description
- Gumroad Product Page Copy
- LinkedIn Launch Post
- Hebrew Marketing Copy
- Ad Hooks
- Image Captions and CTA

## תמונות

```text
06_MARKETING/Images/
```

כוללת:
- 01_Hero_Square.png
- 02_Command_Center_Banner.png
- 03_Features_Square.png
- 04_Social_Poster.png

## שימוש מומלץ בתמונות

| שימוש | תמונה מומלצת |
|---|---|
| דף מכירה | 01_Hero_Square.png |
| באנר Landing Page | 02_Command_Center_Banner.png |
| פוסט LinkedIn | 03_Features_Square.png |
| מודעה אנכית / Story | 04_Social_Poster.png |

---

# 11. איך למכור ב־Gumroad / Payhip / Lemon Squeezy

## שלב 1 — הכנת קובץ למכירה

הקובץ למכירה הוא ה־ZIP המלא:

```text
QA_Release_Command_Center_Kit_v2_1_FULL.zip
```

## שלב 2 — יצירת דף מוצר

השתמש בקובץ:

```text
06_MARKETING/Copy/Gumroad_Product_Page_Copy.md
```

העתק ממנו:
- Headline
- Description
- What is included
- Who this is for
- Product promise

## שלב 3 — העלאת תמונות

העלה לדף המכירה:
1. `01_Hero_Square.png`
2. `02_Command_Center_Banner.png`
3. `03_Features_Square.png`
4. `04_Social_Poster.png`

## שלב 4 — מחיר התחלתי מומלץ

להשקה ראשונה:

```text
$49
```

לאחר פידבק:

```text
$79–$149
```

## שלב 5 — פוסט LinkedIn

השתמש בקובץ:

```text
06_MARKETING/Copy/LinkedIn_Launch_Post.md
```

---

# 12. מגבלות חשובות של הגרסה הנוכחית

חשוב להבין:

1. זו מערכת Local Web App.
2. היא לא SaaS.
3. היא לא מחוברת לענן.
4. היא לא מחוברת אוטומטית ל־Jira.
5. היא לא כותבת ישירות לתיקיות המחשב בלי פעולת ייצוא.
6. הדפדפן שומר מידע מקומית; ניקוי נתוני דפדפן עלול למחוק מידע.
7. לכן חובה לבצע Export JSON לגיבוי.

---

# 13. איך תיראה גרסת Pro עתידית

גרסת Pro יכולה להיבנות עם:

```text
Tauri + SQLite
```

המשמעות:
- אפליקציית Desktop אמיתית.
- קובץ התקנה.
- בסיס נתונים מקומי.
- שמירת Evidence / Attachments.
- דוחות PDF/Excel מתקדמים.
- חוויית מוצר Premium.

---

# 14. בדיקת תקינות עצמית לפני מסירה או מכירה

לפני שאתה מוכר או שולח ללקוח:

1. פתח את `index.html`.
2. צור Project חדש.
3. צור Release חדש.
4. הוסף Risk.
5. הוסף Bug.
6. הוסף Sign-Off.
7. לחץ Save Workspace.
8. לחץ Export JSON.
9. סגור את הדפדפן.
10. פתח שוב את `index.html`.
11. ודא שהנתונים עדיין קיימים.
12. לחץ Import JSON ובדוק שהשחזור עובד.
13. פתח את תיקיית Marketing.
14. ודא שהתמונות נפתחות.
15. פתח את תבניות Markdown.
16. ודא שאין קבצים חסרים.

---

# 15. קבצים חשובים במיוחד

| קובץ | תפקיד |
|---|---|
| `00_START_HERE/README_FIRST.md` | הסבר פתיחה |
| `00_START_HERE/HOWTO_BEGINNERS_STEP_BY_STEP_HE.md` | מדריך זה |
| `01_PROJECT_DESCRIPTION/PROJECT_DESCRIPTION_DETAILED.md` | תיאור מלא לשחזור הפרויקט |
| `02_COMMAND_CENTER/index.html` | מערכת Command Center |
| `02_COMMAND_CENTER/app.js` | לוגיקת המערכת |
| `02_COMMAND_CENTER/styles.css` | עיצוב המערכת |
| `03_DATA/samples/sample_workspace.json` | נתוני דוגמה |
| `04_TEMPLATES/` | כל תבניות העבודה |
| `05_AI_PROMPTS/` | ספריית Prompts |
| `06_MARKETING/` | שיווק ותמונות |
| `09_VERSIONING/VALIDATION_REPORT.md` | דוח בדיקה |

---

# 16. כלל קבוע לפרויקטים עתידיים

בכל פרויקט עתידי צריך לכלול תמיד:

```text
01_PROJECT_DESCRIPTION/PROJECT_DESCRIPTION_DETAILED.md
```

הקובץ חייב לכלול:
- מטרת הפרויקט.
- מבנה התיקיות.
- החלטות טכנולוגיות.
- איך מפעילים.
- איך משחזרים.
- מה קיים.
- מה חסר.
- Roadmap.
- בדיקות שבוצעו.

כך תמיד אפשר לחזור לפרויקט ולהמשיך אותו גם אחרי זמן רב.
