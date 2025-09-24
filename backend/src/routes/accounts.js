const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const plaidClient = require('../config/plaid');
const User = require('../models/User');

// Create Plaid link token
router.post('/create-link-token', auth, async (req, res) => {
  try {
    const request = {
      user: {
        client_user_id: req.user.id,
      },
      client_name: 'CoinCount',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      language: 'en',
    };

    const response = await plaidClient.linkTokenCreate(request);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create link token' });
  }
});

// Exchange public token for access token
router.post('/set-access-token', auth, async (req, res) => {
  try {
    const { public_token, institution } = req.body;
    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account details
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    // Save account information
    const accounts = accountsResponse.data.accounts.map(account => ({
      plaidAccountId: account.account_id,
      name: account.name,
      type: account.type,
      subtype: account.subtype,
      balance: account.balances.current,
      institution: institution.name,
      accessToken,
      itemId,
    }));

    await User.findByIdAndUpdate(req.user.id, {
      $push: { accounts: { $each: accounts } },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to set access token' });
  }
});

// Get account balances
router.get('/balances', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const balancePromises = user.accounts.map(async (account) => {
      if (account.accessToken) {
        const response = await plaidClient.accountsBalanceGet({
          access_token: account.accessToken,
          options: {
            account_ids: [account.plaidAccountId],
          },
        });
        return response.data.accounts[0];
      }
      return account;
    });

    const balances = await Promise.all(balancePromises);
    res.json(balances);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch balances' });
  }
});

module.exports = router;