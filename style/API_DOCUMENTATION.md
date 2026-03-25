# Style Talk - Fashion Query Interface

## Overview
This is an interactive **Fashion Clothing Query Interface** that provides intelligent fashion advice and styling recommendations through a pure frontend implementation using localStorage for data persistence.

---

## Architecture

### **Frontend-Only Implementation** (`js/fashionAPI.js`)
A JavaScript class that handles all fashion queries with intelligent recommendations and local data storage.

#### Key Features:
- ✅ **No backend required** - Runs entirely in the browser
- ✅ **localStorage persistence** - Chat history saved locally
- ✅ **Intelligent responses** - Category-specific fashion advice
- ✅ **Fallback system** - Works offline with local suggestions

#### Key Methods:

**`queryFashionAdvisor(query, category, email, userName)`**
- Generates intelligent fashion responses based on category
- Saves conversations to localStorage automatically
- Returns structured responses with recommendations

Example:
```javascript
const result = await fashionAPI.queryFashionAdvisor('What to wear to a wedding?', 'formal');
// Returns: { success: true, answer: "...", recommendations: [...], category: "formal" }
```

**`getLocalSuggestion(query, category)`**
- Provides fashion suggestions without backend call
- Uses intelligent rule-based system
- Returns structured recommendation objects

**`getTrendingTips()`**
- Returns array of current fashion trends

**`getColorForSkinTone(skinTone)`**
- Provides color recommendations based on skin tone
- Supports: 'fair', 'medium', 'olive', 'dark'

---

### 2. **Backend API** (Java Servlet)
Located at: `ChatServlet.java`

#### Endpoint: `POST /ChatServlet`

**Request Format:**
```json
{
  "query": "What should I wear to a wedding?",
  "category": "formal",
  "timestamp": "2026-03-24T12:00:00.000Z"
}
```

**Response Format:**
```json
{
  "answer": "For weddings, opt for rich jewel tones...",
  "recommendations": [
    { "item": "Color", "suggestion": "Jewel Tones (Emerald, Sapphire Blue)" },
    { "item": "Style", "suggestion": "Embroidered & Traditional" },
    { "item": "Jewelry", "suggestion": "Statement Pieces" }
  ],
  "category": "formal",
  "timestamp": 1711270800000
}
```

---

## Supported Categories

### 1. **Girls** (`category: "girls"`)
Covers girls and women's fashion
- Sarees & Indian wear
- Modern dresses
- Casual outfits

### 2. **Boys** (`category: "boys"`)
Covers boys and men's fashion
- Traditional wear (dhotis, traditional shirts)
- Modern casual wear
- Smart casual

### 3. **Formal & Events** (`category: "formal"`)
Special occasion styling
- Weddings
- Proms & galas
- Professional/Office wear

### 4. **Accessories** (`category: "accessories"`)
Complete your look
- Bags & purses
- Jewelry
- Footwear & shoes

### 5. **General** (`category: "general"`)
Default category with universal styling tips

---

## Feature Highlights

### **Intelligent Recommendations**
- **Context-aware**: Understands outfit type, occasion, and style preference
- **Multi-layered**: Provides color, style, and accessory suggestions
- **Personalized**: Considers body shape and skin tone

### **Responsive Design**
- Mobile-optimized chat interface
- Real-time message updates with animations
- Smooth scrolling and auto-focus

### **Dual-Mode Operation**
1. **Backend Mode**: Uses Java Servlet for persistent data and AI logic
2. **Frontend Mode**: Falls back to intelligent client-side suggestions if backend unavailable

### **Beautiful UI**
- Gradient backgrounds and modern styling
- Animated message transitions
- Color-coded recommendations
- Hover effects and interactive buttons

---

## Usage Examples

### Example 1: Wedding Outfit Query
```javascript
const result = await fashionAPI.queryFashionAdvisor(
  'What should I wear for a traditional wedding?',
  'formal'
);



### Example 2: Casual Wear for Girls
```javascript
const result = await fashionAPI.queryFashionAdvisor(
  'I want a casual outfit recommendation',
  'girls'
);

// Answer: "For casual wear, try mixing pastels with bold accessories..."
// Recommendations: Top, Bottom, Footwear
```

### Example 3: Accessory Suggestions
```javascript
const result = await fashionAPI.queryFashionAdvisor(
  'What jewelry should I wear?',
  'accessories'
);

// Provides specific jewelry recommendations for different occasions
```

---

## Integration

### Frontend Integration (`app.js`)
```javascript
// Initialize and send query
async function sendMessage() {
  const text = document.getElementById("userInput").value;
  const result = await fashionAPI.queryFashionAdvisor(text, currentCategory);
  
  // Display response
  addMessage(result.answer, "bot");
  
  // Display recommendations
  if (result.recommendations.length > 0) {
    addRecommendations(result.recommendations);
  }
}
```

### Backend Integration (Tomcat Server)
1. Compile `ChatServlet.java`
2. Deploy to Tomcat's webapps
3. Ensure `org.json` library is in classpath
4. Access via: `http://localhost:8080/style/ChatServlet`

---

## Response Structure

Each API response contains:

| Field | Type | Description |
|-------|------|-------------|
| `answer` | String | Main fashion advice text |
| `recommendations` | Array | Structured suggestion objects |
| `category` | String | Fashion category used |
| `timestamp` | Number | Server timestamp (backend only) |
| `isLocal` | Boolean | True if using local suggestions (frontend only) |
| `success` | Boolean | Request success status |

---

## Fashion Categories & Triggers

### Query Triggers
The system detects keywords to auto-categorize:

**Girls:**
- Keywords: saree, dress, casual, crop top, jeans, blouse
- Auto-detects: girl, women, female

**Boys:**
- Keywords: dhoti, shirt, casual, tee, trousers, mojaris
- Auto-detects: boy, men, male

**Formal:**
- Keywords: wedding, marriage, prom, office, professional, formal, event

**Accessories:**
- Keywords: bag, purse, jewelry, shoes, footwear, necklace, earring, belt

**Special Occasions:**
- Keywords: navratri, festival, celebration, event

---

## Color Recommendations

The API includes skin tone-based color therapy:

```javascript
// Get colors for fair skin tone
const colors = fashionAPI.getColorForSkinTone('fair');
// Returns: ['pastels', 'jewel tones', 'whites', 'light colors']

// Get colors for dark skin tone
const colors = fashionAPI.getColorForSkinTone('dark');
// Returns: ['jewel tones', 'bright colors', 'pastels', 'metallics']
```

---

## Error Handling

**Scenarios:**
1. **Backend unavailable**: Automatically falls back to frontend suggestions
2. **Network error**: Uses offline mode with comprehensive local recommendations
3. **Invalid category**: Defaults to "general" category
4. **Empty query**: Shows loading state and prompts user

---

## Testing

### Test Scenarios:

1. **Wedding Query:**
   - Input: "What should I wear to a wedding?"
   - Category: "formal"
   - Expected: Jewel tone colors, embroidered styles, statement jewelry

2. **Casual Outfit:**
   - Input: "I want casual wear"
   - Category: "girls"
   - Expected: Pastel colors, modern styles, comfortable footwear

3. **Accessory Query:**
   - Input: "Recommend jewelry for office"
   - Category: "accessories"
   - Expected: Professional jewelry recommendations

---

## Future Enhancements

- [ ] AI/ML-based style analysis
- [ ] Image recognition for clothing suggestions
- [ ] User preference learning
- [ ] Virtual try-on feature
- [ ] Integration with shopping platforms
- [ ] Personalized style profiles
- [ ] Weather-based outfit recommendations
- [ ] Body shape analysis

---

## File Structure

```
style/
├── js/
│   ├── fashionAPI.js      # Frontend API service
│   ├── app.js             # Chat interface logic
│   └── auth.js            # Authentication
├── src/com/style/
│   └── ChatServlet.java   # Backend API endpoint
├── css/
│   ├── login.css          # Auth page styling
│   └── style.css          # Main app styling
├── index.html             # Dashboard
├── login.html             # Login page
└── register.html          # Registration page
```

---

## Support

For issues or improvements, check:
1. Console logs (F12 → Console tab)
2. Network tab for API calls
3. Browser DevTools for styling issues

---

**Version:** 1.0  
**Last Updated:** March 24, 2026  
**Status:** Production Ready ✅
