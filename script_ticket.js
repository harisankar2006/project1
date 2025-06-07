let busNumber = localStorage.getItem('busNumber');
let upiID = localStorage.getItem('upiID');
let boardPoints = JSON.parse(localStorage.getItem('boardPoints'));
let fixedAmounts = JSON.parse(localStorage.getItem('fixedAmounts'));

const boardPointsDiv = document.getElementById('boardPoints');
const ticketArea = document.getElementById('ticketArea');
const qrArea = document.getElementById('qrArea');
const paymentConfirm = document.getElementById('paymentConfirm');
const dataBody = document.getElementById('dataBody');
const totalAmountDisplay = document.getElementById('totalAmount');

let selectedBoardPoint = '';
let selectedAmount = 0;
let numberOfTickets = 0;
let totalAmountToday = 0;

function showBoardPoints() {
    boardPoints.forEach((point, index) => {
        const btn = document.createElement('button');
        btn.innerText = `${point} ₹${fixedAmounts[index]}`;
        btn.className = 'bubble-button';
        btn.onclick = () => selectBoardPoint(point, fixedAmounts[index]);
        boardPointsDiv.appendChild(btn);
    });
}

function selectBoardPoint(point, amount) {
    selectedBoardPoint = point;
    selectedAmount = amount;
    document.getElementById('selectedPoint').innerText = `Board Point: ${point}`;
    boardPointsDiv.style.display = 'none';
    ticketArea.style.display = 'block';
}

function proceedToPayment() {
    numberOfTickets = parseInt(document.getElementById('ticketCount').value);
    if (isNaN(numberOfTickets) || numberOfTickets <= 0) {
        alert('Please enter valid ticket number');
        return;
    }
    const totalAmount = selectedAmount * numberOfTickets;
    const upiUrl = `upi://pay?pa=${upiID}&pn=BusTicket&am=${totalAmount}&cu=INR`;

    ticketArea.style.display = 'none';
    qrArea.style.display = 'block';

    // Generate QR Code
    QRCode.toCanvas(document.getElementById('qrcode'), upiUrl, function (error) {
        if (error) console.error(error);
    });

    // Show Payment Status after 15 seconds
    setTimeout(() => {
        qrArea.style.display = 'none';
        paymentConfirm.style.display = 'block';
    }, 15000);
}

function paymentDone() {
    const now = new Date();
    const paidAmount = selectedAmount * numberOfTickets;
    const newRow = `
        <tr>
            <td>${selectedBoardPoint}</td>
            <td>${numberOfTickets}</td>
            <td>₹${paidAmount}</td>
            <td>${now.toLocaleString()}</td>
        </tr>
    `;
    dataBody.innerHTML += newRow;
    totalAmountToday += paidAmount;
    totalAmountDisplay.innerText = `Total: ₹${totalAmountToday}`;

    resetForNext();
}

function paymentNotDone() {
    resetForNext();
}

function resetForNext() {
    paymentConfirm.style.display = 'none';
    boardPointsDiv.style.display = 'block';
    document.getElementById('ticketCount').value = '';
}

showBoardPoints();
