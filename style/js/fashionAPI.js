class FashionAPI {
  constructor() {
    this.timeout = 5000;
  }

  /**
   * Query the fashion AI for clothing advice (local implementation)
   * @param {string} query - User's fashion query
   * @param {string} category - Fashion category (girls, boys, formal, accessories)
   * @param {string} email - User's email (optional)
   * @param {string} userName - User's name (optional)
   * @returns {Promise<object>} - AI response object
   */
  async queryFashionAdvisor(query, category = 'general', email = '', userName = '') {
    // Local-only response path (no backend OpenAI dependency)
    const answer = this.generateFashionResponse(query, category);
    return {
      success: true,
      answer,
      recommendations: this.generateRecommendations(category),
      category,
      userSaved: false,
      isLocal: true,
      source: 'local'
    };
  }

  getLocalSuggestion(query, category) {
    const q = query.toLowerCase();
    const answer = this.generateDynamicAnswer(q, category);

    return {
      success: true,
      answer: answer,
      category: category,
      isLocal: true,
    };
  }

  generateDynamicAnswer(query, category) {
    const colors = this.extractColors(query);
    const items = this.extractClothingItems(query);
    const occasion = this.extractOccasion(query);
    const colorStr = colors.length > 0 ? colors[0] : null;

    if (query.includes('navratri') || query.includes('navaratri') || query.includes('9 color')) {
      return this.getNavratriAnswer();
    }

    // SAREE QUERIES - Dynamic color matching
    if (items.includes('saree')) {
      const blouseColor = this.suggestBlouseColor(colorStr);
      const jewelry = this.suggestJewelry('saree', occasion);
      return `For a ${colorStr || 'beautiful'} saree, pair it with a ${blouseColor} blouse for perfect elegance and harmony. ${jewelry}`;
    }

    // DRESS QUERIES
    if (items.includes('dress')) {
      const style = this.suggestDressStyle(occasion);
      const colors = this.suggestColors(occasion);
      return `For ${occasion ? 'a ' + occasion + ' event' : 'your event'}, choose a ${style} dress in ${colors}. Keep accessories minimal to let the dress shine, and ensure you feel absolutely confident in it!`;
    }

    // BLOUSE/TOP QUERIES
    if (items.includes('blouse') || items.includes('top') || items.includes('shirt') || items.includes('kurti')) {
      const bottoms = this.suggestBottomsForTop(colorStr, occasion);
      const accessories = this.suggestAccessories(occasion);
      return `A ${colorStr || 'well-fitted'} ${items[0]} pairs beautifully with ${bottoms}. ${accessories} Make sure the fit is flattering for your body type!`;
    }

    // JEWELRY QUERIES
    if (items.includes('jewelry') || items.includes('necklace') || items.includes('earring') || items.includes('bracelet')) {
      return this.getJewelryAdvice(occasion);
    }

    // FOOTWEAR QUERIES
    if (items.includes('shoe') || items.includes('footwear') || items.includes('heel') || items.includes('sneaker') || items.includes('boot')) {
      return this.getFootwearAdvice(colorStr, occasion);
    }

    // BAG QUERIES
    if (items.includes('bag') || items.includes('purse')) {
      return this.getBagAdvice(colorStr, occasion);
    }

    // PANT/BOTTOM QUERIES
    if (items.includes('pant') || items.includes('trouser') || items.includes('jean') || items.includes('dhoti') || items.includes('skirt')) {
      const tops = this.suggestTopsForBottom(colorStr, items[0]);
      return `${colorStr ? colorStr.charAt(0).toUpperCase() + colorStr.slice(1) : 'Well-fitted'} ${items[0]} works great with ${tops}. Ensure proper fit at the waist and length for a polished, confident look!`;
    }

    // GET SPECIFIC ITEM PAIRINGS
    if (items.length > 0) {
      return `For ${items.join(', ')}, focus on: color harmony, proper fit, and occasion-appropriateness. ${colorStr ? `A ${colorStr} color is versatile and elegant.` : ''} The key is choosing pieces that make you feel confident and comfortable!`;
    }

    // OCCASION-SPECIFIC GENERAL ADVICE
    if (occasion) {
      return this.getOccasionAdvice(occasion);
    }

    // DEFAULT FALLBACK - Help user clarify
    return `I'd love to help! To give you precise fashion advice, could you tell me: What specific clothing item are you asking about? (saree, dress, shirt, pants, shoes, jewelry, etc.) And what's the occasion? (wedding, office, casual, party, etc.) Any color preferences?`;
  }

  /**
   * Extract colors from query dynamically
   */
  extractColors(query) {
    const colorMap = {
      'red': 'red', 'pink': 'pink', 'blue': 'blue', 'green': 'green',
      'yellow': 'yellow', 'orange': 'orange', 'purple': 'purple', 'violet': 'violet',
      'white': 'white', 'black': 'black', 'grey': 'grey', 'gray': 'gray',
      'gold': 'gold', 'golden': 'golden', 'silver': 'silver', 'cream': 'cream',
      'maroon': 'maroon', 'navy': 'navy', 'pastel': 'pastel', 'jewel': 'jewel tone',
      'emerald': 'emerald', 'sapphire': 'sapphire', 'coral': 'coral', 'peach': 'peach',
      'burgundy': 'burgundy', 'teal': 'teal', 'aqua': 'aqua', 'lime': 'lime'
    };

    const found = [];
    for (const [color, display] of Object.entries(colorMap)) {
      if (query.includes(color)) {
        found.push(display);
      }
    }
    return found;
  }

  /**
   * Extract clothing items from query
   */
  extractClothingItems(query) {
    const itemMap = {
      'saree': 'saree', 'dress': 'dress', 'blouse': 'blouse', 'top': 'top',
      'shirt': 'shirt', 'pant': 'pants', 'trouser': 'trousers', 'jean': 'jeans',
      'dhoti': 'dhoti', 'skirt': 'skirt', 'gown': 'gown', 'suit': 'suit', 'kurti': 'kurti',
      'jacket': 'jacket', 'coat': 'coat', 'sweater': 'sweater', 'cardigan': 'cardigan',
      'shoe': 'shoes', 'footwear': 'footwear', 'heel': 'heels', 'sneaker': 'sneakers',
      'boot': 'boots', 'sandal': 'sandals', 'bag': 'bag', 'purse': 'purse',
      'jewelry': 'jewelry', 'necklace': 'necklace', 'earring': 'earrings',
      'bracelet': 'bracelet', 'ring': 'ring', 'watch': 'watch', 'scarf': 'scarf'
    };

    const found = [];
    for (const [item, display] of Object.entries(itemMap)) {
      if (query.includes(item)) {
        found.push(display);
      }
    }
    return found;
  }

  /**
   * Extract occasion from query
   */
  extractOccasion(query) {
    const occasions = [
      'wedding', 'marriage', 'prom', 'gala', 'party', 'formal', 'casual',
      'office', 'work', 'professional', 'dinner', 'date', 'festival', 'event',
      'celebration', 'beach', 'everyday', 'traditional'
    ];

    for (const occasion of occasions) {
      if (query.includes(occasion)) {
        return occasion;
      }
    }
    return null;
  }

  /**
   * Suggest blouse color based on saree color - DYNAMIC
   */
  suggestBlouseColor(sareeColor) {
    const suggestions = {
      'pink': 'gold, cream, or white',
      'green': 'golden, cream, or beige',
      'red': 'cream, gold, or burgundy',
      'blue': 'white, silver, or light gold',
      'purple': 'gold, silver, or cream',
      'yellow': 'white, cream, or gold',
      'orange': 'cream, white, or gold',
      'white': 'any bright color for beautiful contrast',
      'black': 'gold, silver, or bright jewel tones',
      'maroon': 'gold or cream',
      'navy': 'gold or white',
      'emerald': 'gold or cream'
    };

    return suggestions[sareeColor] || 'a complementary color that harmonizes with the saree';
  }

  /**
   * Suggest jewelry based on occasion
   */
  suggestJewelry(item, occasion) {
    if (occasion === 'wedding' || occasion === 'formal' || occasion === 'marriage') {
      return 'Add statement jewelry like chandelier earrings, traditional bangles, and a necklace for an elegant, sophisticated finish.';
    } else if (occasion === 'casual') {
      return 'Keep jewelry minimal and delicate - a simple necklace or earrings works perfectly.';
    } else if (occasion === 'party' || occasion === 'celebration') {
      return 'Add bold, statement jewelry to make an impression without overdoing it.';
    }
    return 'Pair with jewelry that complements both the color and occasion.';
  }

  /**
   * Suggest dress style based on occasion
   */
  suggestDressStyle(occasion) {
    if (occasion === 'wedding' || occasion === 'marriage') {
      return 'floor-length, embroidered or traditional';
    } else if (occasion === 'prom') {
      return 'floor-length, with interesting necklines and sleeves';
    } else if (occasion === 'casual') {
      return 'knee-length or midi, in comfortable, breathable fabric';
    } else if (occasion === 'office' || occasion === 'work' || occasion === 'professional') {
      return 'knee-length, tailored, in professional neutral tones';
    } else if (occasion === 'party') {
      return 'short or midi, with a fun or trendy design';
    }
    return 'well-fitted and flattering to your body type';
  }

  /**
   * Suggest colors based on occasion
   */
  suggestColors(occasion) {
    if (occasion === 'wedding' || occasion === 'marriage' || occasion === 'formal') {
      return 'jewel tones like emerald, sapphire, burgundy, or rich muted colors';
    } else if (occasion === 'office' || occasion === 'work' || occasion === 'professional') {
      return 'neutral colors like navy, black, grey,cream, or white';
    } else if (occasion === 'casual') {
      return 'pastels, brights, or comfortable neutral colors';
    } else if (occasion === 'party' || occasion === 'celebration') {
      return 'bold jewel tones, jewel tones, or metallics for a statement';
    }
    return 'colors that suit your skin tone and make you feel confident';
  }

  /**
   * Suggest bottoms for a top - DYNAMIC
   */
  suggestBottomsForTop(topColor, occasion) {
    if (topColor === 'white' || topColor === 'cream') {
      return 'navy, black, grey, or pastel bottoms - all work beautifully';
    } else if (topColor === 'black') {
      return 'any color bottoms - white, gold, jewel tones, or neutrals all pair well';
    } else if (topColor === 'gold' || topColor === 'golden') {
      return 'dark bottoms like navy, maroon, or black for elegance';
    }
    return occasion ? this.suggestColors(occasion) : 'neutral bottoms that create balance';
  }

  /**
   * Suggest tops for bottoms - DYNAMIC
   */
  suggestTopsForBottom(bottomColor, bottomType) {
    if (bottomType === 'jeans' || bottomType === 'jean') {
      return 'casual tees, shirts, sweaters, or kurti in neutral or contrasting colors';
    } else if (bottomType === 'dhoti') {
      return 'traditional silk shirts, modern kurtas, or formal shirts in complementary colors';
    } else if (bottomType === 'trousers' || bottomType === 'trouser') {
      return 'formal or semi-formal tops like blouses, shirts, or kurti';
    } else if (bottomType === 'skirt') {
      return 'any top - try tucking in a shirt for a polished look, or pair with a sweater for casual comfort';
    }
    return 'well-fitted tops that complement your bottom color and occasion';
  }

  /**
   * Get jewelry advice - DYNAMIC
   */
  getJewelryAdvice(occasion) {
    if (occasion === 'formal' || occasion === 'wedding' || occasion === 'marriage') {
      return 'For formal occasions, choose statement pieces like chandelier earrings, layered necklaces, or bold bracelets. Keep it balanced—if wearing bold earrings, keep the necklace minimal. Invest in quality pieces!';
    } else if (occasion === 'casual') {
      return 'For casual wear, layered necklaces, hoop earrings, delicate bracelets, and rings work perfectly. Mix metals like gold, silver, and rose gold for a modern, eclectic touch. Keep it fun and playful!';
    } else if (occasion === 'office' || occasion === 'professional') {
      return 'For professional settings, opt for minimalist, elegant pieces. Simple stud earrings, a delicate necklace, and a watch or bracelet. Keep it understated and classy.';
    }
    return 'Choose jewelry that complements your outfit without overwhelming it. Let your jewelry enhance, not dominate, your look.';
  }

  /**
   * Get footwear advice - DYNAMIC
   */
  getFootwearAdvice(color, occasion) {
    if (occasion === 'formal' || occasion === 'wedding' || occasion === 'marriage') {
      const hueColor = color || 'metallic or neutral';
      return `Pair your outfit with elegant ${hueColor} heels, formal shoes, or traditional footwear. Ensure absolute comfort for all-day wear. Your feet carry you through the celebration—invest in comfort!`;
    } else if (occasion === 'office' || occasion === 'professional') {
      return 'Choose professional footwear like polished heels, ballet flats, loafers, or formal shoes in black, brown, or neutral tones. Comfort is key for a full workday.';
    } else if (occasion === 'casual') {
      const hueColor = color || 'white or neutral';
      return `Comfortable ${hueColor} sneakers, canvas shoes, casual flats, or slip-ons are perfect for a relaxed, casual vibe. Prioritize comfort over everything!`;
    }
    return 'Choose footwear that matches the occasion and complements your outfit colors. Always prioritize comfort—your confidence shines when your feet are happy!';
  }

  /**
   * Get bag advice - DYNAMIC
   */
  getBagAdvice(color, occasion) {
    if (occasion === 'formal' || occasion === 'wedding' || occasion === 'marriage') {
      const hueColor = color || 'burgundy, black, or gold';
      return `For formal events, choose a structured ${hueColor} handbag, clutch, or evening bag that's elegant and can hold your essentials. Quality leather or rich fabrics work best for sophistication.`;
    } else if (occasion === 'office' || occasion === 'professional') {
      return 'Choose a professional, structured handbag in neutral tones like black, brown, or grey. It should be spacious enough for your laptop or documents.';
    } else if (occasion === 'casual') {
      const hueColor = color || 'fun-colored';
      return `A canvas tote, crossbody bag, backpack, or casual ${hueColor} bag works great for everyday wear. Choose based on what you need to carry and your personal style.`;
    }
    return 'Select a bag that complements your outfit, matches the occasion vibe, and is functional for what you need to carry. Style and practicality should go hand in hand!';
  }

  /**
   * Suggest accessories/layering
   */
  suggestAccessories(occasion) {
    if (occasion === 'casual') {
      return 'Add a denim jacket, cardigan, or scarf for layering and extra style points.';
    } else if (occasion === 'formal' || occasion === 'wedding') {
      return 'Consider a silk shawl, elegant wrap, or statement jacket to complete your formal look.';
    }
    return 'Add appropriate accessories like a jacket, scarf, or belt to layer and add depth to your outfit.';
  }

  /**
   * Get occasion-specific advice
   */
  getOccasionAdvice(occasion) {
    const adviceMap = {
      'wedding': 'For weddings, embrace rich jewel tones like emerald or sapphire blue. Add statement jewelry, traditional embroidered pieces, and polished footwear for elegance. Ensure your outfit is comfortable for extended celebrations!',
      'marriage': 'For a marriage/wedding event, opt for sophisticated jewelry, traditional or fusion wear, and colors that make you feel radiant. Comfort is key for celebrated events!',
      'office': 'For office wear, stick to tailored pieces in neutral colors like navy, black, grey, or white. Professional footwear and minimal jewelry complete the polished look. Comfort matters for your workday!',
      'work': 'Professional attire means well-fitted, tailored pieces in neutral tones. Keep accessories minimal and polished. Your confidence matters more than trends!',
      'casual': 'For casual occasions, mix pastels with bold accessories. Comfortable fabrics and relaxed fits are perfect. Express your personal style here!',
      'prom': 'For prom, choose a floor-length gown in bold jewel tones or metallics. Add elegant heels, statement jewelry, and feel absolutely glamorous!',
      'formal': 'For formal events, choose sophisticated pieces in jewel tones or neutrals. Add statement jewelry and polished footwear. You will look and feel elegant!',
      'party': 'For parties, bold colors, metallics, or jewel tones work great. Add fun accessories and let your personality shine through your outfit!',
      'festival': 'For festivals, embrace traditional or fusion wear in vibrant colors. Coordinate jewelry and accessories thoughtfully. Celebrate with style!',
      'date': 'For a date, choose something that makes YOU feel confident—whether casual or semi-formal. Comfort and authenticity are attractive. Be yourself!',
      'beach': 'For beach wear, light, breathable fabrics in bright or pastel colors work best. Accessorize with sandals, sunglasses, and a fun cover-up.',
      'celebration': 'For celebrations, wear colors and styles that make you feel joyful and confident. This is your moment to shine!'
    };

    return adviceMap[occasion] || `For a ${occasion}, choose clothing that fits the vibe and makes you feel absolutely confident and comfortable!`;
  }

  /**
   * Get Navratri colors answer
   */
  getNavratriAnswer() {
    return `The 9 Navratri Colors:
            
🟠 Day 1: Orange - Energy and Creativity
⚪ Day 2: White - Purity and Peace
🔴 Day 3: Red - Strength and Passion
🔵 Day 4: Royal Blue - Wisdom and Calm
🟡 Day 5: Yellow - Joy and Positivity
🟢 Day 6: Green - Nature and Growth
⚫ Day 7: Grey - Balance and Serenity
🟣 Day 8: Purple - Spirituality
🩵 Day 9: Peacock Green - Prosperity

Wear traditional or modern attire in these colors on each respective day to celebrate Navratri beautifully and meaningfully!`;
  }

  /**
   * Get trending fashion tips
   */
  getTrendingTips() {
    return [
      'Pastel colors and soft fabrics are trending this season',
      'Layering is key for a sophisticated look',
      'Comfort meets style with oversized silhouettes',
      'Mix metals for a modern, contemporary aesthetic',
      'Sustainable fashion is the way forward',
    ];
  }

  /**
   * Get color recommendations for skin tone
   */
  getColorForSkinTone(skinTone) {
    const colorGuide = {
      fair: ['pastels', 'jewel tones', 'whites', 'light colors'],
      medium: ['warm tones', 'earth colors', 'jewel tones', 'bold colors'],
      olive: ['jewel tones', 'warm colors', 'deep shades', 'metallics'],
      dark: ['jewel tones', 'bright colors', 'pastels', 'metallics'],
    };
    return colorGuide[skinTone.toLowerCase()] || colorGuide.medium;
  }

  /**
   * Get chat history for a user (localStorage implementation)
   */
  async getChatHistory(email, category = null) {
    try {
      const storageKey = 'chat_history_' + email;
      const stored = localStorage.getItem(storageKey);

      if (!stored) {
        return { success: true, categories: [] };
      }

      const historyByCategory = JSON.parse(stored);
      const categories = [];

      for (const [cat, messages] of Object.entries(historyByCategory)) {
        if (!category || cat === category) {
          categories.push({
            category: cat,
            messageCount: messages.length,
            lastMessage: messages.length > 0 ? messages[messages.length - 1].timestamp : null
          });
        }
      }

      console.log('[FashionAPI] Retrieved chat history from localStorage:', categories);
      return { success: true, categories: categories };

    } catch (error) {
      console.error('[FashionAPI] Error reading chat history from localStorage:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate intelligent fashion response based on query and category
   */
  generateFashionResponse(query, category) {
    const q = query.toLowerCase();

    // Super-specific query overrides (more relevant answers)
    if (q.includes('navratri') || q.includes('navaratri') || q.includes('9 colors')) {
      return "Navratri has 9 iconic colors: Orange, White, Red, Royal Blue, Yellow, Green, Grey, Purple, and Peacock Green. Style tip: match your outfit to the day’s color and use subtle accessories to balance the look.";
    }
    if (q.includes('rainbow') || q.includes('7 colors') || q.includes('7 colours')) {
      return "For rainbow color inspiration, use a primary base shade and add accent pieces in adjacent hues. During dress-up themes, coordinate 2-3 colors and keep one color dominant to avoid looking too busy.";
    }

    // Intent scoring for categories
    const candidates = [
      {text: this.generateGirlsFashionResponse(q), score: this.intentScore(q, 'girls')},
      {text: this.generateBoysFashionResponse(q), score: this.intentScore(q, 'boys')},
      {text: this.generateFormalFashionResponse(q), score: this.intentScore(q, 'formal')},
      {text: this.generateAccessoriesResponse(q), score: this.intentScore(q, 'accessories')},
      {text: this.generateGeneralFashionResponse(q), score: this.intentScore(q, 'general')}
    ];

    // If category explicitly selected, favor it
    if (category && category !== 'general') {
      candidates.forEach(c => {
        if (c === candidates.find(cc => cc.text === this[`generate${category.charAt(0).toUpperCase() + category.slice(1)}FashionResponse`](q))) {
          c.score += 3;
        }
      });
    }

    candidates.sort((a,b) => b.score - a.score);
    return candidates[0].text;
  }

  intentScore(query, category) {
    let score = 0;
    if (category === 'girls' && (query.includes('girls') || query.includes('dress') || query.includes('skirt') || query.includes('saree'))) score += 2;
    if (category === 'boys' && (query.includes('boys') || query.includes('shirt') || query.includes('trousers') || query.includes('dhoti'))) score += 2;
    if (category === 'formal' && (query.includes('formal') || query.includes('suit') || query.includes('meeting') || query.includes('interview'))) score += 2;
    if (category === 'accessories' && (query.includes('accessories') || query.includes('watch') || query.includes('bag') || query.includes('jewelry'))) score += 2;
    if (category === 'general' && query.split(' ').length > 4) score += 1;

    // Add matches for color-related intent
    if (query.includes('color') || query.includes('colour')) score += 1;
    if (query.includes('trend') || query.includes('style')) score += 1;

    return score;
  }

  /**
   * Generate recommendations for a category
   */
  generateRecommendations(category) {
    const recommendations = {
      girls: [
        "Try pastel colors for a soft, feminine look",
        "Layer with light cardigans for versatile styling",
        "Mix patterns carefully - solids with one print work best"
      ],
      boys: [
        "Focus on clean lines and neutral colors",
        "Layering adds sophistication to any outfit",
        "Quality fabrics make a big difference"
      ],
      formal: [
        "Tailored pieces are always a good investment",
        "Neutral colors work for any occasion",
        "Proper fit is more important than brand"
      ],
      accessories: [
        "Less is more - choose quality over quantity",
        "Match metals (gold with gold, silver with silver)",
        "Consider the occasion when selecting accessories"
      ]
    };

    return recommendations[category] || ["Keep it simple and classic", "Quality over quantity", "Comfort is key"];
  }

  /**
   * Generate girls-specific fashion responses
   */
  generateGirlsFashionResponse(query) {
    if (query.includes('dress') || query.includes('outfit')) {
      return "For girls' fashion, consider flowy dresses in soft fabrics like cotton or chiffon. Pastel colors work beautifully, and you can accessorize with minimal jewelry and comfortable flats. The key is to choose pieces that allow freedom of movement while looking elegant.";
    }
    if (query.includes('color') || query.includes('colour')) {
      return "Soft, feminine colors like pastels (pink, lavender, mint) are perfect for girls' fashion. You can also incorporate bolder colors through accessories rather than the main outfit. Remember that skin tone plays a big role in color selection!";
    }
    return "Girls' fashion should be comfortable, age-appropriate, and allow for easy movement. Focus on quality fabrics, flattering fits, and pieces that can be mixed and matched easily.";
  }

  /**
   * Generate boys-specific fashion responses
   */
  generateBoysFashionResponse(query) {
    if (query.includes('shirt') || query.includes('pants')) {
      return "For boys' fashion, opt for comfortable, durable fabrics like cotton or blends. Clean lines and neutral colors create a polished look. Consider layering with light jackets or sweaters for different occasions.";
    }
    if (query.includes('casual') || query.includes('everyday')) {
      return "Casual boys' fashion should prioritize comfort and durability. Jeans or chinos paired with polo shirts or button-downs work well. Comfortable sneakers complete the look perfectly.";
    }
    return "Boys' fashion focuses on clean, classic pieces that stand the test of time. Quality materials and proper fit are essential for both comfort and appearance.";
  }

  /**
   * Generate formal fashion responses
   */
  generateFormalFashionResponse(query) {
    if (query.includes('suit') || query.includes('blazer')) {
      return "A well-tailored suit or blazer is the cornerstone of formal fashion. Choose neutral colors like navy, gray, or black. Ensure proper fit - the shoulders should align perfectly and the pants should break slightly over the shoes.";
    }
    if (query.includes('interview') || query.includes('meeting')) {
      return "For professional settings, stick to classic pieces: button-down shirts, dress pants or skirts, and closed-toe shoes. Subtle patterns are acceptable, but solid colors are safest. Always err on the side of being slightly overdressed.";
    }
    return "Formal fashion emphasizes quality, fit, and timeless style. Invest in versatile pieces that can transition between different professional occasions.";
  }

  /**
   * Generate accessories responses
   */
  generateAccessoriesResponse(query) {
    if (query.includes('watch') || query.includes('jewelry')) {
      return "Accessories should complement rather than overpower your outfit. Choose quality pieces that match your personal style. For watches, leather or metal bands work well; for jewelry, consider your skin tone when selecting metals.";
    }
    if (query.includes('bag') || query.includes('belt')) {
      return "Bags and belts should coordinate with your shoes and other accessories. Leather goods in neutral colors are the most versatile. Remember that function should guide your choice - comfort and practicality matter!";
    }
    return "Accessories are the finishing touches that elevate any outfit. Choose pieces that reflect your personality while maintaining balance with the rest of your ensemble.";
  }

  /**
   * Generate general fashion responses
   */
  generateGeneralFashionResponse(query) {
    if (query.includes('color') || query.includes('colour')) {
      return "Color choice depends on your skin tone, the occasion, and personal preference. Warm skin tones look great in earth tones and warm colors, while cool skin tones suit jewel tones and cool colors. Consider the season and your wardrobe's existing pieces.";
    }
    if (query.includes('fit') || query.includes('size')) {
      return "Proper fit is crucial for any outfit. Clothes should skim your body without being too tight or too loose. When in doubt, it's better to size up and have alterations done. Comfort should never be sacrificed for fashion.";
    }
    return "Fashion is about expressing yourself while feeling confident and comfortable. Focus on quality pieces that fit well and can be styled in multiple ways. Remember that personal style evolves over time!";
  }
}

// Export for use in other scripts
const fashionAPI = new FashionAPI();
