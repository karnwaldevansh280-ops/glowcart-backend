const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Replace YOUR_PASSWORD with devanshweb03
const dbURI = "mongodb+srv://devanshwebdev:devanshweb03@cluster0.9cdgyoa.mongodb.net/glowcartDB?retryWrites=true&w=majority";

mongoose.connect(dbURI)
    .then(() => console.log("✅ Cloud Database Connected!"))
    .catch(err => console.log("❌ DB Error:", err));

const Product = mongoose.model('Product', new mongoose.Schema({
    brand: String, name: String, price: Number, rating: String, reviews: Number, category: String, image: String
}));

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// Use Render's port or 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server live on port ${PORT}`));