# 🧘‍♀️ MindEase — Your Personal Mental Wellness Companion

> **MindEase** is a MERN-based journaling and mood-tracking web app that helps users log emotions, visualize mental health trends, and receive AI-powered affirmations and advice.

---

## 🌟 Features Overview

### 🧾 1. Journal System

* Users can create journal entries to record thoughts and daily reflections.
* Each journal entry is analyzed by AI (Groq LLaMA model) to extract:

  * **Mood** (happy, sad, anxious, etc.)
  * **Advice** (personalized suggestions)
  * **Affirmation Quote**

### 🧠 2. Mood Trends & Analytics

* Dynamic charts show emotional patterns over time.
* **Weekly View** → shows last 7 days (based on most recent entries).
* **Monthly View** → shows last 30 days grouped by week.
* Displays key metrics:

  * Average Mood
  * Best Day
  * Mood Trend (“Improving”, “Declining”, “Stable”)
* Interactive graph switch between **Line Chart** and **Bar Chart** (Recharts).

### 💬 3. Daily Affirmations

* AI-powered positive affirmations generated via **Groq API**.
* Users can save affirmations to favorites.
* Filter affirmations by category (Self-Care, Growth, Resilience, etc.).

### 📜 4. Journal History

* Full searchable journal list with filters by mood or keyword.
* Paginated display using `limit` and `page` query params.
* Entry modal shows:

  * Full journal text
  * AI advice
  * Affirmation quote
  * Date and emoji mood marker

### 🔒 5. Authentication

* Secure signup/login using JWT (JSON Web Tokens).
* Passwords hashed using bcrypt.
* `protect` middleware restricts routes to logged-in users.

---

## ⚙️ Tech Stack

| Layer              | Technologies                                           |
| ------------------ | ------------------------------------------------------ |
| **Frontend**       | React + Vite + TailwindCSS + ShadCN + Recharts + Axios |
| **Backend**        | Node.js + Express.js                                   |
| **Database**       | MongoDB (Mongoose ORM)                                 |
| **Auth**           | JWT + bcrypt                                           |
| **AI Integration** | Groq SDK (LLaMA-3.1 model)                             |
| **Visualization**  | Recharts (LineChart, BarChart)                         |
| **Date handling**  | Moment.js                                              |

---

## 🧩 Project Folder Structure

```
mindease-calm-ui-main/
├── backend/
│   ├── controllers/
│   │   ├── affirmationController.js
│   │   ├── authController.js
│   │   ├── history.js
│   │   ├── journalController.js
│   │   └── moodController.js   ✅ mood trends logic
│   ├── middleware/
│   │   └── authMiddleware.js   ✅ JWT verification
│   ├── models/
│   │   ├── Affirmation.js
│   │   ├── JournalEntry.js
│   │   ├── MoodEntry.js
│   │   └── User.js
│   ├── routes/
│   │   ├── affirmationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── historyRoutes.js
│   │   ├── journalRoutes.js
│   │   └── moodRoutes.js
│   ├── utils/
│   │   ├── analyzeWithGroq.js
│   │   └── generateToken.js
│   ├── journalData.json        ✅ Mock dataset (30-day entries)
│   ├── seedJournalData.js      ✅ Script to seed MongoDB
│   ├── server.js               ✅ Entry point
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── JournalCard.jsx
    │   │   └── ...
    │   ├── pages/
    │   │   ├── History.jsx
    │   │   ├── MoodGraph.jsx
    │   │   ├── Journal.jsx
    │   │   └── Affirmations.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🧠 API Documentation

### 🔑 Authentication Routes

| Method | Endpoint           | Description                            |
| ------ | ------------------ | -------------------------------------- |
| `POST` | `/api/auth/signup` | Create a new user                      |
| `POST` | `/api/auth/login`  | Login existing user, returns JWT token |

---

### 🧾 Journal Routes

| Method | Endpoint       | Description                          |
| ------ | -------------- | ------------------------------------ |
| `POST` | `/api/journal` | Create journal (auto-analyzed by AI) |
| `GET`  | `/api/journal` | Get all user journals                |

---

### 📚 History Routes

| Method | Endpoint                          | Description                              |
| ------ | --------------------------------- | ---------------------------------------- |
| `GET`  | `/api/history`                    | Get paginated & filtered journal history |
| Params | `search`, `mood`, `page`, `limit` |                                          |

Example:

```
GET /api/history?search=happy&mood=excited&page=2&limit=5
```

---

### 📊 Mood Trend Routes

| Method | Endpoint                         | Description                      |
| ------ | -------------------------------- | -------------------------------- |
| `GET`  | `/api/mood/trends?period=weekly` | Weekly or Monthly trend analysis |

**Query Params:**

* `period` = `"weekly"` or `"monthly"`

**Returns:**

```json
{
  "chartData": [
    { "label": "Mon", "mood": 3.5 },
    { "label": "Tue", "mood": 4.2 }
  ],
  "averageMood": 3.7,
  "bestDay": "Thu",
  "trend": "Improving"
}
```

---

### 💬 Affirmation Routes

| Method | Endpoint                     | Description                   |
| ------ | ---------------------------- | ----------------------------- |
| `GET`  | `/api/affirmation`           | Get new AI affirmation        |
| `POST` | `/api/affirmation/save`      | Save affirmation to favorites |
| `GET`  | `/api/affirmation/favorites` | Get saved affirmations        |

---

## 🧰 Installation & Setup

### 1️⃣ Clone the repo

```bash
git clone https://github.com/yourusername/mindease-calm-ui-main.git
cd mindease-calm-ui-main
```

### 2️⃣ Setup backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mindease
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
```

### 3️⃣ (Optional) Seed mock journal data

```bash
node seedJournalData.js
```

### 4️⃣ Run backend

```bash
npm run dev
```

### 5️⃣ Setup frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend will run on [http://localhost:5173](http://localhost:5173)

---

## 📈 Example Outputs

**Dashboard (Trends):**

* Weekly line graph showing mood variation by weekday
* Monthly bar chart grouped by week
* Average mood score (1–5 scale)
* Trend summary: *Improving / Declining / Stable*

**Journal History:**

* Search: “happy”
* Filter by mood: “excited”
* Pagination control
* AI Advice + Affirmation displayed in modal

**Affirmation Page:**

* New AI-generated affirmation
* Save to favorites for future motivation

---

## 🔒 Authentication Flow

1. User signs up or logs in → backend returns JWT
2. Token stored in `localStorage`
3. All protected routes send header:

   ```
   Authorization: Bearer <token>
   ```
4. `protect` middleware verifies token → attaches user info → allows route access

---

## 📊 Data Model Overview

### 🧍‍♂️ User

```js
{
  name: String,
  email: String,
  password: String (hashed)
}
```

### 📔 JournalEntry

```js
{
  user: ObjectId,
  content: String,
  mood: String,
  advice: String,
  quote: String,
  createdAt: Date
}
```

### 🧩 Affirmation

```js
{
  user: ObjectId,
  text: String,
  category: String,
  createdAt: Date
}
```

---

## 🧪 Future Enhancements

* 📱 Mobile responsive UI improvements
* 📆 Calendar view for mood tracking
* 📉 Export mood data as CSV or PDF
* 🌐 Multi-language affirmation support
* 🔔 Email or push-based daily reminders

---

## 👨‍💻 Author

**Mohammad Rahman**

> MERN Stack Developer | AI-integrated Web Apps | Passionate about mental wellness tech
> 📧 Email: *mrahman.jpc@gmail.com*
> 💼 LinkedIn: [](#)

---
