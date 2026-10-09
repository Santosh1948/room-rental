const express = require('express');

const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("../src/routes/property.routes");
const roomRoutes = require("../src/routes/room.routes");
const rentalRequestRoutes = require("../src/routes/rentalRequest.routes");
const bookingRoutes = require("../src/routes/booking.router");
const paymentRoutes = require("./routes/payment.routes");
const reviewRoutes = require("./routes/review.routers");
const favoriteRoutes = require("./routes/favorite.routes");
const notificationRoutes = require("./routes/notification.routes");
const adminRoutes = require("./routes/admin.routes");
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/properties" , propertyRoutes);
app.use("/api/rooms",roomRoutes);
app.use("/api/rental-requests", rentalRequestRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);




app.get('/', (req, res) => {
  res.send('Hello World!');
});


module.exports = app;