# OpenAI API Integration Guide

For more accurate and intelligent fashion recommendations, you can integrate **OpenAI's GPT API** with your Style Talk application.

## Why OpenAI?

✅ **More Contextual**: Understands nuanced fashion questions  
✅ **Personalized**: Can consider multiple factors (body type, occasion, preferences)  
✅ **Natural Language**: Handles complex and varied user inputs  
✅ **Real-time Learning**: Trained on latest fashion trends  

---

## Integration Steps

### 1. Get OpenAI API Key

1. Go to [https://platform.openai.com/api/keys](https://platform.openai.com/api/keys)
2. Sign up or log in
3. Create a new API key
4. Copy and save it securely

### 2. Update Backend (ChatServlet.java)

Add OpenAI dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>com.openai</groupId>
    <artifactId>openai-java</artifactId>
    <version>0.0.1</version>
</dependency>
```

Or use `okhttp` for direct API calls:

```xml
<dependency>
    <groupId>com.squareup.okhttp3</groupId>
    <artifactId>okhttp</artifactId>
    <version>4.11.0</version>
</dependency>
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.10.1</version>
</dependency>
```

### 3. Create OpenAI Service Class

Create `src/com/style/OpenAIService.java`:

```java
package com.style;

import java.io.IOException;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class OpenAIService {
    
    private static final String API_URL = "https://api.openai.com/v1/chat/completions";
    private String apiKey;
    private OkHttpClient client;
    
    public OpenAIService(String apiKey) {
        this.apiKey = apiKey;
        this.client = new OkHttpClient();
    }
    
    /**
     * Get fashion advice from OpenAI
     */
    public String getFashionAdvice(String query, String category) throws IOException {
        String systemPrompt = "You are a professional fashion advisor. Provide concise, " +
                            "specific, and practical fashion advice. Category: " + category;
        
        String jsonBody = ""+ 
            "{\n" +
            "  \"model\": \"gpt-3.5-turbo\",\n" +
            "  \"messages\": [\n" +
            "    {\"role\": \"system\", \"content\": \"" + systemPrompt + "\"},\n" +
            "    {\"role\": \"user\", \"content\": \"" + query.replace("\"", "\\\"") + "\"}\n" +
            "  ],\n" +
            "  \"temperature\": 0.7,\n" +
            "  \"max_tokens\": 500\n" +
            "}";
        
        RequestBody body = RequestBody.create(jsonBody, 
            okhttp3.MediaType.parse("application/json; charset=utf-8"));
        
        Request request = new Request.Builder()
            .url(API_URL)
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .post(body)
            .build();
        
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                return null; // Fall back to local suggestions
            }
            
            String responseBody = response.body().string();
            JsonObject json = JsonParser.parseString(responseBody).getAsJsonObject();
            
            String content = json
                .getAsJsonArray("choices")
                .get(0)
                .getAsJsonObject()
                .getAsJsonObject("message")
                .get("content")
                .getAsString();
            
            return content;
        }
    }
}
```

### 4. Update ChatServlet to Use OpenAI

```java
@WebServlet("/ChatServlet")
public class ChatServlet extends HttpServlet {
    
    private OpenAIService openAIService;
    
    @Override
    public void init() throws ServletException {
        String apiKey = System.getenv("OPENAI_API_KEY");
        if (apiKey != null) {
            openAIService = new OpenAIService(apiKey);
        }
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        
        try {
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            
            JSONObject input = new JSONObject(sb.toString());
            String query = input.optString("query", "").toLowerCase();
            String category = input.optString("category", "general").toLowerCase();
            
            JSONObject result = new JSONObject();
            
            // Try OpenAI first
            if (openAIService != null) {
                try {
                    String answer = openAIService.getFashionAdvice(query, category);
                    if (answer != null) {
                        result.put("answer", answer);
                        result.put("source", "openai");
                    } else {
                        // Fall back to local
                        result = getFashionResponse(query, category);
                        result.put("source", "local");
                    }
                } catch (Exception e) {
                    System.err.println("OpenAI error: " + e.getMessage());
                    // Fall back to local
                    result = getFashionResponse(query, category);
                    result.put("source", "local");
                }
            } else {
                // No OpenAI key, use local
                result = getFashionResponse(query, category);
                result.put("source", "local");
            }
            
            response.getWriter().print(result.toString());
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            JSONObject error = new JSONObject();
            error.put("error", e.getMessage());
            response.getWriter().print(error.toString());
        }
    }
    
    // Keep existing getFashionResponse method as fallback
    private JSONObject getFashionResponse(String query, String category) {
        // ... existing implementation ...
    }
}
```

### 5. Set Environment Variable

**On Windows:**
```powershell
$env:OPENAI_API_KEY="your-api-key-here"
```

**On Linux/Mac:**
```bash
export OPENAI_API_KEY="your-api-key-here"
```

### 6. Alternative: Frontend Integration

You can also call OpenAI directly from JavaScript:

```javascript
// Update fashionAPI.js
const OPENAI_API_KEY = "your-key-here"; // Consider moving to backend

async function queryOpenAI(query, category) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional fashion advisor for ${category} style.`
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}
```

⚠️ **Security Note**: Never expose API keys in frontend code. Always use backend.

---

## Pricing

**OpenAI GPT-3.5-turbo:**
- Input: $0.0005 per 1K tokens
- Output: $0.0015 per 1K tokens

For fashion advice (~200 tokens): ~$0.0005 per request

---

## Testing

Test with sample queries using your own backend tooling (no specific command lines are included in this file).

---

## Current Status

✅ **Fallback System Enabled**  
- Uses OpenAI when available
- Falls back to local suggestions
- Users never experience downtime

---

## Next Steps

1. Get OpenAI API key
2. Add dependencies to pom.xml
3. Implement OpenAIService.java
4. Update ChatServlet
5. Set environment variable
6. Test and deploy!

For more details: [OpenAI API Docs](https://platform.openai.com/docs/api-reference)
