@"
from flask import Flask, request, jsonify
import os, psycopg2

app = Flask(__name__)

DB_HOST     = os.getenv('DB_HOST', 'localhost')
DB_NAME     = os.getenv('DB_NAME', 'sbsdb')
DB_USER     = os.getenv('DB_USER', 'sbsadmin')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'password')

def get_db():
    return psycopg2.connect(host=DB_HOST, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)

@app.route('/health')
def health():
    return {'status': 'UP', 'service': 'txn-service'}

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    account_number = request.args.get('accountNumber')
    try:
        conn = get_db(); cur = conn.cursor()
        cur.execute('''SELECT id, type, amount, description, created_at
                       FROM transactions WHERE account_number=%s
                       ORDER BY created_at DESC LIMIT 20''', (account_number,))
        rows = cur.fetchall()
        cur.close(); conn.close()
        return {'transactions': [{'id': r[0], 'type': r[1], 'amount': float(r[2]), 'description': r[3], 'date': str(r[4])} for r in rows]}
    except Exception as e:
        return {'error': str(e)}, 500

@app.route('/api/transfer', methods=['POST'])
def transfer():
    data      = request.get_json()
    from_acct = data.get('fromAccount')
    to_acct   = data.get('toAccount')
    amount    = data.get('amount')
    mode      = data.get('mode', 'IMPS')
    try:
        conn = get_db(); cur = conn.cursor()
        cur.execute('UPDATE accounts SET balance = balance - %s WHERE account_number=%s AND balance >= %s',
                    (amount, from_acct, amount))
        if cur.rowcount == 0:
            conn.rollback(); return {'error': 'Insufficient balance'}, 400
        cur.execute('UPDATE accounts SET balance = balance + %s WHERE account_number=%s', (amount, to_acct))
        cur.execute('INSERT INTO transactions (account_number, type, amount, description) VALUES (%s,%s,%s,%s)',
                    (from_acct, 'DEBIT', amount, f'{mode} to {to_acct}'))
        cur.execute('INSERT INTO transactions (account_number, type, amount, description) VALUES (%s,%s,%s,%s)',
                    (to_acct, 'CREDIT', amount, f'{mode} from {from_acct}'))
        conn.commit(); cur.close(); conn.close()
        return {'message': 'Transfer successful', 'mode': mode}
    except Exception as e:
        return {'error': str(e)}, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8083, debug=False)
"@ | Out-File -FilePath app\txn-service\app.py -Encoding utf8