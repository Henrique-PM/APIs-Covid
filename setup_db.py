import sqlite3

def create_tables():
    try:
        with sqlite3.connect('bancoInfo.db') as conn:
            c = conn.cursor()
            c.execute('''
            CREATE TABLE IF NOT EXISTS info (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pais TEXT,
                populacao TEXT,
                casos TEXT,
                pessoas_vacinadas TEXT,
                mortes TEXT
            )
            ''')
            conn.commit()
            print("Tabela criada com sucesso!")
    except sqlite3.Error as e:
        print(f"Erro ao criar a tabela no banco de dados: {e}")

if __name__ == "__main__":
    create_tables()
