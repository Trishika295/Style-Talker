const fs = require('fs');
const apiCode = fs.readFileSync('./js/fashionAPI.js', 'utf8');

eval(apiCode);

// Test queries
const testQueries = [
  { query: "for pink saree which blouse color", category: "girls" },
  { query: "office wear men", category: "boys" },
  { query: "give 9 navaratri colors", category: "general" },
  { query: "casual outfit girls", category: "girls" },
  { query: "jewelry for wedding", category: "accessories" },
  { query: "blue dress for formal", category: "girls" },
  { query: "shoe recommendations for casual", category: "accessories" }
];

console.log("=== Fashion API Dynamic Response Test ===\n");

testQueries.forEach((test, idx) => {
  console.log(`Test ${idx + 1}: "${test.query}" (Category: ${test.category})`);
  const suggestion = fashionAPI.getLocalSuggestion(test.query, test.category);
  console.log(`Answer: ${suggestion.answer}\n`);
});

console.log("=== All tests completed ===");
