document.addEventListener('DOMContentLoaded', function () {
    const cart = [];
    const tableBody = document.querySelector('#orderSummary tbody');
    const totalPriceElement = document.getElementById('totalPrice');
    const favoritesKey = 'favoriteItems';

    document.querySelectorAll('.addToCart').forEach(button => {
        button.addEventListener('click', function () {
            const inputElement = this.previousElementSibling.querySelector('input');
            const itemName = inputElement.name;
            const itemAmount = parseFloat(inputElement.value) || 0;
            const itemSection = inputElement.dataset.section; 
            const itemPricePerUnit = parseFloat(inputElement.dataset.price);
            const itemTotalPrice = itemAmount * itemPricePerUnit;

            //Checking if the user entered a valid quantity 
            if (itemAmount > 0) {
                addItemToCart(itemName, itemAmount, itemTotalPrice, itemSection);
                updateOrderSummary();
            } else {
                alert("Please enter a valid amount");
            }
        });
    });

    //Function to add items to the cart 
    function addItemToCart(name, amount, totalPrice, section) {
        const existingItemIndex = cart.findIndex(item => item.name === name);
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].amount += amount;
            cart[existingItemIndex].totalPrice += totalPrice;
        } else {
            cart.push({ name, amount, totalPrice, section });
        }
    }

    //function to update order summary
    function updateOrderSummary() {
        tableBody.innerHTML = '';
        let totalOrderPrice = 0;

        cart.forEach((item, index) => {
            totalOrderPrice += item.totalPrice;

            //Determing if 'Quantity' should be shown in the table based on the section  
            const unitLabel = [ 'Analgesics', 'Antibiotics','Antidepressants', 'Antihistamines', 'Antihypertensives'].includes(item.section) ? 'Quantity' : '';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${Math.floor(item.amount)} ${unitLabel}</td>
                <td>${item.totalPrice.toFixed(2)}</td>
                <td><button class="removeItem" data-index="${index}">Remove</button></td>
            `;
            tableBody.appendChild(row);
        });

        totalPriceElement.innerText = totalOrderPrice.toFixed(2);
        attachRemoveEventListeners();
    }

    //Function to create a remove button on the order table
    function attachRemoveEventListeners() {
        document.querySelectorAll('.removeItem').forEach(button => {
            button.addEventListener('click', function () {
                const itemIndex = parseInt(this.dataset.index, 10);
                cart.splice(itemIndex, 1);
                updateOrderSummary();
            });
        });
    }

    //Function to save favorites to the local storage
    document.getElementById('saveFavorites').addEventListener('click', function () {
        const favoriteItems = cart.map(item => ({ ...item }));
        localStorage.setItem(favoritesKey, JSON.stringify(favoriteItems));
        alert('Favorites saved!');
    });

    //Function to apply favorites to the order table from the local storage
    document.getElementById('applyFavorites').addEventListener('click', function () {
        const savedFavorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
        savedFavorites.forEach(favoriteItem => {
            addItemToCart(favoriteItem.name, favoriteItem.amount, favoriteItem.totalPrice, favoriteItem.section);
        });
        updateOrderSummary();
        alert('Favorites applied!');
    });

    //After checking if the cart is empty. Redirecting the user to the purchase page to confirm their order
    document.getElementById('purchaseButton').addEventListener('click', function () {
        // Check if the cart is empty
        if (cart.length === 0) {
            // Prevent redirection
            alert('Your cart is empty. Please add items to the cart before proceeding to checkout.');
            return; 
        }
        localStorage.setItem('orderSummary', JSON.stringify(cart));
        localStorage.setItem('totalPrice', totalPriceElement.innerText + " LKR");  // Save the order summary and total price to localStorage
        window.location.href = 'purchase.html';   // Redirect to Purchase page
    });
});
