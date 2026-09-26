# AI Studio – Frontend

**AI Studio** turns a written story into a storyboard. Paste a story, pick a tone, and AI breaks it into numbered scenes, each with what the camera sees and what the characters say. It's the first step towards generating images and short videos for each scene.

Backend API: [ai-studio-backend](https://github.com/Ogechi01/ai-studio-backend)

## Features

- Register and log in (JWT); you stay logged in after a refresh, and an expired session sends you back to log in with a message
- Projects: create, switch between and delete projects
- Paste a story (up to 20,000 characters), choose a tone (Drama, Action, Romance, Horror, Comedy, Thriller) and generate scenes
- Scenes are saved per project and reload when you open the project again
- Loading states, inline error and success messages, and a responsive layout for mobile

## Tech stack

- **React 19** + **Vite**
- **React Router**: protected routes
- **Axios**: API client that attaches the token automatically and handles expired sessions
- **Tailwind CSS v4**

## Getting started

Start the [backend](https://github.com/Ogechi01/ai-studio-backend) first, then:

```bash
git clone https://github.com/Ogechi01/ai-studio-frontend.git
cd ai-studio-frontend
npm install
cp .env.example .env   # set VITE_API_URL if the backend isn't on localhost:5002
npm run dev            # http://localhost:5173
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL (default `http://localhost:5002/api`) |

Scripts: `npm run dev`, `npm run build`, `npm run lint`, `npm run preview`.

## Project structure

```
src/
  App.jsx               Routes and login state
  api/axios.js          API client (base URL, token, session expiry)
  utils/auth.js         Token storage
  pages/
    LandingPage.jsx     Intro + login/register
    Login.jsx
    Register.jsx
    Dashboard.jsx       Projects, story form, scenes
  components/
    SceneCard.jsx       One scene
    Alert.jsx           Error / success messages
    Spinner.jsx         Loading indicator
```

## Roadmap

- [ ] Image for each scene
- [ ] Turn scenes into video clips
- [ ] Voice-over for dialogue
- [ ] Export as a PDF script or a full video
