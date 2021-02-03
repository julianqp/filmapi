require('dotenv').config({ path: '.env' });

const config = {
  tmdbKey: '831e08f1af6a358dffb3e2b2790c7f3a',
  tmdbUrl: 'https://api.themoviedb.org/3/',
  stripe_sk: process.env.STRIPE,
};

module.exports = config;
