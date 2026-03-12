const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serving index.html at the root for local testing
app.use(express.static(__dirname));

const supabaseUrl = 'https://bajxgcoacycwmpxoqcwv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhanhnY29hY3ljd21weG9xY3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NTIyODIsImV4cCI6MjA4ODQyODI4Mn0.LRqikoZMKh7N0icbLWu0ZyECpa4FiBLYKoCJlXDQ4PM';
const supabase = createClient(supabaseUrl, supabaseKey);

// Route to serve HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Match the /api/submit path from the frontend
app.post('/api/submit', async (req, res) => {
    const { fullname, email, phone, subject } = req.body;

    const { data, error } = await supabase
        .from('contacts')
        .insert([{ 
            full_name: fullname, 
            email: email, 
            phone: phone, 
            subject: subject 
        }]);

    if (error) {
        console.error("Supabase Error:", error.message);
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'Success', data });
});

// This is required for Vercel
module.exports = app;

// Local testing port
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});