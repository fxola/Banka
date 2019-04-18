/* eslint-disable no-unused-expressions */
import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URL
});

pool.on('connect', () => {
  console.log('connected to the database');
});

pool.on('error', err => {
  console.log(err);
});

/**
 * Create Tables
 */
const createTableSchema = () => {
  const sqlDump = `
    CREATE TABLE users (
            id serial primary key NOT NULL,
            firstname varchar(128) NOT NULL,
            lastname varchar(128) NOT NULL,
            email varchar(128) NOT NULL UNIQUE,
            password varchar(128) NOT NULL,
            type TEXT NOT NULL DEFAULT 'client',
            isadmin BOOLEAN NOT NULL DEFAULT FALSE
            );
    CREATE TABLE accounts (
        id serial primary key NOT NULL,
        owner integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        accountnumber integer NOT NULL UNIQUE,
        balance NUMERIC(15,2) NOT NULL DEFAULT '0.00',
        type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        createdon TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updatedon TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
    CREATE TABLE transactions (
        id serial primary key NOT NULL,
        accountnumber integer NOT NULL REFERENCES accounts(accountnumber) ON DELETE CASCADE,
        cashier integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        amount NUMERIC(15,2) NOT NULL,
        oldbalance NUMERIC(15,2) NOT NULL,
        newbalance NUMERIC(15,2) NOT NULL,
        createdon TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        `;
  pool
    .query(sqlDump)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
};

createTableSchema();
