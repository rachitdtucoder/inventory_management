document.getElementById('printButton').addEventListener('click', function () {
    const transactionTableBody = document.getElementById('transactionTableBody');
    const lastRow = transactionTableBody.lastElementChild; // Get the last row of the table

    if (lastRow) {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>TRANSACTION DETAILS</title>');
        printWindow.document.write('<style> body { font-family: Arial, sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; } </style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h2 style="text-align:center;">UJLAYAN KISSAN SEVA KENDRA, BARODA</h2>');
        printWindow.document.write('<table border="1">'); 
        printWindow.document.write('<tr><th>Date</th><th>Customer Name</th><th>Customer Mobile</th><th>Medicine</th><th>Quantity Sold</th><th>Selling Price</th><th>Amount Paid</th><th>Amount Pending</th><th>Total Amount</th></tr>');
        
        // Extracting necessary data from the last row
        const cells = lastRow.getElementsByTagName('td');

        // Adjust the indices based on your column structure
        printWindow.document.write(`<tr>
            <td>${cells[1].innerText}</td>  
            <td>${cells[2].innerText}</td>  
            <td>${cells[3].innerText}</td>  
            <td>${cells[4].innerText}</td>  
            <td>${cells[5].innerText}</td>  
            <td>${cells[7].innerText}</td>  
            <td>${cells[9].innerText}</td>  
            <td style="color:red;">${cells[10].innerText}</td>
            <td>${cells[11].innerText}</td>  
        </tr>`);
        
        printWindow.document.write('</table>');
        printWindow.document.write('<footer style="margin-left:900px"><p>VIKAS UJLAYAN</p></footer>');
        printWindow.document.write('</body></html>');
        printWindow.document.close(); // Close the document
        printWindow.print(); // Open print dialog
    } else {
        alert("No transactions to print.");
    }
});


// Function to load transactions from localStorage
function loadTransactions(filteredTransactions = null) {
    const transactionTableBody = document.getElementById('transactionTableBody');
    transactionTableBody.innerHTML = ''; // Clear existing transactions

    const transactions = filteredTransactions || JSON.parse(localStorage.getItem('transactions')) || [];
    
    // Using a simple for loop to iterate through transactions
    for (let index = 0; index < transactions.length; index++) {
        const transaction = transactions[index];
        const row = document.createElement('tr');
        row.innerHTML = `<td>${index + 1}</td>
                         <td>${transaction.date}</td>
                         <td>${transaction.customerName}</td>
                         <td>${transaction.customerMobile}</td>
                         <td>${transaction.medicineName}</td>
                         <td>${transaction.quantity}</td>
                         <td>${transaction.buyingPrice}</td>
                         <td>${transaction.sellingPrice}</td>
                         <td>${transaction.profit}</td>
                         <td>${transaction.amountPaid}</td>
                         <td class="amountPending amountPending_${index}">${transaction.amountPending}</td>
                         <td>${transaction.totalAmount}</td>
                         <td class="actions">
                             <button onclick="editAmountPending(${index})">Edit Amount Pending</button>
                             <button onclick="deleteTransaction(${index})">Delete</button>
                         </td>`;
        
        // Append the row to the table body first
        transactionTableBody.appendChild(row); 

        
        // Set color for amountPending based on its value
        const amountPendingElement = row.querySelector(`.amountPending_${index}`);
        if (transaction.amountPending > 0) {
            amountPendingElement.style.color = 'red';
        } else {
            amountPendingElement.style.color = 'black';
        }
    }
    // Show print button if there are transactions
    const printButton = document.getElementById('printButton');
    printButton.style.display = transactions.length > 0 ? 'block' : 'none'; // Show or hide print button
}

// Function to add transaction
document.getElementById('addTransactionBtn').addEventListener('click', function () {
    const customerName = document.getElementById('customerName').value;
    const customerMobile = document.getElementById('customerMobile').value;
    const medicineName = document.getElementById('medicineNameTransaction').value;
    const quantity = Number(document.getElementById('quantity').value);
    const sellingPrice = Number(document.getElementById('sellingPrice').value);
    const amountPaid = Number(document.getElementById('amountPaid').value);
    
    if (customerName && customerMobile && medicineName && quantity && sellingPrice && amountPaid) {
        const buyingPrice = getBuyingPrice(medicineName); // Function to fetch the buying price
        const profit = (sellingPrice - buyingPrice) * quantity;
        const totalAmount = sellingPrice * quantity;
        const amountPending = totalAmount - amountPaid;

        // Fetch the inventory
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        // const medicine = inventory.find(item => item.name === medicineName);
        let medicine = undefined; // Initialize medicine variable to store the found medicine
        // Loop through the inventory array
        for (let i = 0; i < inventory.length; i++) {
            const item = inventory[i]; // Get the current item
            if (item.name === medicineName) { // Check if the name matches
                medicine = item; // If a match is found, assign it to medicine
                break; // Exit the loop since we found the medicine
            }
        }

        // Check if enough quantity is available
        if (medicine && medicine.quantity >= quantity) {
            // Update the medicine quantity
            medicine.quantity -= quantity;

            // Save the updated inventory
            localStorage.setItem('inventory', JSON.stringify(inventory));

            // Add the transaction
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            transactions.push({
                date: new Date().toLocaleString(),
                customerName,
                customerMobile,
                medicineName,
                quantity,
                buyingPrice,
                sellingPrice,
                profit,
                amountPaid,
                amountPending,
                totalAmount,
            });
            localStorage.setItem('transactions', JSON.stringify(transactions));
            loadTransactions();
            // Clear input fields
            document.getElementById('customerName').value = '';
            document.getElementById('customerMobile').value = '';
            document.getElementById('medicineNameTransaction').value = '';
            document.getElementById('quantity').value = '';
            document.getElementById('sellingPrice').value = '';
            document.getElementById('amountPaid').value = '';
            loadInventory(); // Load inventory after updating

        } else {
            alert('Not enough quantity available in inventory.');
        }
    }
});

// Function to fetch buying price from localStorage
function getBuyingPrice(medicineName) {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const medicine = inventory.find(item => item.name === medicineName);
    return medicine ? medicine.buyingPrice : 0; // Return buying price if found
}

// Function to delete a transaction
function deleteTransaction(index) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.splice(index, 1); // Remove the transaction at the specified index
    localStorage.setItem('transactions', JSON.stringify(transactions));
    loadTransactions(); // Reload transactions after deletion
}
// Function to edit the amount pending for a transaction
function editAmountPending(index) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transaction = transactions[index];
    // Prompt the user for the new amount pending
    const newAmountPending = prompt('Enter the new amount pending:', transaction.amountPending);
    // Validate the new amount pending
    if (newAmountPending !== null && !isNaN(newAmountPending) && newAmountPending >= 0) {
        const amountPendingValue = parseFloat(newAmountPending);
        const totalAmount = transaction.totalAmount;
        // Calculate the new amount paid
        const newAmountPaid = totalAmount - amountPendingValue;
        // Update the transaction
        transaction.amountPending = amountPendingValue;
        transaction.amountPaid = newAmountPaid;
        // Save the updated transactions back to localStorage
        localStorage.setItem('transactions', JSON.stringify(transactions));
        // Reload the transactions to reflect the changes
        loadTransactions();
    }
}
function searchCustomer() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    // Filter transactions by customer name
    const filteredTransactions = transactions.filter(transaction => 
        transaction.customerName.toLowerCase().includes(searchTerm)
    );
    
    // Load only the filtered transactions
    loadTransactions(filteredTransactions);
}

// Initial load of transactions
loadTransactions();

