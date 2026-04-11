// In-memory fake database — replace with Prisma when ready

const profiles = [
  {
    id: '1',
    name: 'Alice Nguyen',
    email: 'alice@example.com',
    role: 'barista',
    location: 'Melbourne',
    available: true,
  },
  {
    id: '2',
    name: 'Ben Tran',
    email: 'ben@example.com',
    role: 'chef',
    location: 'Sydney',
    available: false,
  },
  {
    id: '3',
    name: 'Chloe Smith',
    email: 'chloe@example.com',
    role: 'waitstaff',
    location: 'Melbourne',
    available: true,
  },
];

const users = [
  {
    id: 'u1',
    email: 'alice@example.com',
    password: 'hashed_password_1',
  },
  {
    id: 'u2',
    email: 'ben@example.com',
    password: 'hashed_password_2',
  },
];

module.exports = { profiles, users };
