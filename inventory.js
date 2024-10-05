// Function to load inventory from localStorage
function loadInventory() {
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    inventoryTableBody.innerHTML = ''; // Clear existing inventory

    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    // Sort the inventory alphabetically by medicine name
    inventory.sort((a, b) => a.name.localeCompare(b.name));
    for (let index = 0; index < inventory.length; index++) {
        const item = inventory[index];
        const row = document.createElement('tr');
        row.innerHTML =`<td>${index + 1}</td>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${item.buyingPrice}</td>
                        <td class="actions">
                            <button onclick="editMedicine('${item.name}')">Edit</button>
                            <button onclick="deleteMedicine('${item.name}')">Delete</button>
                        </td>`;
        inventoryTableBody.appendChild(row);
    }
}

// Function to add medicine to the inventory
document.getElementById('addMedicineBtn').addEventListener('click', function () {
    const medicineName = document.getElementById('medicineName').value;
    const medicineQuantity = document.getElementById('medicineQuantity').value;
    const medicineBuyingPrice = document.getElementById('medicineBuyingPrice').value;

    if (medicineName && medicineQuantity && medicineBuyingPrice) {
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        inventory.push({
            name: medicineName,
            quantity: Number(medicineQuantity),
            buyingPrice: Number(medicineBuyingPrice),
        });
        localStorage.setItem('inventory', JSON.stringify(inventory));
        loadInventory();
        // Clear input fields
        document.getElementById('medicineName').value = '';
        document.getElementById('medicineQuantity').value = '';
        document.getElementById('medicineBuyingPrice').value = '';
    }
});

// Function to delete medicine from the inventory
function deleteMedicine(medicineName) {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const updatedInventory = inventory.filter(item => item.name !== medicineName); // Remove the medicine with the specified name
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    loadInventory(); // Reload inventory after deletion
}
// Function to edit medicine details
function editMedicine(medicineName) {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const item = inventory.find(item => item.name === medicineName); // Find the medicine by name
    if (item) {
        const newQuantity = prompt('Edit quantity:', item.quantity);
        const newBuyingPrice = prompt('Edit buying price:', item.buyingPrice);

        // Validate new inputs
        if (newQuantity !== null && newBuyingPrice !== null) {
            if (!isNaN(newQuantity) && !isNaN(newBuyingPrice)) {
                item.quantity = parseInt(newQuantity);
                item.buyingPrice = parseFloat(newBuyingPrice);

                localStorage.setItem('inventory', JSON.stringify(inventory));
                loadInventory(); // Refresh the inventory display
            }
        }
    } else {
        alert('Medicine not found!'); // Optional: Alert if medicine not found
    }
}

// Initial load of inventory
loadInventory();
