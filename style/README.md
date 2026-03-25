# Style Talk - Fashion Chatbot

A beautiful, interactive fashion chatbot that provides personalized styling advice for different categories.

## Features

- Category-based advice**: Specialized recommendations for Girls, Boys, Formal wear, and Accessories
- Interactive chat interface**: Real-time conversation with intelligent responses
- Local storage**: All chat history saved in your browser (no backend required)
- Responsive design**: Works on desktop and mobile devices
- Smart suggestions**: Context-aware fashion recommendations

## How to Use

1. Register/Login: Create an account or log in to access the dashboard
2. Choose Category: Select from Girls, Boys, Formal, or Accessories 
3. Start Chatting: Ask questions about fashion, colors, outfits, or styling
4. View History: Your chat history is automatically saved and displayed in the sidebar

## Project Structure

```
style/
├── index.html          # Main dashboard with category selection
├── chatbot.html        # Dedicated chat interface
├── login.html          # User authentication
├── register.html       # User registration
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   ├── app.js          # Main application logic
│   ├── auth.js         # Authentication handling
│   └── fashionAPI.js   # Fashion advice engine
└── API_DOCUMENTATION.md # Technical documentation
```

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Browser localStorage (no database required)
- **Styling**: Custom CSS with responsive design
- **Architecture**: Component-based JavaScript classes

## Running the Application

Simply open `index.html` in any modern web browser. No server or installation required!

## Key Components

### FashionAPI Class
Handles all fashion queries with intelligent, category-specific responses:
- Girls fashion: Focus on comfort, colors, and age-appropriate styles
- Boys fashion: Clean lines, quality fabrics, and versatile pieces
- Formal wear: Professional attire, proper fit, and timeless styles
- Accessories: Coordination, quality, and balance

### Chat System
- Real-time message display
- Automatic chat history saving
- Category-based conversation organization
- User-friendly interface with typing indicators

## Browser Support

Works in all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Future Enhancements

If you want to add backend functionality later, consider:
- Node.js/Express server for cloud storage
- React frontend for enhanced UI
- Database integration for user accounts
- OpenAI API integration for more advanced responses</content>
<parameter name="filePath">c:\Users\trishika s\OneDrive\Desktop\style\README.md