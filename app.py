from flask import Flask, request, jsonify, send_file
import sqlite3
from datetime import datetime
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, "database.db")


def init_db():
    conn = sqlite3.connect(DATABASE)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS safety_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            risk_level TEXT,
            speed INTEGER,
            drowsiness INTEGER,
            distraction INTEGER,
            collision_risk INTEGER,
            created_at TEXT
        )
    """)

    conn.commit()
    conn.close()


@app.route("/")
def home():
    return send_file(os.path.join(BASE_DIR, "index.html"))


@app.route("/style.css")
def style():
    return send_file(
        os.path.join(BASE_DIR, "style.css"),
        mimetype="text/css"
    )


@app.route("/script.js")
def script():
    return send_file(
        os.path.join(BASE_DIR, "script.js"),
        mimetype="application/javascript"
    )


@app.route("/api/analyze", methods=["POST"])
def analyze():

    data = request.get_json()

    speed = int(data.get("speed", 0))
    drowsiness = int(data.get("drowsiness", 0))
    distraction = int(data.get("distraction", 0))
    collision_risk = int(data.get("collisionRisk", 0))

    score = 0

    if speed > 80:
        score += 25

    if speed > 100:
        score += 20

    if drowsiness:
        score += 30

    if distraction:
        score += 25

    if collision_risk > 50:
        score += 30

    if score >= 70:
        risk = "HIGH"
        message = "⚠️ HIGH RISK! Slow down and stay alert."

    elif score >= 35:
        risk = "MEDIUM"
        message = "⚠️ Medium risk detected. Drive carefully."

    else:
        risk = "LOW"
        message = "✅ Driving condition looks safe."

    conn = sqlite3.connect(DATABASE)

    conn.execute("""
        INSERT INTO safety_logs
        (risk_level, speed, drowsiness, distraction,
         collision_risk, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        risk,
        speed,
        drowsiness,
        distraction,
        collision_risk,
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "risk": risk,
        "score": min(score, 100),
        "message": message
    })


if __name__ == "__main__":
    init_db()

    print("================================")
    print("   SAFEGUARD AI SERVER STARTED")
    print("   http://127.0.0.1:5000")
    print("================================")

    app.run(debug=True)