from flask import Flask, request, jsonify
from flask_cors import CORS
import os, psycopg2

app = Flask(__name__)
CORS(app)

DB_HOST     = os.getenv('DB_HOST', 'localhost')
DB_NAME     = os.getenv('DB_NAME', 'sbsdb')
DB_USER     = os.getenv('DB_USER', 'sbsadmin')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'password')

def get_db():
    return psycopg2.connect(host=DB_HOST, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)

@app.route('/health')
def health():
    return {'status': 'UP', 'service': 'account-service'}

@app.route('/api/accounts', methods=['GET'])
def get_accounts():
    customer_id = request.args.get('customerId')
    try:
        conn = get_db(); cur = conn.cursor()
        cur.execute('SELECT account_number, account_type, balance FROM accounts WHERE customer_id=%s', (customer_id,))
        rows = cur.fetchall()
        cur.close(); conn.close()
        return {'accounts': [{'accountNumber': r[0], 'type': r[1], 'balance': float(r[2])} for r in rows]}
    except Exception as e:
        return {'error': str(e)}, 500

@app.route('/api/accounts/<account_number>', methods=['GET'])
def get_account(account_number):
    try:
        conn = get_db(); cur = conn.cursor()
        cur.execute('SELECT account_number, account_type, balance FROM accounts WHERE account_number=%s', (account_number,))
        row = cur.fetchone()
        cur.close(); conn.close()
        if not row:
            return {'error': 'Not found'}, 404
        return {'accountNumber': row[0], 'type': row[1], 'balance': float(row[2])}
    except Exception as e:
        return {'error': str(e)}, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8082, debug=False)
