import os

# Isolate API tests from any developer SQLite file.
os.environ["DB_DRIVER"] = "memory"
