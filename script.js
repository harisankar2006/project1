let boardPoints = []; // To store boarding points and amounts
let userUpiId = "";    // To store entered UPI ID

function createBoardPointInputs() {
    userUpiId = document.getElementById('upiId').value.trim();
    const boardPointCount = parseInt(document.getElementById('boardPointCount').value);

    if (!userUpiId || boardPointCount <= 0) {
        alert('Please enter a valid UPI ID and number of boarding points.');
        return;
    }

    boardPoints = [];

    // Get boarding point names and amounts one by one
    for (let i = 0; i < boardPointCount; i++) {
        const name = prompt(`Enter name for Board Point ${i + 1}`);
        const amount = prompt(`Enter fixed amount for ${name}`);

        if (!name || !amount || isNaN(amount)) {
            alert('Invalid input. Please enter correct name and amount.');
            return;
        }

        boardPoints.push({ name, amount: parseInt(amount) });
    }

    // Now populate select options
    const select = document.getElementById('boardingPoint');
    select.innerHTML = "";

    boardPoints.forEach((bp, index) => {
        const option = document.createElement('option');
        option.value = index; // save index for easy access
        option.textContent = `${bp.name} (₹${bp.amount})`;
        select.appendChild(option);
    });

    // Show after save section
    document.getElementById('afterSaveSection').style.display = 'block';

    // Hide initial form area
    document.getElementById('form-area').style.display = 'none';
}

function clearForm() {
    document.getElementById('boardingPoint').selectedIndex = 0;
    document.getElementById('ticketCount').value = 1;
    document.getElementById('qrcode').innerHTML = "";
}

function generateQRCode() {
    const selectedIndex = parseInt(document.getElementById('boardingPoint').value);
    const ticketCount = parseInt(document.getElementById('ticketCount').value);

    if (isNaN(selectedIndex) || selectedIndex < 0 || !ticketCount || ticketCount <= 0) {
        alert('Please select a boarding point and enter number of tickets.');
        return;
    }

    const selectedBoardPoint = boardPoints[selectedIndex];
    const totalAmount = selectedBoardPoint.amount * ticketCount;

    const upiUrl = `upi://pay?pa=${userUpiId}&pn=BusTicket&am=${totalAmount}&cu=INR&tn=Boarding:${selectedBoardPoint.name}`;

    // Clear previous QR
    document.getElementById('qrcode').innerHTML = "";

    // Create QR
    new QRCode(document.getElementById('qrcode'), {
        text: upiUrl,
        width: 250,
        height: 250
    });

    // Show amount info
    const amountText = document.createElement('h3');
    amountText.innerText = `Total Payable Amount: ₹${totalAmount}`;
    document.getElementById('qrcode').appendChild(amountText);
}
