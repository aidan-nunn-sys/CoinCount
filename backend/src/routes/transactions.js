const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const plaidClient = require('../config/plaid');
const User = require('../models/User');

// Get transactions
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days

    const transactionPromises = user.accounts.map(async (account) => {
      if (account.accessToken) {
        const request = {
          access_token: account.accessToken,
          start_date: startDate.toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0],
        };
        
        const response = await plaidClient.transactionsGet(request);
        return response.data.transactions;
      }
      return [];
    });

    const transactions = await Promise.all(transactionPromises);
    res.json(transactions.flat());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;