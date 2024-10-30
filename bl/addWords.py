import config
import csv
import psycopg2

CSV_PATH = "./static/words/"


def validateFile(row):
    if len(row) != 2 or not (len(row[0]) > 1 and int(row[1]) > 1):
        return str(row) + " " + "IS NOT A VALID INPUT"
    return ''


def csvParser():
    with open(CSV_PATH) as f:
        reader = csv.reader(f, delimiter=",")
        return list(reader)


# Defining main function
def main():
    wordList = csvParser()
    conn = psycopg2.connect(config.DB_ST)
    query = "INSERT INTO words(name,count) values(%s,%s);"
    hasError = False
    for word in wordList:
        errorMsg = validateFile(word)
        hasError = len(errorMsg) > 0
        cur = conn.cursor()
        if hasError:
            print("VALIDATION ERROR:", errorMsg)
            conn.rollback()
            break
        else:
            try:
                cur.execute(query, word)
            except psycopg2.DatabaseError as error:
                print("DB ERROR:", error, word)
                conn.rollback()
                hasError = True
                break

    if not hasError:
        conn.commit()
    cur.close()
    conn.close()


if __name__ == "__main__":
    CSV_PATH += input("ENTER CSV FILENAME\n")
    main()
