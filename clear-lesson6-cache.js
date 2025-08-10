// Run this in the browser console to clear lesson 6 completion cache
// This will help debug the green state issue

console.log("=== Clearing Lesson 6 Cache ===");

// Check current progress
const currentProgress = localStorage.getItem('lesson-6-progress');
console.log("Current lesson-6-progress:", currentProgress);

if (currentProgress) {
  const parsed = JSON.parse(currentProgress);
  console.log("Parsed progress:", parsed);
  
  // Check specifically for python-correct-6-5 (Misi Rahasia)
  console.log("python-correct-6-5 status:", parsed['python-correct-6-5']);
  console.log("mustFixCompleted for 6-5:", parsed.mustFixCompleted?.['python-correct-6-5']);
}

// Clear all lesson 6 progress
localStorage.removeItem('lesson-6-progress');
console.log("Cleared lesson-6-progress");

// Also clear any individual code storage
const keysToRemove = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.includes('lesson6') && key.includes('python-correct-6-5')) {
    keysToRemove.push(key);
  }
}

keysToRemove.forEach(key => {
  console.log("Removing key:", key);
  localStorage.removeItem(key);
});

console.log("=== Cache cleared, please refresh the page ===");