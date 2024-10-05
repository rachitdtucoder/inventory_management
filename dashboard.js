function updateProfitDisplay() {
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to the start of today (midnight) to avoid time mismatch

  let totalProfit = 0;

  // Filter transactions by today's date
  const todaysTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      transactionDate.setHours(0, 0, 0, 0); // Set time to the start of the transaction date

      // Compare only dates, ignoring time differences
      return transactionDate.getTime() === today.getTime();
  });

  // Calculate total profit for today's transactions
  todaysTransactions.forEach(transaction => {
      totalProfit += transaction.profit; // Sum profits
  });

  // Update profit display
  const profitDisplay = document.getElementById('todaysProfit');
  profitDisplay.innerText = `${totalProfit.toFixed(2)} Rupees`;

  // Update date display
  const profitDate = document.getElementById('profitDate');
  profitDate.innerText = `Profit on ${today.toLocaleDateString()}`; // Format date as needed
}

// Call updateProfitDisplay on page load
updateProfitDisplay();



