require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();

app.use(cors({origin: process.env.CLIENT_URI,
        credentials: true,

}));

app.use(express.json());
app.use(cookieParser());



app.get("/api/health", (req, res) => {
    res.status(200).json({message: "Server is running"});
});

//Task REST API 
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);

//unknown endpoint
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
    });
});

//Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
startServer();