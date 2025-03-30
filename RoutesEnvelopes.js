const express = require('express');
const router = express.Router();

// Sample envelopes data
let envelopes = [
    { id: 1, name: "Rent", balance: 1200 },
    { id: 2, name: "Groceries", balance: 500 },
    { id: 3, name: "Entertainment", balance: 300 }
];

const MAX_BUDGET = 5000; // Max budget limit

// Get all envelopes and total/remaining budget
router.get('/', (req, res) => {
    const totalSpent = envelopes.reduce((sum, env) => sum + env.balance, 0);
    const amountLeft = MAX_BUDGET - totalSpent;

    res.json({
        envelopes,
        maxBudget: MAX_BUDGET,
        totalSpent,
        amountLeft
    });
});

// Add a new envelope
router.post('/', (req, res) => {
    const { name, balance } = req.body;

    // Validate inputs
    if (!name || balance === undefined || balance < 0) {
        return res.status(400).json({ error: "Invalid envelope data" });
    }

    // Calculate current total spent and check if adding new envelope exceeds the max budget
    const currentTotalSpent = envelopes.reduce((sum, env) => sum + env.balance, 0);
    const newTotal = currentTotalSpent + balance;

    if (newTotal > MAX_BUDGET) {
        const overAmount = newTotal - MAX_BUDGET;
        return res.status(400).json({ error: `Budget limit exceeded by $${overAmount.toFixed(2)}` });
    }

    const newEnvelope = {
        id: envelopes.length + 1,
        name,
        balance
    };

    envelopes.push(newEnvelope);
    res.status(201).json(newEnvelope);
});

// Update an envelope balance
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { balance } = req.body;

    const envelope = envelopes.find(env => env.id === parseInt(id));

    if (!envelope) {
        return res.status(404).json({ error: "Envelope not found" });
    }

    envelope.balance = balance;
    res.json(envelope);
});

// Delete an envelope
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    envelopes = envelopes.filter(env => env.id !== parseInt(id));
    res.status(204).send();
});

module.exports = router;
