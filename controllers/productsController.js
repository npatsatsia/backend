const { client } = require('../config/dbConnection')
// const { v4: uuidv4 } = require('uuid');

const db = client.db('newEcommPrj');
const productsData = db.collection('products');

const getProducts = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const search = req.query.search;

    if (!Number.isInteger(page) || page <= 0) {
        return res.status(400).json({ error: 'Invalid page number' });
    }
    if (!Number.isInteger(limit) || limit <= 0) {
        return res.status(400).json({ error: 'Invalid limit' });
    }

    const skipIndex = (page - 1) * limit;
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    const category = typeof req.query.category === 'string' ? req.query.category : null;
    const color = typeof req.query.color === 'string' ? req.query.color : null;
    const collection = typeof req.query.collection === 'string' ? req.query.collection : null;
    const size = typeof req.query.size === 'string' ? req.query.size : null;

    const query = {};
    try {
        await client.connect();

        if (!isNaN(minPrice) && minPrice >= 0) query.price = { $gte: minPrice };
        if (!isNaN(maxPrice) && maxPrice >= 0) {
            if (query.price) query.price.$lte = maxPrice;
            else query.price = { $lte: maxPrice };
        }
        if (category) query.category = category;
        if (color) query.color = color;
        if (collection) query.collection = collection;
        if (size) query.size = size;
        if (search) {
            query.$or = [
                { productName: { $regex: search, $options: 'i' } },
                { SKU: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $elemMatch: { $regex: search, $options: 'i' } } }
            ];
        }

        const totalProducts = await productsData.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await productsData
            .find(query)
            .sort({ _id: 1 })
            .skip(skipIndex)
            .limit(limit)
            .toArray()

        if(products.length === 0) {
            return res.status(204).json();
        }
        
        res.json({ totalPages, products });
    } catch (error) {
        console.error('Error fetching Products:', error);
        if (error.name === 'MongoNetworkError') {
            return res.status(503).json({ error: 'Service Unavailable' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
};

const handleSuggestProducts = async (req, res) => {
    const search = req.query.search;
    const limit = 7;

    if (!search) {
        return res.status(400).json({ error: 'No search term provided' });
    }

    const query = {
        $or: [
            { SKU: { $regex: search, $options: 'i' } },
            { productName: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $elemMatch: { $regex: search, $options: 'i' } } }
        ]
    };

    try {
        await client.connect();
        const products = await productsData
            .find(query)
            .limit(limit)
            .toArray()

        if(products.length === 0) {
            return res.status(204).json();
        }
        
        res.json(products);
    } catch (error) {
        console.error('Error fetching Product Suggestions:', error);
        if (error.name === 'MongoNetworkError') {
            return res.status(503).json({ error: 'Service Unavailable' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
}


// const postProducts = async (req, res) => {
//     function generateSKU(productName, productCategory) {
//         const prefix = productName.split(' ').slice(0, 3).map(word => word.substring(0, 2).toUpperCase()).join('') + productCategory.substring(0, 2).toUpperCase();
//         const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//         return `${prefix}-${randomNumber}`;
//     }
    
//     let sum = 0;
    
//     try {
//         await client.connect();

//         for (const product of products) {
//             const id = uuidv4();
//             const sku = generateSKU(product.productName, product.category);
//             const updateProduct = { ...product, "_id": id, "SKU": sku };

//             await productsData.insertOne(updateProduct);
//             sum += 1;
//         }
//         res.json(`Added ${sum} Products`);
//     } catch (error) {
//         console.error('Error inserting products:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

module.exports = { getProducts, handleSuggestProducts }