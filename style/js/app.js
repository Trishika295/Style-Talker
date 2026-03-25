
let currentCategory = "general";

function startChat(category) {
  window.location.href = `chatbot.html?category=${encodeURIComponent(category)}`;
}

function initializeChatbot(category) {
  currentCategory = category;
  const categoryNames = {
    girls: "Girls Style",
    boys: "Boys Style",
    formal: "Formal & Events",
    accessories: "Accessories"
  };
  
  const categoryTitle = categoryNames[category] || category;
  
  document.getElementById("categoryTitle").textContent = categoryTitle;
  document.title = `Style Talk - ${categoryTitle}`;
  
  const greeting = `Hello! I'm your Style Companion for ${categoryTitle} trends. Tell me what you are looking for—a specific outfit, advice for an event, or general trend spotting!`;
  addMessage(greeting, "bot");

  loadRecentChats();
  
  setTimeout(() => {
    document.getElementById("userInput").focus();
  }, 100);
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  // Show loading indicator
  const loadingMsg = addMessage("🔍 Analyzing your query...", "bot");

  try {
    // Get user info from localStorage
    let email = "";
    let userName = "User";
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      email = userData.email || "";
      userName = userData.name || "User";
    }

    // Use FashionAPI to get response
    const result = await fashionAPI.queryFashionAdvisor(text, currentCategory, email, userName);
    
    // Remove loading message
    if (loadingMsg) loadingMsg.remove();

    // Add AI response - only the answer, no recommendations
    addMessage(result.answer, "bot");

    // Store chat in localStorage as backup
    if (email) {
      storeChatInLocalStorage(email, currentCategory, text, result.answer);
    }

    // Show message if user data was saved
    if (result.userSaved) {
      console.log("✓ Chat saved on server for user: " + email);
    } else {
      console.log("📋 Chat stored in localStorage (server backup method)");
    }

    // Optional: Add suggestion to use OpenAI for better accuracy
    if (!result.isLocal) {
      addMessage("💡 Tip: For more accurate and personalized recommendations, consider using OpenAI API integration.", "bot-info");
    }

  } catch (error) {
    console.error("Error calling API:", error);
    if (loadingMsg) loadingMsg.remove();
    addMessage(getFashionSuggestion(text), "bot");
  }
}

// Store chat message in localStorage for backup
function storeChatInLocalStorage(email, category, userMessage, botMessage) {
  try {
    const storageKey = 'chat_history_' + email;
    let historyByCategory = {};
    
    // Load existing data
    const existing = localStorage.getItem(storageKey);
    if (existing) {
      historyByCategory = JSON.parse(existing);
    }
    
    // Initialize category if needed
    if (!historyByCategory[category]) {
      historyByCategory[category] = [];
    }
    
    // Add messages
    const timestamp = new Date().toLocaleString();
    historyByCategory[category].push({
      sender: "user",
      message: userMessage,
      timestamp: timestamp
    });
    historyByCategory[category].push({
      sender: "bot",
      message: botMessage,
      timestamp: timestamp
    });
    
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(historyByCategory));
    console.log("✓ Chat stored in localStorage for: " + email + " > " + category);
    
  } catch (error) {
    console.error("❌ Error storing in localStorage:", error);
  }
}

// Add message to chat window
function addMessage(text, sender) {
  const messages = document.getElementById("chatMessages");
  const msg = document.createElement("div");
  msg.className = "message " + sender;
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
  return msg;
}

// Rule-based fallback suggestions
function getFashionSuggestion(query) {
  const q = query.toLowerCase();

  if (q.includes("blouse")) {
    return "For a green saree, pair it with a golden or cream blouse for elegance.";
  } else if (q.includes("dhoti")) {
    return "A cream dhoti looks great with a maroon or dark green silk shirt.";
  } else if (q.includes("shirt")) {
    return "White shirts pair well with navy trousers or pastel dhotis for a modern look.";
  } else if (q.includes("dress")) {
    return "Modern dresses in pastel shades with statement sleeves are trending this season.";
  } else if (q.includes("navratri") || q.includes("navaratri")) {
    return "Navratri colors: Orange, White, Red, Royal Blue, Yellow, Green, Grey, Purple, Peacock Green. Style tip: wear the day color plus one neutral (black/white) and keep accessories minimal.";
  } else if (q.includes("rainbow") || q.includes("7 colors") || q.includes("7 colours")) {
    return "Rainbow styling tip: choose one dominant color and accent with 2-3 complementary shades; avoid all 7 in equal proportions to stay polished.";
  } else {
    return "Try mixing pastel colors with bold accessories for a stylish outfit.";
  }
}

// Load recent chats from backend and display in sidebar
async function loadRecentChats() {
  try {
    // Get user email from localStorage
    const user = localStorage.getItem("user");
    if (!user) {
      console.log("❌ User not found in localStorage");
      return;
    }
    
    const userData = JSON.parse(user);
    const email = userData.email;
    
    if (!email) {
      console.log("❌ Email not found in user data");
      return;
    }

    console.log("🔄 Loading recent chats for: " + email);

    // Try to use FashionAPI to fetch chat history
    let data = await fashionAPI.getChatHistory(email);
    
    // If server returns 404, use localStorage as fallback (during development)
    if (!data.success && data.error && data.error.includes('404')) {
      console.log("⚠️  Server endpoint not available, using localStorage fallback");
      data = getRecentChatsFromLocalStorage(email);
    }
    
    console.log("📦 Response data:", data);

    if (!data.success) {
      console.log("❌ Could not load chat history");
      return;
    }

    if (!data.categories || data.categories.length === 0) {
      console.log("⚠️  No categories found in response");
      const recentChatsDiv = document.querySelector('.recent-chats');
      if (recentChatsDiv) {
        recentChatsDiv.innerHTML = `
          <h4>RECENT CHATS</h4>
          <p>No recent chats. Start one now!</p>
        `;
      }
      return;
    }

    // Update the recent chats section
    const recentChatsDiv = document.querySelector('.recent-chats');
    if (!recentChatsDiv) {
      console.error("❌ recent-chats div not found in DOM");
      return;
    }

    const categoriesArray = data.categories || [];
    
    console.log("✓ Found " + categoriesArray.length + " categories");

    // Build HTML for recent chats
    let html = '<h4>RECENT CHATS</h4>';
    
    categoriesArray.forEach(cat => {
      const categoryName = getCategoryDisplayName(cat.category);
      html += `
        <div class="recent-chat-item" onclick="navigateToChat('${cat.category}')">
          <div class="chat-category">${categoryName}</div>
          <div class="chat-meta">${cat.messageCount} messages</div>
        </div>
      `;
      console.log("  ✓ Added: " + cat.category + " (" + cat.messageCount + " messages)");
    });

    recentChatsDiv.innerHTML = html;
    console.log("✓ Recent chats loaded successfully!");

  } catch (error) {
    console.error("❌ Error loading recent chats:", error);
    console.error("Stack:", error.stack);
  }
}

// Fallback: Get recent chats from localStorage
function getRecentChatsFromLocalStorage(email) {
  console.log("📋 Checking localStorage for chat history");
  const storageKey = 'chat_history_' + email;
  const chatData = localStorage.getItem(storageKey);
  
  if (!chatData) {
    return { success: false };
  }
  
  try {
    const historyByCategory = JSON.parse(chatData);
    const categories = [];
    
    for (const [category, messages] of Object.entries(historyByCategory)) {
      if (Array.isArray(messages) && messages.length > 0) {
        categories.push({
          category: category,
          messageCount: messages.length
        });
      }
    }
    
    console.log("✓ Found " + categories.length + " categories in localStorage");
    return { success: true, categories: categories };
  } catch (e) {
    console.error("❌ Error parsing localStorage data:", e);
    return { success: false };
  }
}

// Get display name for category
function getCategoryDisplayName(category) {
  const names = {
    girls: "👩 Girls Style",
    boys: "🧢 Boys Style",
    formal: "🎩 Formal & Events",
    accessories: "⚡ Accessories"
  };
  return names[category] || category;
}

// Navigate to a specific chat category
function navigateToChat(category) {
  window.location.href = `chatbot.html?category=${encodeURIComponent(category)}`;
}