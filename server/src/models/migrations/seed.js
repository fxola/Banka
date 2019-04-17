import db from '../db';

const createUsers = async (email, firstname, lastname, password, type, isAdmin) => {
  const query = `insert into users(email,firstname,lastname,password,type,isadmin) 
VALUES ($1,$2,$3,$4,$5,$6)`;
  const values = [email, firstname, lastname, password, type, isAdmin];
  await db
    .query(query, values)
    .then(() => {
      console.log('user created successfully');
    })
    .catch(() => {
      console.log('users seeding failed.');
    });
};

const createAccounts = async (type, accountnumber, owner) => {
  const query = `insert into accounts(type,accountnumber,owner) values ($1,$2,$3)`;
  const values = [type, accountnumber, owner];
  await db
    .query(query, values)
    .then(() => {
      console.log('account created successfully');
    })
    .catch(() => {
      console.log('accounts seeding failed.');
    });
};

(async () => {
  await createUsers(
    'user@admin.com',
    'admin',
    'admin',
    '$2b$10$aRUut8DBn7YgO5eVBW4uFeB47YMFMOrLRxf6jylsAKl1eEwYUYY9m',
    'staff',
    true
  );
  await createUsers(
    'user@staff.com',
    'first',
    'staff',
    '$2b$10$g0tV.Pdv.CEZFyI1Tecy0.CSjNAdzM6kGyB/KSPqBbBprz4EGgjpq',
    'staff',
    false
  );
  await createUsers(
    'user2@staff.com',
    'second',
    'staff',
    '$2b$10$zJF.wRMevlFGfphFDKBPDufEPXaLrJy8RaYFGx7spc6cxTwmETOhm',
    'staff',
    false
  );

  await createAccounts('savings', 1029705319, 1);
  await createAccounts('savings', 1029704415, 2);
  await createAccounts('savings', 1029704416, 3); // active
})();
