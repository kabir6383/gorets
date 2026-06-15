import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCWrjqU7ZqhBIiGuzOQ9755EJ2TsKZ5jMM",
  authDomain: "gorets-2cfda.firebaseapp.com",
  projectId: "gorets-2cfda",
  storageBucket: "gorets-2cfda.firebasestorage.app",
  messagingSenderId: "828605157406",
  appId: "1:828605157406:web:649687db1346f4b7845e0f",
  databaseURL: "https://gorets-2cfda-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const STATIC_MENU = [
  { id: 'm1',  name: 'FRENCH FRIES ( SALTED )',        category: 'CLASSIC APPETIZERS',       price: 129, image: 'https://media.dodostatic.com/image/r:520x520/019cc42473d779a08d1c544fb74bae39.jpg', tags: [] },
  { id: 'm2',  name: "FRENCH FRIES ( HOT'N'SPICY )",  category: 'CLASSIC APPETIZERS',       price: 139, image: 'https://media.dodostatic.com/image/r:520x520/019cc426b20a747cae42dee4f5338092.jpg', tags: [] },
  { id: 'm3',  name: 'GARLIC BREAD',                   category: 'CLASSIC APPETIZERS',       price: 169, image: 'https://media.dodostatic.com/image/r:520x520/019cc46e611e751f84ab08c4db0506a9.jpg', tags: [] },
  { id: 'm4',  name: 'LOADED FRIES WITH CHICKEN',      category: 'CLASSIC APPETIZERS',       price: 199, image: 'https://media.dodostatic.com/image/r:520x520/019cc4707c3772deb063dda9cfc3ef3e.jpg', tags: [] },
  { id: 'm5',  name: 'BRUSCHETTA',                     category: 'CLASSIC APPETIZERS',       price: 219, image: 'https://media.dodostatic.com/image/r:520x520/0193afe0630f72f0842e67e0c125fc3e.jpg', tags: [] },
  { id: 'm6',  name: 'CHICKEN CHEESE BALLS',           category: 'CLASSIC APPETIZERS',       price: 249, image: 'https://media.dodostatic.com/image/r:520x520/0196bfcd5a09736faae37eeb8b304249.jpg', tags: [] },
  { id: 'm7',  name: 'DYNAMITE CHICKEN',               category: 'CLASSIC APPETIZERS',       price: 249, image: 'https://media.dodostatic.com/image/r:520x520/0193b0f75c5d760397768977a198f7c8.jpg', tags: [] },
  { id: 'm8',  name: 'CHIZZA',                         category: 'CLASSIC APPETIZERS',       price: 259, image: 'https://media.dodostatic.com/image/r:520x520/0193b0d3f92e78c49b6ea991edadbe3c.jpg', tags: [] },
  { id: 'm11', name: 'CHICKEN POPCORN',                category: "NYC'S SPECIALS",           price: 199, image: 'https://media.dodostatic.com/image/r:520x520/019cc47aa3ba739dbe989e413e50e7bd.jpg', tags: [] },
  { id: 'm12', name: 'CHICKEN STRIPS',                 category: "NYC'S SPECIALS",           price: 239, image: 'https://media.dodostatic.com/image/r:520x520/019cc479f68174de92fb21c9b6b15e63.jpg', tags: [] },
  { id: 'm13', name: 'CRISPY CHICKEN WINGS',           category: "NYC'S SPECIALS",           price: 239, image: 'https://media.dodostatic.com/image/r:520x520/0193b11dc6297669ba6189c87ccd8622.jpg', tags: [] },
  { id: 'm14', name: 'CAJUN CHICKEN BURGER',           category: "NYC'S SPECIALS",           price: 269, image: 'https://media.dodostatic.com/image/r:520x520/0193b119dde6765f918d249fed19a7c7.jpg', tags: [] },
  { id: 'm20', name: 'CLASSIC MARGARITA',              category: 'VEGETARIAN PIZZA',         price: 249, image: 'https://media.dodostatic.com/image/r:520x520/0193b0fd0d5c7378bd87f6ad94f50e7c.jpg', tags: [] },
  { id: 'm21', name: 'FARM HOUSE PIZZA',               category: 'VEGETARIAN PIZZA',         price: 279, image: 'https://media.dodostatic.com/image/r:520x520/019cc6d2d4d5707ea91ee9210a53fdc5.jpg', tags: [] },
  { id: 'm22', name: 'PANEER TIKKA PIZZA',             category: 'VEGETARIAN PIZZA',         price: 299, image: 'https://media.dodostatic.com/image/r:520x520/0193b0fd0d5c7378bd87f6ad94f50e7c.jpg', tags: [] },
  { id: 'm24', name: 'PIZZA DI SIMPLY CHICKEN',        category: 'NON-VEGETARIAN PIZZA',     price: 299, image: 'https://media.dodostatic.com/image/r:520x520/0193b111ba8275c889ff596c980113b7.jpg', tags: [] },
  { id: 'm25', name: 'CHICKEN BBQ PIZZA',              category: 'NON-VEGETARIAN PIZZA',     price: 329, image: 'https://media.dodostatic.com/image/r:520x520/0193b111ba8275c889ff596c980113b7.jpg', tags: [] },
  { id: 'm31', name: 'CREAMY ALFREDO CHICKEN PIZZA',   category: "GORET'S SPECIAL PIZZA",   price: 379, image: 'https://media.dodostatic.com/image/r:520x520/019cc6d2d4d5707ea91ee9210a53fdc5.jpg', tags: [] },
  { id: 'm32', name: 'GORET SPECIAL COMBO PIZZA',      category: "GORET'S SPECIAL PIZZA",   price: 419, image: 'https://media.dodostatic.com/image/r:520x520/019cc6d2d4d5707ea91ee9210a53fdc5.jpg', tags: [] },
  { id: 'm40', name: 'VEG PASTA',                      category: 'PASTA',                    price: 199, image: 'https://media.dodostatic.com/image/r:520x520/0193afe0630f72f0842e67e0c125fc3e.jpg', tags: [] },
  { id: 'm41', name: 'CHICKEN PASTA',                  category: 'PASTA',                    price: 229, image: 'https://media.dodostatic.com/image/r:520x520/0193afe0630f72f0842e67e0c125fc3e.jpg', tags: [] },
  { id: 'm46', name: 'VEG BURGER',                     category: 'BURGER',                   price: 149, image: 'https://media.dodostatic.com/image/r:520x520/0193b1197a6979528c7ad74ca28452aa.jpg', tags: [] },
  { id: 'm48', name: 'SIMPLY CHICKEN BURGER',          category: 'BURGER',                   price: 169, image: 'https://media.dodostatic.com/image/r:520x520/0193b119dde6765f918d249fed19a7c7.jpg', tags: [] },
  { id: 'm50', name: 'SPICY DOUBLE PATTY BURGER',      category: 'BURGER',                   price: 199, image: 'https://media.dodostatic.com/image/r:520x520/0193b119dde6765f918d249fed19a7c7.jpg', tags: [] },
  { id: 'm55', name: 'VEG WRAP',                       category: 'WRAPS',                    price: 139, image: 'https://media.dodostatic.com/image/r:520x520/0193b1197a6979528c7ad74ca28452aa.jpg', tags: [] },
  { id: 'm56', name: 'CHICKEN WRAP',                   category: 'WRAPS',                    price: 159, image: 'https://media.dodostatic.com/image/r:520x520/0193b119dde6765f918d249fed19a7c7.jpg', tags: [] },
  { id: 'm60', name: 'WAFFLE SANDWICH',                category: 'WAFFLE SANDWICH',           price: 179, image: 'https://media.dodostatic.com/image/r:520x520/019cc717a06f77c6aa5ab057e427ac33.jpg', tags: [] },
  { id: 'm63', name: 'WAFFLE WITH ICE CREAM',          category: 'WAFFLE WITH ICE CREAM',    price: 199, image: 'https://media.dodostatic.com/image/r:520x520/019cc717a06f77c6aa5ab057e427ac33.jpg', tags: [] },
  { id: 'm66', name: 'COFFEE MILKSHAKE',               category: 'MILKSHAKES',               price: 149, image: 'https://media.dodostatic.com/image/r:520x520/019cc702b90f76b9b6f20ac6494fbc87.jpg', tags: [] },
  { id: 'm67', name: 'CHOCOLATE MILKSHAKE',            category: 'MILKSHAKES',               price: 149, image: 'https://media.dodostatic.com/image/r:520x520/019cc702b90f76b9b6f20ac6494fbc87.jpg', tags: [] },
  { id: 'm68', name: 'STRAWBERRY MILKSHAKE',           category: 'MILKSHAKES',               price: 149, image: 'https://media.dodostatic.com/image/r:520x520/019cc702b90f76b9b6f20ac6494fbc87.jpg', tags: [] },
  { id: 'm72', name: 'FUDGY BROWNIE',                  category: 'DESSERTS',                 price: 149, image: 'https://media.dodostatic.com/image/r:520x520/019cc717a06f77c6aa5ab057e427ac33.jpg', tags: [] },
  { id: 'm73', name: 'LAVA CAKE',                      category: 'DESSERTS',                 price: 169, image: 'https://media.dodostatic.com/image/r:520x520/019cc717a06f77c6aa5ab057e427ac33.jpg', tags: [] },
  { id: 'm80', name: 'CLASSIC SUNDAE',                 category: 'SUNDAE',                   price: 129, image: 'https://media.dodostatic.com/image/r:520x520/019cc702b90f76b9b6f20ac6494fbc87.jpg', tags: [] },
  { id: 'm85', name: 'ROSE FALOODA',                   category: 'FALOODA',                  price: 149, image: 'https://media.dodostatic.com/image/r:520x520/019cc736f1af790f8e381362297402eb.jpg', tags: [] },
  { id: 'm87', name: 'CLASSIC MINT',                   category: 'MOJITO',                   price: 119, image: 'https://media.dodostatic.com/image/r:520x520/019cc736f1af790f8e381362297402eb.jpg', tags: [] },
  { id: 'm88', name: 'LEMON MOJITO',                   category: 'MOJITO',                   price: 129, image: 'https://media.dodostatic.com/image/r:520x520/019cc736f1af790f8e381362297402eb.jpg', tags: [] },
  { id: 'm90', name: "GORET'S JIGARTHANDA",            category: "GORET'S JIGARTHANDA",     price: 149, image: 'https://media.dodostatic.com/image/r:520x520/019cc736f1af790f8e381362297402eb.jpg', tags: [] },
  { id: 'm94', name: 'FRESH LIME',                     category: 'FRESH JUICES',             price: 69,  image: 'https://media.dodostatic.com/image/r:520x520/019cc713b9e4789294f4d895281768e9.jpg', tags: [] },
  { id: 'm95', name: 'ORANGE JUICE',                   category: 'FRESH JUICES',             price: 79,  image: 'https://media.dodostatic.com/image/r:520x520/019cc713b9e4789294f4d895281768e9.jpg', tags: [] },
  { id: 'm96', name: 'WATERMELON JUICE',               category: 'FRESH JUICES',             price: 89,  image: 'https://media.dodostatic.com/image/r:520x520/019cc713b9e4789294f4d895281768e9.jpg', tags: [] },
  { id: 'm100', name: 'HOT CHOCOLATE',                 category: 'HOT CHOCOLATE',            price: 129, image: 'https://media.dodostatic.com/image/r:520x520/019cc702b90f76b9b6f20ac6494fbc87.jpg', tags: [] },
  { id: 'm104', name: 'MASALA CHAI',                   category: 'HOT BEVERAGES',            price: 49,  image: 'https://media.dodostatic.com/image/r:520x520/019cc702b90f76b9b6f20ac6494fbc87.jpg', tags: [] },
  { id: 'm105', name: 'FILTER COFFEE',                 category: 'HOT BEVERAGES',            price: 59,  image: 'https://media.dodostatic.com/image/r:520x520/019cc702b90f76b9b6f20ac6494fbc87.jpg', tags: [] },
];

async function seed() {
  console.log("Seeding menu items into Firestore...");
  for (const item of STATIC_MENU) {
    try {
      await set(ref(db, `menu/${item.id}`), item);
      console.log(`✅ Added ${item.name}`);
    } catch (e) {
      console.error(`❌ Failed ${item.name}: ${e.message}`);
    }
  }
  console.log("Seeding complete!");
  process.exit(0);
}

seed();
