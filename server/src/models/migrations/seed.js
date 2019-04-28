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
    .catch(err => {
      console.log('users seeding failed.', err);
    });
};

const createAccounts = async (type, accountnumber, owner, avatar) => {
  const query = `insert into accounts(type,accountnumber,owner,avatar) values ($1,$2,$3,$4)`;
  const values = [type, accountnumber, owner, avatar];
  await db
    .query(query, values)
    .then(() => {
      console.log('account created successfully');
    })
    .catch(err => {
      console.log('accounts seeding failed.', err);
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
  await createUsers(
    'first@user.com',
    'first',
    'user',
    '$2b$10$KDkzDOJz9VXq5CmoisAuweLjoj5yb1h9kpoDxxAX3CXfEUkebNOcG',
    'client',
    false
  );
  await createUsers(
    'second@user.com',
    'second',
    'user',
    '$2b$10$tTkGOLEmkbBYUNCvgN7PDu0AQwbQh8Mu3AJATrCz7nn0ek1pqDKhi',
    'client',
    false
  );
  await createUsers(
    'new@user.com',
    'new',
    'user',
    '$2b$10$KDkzDOJz9VXq5CmoisAuweLjoj5yb1h9kpoDxxAX3CXfEUkebNOcG',
    'client',
    false
  );
  await createAccounts('savings', 1029705319, 4, 'uploads/avatar.png');
  await createAccounts('savings', 1029704415, 4, 'uploads/avatar.png');
  await createAccounts('savings', 1029709922, 4, 'uploads/avatar.png');
  await createAccounts('savings', 1029704123, 4, 'uploads/avatar.png');
  await createAccounts('savings', 1029704416, 4, 'uploads/avatar.png'); // active
})();
