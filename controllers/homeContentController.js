const homeContent = require('../homeContent.json')

const getHomeContents = async (req, res) => {
    try {
        res.json(homeContent);
    } catch (error) {
        console.error('Error fetching collections:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {getHomeContents}