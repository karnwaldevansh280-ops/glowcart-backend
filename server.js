const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbURI = "mongodb+srv://devanshwebdev:devanshweb03@cluster0.9cdgyoa.mongodb.net/glowcartDB?retryWrites=true&w=majority";

mongoose.connect(dbURI)
    .then(() => console.log("✅ Cloud Database Connected!"))
    .catch(err => {
        console.log("❌ DB Connection Failed!");
        console.log(err);
    });

const Product = mongoose.model('Product', new mongoose.Schema({
    brand: String, 
    name: String, 
    price: Number, 
    rating: String, 
    reviews: Number, 
    category: String, 
    image: String
}));

// --- UPDATED ROUTE WITH FILTERING ---
app.get('/api/products', async (req, res) => {
    try {
        let query = {};

        // 1. Search Logic (Looks in Name or Brand)
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { brand: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // 2. Category Filter (Exact match)
        if (req.query.category) {
            query.category = req.query.category;
        }

        // 3. Price Filter (Less than or equal to)
        if (req.query.maxPrice) {
            query.price = { $lte: parseInt(req.query.maxPrice) };
        }

        // 4. Price Range Filter (Min and Max)
        if (req.query.minPrice && req.query.maxPrice) {
            query.price = { 
                $gte: parseInt(req.query.minPrice), 
                $lte: parseInt(req.query.maxPrice) 
            };
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Server Error", details: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server live on port ${PORT}`));
