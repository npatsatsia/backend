const { client } = require('../config/dbConnection')
const homeContent = require('../homeContent.json')
const products = require("../products.json")
const { v4: uuidv4 } = require('uuid');

const db = client.db('newEcommPrj');
const productsData = db.collection('products');

const getProducts = async (req, res) => {
    try {
        await client.connect();

        const data = await productsData.find({}).toArray()
        
        res.json(data);
    } catch (error) {
        console.error('Error fetching Products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const postProducts = async (req, res) => {
    function generateSKU(productName, productCategory) {
        const prefix = productName.split(' ').slice(0, 3).map(word => word.substring(0, 2).toUpperCase()).join('') + productCategory.substring(0, 2).toUpperCase();
        const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${prefix}-${randomNumber}`;
    }
    
    let sum = 0;
    
    try {
        await client.connect();

        for (const product of products) {
            const id = uuidv4();
            const sku = generateSKU(product.productName, product.category);
            const updateProduct = { ...product, "_id": id, "SKU": sku };

            await productsData.insertOne(updateProduct);
            sum += 1;
        }
        res.json(`Added ${sum} Products`);
    } catch (error) {
        console.error('Error inserting products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getProducts, postProducts }