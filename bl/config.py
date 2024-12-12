import os
import psycopg2
from psycopg2.extras import RealDictCursor
import psycopg2.pool

ENVIRONMENT = os.environ.get("ENVIRONMENT") or "development"

DEBUG = ENVIRONMENT == "development"
CLIENT_URL = os.environ.get("CLIENT_URL")
ACCEPTED_ORiGINS = "*" if DEBUG else [CLIENT_URL]

DB_DT = {
    "host": os.environ.get("DB_HOST"),
    "database": os.environ.get("DB_NAME"),
    "user": os.environ.get("DB_USERNAME"),
    "password": os.environ.get("DB_PASSWORD"),
}

DB_ST = "postgres://avnadmin:AVNS_SthqTRCLjFVBqb1STcq@ovm-ovm-1.i.aivencloud.com:10555/ovm?sslmode=require"

def get_db_connection():
    conn = psycopg2.connect(DB_ST)
    conn.autocommit = True
    # conn.set_session(autocommit = True)
    cur = conn.cursor(cursor_factory=RealDictCursor)

    def closeConn():
        cur.close()
        conn.close()

    return cur, closeConn


def testDBCon():
    try:
        conn = psycopg2.connect(DB_ST)
        conn.close()
        print("DB CONNECTION SUCCESSFUL ", DB_ST)
    except Exception as e:
        print("DB CONNECTION FAILED ", DB_ST)
        print(e)
