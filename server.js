const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// 1. Better CORS settings to allow local testing
app.use(cors({
    origin: '*', // Allows requests from any origin (ideal for development)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());
app.use(express.static(__dirname));

// 2. Configuration
const supabaseUrl = 'https://wtddbmwzgcarlxptzjnh.supabase.co';
const supabaseKey = 'sb_publishable_35PMd2WhFECASfB0ekZCNg_72KhhRb9';
const supabase = createClient(supabaseUrl, supabaseKey);

// 3. Route to serve the HTML frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 4. The submission endpoint
app.post('/api/submit', async (req, res) => {
    const { fullname, email, phone, subject } = req.body;

    // Basic Validation
    if (!fullname || !email) {
        return res.status(400).json({ error: 'Full Name and Email are required' });
    }

    try {
        // MATCHES SQL: Insert into 'fullname' column (no underscore)
        const { data, error } = await supabase
            .from('contacts')
            .insert([
                { 
                    fullname: fullname, 
                    email: email, 
                    phone: phone || null, 
                    subject: subject || 'No Subject' 
                }
            ])
            .select();

        if (error) {
            console.error("Supabase Error:", error.message);
            return res.status(500).json({ error: error.message });
        }

        console.log("Success! Data saved to Supabase:", data);
        return res.status(200).json({ message: 'Success', data });

    } catch (err) {
        console.error("Server Error:", err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Required for Vercel deployment
module.exports = app;

// 5. Local server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running! View your form at: http://localhost:${PORT}`);
});
