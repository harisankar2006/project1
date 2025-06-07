const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Serve static frontend (optional)
app.use(express.static('public')); // <-- place index.html here if needed

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/paymentDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Define payment schema
const paymentSchema = new mongoose.Schema({
    date: String,
    boardingPoint: String,
    numberOfTickets: Number,
    amount: Number
});

// Create payment model
const Payment = mongoose.model('Payment', paymentSchema);

// API endpoint to save payment details
app.post('/savePayment', (req, res) => {
    const paymentDetails = req.body;
    const newPayment = new Payment(paymentDetails);
    newPayment.save()
        .then(() => res.send('Payment saved successfully'))
        .catch(err => {
            console.error('Save error:', err);
            res.status(500).send('Error saving payment');
        });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
