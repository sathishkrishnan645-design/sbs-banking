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
    return {'status': 'UP', 'service': 'loan-service'}

@app.route('/api/loans', methods=['GET'])
def get_loans():
    customer_id = request.args.get('customerId')
    try:
        conn = get_db(); cur = conn.cursor()
        cur.execute('SELECT id, amount, tenure_months, emi, status FROM loans WHERE customer_id=%s', (customer_id,))
        rows = cur.fetchall()
        cur.close(); conn.close()
        return {'loans': [{'id': r[0], 'amount': float(r[1]), 'tenureMonths': r[2], 'emi': float(r[3]), 'status': r[4]} for r in rows]}
    except Exception as e:
        return {'error': str(e)}, 500

@app.route('/api/loans/apply', methods=['POST'])
def apply_loan():
    data        = request.get_json()
    customer_id = data.get('customerId')
    amount      = float(data.get('amount'))
    tenure      = int(data.get('tenureMonths'))
    r           = 10.5 / (12 * 100)
    emi         = round(amount * r * (1+r)**tenure / ((1+r)**tenure - 1), 2)
    try:
        conn = get_db(); cur = conn.cursor()
        cur.execute('INSERT INTO loans (customer_id, amount, tenure_months, emi, status) VALUES (%s,%s,%s,%s,%s) RETURNING id',
                    (customer_id, amount, tenure, emi, 'APPLIED'))
        loan_id = cur.fetchone()[0]
        conn.commit(); cur.close(); conn.close()
        return {'loanId': loan_id, 'emi': emi, 'status': 'APPLIED'}, 201
    except Exception as e:
        return {'error': str(e)}, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8084, debug=False)
"@ | Out-File -FilePath app\loan-service\app.py -Encoding utf8