"""
This file is the database configuration for a SQLAlchemy application. Its job is to:

Connect to the database.
Create database sessions.
Define a base class for all database models.
Properly open and close database connections.
"""

from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from config import DATABASE_URL 

engine = create_engine(
	DATABASE_URL, 
	echo=True
) # with echo=True every SQL query is printed; 

# try:
#     with engine.connect() as connection:
#         result = connection.execute(text("SELECT 1"))
#         print("✅ Database connected successfully!")
#         print(result.scalar())
# except Exception as e:
#     print("❌ Database connection failed!")
#     print(e)

SessionLocal = sessionmaker(
	autocommit=False, 
	autoflush=False, 
	bind=engine
) # used to create  sesion; waits after each operation, doesnt commit; 

Base = declarative_base()

def get_db():
	db = SessionLocal()
	try:
		yield db
	finally:
		db.close()
