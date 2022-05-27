--Entering psql command prompt
    psql -U postgres

--Creating a role
    CREATE ROLE me WITH LOGIN PASSWORD 'password';

--Alter role for 'me' to create database
    ALTER ROLE me CREATEDB;

--Quit
    \q

--Connect postgres with 'me'
    psql -d postgres -U me

--Create databse
    CREATE DATABSE habuild;

--Connect to the database
    \c habuild

--Create tables
    CREATE TABLE topics (
        ID SERIAL PRIMARY KEY,
        name VARCHAR(40)
    );

    CREATE TABLE rankings (
        ID SERIAL PRIMARY KEY,
        ranking INT,
        tid INT REFERENCES topics(id)
    );

--Insert values in tables
    INSERT INTO topics(name) VALUES ('RRR'),('KGF'),('Bhool Bhulaiyaa 2'),('Doctor Strange');
    INSERT INTO rankings(ranking,tid) VALUES (60,1),(70,2),(60,3),(80,4);

--Query to display tables
    SELECT * FROM topics;
    SELECT * FROM rankings;