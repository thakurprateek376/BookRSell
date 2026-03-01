// Sample data for testing BookRsell
// Run this in MongoDB shell to add test data

// Sample Users
db.users.insertMany([
  {
    name: "Raj Kumar",
    email: "raj@example.com",
    password: "$2a$10$lZwQZN8ZR8XpZN8ZR8XpZN8ZR8XpZN8ZR8XpZN8ZR8XpZN8ZR8Xp2", // hashed "password123"
    city: "Delhi",
    phone: "9876543210",
    role: "seller",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Priya Singh",
    email: "priya@example.com",
    password: "$2a$10$lZwQZN8ZR8XpZN8ZR8XpZN8ZR8XpZN8ZR8XpZN8ZR8XpZN8ZR8Xp2", // hashed "password123"
    city: "Mumbai",
    phone: "9876543211",
    role: "seller",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Akshay Patel",
    email: "akshay@example.com",
    password: "$2a$10$lZwQZN8ZR8XpZN8ZR8XpZN8ZR8XpZN8ZR8XpZN8ZR8XpZN8ZR8Xp2", // hashed "password123"
    city: "Bangalore",
    phone: "9876543212",
    role: "buyer",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Neha Sharma",
    email: "neha@example.com",
    password: "$2a$10$lZwQZN8ZR8XpZN8ZR8XpZN8ZR8XpZN8ZR8XpZN8ZR8XpZN8ZR8Xp2", // hashed "password123"
    city: "Hyderabad",
    phone: "9876543213",
    role: "seller",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Sample Books
db.books.insertMany([
  {
    title: "Advanced Java Programming",
    author: "Herbert Schildt",
    price: 350,
    category: "Engineering",
    description: "Comprehensive guide to advanced Java concepts. Used once, in excellent condition. Includes all chapters and exercises.",
    condition: "Very Good",
    city: "Delhi",
    seller: ObjectId("user_id_1"), // Replace with actual user ID
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Data Structures and Algorithms",
    author: "Mark Allen Weiss",
    price: 400,
    category: "Engineering",
    description: "Essential resource for competitive programming. Pristine condition, no markings.",
    condition: "Like New",
    city: "Mumbai",
    seller: ObjectId("user_id_2"),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Biochemistry Essentials",
    author: "Jeremy M. Berg",
    price: 550,
    category: "Medical",
    description: "Medical student essential. Good condition, some highlighting on important sections.",
    condition: "Good",
    city: "Bangalore",
    seller: ObjectId("user_id_1"),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Python for Data Science",
    author: "Wes McKinney",
    price: 300,
    category: "Engineering",
    description: "Perfect for learning Python and data analysis. Used for one semester.",
    condition: "Good",
    city: "Delhi",
    seller: ObjectId("user_id_4"),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Database System Concepts",
    author: "Silberschatz, Korth",
    price: 450,
    category: "Engineering",
    description: "Standard textbook for database design. Fair condition, some wear and tear.",
    condition: "Fair",
    city: "Hyderabad",
    seller: ObjectId("user_id_3"),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Organic Chemistry",
    author: "Paula Bruice",
    price: 600,
    category: "Science",
    description: "Comprehensive organic chemistry guide. Excellent for competitive exams.",
    condition: "Very Good",
    city: "Mumbai",
    seller: ObjectId("user_id_2"),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "English Literature Classics",
    author: "Various Authors",
    price: 250,
    category: "Arts",
    description: "Collection of classic literature. Well-preserved copies.",
    condition: "Good",
    city: "Chennai",
    seller: ObjectId("user_id_4"),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Business Economics",
    author: "Pindyck & Rubinfeld",
    price: 500,
    category: "Commerce",
    description: "Commerce student guide. Latest edition with updated examples.",
    condition: "Very Good",
    city: "Kolkata",
    seller: ObjectId("user_id_1"),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

console.log("Sample data inserted successfully!");

// Note: The above password hashes are examples. To create real hashes:
// 1. In Node.js:
// const bcrypt = require('bcryptjs');
// bcrypt.hash('password123', 10).then(hash => console.log(hash));

// 2. Or register users through the API interface instead
