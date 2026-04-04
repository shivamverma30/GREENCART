import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const seedProducts = [
  {
    name: "Fresh Tomato 1kg",
    description: ["Farm fresh", "Great for salads and curries"],
    price: 60,
    offerPrice: 49,
    image: ["https://images.unsplash.com/photo-1546470427-e212b30d8e9b?auto=format&fit=crop&w=800&q=80"],
    category: "Vegetables",
    inStock: true,
  },
  {
    name: "Potato 1kg",
    description: ["Daily essential", "Naturally grown"],
    price: 45,
    offerPrice: 35,
    image: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80"],
    category: "Vegetables",
    inStock: true,
  },
  {
    name: "Banana 1 Dozen",
    description: ["Naturally sweet", "Rich in potassium"],
    price: 80,
    offerPrice: 69,
    image: ["https://images.unsplash.com/photo-1574226516831-e1dff420e37f?auto=format&fit=crop&w=800&q=80"],
    category: "Fruits",
    inStock: true,
  },
  {
    name: "Apple 1kg",
    description: ["Crisp texture", "Imported quality"],
    price: 180,
    offerPrice: 149,
    image: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80"],
    category: "Fruits",
    inStock: true,
  },
  {
    name: "Whole Milk 1L",
    description: ["Rich and creamy", "Daily fresh supply"],
    price: 75,
    offerPrice: 65,
    image: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80"],
    category: "Dairy",
    inStock: true,
  },
  {
    name: "Brown Bread",
    description: ["Soft slices", "Perfect for breakfast"],
    price: 55,
    offerPrice: 45,
    image: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"],
    category: "Bakery",
    inStock: true,
  },
  {
    name: "Instant Noodles Pack",
    description: ["Quick meal", "Popular flavor"],
    price: 30,
    offerPrice: 25,
    image: ["https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80"],
    category: "Instant",
    inStock: true,
  },
  {
    name: "Basmati Rice 1kg",
    description: ["Premium grain", "Long and aromatic"],
    price: 160,
    offerPrice: 139,
    image: ["https://images.unsplash.com/photo-1586201375761-83865001e17b?auto=format&fit=crop&w=800&q=80"],
    category: "Grains",
    inStock: true,
  },
];

const run = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing in environment variables");
    }

    await mongoose.connect(`${mongoUri}/greencart`);

    const count = await Product.countDocuments();
    if (count > 0) {
      console.log(`Seed skipped: ${count} products already exist.`);
      process.exit(0);
    }

    await Product.insertMany(seedProducts);
    console.log(`Seed complete: inserted ${seedProducts.length} products.`);
    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exit(1);
  }
};

run();
