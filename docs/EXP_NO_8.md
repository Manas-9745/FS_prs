# Experiment 8 – Real‑Time Communication via WebSockets (Port 5000)

**Objective**: Demonstrate live, bidirectional chat that persists across page reloads and isolates rooms per item.

## How to Run the Demo
1. **Start the backend** (already running on port **5000**) – if it stopped, run `npm run dev` inside `backend/`.
2. **Start the frontend** – run `npm run dev` inside `frontend/`. Vite will serve the UI on **http://localhost:5174** (it auto‑switches if 5173 is occupied).
3. Open **two browser tabs** (or an incognito window) and navigate to `http://localhost:5174`.
4. In **Tab 1** click **“Continue as Student 1 (Pooja)”**. In **Tab 2** click **“Continue as Student 2 (Aarav)”**.
5. Select the same item (e.g., **Blue Backpack**) from the left‑hand list in **both tabs**.
6. In **Tab 1** type:
   ```
   Hello! Did someone find the Blue Backpack in Central Library?
   ```
   and press **Enter** or click **Send**.
7. Verify that the message appears **instantly** in **Tab 2** without any page refresh.
8. In **Tab 2** reply:
   ```
   Hey! Yes, I found it near the study cubicles and kept it safe.
   ```
   and send.
9. Confirm the reply shows up immediately in **Tab 1**.
10. **Refresh** either tab – the full conversation (both messages) should load from **MongoDB Atlas** automatically.

## Expected UI Indicators
- The **ConnectionBadge** displays **“WebSocket: Port 5000 Live”** (green).
- The **“Test Server (5000)”** button opens a modal showing socket ID, transport, latency, and active room.
- Messages are grouped by date (Today, Yesterday, etc.).

## Screenshots (replace placeholders with actual images)
| Step | Screenshot |
|------|------------|
| 1 | `![Live Chat UI](./exp8-screenshots/01-live-chat.png)` |
| 2 | `![Student 1 logged in](./exp8-screenshots/02-student1.png)` |
| 3 | `![Student 2 logged in](./exp8-screenshots/03-student2.png)` |
| 4 | `![Message sent from Tab 1](./exp8-screenshots/04-tab1-message.png)` |
| 5 | `![Message appears in Tab 2](./exp8-screenshots/05-tab2-receive.png)` |
| 6 | `![Reply from Tab 2](./exp8-screenshots/06-tab2-reply.png)` |
| 7 | `![Conversation after reload](./exp8-screenshots/07-reload-history.png)` |
| 8 | `![Room isolation test](./exp8-screenshots/08-room-isolation.png)` |

---

*All code changes for this experiment are committed. The core fix was adding a mutable `selectedItemRef` in `ChatSection.jsx` so the client joins the correct room immediately on socket connection, guaranteeing real‑time message propagation across tabs.*
