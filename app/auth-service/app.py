from flask import Flask, request, jsonify
import os, redis, jwt, bcrypt, psycopg2
from datetime import datetime, timedelta

app = Flask(__name__)

JWT_SECRET  = os.getenv("JWT_SECRET", "sbs-secret-key")
REDIS_HOST  = os.getenv("REDIS_HOST", "localhost")
DB_HOST     = os.getenv("DB_HOST", "localhost")
DB_NAME     = os.getenv("DB_NAME", "sbsdb")
DB_USER     = os.getenv("DB_USER", "sbsadmin")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")

def get_redis():
    return redis.Redis(host=REDIS_HOST, port=6379, decode_responses=True)

def get_db():
    return psycopg2.connect(host=DB_HOST, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)

@app.route("/health")
def health():
    return jsonify({"status": "UP", "service": "auth-service"})

@app.route("/api/auth/login", methods=["POST"])
def login():
    data        = request.get_json()
    customer_id = data.get("customerId")
    password    = data.get("password")
    try:
        conn = get_db()
        cur  = conn.cursor()
        cur.execute("SELECT id, password_hash, full_name FROM users WHERE customer_id=%s AND status='ACTIVE'", (customer_id,))
        user = cur.fetchone()
        cur.close(); conn.close()
    except Exception as e:
        return jsonify({"error": "DB error", "detail": str(e)}), 500

    if not user or not bcrypt.checkpw(password.encode(), user[1].encode()):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode({
        "sub": customer_id,
        "name": user[2],
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(minutes=15)
    }, JWT_SECRET, algorithm="HS256")

    r = get_redis()
    r.setex(f"token:{token}", 900, customer_id)

    return jsonify({
        "accessToken": token,
        "customerId": customer_id,
        "fullName": user[2],
        "expiresIn": 900
    })

@app.route("/api/auth/logout", methods=["POST"])
def logout():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    get_redis().delete(f"token:{token}")
    return jsonify({"message": "Logged out"}), 200

@app.route("/api/auth/verify", methods=["POST"])
def verify():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    r = get_redis()
    if not r.exists(f"token:{token}"):
        return jsonify({"valid": False}), 401
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return jsonify({"valid": True, "customerId": payload["sub"]})
    except jwt.ExpiredSignatureError:
        return jsonify({"valid": False, "error": "Token expired"}), 401

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8081, debug=False)
