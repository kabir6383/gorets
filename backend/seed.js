const mongoose = require('mongoose');
const Menu = require('./models/Menu');
const fs = require('fs');

const menuDataPath = 'C:\\Users\\muthu\\.gemini\\antigravity-ide\\brain\\574509db-c6a6-4d15-b71e-19d79cb1a098\\scratch\\menuData.json';

mongoose.connect('mongodb://127.0.0.1:27017/gorets')
.then(async () => {
  console.log('MongoDB connected for seeding');
  
  try {
    const menuData = JSON.parse(fs.readFileSync(menuDataPath, 'utf8'));
    
    await Menu.deleteMany({});
    console.log('Cleared existing menu data');
    
    await Menu.insertMany(menuData);
    console.log(`Successfully seeded ${menuData.length} menu items`);
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
})
.catch((err) => console.error('MongoDB connection error:', err));
