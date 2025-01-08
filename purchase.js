document.addEventListener('DOMContentLoaded', function () {
    const orderSummaryTableBody = document.querySelector('#orderSummaryTable tbody');
    const totalPriceElement = document.getElementById('totalPrice');
    
    // Loading the order summary from the local storage
    const orderSummary = JSON.parse(localStorage.getItem('orderSummary') || '[]');
    const totalPrice = localStorage.getItem('totalPrice') || '0';

    // Displaying the order summary
    orderSummary.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${Math.floor(item.amount)} ${item.section === 'Analgesics' || item.section === 'Antibiotics' ||  item.section === 'Antidepressants' ||  item.section === 'Antihistamines' || item.section === 'Antihypertensives' ? 'Quantity' : ''}</td>
            <td>${item.totalPrice.toFixed(2)}</td>
        `;
        orderSummaryTableBody.appendChild(row);
    });

    totalPriceElement.innerText = totalPrice;

    const personalDetailsSection = document.getElementById('personalDetails');
    const deliveryDetailsSection = document.getElementById('deliveryDetails');
    const paymentDetailsSection = document.getElementById('paymentDetails');

    const payButton = document.getElementById('payButton');

    payButton.addEventListener('click', function () {
        if (validatePaymentDetails()) {
            const name = document.getElementById('name').value.trim();
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 3); // Assuming delivery in 3 days

            // Display thank you message and delivery date
            alert(`Thank you for your purchase, ${name}! Your order will be delivered on ${deliveryDate.toDateString()}.`);
            localStorage.removeItem('orderSummary');
            localStorage.removeItem('totalPrice');
 
        } else {
            alert('Please fill in all the payment details.');
        }
    });

//Functiona to validate user details
    //Function to validate personal details
    function validatePersonalDetails() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();

        return name && email && phone;
    }

    //Function to validate delivery details
    function validateDeliveryDetails() {
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const postalCode = document.getElementById('postalCode').value.trim();

        return address && city && postalCode;
    }

    //Function to validate payment details
    function validatePaymentDetails() {
        const paymentMethod = document.getElementById('paymentMethod').value;
        const cardNumber = document.getElementById('cardNumber').value.trim();
        const expiryDate = document.getElementById('expiryDate').value.trim();
        const cvv = document.getElementById('cvv').value.trim();

        return paymentMethod && cardNumber && expiryDate && cvv;
    }
});
