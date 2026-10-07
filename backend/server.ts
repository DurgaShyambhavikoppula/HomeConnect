import express from "express";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "homeconnect-jwt-secret-key-12345678";
const DB_FILE = path.join(process.cwd(), "backend", "db.json");

// Define basic interface schemas for standard type-safety
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  type: "renter" | "owner" | "admin";
  approved: boolean; // owners need approval
}

interface Property {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerContact: string;
  propertyType: string; // e.g., Flat, House, Loft, PG
  propertyAdType: string; // e.g., For Rent, For Sale
  propertyAddress: string;
  propertyAmt: number;
  propertyImage: string;
  additionalInfo: string;
  furnishingStatus: string; // e.g., Furnished, Semi-Furnished, Unfurnished
  isAvailable: boolean;
}

interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  ownerId: string;
  userId: string;
  userName: string;
  phone: string;
  bookingStatus: "pending" | "confirmed" | "cancelled";
  bookingDate: string;
  visitDate?: string;
  message?: string;
}

// Low-level simple JSON-file Database wrapper
class LocalDB {
  private data: { users: User[]; properties: Property[]; bookings: Booking[] } = {
    users: [],
    properties: [],
    bookings: []
  };

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(fileContent);
      } else {
        this.seed();
      }
    } catch (e) {
      console.error("Failed to load local database, falling back to empty/seed:", e);
      this.seed();
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to write to local database file:", e);
    }
  }

  private seed() {
    // Initial standard users
    const defaultUsers: User[] = [
      {
        id: "usr_admin",
        name: "Admin HomeConnect",
        email: "admin@homeconnect.com",
        passwordHash: "admin123", // Keep it simple for local app
        phone: "+1 (555) 019-9000",
        type: "admin",
        approved: true
      },
      {
        id: "usr_renter",
        name: "John Doe",
        email: "renter@homeconnect.com",
        passwordHash: "renter123",
        phone: "+1 (555) 012-3456",
        type: "renter",
        approved: true
      },
      {
        id: "usr_owner1",
        name: "David Smith",
        email: "owner@homeconnect.com",
        passwordHash: "owner123",
        phone: "+1 (555) 098-7654",
        type: "owner",
        approved: true
      },
      {
        id: "usr_owner2",
        name: "Emma Watson",
        email: "owner2@homeconnect.com",
        passwordHash: "owner123",
        phone: "+1 (555) 044-8899",
        type: "owner",
        approved: false // Pending approval
      }
    ];

    const defaultProperties: Property[] = [
      {
        id: "prop_1",
        ownerId: "usr_owner1",
        ownerName: "David Smith",
        ownerContact: "+1 (555) 098-7654",
        propertyType: "Flat",
        propertyAdType: "For Rent",
        propertyAddress: "3 BHK Premium Flat, Indiranagar, Bangalore - 560038",
        propertyAmt: 25000,
        propertyImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60",
        furnishingStatus: "Furnished",
        additionalInfo: "Spacious BHK with modular kitchen, close to metro station. Includes backup power and 24/7 security.",
        isAvailable: true
      },
      {
        id: "prop_2",
        ownerId: "usr_owner1",
        ownerName: "David Smith",
        ownerContact: "+1 (555) 098-7654",
        propertyType: "House",
        propertyAdType: "For Rent",
        propertyAddress: "Villa Green Oasis, Koramangala, Bangalore - 560034",
        propertyAmt: 45000,
        propertyImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
        furnishingStatus: "Semi-Furnished",
        additionalInfo: "Independent duplex house with garden, private parking, and high-speed fiber internet ready.",
        isAvailable: true
      },
      {
        id: "prop_3",
        ownerId: "usr_owner1",
        ownerName: "David Smith",
        ownerContact: "+1 (555) 098-7654",
        propertyType: "Loft",
        propertyAdType: "For Rent",
        propertyAddress: "Modern Studio Loft, Whitefield, Bangalore - 560066",
        propertyAmt: 18000,
        propertyImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60",
        furnishingStatus: "Furnished",
        additionalInfo: "Chic studio flat designed for IT professionals. Minimalistic wooden theme, pet-friendly and well-lit.",
        isAvailable: true
      }
    ];

    const defaultBookings: Booking[] = [
      {
        id: "bkg_1",
        propertyId: "prop_1",
        propertyTitle: "3 BHK Premium Flat, Indiranagar",
        ownerId: "usr_owner1",
        userId: "usr_renter",
        userName: "John Doe",
        phone: "+1 (555) 012-3456",
        bookingStatus: "pending",
        bookingDate: "2026-06-29"
      }
    ];

    this.data = {
      users: defaultUsers,
      properties: defaultProperties,
      bookings: defaultBookings
    };
    this.save();
  }

  getUsers() { return this.data.users; }
  getProperties() { return this.data.properties; }
  getBookings() { return this.data.bookings; }

  addUser(user: User) {
    this.data.users.push(user);
    this.save();
  }

  updateUser(id: string, updates: Partial<User>) {
    this.data.users = this.data.users.map((u) => (u.id === id ? { ...u, ...updates } : u));
    this.save();
  }

  addProperty(property: Property) {
    this.data.properties.push(property);
    this.save();
  }

  updateProperty(id: string, updates: Partial<Property>) {
    this.data.properties = this.data.properties.map((p) => (p.id === id ? { ...p, ...updates } : p));
    this.save();
  }

  deleteProperty(id: string) {
    this.data.properties = this.data.properties.filter((p) => p.id !== id);
    this.save();
  }

  addBooking(booking: Booking) {
    this.data.bookings.push(booking);
    this.save();
  }

  updateBookingStatus(id: string, status: "pending" | "confirmed" | "cancelled") {
    this.data.bookings = this.data.bookings.map((b) => (b.id === id ? { ...b, bookingStatus: status } : b));
    this.save();
  }
}

const db = new LocalDB();

// Express JSON parsing middlewares
app.use(express.json());

// Express Logging and Simple Mock Auth Middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------

app.post("/api/auth/register", (req, res) => {
  const { name, email, password, type, phone } = req.body;

  if (!name || !email || !password || !type) {
    return res.status(400).json({ message: "Please fill in all required fields." });
  }

  const existingUser = db.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ message: "Email is already registered." });
  }

  const userId = "usr_" + Date.now().toString();
  const newUser: User = {
    id: userId,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    email,
    passwordHash: password, // Store as cleartext/simple hash for sandbox ease
    phone: phone || "",
    type: type as "renter" | "owner" | "admin",
    approved: type === "owner" ? false : true // owner needs admin approval, renter is approved instantly
  };

  db.addUser(newUser);

  res.status(201).json({
    message: type === "owner" 
      ? "Registration successful! Waiting for admin approval to post properties." 
      : "Registration successful!",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      type: newUser.type,
      approved: newUser.approved
    }
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = db.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  // Create token
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, type: user.type, approved: user.approved },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    message: "Login successful!",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      approved: user.approved
    }
  });
});

// ----------------------------------------------------
// PUBLIC / USER PROPERTIES ENDPOINTS
// ----------------------------------------------------

// Get all available properties
app.get("/api/properties", (req, res) => {
  const props = db.getProperties().filter((p) => p.isAvailable);
  res.json(props);
});

// Get detailed info of a single property
app.get("/api/properties/:id", (req, res) => {
  const property = db.getProperties().find((p) => p.id === req.params.id);
  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }
  res.json(property);
});

// ----------------------------------------------------
// BOOKINGS ENDPOINTS (TENANT ROLE)
// ----------------------------------------------------

// Create a booking
app.post("/api/bookings", authenticateToken, (req: any, res) => {
  const { propertyId, userName, phone, visitDate, message } = req.body;
  const userId = req.user.id;

  if (!propertyId || !userName || !phone) {
    return res.status(400).json({ message: "Please fill in all requested fields (Name, Phone Number)." });
  }

  const property = db.getProperties().find((p) => p.id === propertyId);
  if (!property) {
    return res.status(404).json({ message: "Property not found." });
  }

  const bookingId = "bkg_" + Date.now().toString();
  const newBooking: Booking = {
    id: bookingId,
    propertyId: property.id,
    propertyTitle: property.propertyAddress.split(",")[0], // Compact title
    ownerId: property.ownerId,
    userId: userId,
    userName: userName,
    phone: phone,
    bookingStatus: "pending",
    bookingDate: new Date().toISOString().split("T")[0],
    visitDate: visitDate || new Date().toISOString().split("T")[0],
    message: message || ""
  };

  db.addBooking(newBooking);

  res.status(201).json({
    message: "Booking requested! Status is pending owner confirmation.",
    booking: newBooking
  });
});

// Get logged-in tenant's bookings
app.get("/api/bookings", authenticateToken, (req: any, res) => {
  const userBookings = db.getBookings().filter((b) => b.userId === req.user.id);
  res.json(userBookings);
});

// ----------------------------------------------------
// OWNER ENDPOINTS
// ----------------------------------------------------

// Get owner's properties
app.get("/api/owner/properties", authenticateToken, (req: any, res) => {
  if (req.user.type !== "owner") {
    return res.status(403).json({ message: "Access denied. Owners only." });
  }

  const ownerProps = db.getProperties().filter((p) => p.ownerId === req.user.id);
  res.json(ownerProps);
});

// Add a new property
app.post("/api/owner/properties", authenticateToken, (req: any, res) => {
  if (req.user.type !== "owner") {
    return res.status(403).json({ message: "Access denied. Owners only." });
  }

  // Double check if the owner is approved
  const ownerRecord = db.getUsers().find((u) => u.id === req.user.id);
  if (!ownerRecord || !ownerRecord.approved) {
    return res.status(403).json({ message: "Your owner account is pending Admin approval. You cannot add properties yet." });
  }

  const { propertyType, propertyAdType, propertyAddress, propertyAmt, propertyImage, furnishingStatus, additionalInfo, ownerContact } = req.body;

  if (!propertyType || !propertyAdType || !propertyAddress || !propertyAmt || !ownerContact) {
    return res.status(400).json({ message: "Please fill in all required fields." });
  }

  const propId = "prop_" + Date.now().toString();
  const newProp: Property = {
    id: propId,
    ownerId: req.user.id,
    ownerName: req.user.name,
    ownerContact: ownerContact,
    propertyType,
    propertyAdType,
    propertyAddress,
    propertyAmt: Number(propertyAmt),
    propertyImage: propertyImage || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60",
    furnishingStatus: furnishingStatus || "Unfurnished",
    additionalInfo: additionalInfo || "",
    isAvailable: true
  };

  db.addProperty(newProp);

  res.status(201).json({
    message: "Property listed successfully!",
    property: newProp
  });
});

// Update an existing property
app.put("/api/owner/properties/:id", authenticateToken, (req: any, res) => {
  if (req.user.type !== "owner") {
    return res.status(403).json({ message: "Access denied. Owners only." });
  }

  const prop = db.getProperties().find((p) => p.id === req.params.id);
  if (!prop) return res.status(404).json({ message: "Property not found." });
  if (prop.ownerId !== req.user.id) return res.status(403).json({ message: "Unauthorized to update this property." });

  const allowed = ["propertyType", "propertyAdType", "propertyAddress", "propertyAmt", "propertyImage", "furnishingStatus", "additionalInfo", "ownerContact", "isAvailable"];
  const updates: any = {};
  for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];
  if (updates.propertyAmt !== undefined) updates.propertyAmt = Number(updates.propertyAmt);

  db.updateProperty(req.params.id, updates);
  res.json({ message: "Property updated successfully.", property: db.getProperties().find((p) => p.id === req.params.id) });
});

// Delete property
app.delete("/api/owner/properties/:id", authenticateToken, (req: any, res) => {
  if (req.user.type !== "owner") {
    return res.status(403).json({ message: "Access denied." });
  }

  const prop = db.getProperties().find((p) => p.id === req.params.id);
  if (!prop) {
    return res.status(404).json({ message: "Property not found." });
  }

  if (prop.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized to delete this property." });
  }

  db.deleteProperty(req.params.id);
  res.json({ message: "Property removed successfully." });
});

// Get bookings on owner's properties
app.get("/api/owner/bookings", authenticateToken, (req: any, res) => {
  if (req.user.type !== "owner") {
    return res.status(403).json({ message: "Access denied." });
  }

  const ownerBkg = db.getBookings().filter((b) => b.ownerId === req.user.id);
  res.json(ownerBkg);
});

// Update booking status (confirm / cancel)
app.put("/api/owner/bookings/:id", authenticateToken, (req: any, res) => {
  if (req.user.type !== "owner") {
    return res.status(403).json({ message: "Access denied." });
  }

  const { status } = req.body;
  if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  const booking = db.getBookings().find((b) => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }

  if (booking.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized to update this booking." });
  }

  db.updateBookingStatus(req.params.id, status);

  // If confirmed, make the property booked (or we can keep it available, let's keep it available but update status)
  if (status === "confirmed") {
    db.updateProperty(booking.propertyId, { isAvailable: false });
  } else if (status === "cancelled") {
    db.updateProperty(booking.propertyId, { isAvailable: true });
  }

  res.json({ message: `Booking ${status} successfully!` });
});

// ----------------------------------------------------
// ADMIN ENDPOINTS
// ----------------------------------------------------

// Get all users
app.get("/api/admin/users", authenticateToken, (req: any, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  res.json(db.getUsers());
});

// Approve owner
app.post("/api/admin/users/:id/approve", authenticateToken, (req: any, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  const targetUser = db.getUsers().find((u) => u.id === req.params.id);
  if (!targetUser) {
    return res.status(404).json({ message: "User not found." });
  }

  db.updateUser(req.params.id, { approved: true });
  res.json({ message: `User ${targetUser.name} approved as legitimate Owner.` });
});

// Get all bookings
app.get("/api/admin/bookings", authenticateToken, (req: any, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  res.json(db.getBookings());
});

// Get all properties
app.get("/api/admin/properties", authenticateToken, (req: any, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  res.json(db.getProperties());
});

// ----------------------------------------------------
// VITE DEV SERVER AND PRODUCTION INDEX HANDLING
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      configFile: path.join(process.cwd(), "frontend", "vite.config.ts"),
      root: process.cwd()
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
