const apiBaseURL = 'http://localhost:3000/envelopes';

// Function to fetch and display envelopes
async function fetchEnvelopes() {
    try {
        const response = await fetch(apiBaseURL);
        if (!response.ok) {
            throw new Error('Error fetching envelopes');
        }
        const data = await response.json();
        const { envelopes, maxBudget, totalSpent, amountLeft } = data;

        displayEnvelopes(envelopes);
        displayBudgetSummary(maxBudget, totalSpent, amountLeft);
    } catch (error) {
        console.error('Error:', error);
        alert('Unable to fetch envelopes');
    }
}

// Function to display envelopes in the UI
function displayEnvelopes(envelopes) {
    const envelopesList = document.getElementById('envelopes-list');
    envelopesList.innerHTML = '';

    envelopes.forEach(envelope => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${envelope.name}</strong> - Allocated: $${envelope.balance}
            <button onclick="deleteEnvelope(${envelope.id})">Delete</button>
        `;
        envelopesList.appendChild(listItem);
    });
}

// Function to display the total budget, amount spent, and remaining budget
function displayBudgetSummary(maxBudget, totalSpent, amountLeft) {
    const budgetSummary = document.getElementById('budget-summary');
    budgetSummary.innerHTML = `
        <strong>Max Budget:</strong> $${maxBudget.toFixed(2)} <br>
        <strong>Total Spent:</strong> $${totalSpent.toFixed(2)} <br>
        <strong>Amount Left:</strong> $${amountLeft.toFixed(2)}
    `;
}

// Function to add an envelope
async function addEnvelope() {
    const name = document.getElementById('envelope-name').value;
    const balance = parseFloat(document.getElementById('envelope-balance').value);

    if (!name || isNaN(balance) || balance < 0) {
        alert("Please enter a valid envelope name and balance.");
        return;
    }

    try {
        const response = await fetch(apiBaseURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, balance })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        await fetchEnvelopes();
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);  // Show exact error message (e.g., how much over budget)
    }
}

// Function to delete an envelope
async function deleteEnvelope(id) {
    try {
        const response = await fetch(`${apiBaseURL}/${id}`, { method: 'DELETE' });

        if (!response.ok) {
            throw new Error('Error deleting envelope');
        }

        await fetchEnvelopes();
    } catch (error) {
        console.error('Error:', error);
        alert('Unable to delete envelope');
    }
}

// Add event listener to button
document.getElementById('add-envelope').addEventListener('click', addEnvelope);

// Load envelopes on page load
fetchEnvelopes();
