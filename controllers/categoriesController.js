const { client } = require('../config/dbConnection')

const db = client.db('newEcommPrj');
const categories = db.collection('categories');

const getCategories = async (req, res, next) => {
    try {
        await client.connect();
        const categoriesList = await categories.find().toArray();
        if (!categoriesList.length) {
            throw new Error('No categories found');
        }
        res.json(categoriesList);
    } catch (error) {
        console.error(error);
        next(error);
    } finally {
        await client.close();
    }
}


module.exports = { getCategories }