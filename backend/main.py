from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import sys
import io
import datetime
import random
import cv2
import mediapipe as mp
import numpy as np
import base64
import json
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    return sqlite3.connect('nexora.db', check_same_thread=False)

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS progress (id INTEGER PRIMARY KEY, streak INTEGER, xp INTEGER, badges INTEGER)''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS emergencies (id INTEGER PRIMARY KEY, timestamp TEXT, status TEXT)''')
    cursor.execute('SELECT COUNT(*) FROM progress')
    if cursor.fetchone()[0] == 0:
        cursor.execute('INSERT INTO progress (streak, xp, badges) VALUES (14, 4250, 8)')
    conn.commit()
    conn.close()

init_db()

@app.get("/")
def read_root(): return {"message": "Nexora Access API Active"}

@app.get("/api/progress")
def get_progress():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT streak, xp, badges FROM progress WHERE id = 1')
    row = c.fetchone()
    conn.close()
    return {"streak": row[0], "xp": row[1], "badges": row[2]}

@app.post("/api/progress/add_xp")
def add_xp():
    conn = get_db()
    c = conn.cursor()
    c.execute('UPDATE progress SET xp = xp + 50 WHERE id = 1')
    if random.random() > 0.8:
        c.execute('UPDATE progress SET badges = badges + 1 WHERE id = 1')
    conn.commit()
    conn.close()
    return get_progress()

class CodeRequest(BaseModel): code: str

@app.post("/api/execute")
def execute_code(req: CodeRequest):
    old_stdout = sys.stdout
    redirected_output = sys.stdout = io.StringIO()
    try:
        exec(req.code, {})
        sys.stdout = old_stdout
        return {"output": redirected_output.getvalue()}
    except Exception as e:
        sys.stdout = old_stdout
        return {"error": str(e)}

@app.post("/api/emergency")
def log_emergency():
    conn = get_db()
    c = conn.cursor()
    ts = datetime.datetime.now().isoformat()
    c.execute('INSERT INTO emergencies (timestamp, status) VALUES (?, ?)', (ts, 'DISPATCHED'))
    conn.commit()
    conn.close()
    return {"status": "success", "timestamp": ts}

# --- REAL-TIME MEDIAPIPE WEBSOCKET ---
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.7)

def detect_gesture(hand_landmarks, hand_label):
    fingers_up = []
    # Thumb (check x relative to palm, accounting for Left/Right hand)
    if hand_label == "Right":
        if hand_landmarks.landmark[4].x < hand_landmarks.landmark[3].x:
            fingers_up.append(1)
        else:
            fingers_up.append(0)
    else:
        if hand_landmarks.landmark[4].x > hand_landmarks.landmark[3].x:
            fingers_up.append(1)
        else:
            fingers_up.append(0)
            
    # Other 4 fingers (check y relative to lower joint)
    for tip, pip in [(8, 6), (12, 10), (16, 14), (20, 18)]:
        if hand_landmarks.landmark[tip].y < hand_landmarks.landmark[pip].y - 0.02:
            fingers_up.append(1)
        else:
            fingers_up.append(0)
            
    if fingers_up == [1, 1, 1, 1, 1]: return "HELLO"
    if fingers_up == [0, 0, 0, 0, 0]: return "FIST"
    if fingers_up == [0, 1, 1, 0, 0]: return "PEACE"
    if fingers_up == [1, 0, 0, 0, 0]: return "GOOD"
    if fingers_up == [0, 1, 0, 0, 0]: return "ONE"
    if fingers_up == [1, 1, 0, 0, 1]: return "I LOVE YOU"
    
    return "DETECTING..." # Let user know hand is tracked but gesture unknown

@app.websocket("/ws/sign_stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            header, encoded = data.split(",", 1) if "," in data else ("", data)
            img_bytes = base64.b64decode(encoded)
            np_arr = np.frombuffer(img_bytes, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if img is not None:
                img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                results = hands.process(img_rgb)
                
                response = {"landmarks": [], "predicted": None, "timestamp": datetime.datetime.now().strftime("%H:%M:%S")}
                if results.multi_hand_landmarks and results.multi_handedness:
                    for idx, hand_landmarks in enumerate(results.multi_hand_landmarks):
                        hand_label = results.multi_handedness[idx].classification[0].label
                        gesture = detect_gesture(hand_landmarks, hand_label)
                        if gesture: response["predicted"] = gesture
                        
                        coords = [{"x": lm.x, "y": lm.y, "z": lm.z} for lm in hand_landmarks.landmark]
                        response["landmarks"] = coords
                        break
                
                await websocket.send_text(json.dumps(response))
            else:
                await asyncio.sleep(0.01)
    except WebSocketDisconnect:
        print("Client disconnected from WebSocket.")
    except Exception as e:
        print(f"WebSocket Error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
