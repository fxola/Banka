export default {
  users: [
    {
      id: 1,
      email: 'user@admin.com',
      password: '$2b$10$aRUut8DBn7YgO5eVBW4uFeB47YMFMOrLRxf6jylsAKl1eEwYUYY9m',
      type: 'staff',
      isAdmin: true
    },
    {
      id: 2,
      email: 'user@staff.com',
      password: '$2b$10$g0tV.Pdv.CEZFyI1Tecy0.CSjNAdzM6kGyB/KSPqBbBprz4EGgjpq',
      type: 'staff',
      isAdmin: false
    },
    {
      id: 3,
      email: 'user2@staff.com',
      password: '$2b$10$zJF.wRMevlFGfphFDKBPDufEPXaLrJy8RaYFGx7spc6cxTwmETOhm',
      type: 'staff',
      isAdmin: false
    }
  ],
  accounts: [
    {
      id: 1,
      createdOn: '2019-04-05T12:14:03.374Z',
      owner: 2,
      type: 'savings',
      status: 'draft',
      balance: '0.00',
      accountNumber: 1029705319
    },
    {
      id: 2,
      createdOn: '2019-04-05T12:14:03.374Z',
      owner: 2,
      type: 'savings',
      status: 'draft',
      balance: '0.00',
      accountNumber: 1029704415
    },
    {
      id: 3,
      createdOn: '2019-04-05T12:14:03.374Z',
      owner: 2,
      type: 'savings',
      status: 'active',
      balance: '0.00',
      accountNumber: 1029704416
    }
  ],
  transactions: []
};
