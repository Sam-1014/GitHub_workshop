import express from "express";
import cors from "cors";
import { supabase } from "./supabase";

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// TEMPORARY OTP STORAGE
// ===============================

type OTPData = {
    otp: string;
    expiresAt: number;
};

const otpStore = new Map<string, OTPData>();

// ===============================
// HOME ROUTE
// ===============================

app.get("/", (_req, res) => {
    res.json({
        message: "Pandora Backend API is running successfully 🚀"
    });
});

// ===============================
// GET ALL USERS
// ===============================

app.get("/api/users", async (_req, res) => {
    const { data, error } = await supabase
        .from("users")
        .select("*");

    console.log("GET /api/users");
    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
});

// ===============================
// GET USER BY ID
// ===============================

app.get("/api/users/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            error: "Invalid user ID"
        });
    }

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

    console.log(`GET /api/users/${id}`);
    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
        return res.status(404).json({
            error: "User not found"
        });
    }

    res.json(data);
});

// ===============================
// POST USER
// ===============================

app.post("/api/users", async (req, res) => {
    const { full_name, email, role } = req.body;

    if (!full_name || !email || !role) {
        return res.status(400).json({
            error: "full_name, email and role are required"
        });
    }

    const { data, error } = await supabase
        .from("users")
        .insert([
            {
                full_name,
                email,
                role
            }
        ])
        .select()
        .single();

    console.log("POST /api/users");
    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.status(201).json(data);
});

// ===============================
// UPDATE USER
// ===============================

app.put("/api/users/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { full_name, email, role } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({
            error: "Invalid user ID"
        });
    }

    if (!full_name || !email || !role) {
        return res.status(400).json({
            error: "full_name, email and role are required"
        });
    }

    const { data, error } = await supabase
        .from("users")
        .update({
            full_name,
            email,
            role
        })
        .eq("id", id)
        .select()
        .single();

    console.log(`PUT /api/users/${id}`);
    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
        return res.status(404).json({
            error: "User not found"
        });
    }

    res.json(data);
});

// =====================================================
// PANDORA AUTH — REQUEST OTP
// =====================================================

app.post("/api/auth/request-otp", async (req, res) => {
    const { full_name, email, password } = req.body;

    // -------------------------------
    // Validate input
    // -------------------------------

    if (!full_name || !email || !password) {
        return res.status(400).json({
            success: false,
            error: "Full name, email and password are required."
        });
    }

    // -------------------------------
    // Check SRM email
    // -------------------------------

    if (!email.toLowerCase().endsWith("@srmist.edu.in")) {
        return res.status(400).json({
            success: false,
            error: "Only SRMIST email addresses are allowed."
        });
    }

    // -------------------------------
    // Generate 6-digit OTP
    // -------------------------------

    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    // OTP valid for 5 minutes

    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(email.toLowerCase(), {
        otp,
        expiresAt
    });

    console.log("--------------------------------");
    console.log("PANDORA OTP GENERATED");
    console.log("Email:", email);
    console.log("OTP:", otp);
    console.log("--------------------------------");

    // -------------------------------
    // DEMO RESPONSE
    // -------------------------------
    // Later we will replace this with
    // real email sending.

    res.json({
        success: true,
        message: "OTP generated successfully.",
        demoOtp: otp
    });
});

// =====================================================
// PANDORA AUTH — VERIFY OTP
// =====================================================

app.post("/api/auth/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    // -------------------------------
    // Validate input
    // -------------------------------

    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            error: "Email and OTP are required."
        });
    }

    const normalizedEmail = email.toLowerCase();

    // -------------------------------
    // Find stored OTP
    // -------------------------------

    const storedData = otpStore.get(normalizedEmail);

    if (!storedData) {
        return res.status(400).json({
            success: false,
            error: "OTP not found. Please request a new OTP."
        });
    }

    // -------------------------------
    // Check expiration
    // -------------------------------

    if (Date.now() > storedData.expiresAt) {

        otpStore.delete(normalizedEmail);

        return res.status(400).json({
            success: false,
            error: "OTP has expired. Please request a new OTP."
        });
    }

    // -------------------------------
    // Check OTP
    // -------------------------------

    if (otp !== storedData.otp) {
        return res.status(400).json({
            success: false,
            error: "Invalid OTP."
        });
    }

    // -------------------------------
    // OTP SUCCESS
    // -------------------------------

    otpStore.delete(normalizedEmail);

    console.log("--------------------------------");
    console.log("EMAIL VERIFIED");
    console.log("Email:", normalizedEmail);
    console.log("--------------------------------");

    res.json({
        success: true,
        message: "Email verified successfully."
    });
});

// ===============================
// SERVER
// ===============================

const PORT = Number(process.env.PORT) || 3000;

// =====================================================
// TEAM FORMATION — CREATE TEAM
// =====================================================

app.post("/api/teams", async (req, res) => {
    const {
        team_name,
        team_leader_email,
        member_2_email,
        member_3_email,
        member_4_email
    } = req.body;

    // -------------------------------
    // Validate team name
    // -------------------------------

    if (!team_name || !team_name.trim()) {
        return res.status(400).json({
            success: false,
            error: "Team name is required."
        });
    }

    // -------------------------------
    // Validate team leader
    // -------------------------------

    if (!team_leader_email || !team_leader_email.trim()) {
        return res.status(400).json({
            success: false,
            error: "Team leader email is required."
        });
    }

    // -------------------------------
    // Create team
    // -------------------------------

    const { data, error } = await supabase
        .from("teams")
        .insert([
            {
                team_name: team_name.trim(),
                team_leader_email: team_leader_email.trim().toLowerCase(),
                member_2_email: member_2_email
                    ? member_2_email.trim().toLowerCase()
                    : null,
                member_3_email: member_3_email
                    ? member_3_email.trim().toLowerCase()
                    : null,
                member_4_email: member_4_email
                    ? member_4_email.trim().toLowerCase()
                    : null
            }
        ])
        .select()
        .single();

    console.log("--------------------------------");
    console.log("TEAM CREATED");
    console.log("TEAM:", data);
    console.log("ERROR:", error);
    console.log("--------------------------------");

    if (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }

    res.status(201).json({
        success: true,
        message: "Team created successfully.",
        team: data
    });
});

// =====================================================
// GET TEAM BY ID
// =====================================================

app.get("/api/teams/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: "Invalid team ID."
        });
    }

    const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return res.status(404).json({
            success: false,
            error: "Team not found."
        });
    }

    res.json({
        success: true,
        team: data
    });
});

app.listen(PORT, () => {
    console.log("--------------------------------");
    console.log(`Pandora Backend running at`);
    console.log(`http://localhost:${PORT}`);
    console.log("--------------------------------");
});