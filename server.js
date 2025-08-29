// server.js
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());


const USER_DETAILS = {
    full_name: "Tridib_Chatterjee", 
    dob: "16032003", 
    email: "tridibstudy@gmail.com", 
    roll_number: "22BCE5142" 
};

// Helper function to check if a string represents a number
function isNumeric(str) {
    return /^\d+$/.test(str);
}

// Helper function to check if a string contains only alphabets
function isAlphabetic(str) {
    return /^[a-zA-Z]+$/.test(str);
}

// Helper function to check for special characters
function isSpecialCharacter(str) {
    // Single character that is not alphanumeric
    return str.length === 1 && /[^a-zA-Z0-9]/.test(str);
}

// Helper function to create alternating caps
function alternatingCaps(str) {
    let result = '';
    let capNext = false; // Start with lowercase
    
    for (let i = 0; i < str.length; i++) {
        if (capNext) {
            result += str[i].toUpperCase();
        } else {
            result += str[i].toLowerCase();
        }
        capNext = !capNext;
    }
    
    return result;
}

// Main processing function
function processArray(data) {
    const oddNumbers = [];
    const evenNumbers = [];
    const alphabets = [];
    const specialCharacters = [];
    let sum = 0;
    let allAlphabetChars = '';
    
    // Process each element in the array
    for (const item of data) {
        if (typeof item !== 'string') {
            continue; // Skip non-string items
        }
        
        // Check if it's a number
        if (isNumeric(item)) {
            const num = parseInt(item, 10);
            sum += num;
            
            if (num % 2 === 0) {
                evenNumbers.push(item);
            } else {
                oddNumbers.push(item);
            }
        }
        // Check if it's alphabetic (single or multiple characters)
        else if (isAlphabetic(item)) {
            alphabets.push(item.toUpperCase());
            allAlphabetChars += item;
        }
        // Check if it's a special character
        else if (isSpecialCharacter(item)) {
            specialCharacters.push(item);
        }
        // Handle mixed content (like "ABcD" in example)
        else {
            // Extract only alphabetic characters
            const alphaOnly = item.replace(/[^a-zA-Z]/g, '');
            if (alphaOnly) {
                alphabets.push(alphaOnly.toUpperCase());
                allAlphabetChars += alphaOnly;
            }
            
            // Check for special characters in the string
            for (const char of item) {
                if (isSpecialCharacter(char)) {
                    specialCharacters.push(char);
                }
            }
        }
    }
    
    // Create concatenation string (reverse order with alternating caps)
    const reversedAlpha = allAlphabetChars.split('').reverse().join('');
    const concatString = alternatingCaps(reversedAlpha);
    
    return {
        oddNumbers,
        evenNumbers,
        alphabets,
        specialCharacters,
        sum: sum.toString(),
        concatString
    };
}

// GET endpoint (optional - for testing)
app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

// POST endpoint
app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;
        
        // Validate input
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input. 'data' must be an array."
            });
        }
        
        // Process the array
        const result = processArray(data);
        
        // Build response
        const response = {
            is_success: true,
            user_id: `${USER_DETAILS.full_name}_${USER_DETAILS.dob}`,
            email: USER_DETAILS.email,
            roll_number: USER_DETAILS.roll_number,
            odd_numbers: result.oddNumbers,
            even_numbers: result.evenNumbers,
            alphabets: result.alphabets,
            special_characters: result.specialCharacters,
            sum: result.sum,
            concat_string: result.concatString
        };
        
        res.status(200).json(response);
        
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        is_success: false,
        error: "Something went wrong!"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test the API at: http://localhost:${PORT}/bfhl`);
});

// Export for testing purposes
module.exports = app;