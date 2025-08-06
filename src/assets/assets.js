import { IoLogoDesignernews } from "react-icons/io";

export const Populer_Categories = [
    { title: "Logo Design", icon: "Logo" },
    { title: "Web Development", icon: "code" },
    { title: "Content Writing", icon: "edit_note" },
    { title: "Video Editing", icon: "videocam" },
    { title: "Digital Marketing", icon: "trending_up" },
    { title: "UI/UX Design", icon: "brush" }
]


export const Data = [
    {
        title: "Professional Logo Design",
        price: "$120",
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
    },
    {
        title: "Responsive Website Development",
        price: "$350",
        rating: "4.8",
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
    },
    {
        title: "SEO Optimization Package",
        price: "$200",
        rating: "4.7",
        image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
    },
    {
        title: "Social Media Management",
        price: "$250",
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
    }
]

export const gigs = [
  {
    id: 101,
    title: "I will design a professional logo",
    image: "/images/gig1.jpg",
    price: 49,
    rating: 4.9,
    reviews: 120,
    seller: {
      id: 1,
      name: "DesignPro",
      avatar: "/avatars/user1.png",
      level: "Level 2",
    },
    category: "Logo Design",
  },
  {
    id: 102,
    title: "I will build a modern website using React",
    image: "/images/gig2.jpg",
    price: 150,
    rating: 4.8,
    reviews: 87,
    seller: {
      id: 2,
      name: "CodeMaster",
      avatar: "/avatars/user2.png",
      level: "Top Rated",
    },
    category: "Web Development",
  },
  {
    id: 103,
    title: "I will write SEO-friendly blog posts",
    image: "/images/gig3.jpg",
    price: 25,
    rating: 5.0,
    reviews: 200,
    seller: {
      id: 3,
      name: "WriteWell",
      avatar: "/avatars/user3.png",
      level: "Level 1",
    },
    category: "Content Writing",
  },
];

// 🟨 Gig Details (can fetch by id)
export const gigDetails = {
  101: {
    description: "A custom logo that represents your brand identity.",
    packages: [
      { tier: "Basic", price: 29, includes: "1 Logo concept" },
      { tier: "Standard", price: 49, includes: "2 Logo concepts + revisions" },
      { tier: "Premium", price: 79, includes: "3 concepts + source files" },
    ],
    faq: [
      { question: "What do you need to get started?", answer: "Brand name, slogan, and any references." },
      { question: "How long will it take?", answer: "Usually 2-3 days." },
    ],
  },
  // Add gigDetails[102], etc. as needed
};

// 🟥 Seller Dashboard - Gigs & Orders
export const myGigs = [
  { id: 101, title: "Professional Logo Design", status: "Active" },
  { id: 104, title: "Instagram Post Design", status: "Pending" },
];

export const myOrders = [
  {
    id: "ORD-7890",
    gigTitle: "Blog Article Writing",
    status: "Delivered",
    buyer: "ClientA",
    price: 30,
  },
  {
    id: "ORD-7891",
    gigTitle: "SEO Optimization",
    status: "In Progress",
    buyer: "StartupX",
    price: 50,
  },
];

// 🟧 Login/Register Dummy (for UI form testing)
export const users = [
  { email: "user@example.com", password: "password123", role: "buyer" },
  { email: "freelancer@example.com", password: "freelance456", role: "seller" },
];