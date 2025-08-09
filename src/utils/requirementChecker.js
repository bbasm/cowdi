// Requirement checker for specific Python turtle exercises

// Requirements for python-correct-7-4 (Rainbow Star)
export function checkRainbowStarRequirements(code) {
  const requirements = [
    {
      id: "colors-list",
      description: "Membuat list warna (minimal 5 warna)",
      check: (code) => {
        const hasColorsList = /colors?\s*=\s*\[.*\]/i.test(code);
        const colorCount = (code.match(/["'][^"']*["']/g) || []).length;
        return hasColorsList && colorCount >= 5;
      },
    },
    {
      id: "star-loop",
      description: "Menggunakan for loop untuk menggambar bintang",
      check: (code) => {
        return /for\s+\w+\s+in\s+range\s*\(\s*5\s*\)/i.test(code);
      },
    },
    {
      id: "color-change",
      description: "Mengganti warna sebelum setiap garis (pencolor)",
      check: (code) => {
        return /pencolor\s*\(/i.test(code) && /colors?\[/i.test(code);
      },
    },
    {
      id: "star-angle",
      description: "Menggunakan sudut yang benar untuk bintang",
      check: (code) => {
        return /144/.test(code) && /(left|right)\s*\(\s*144\s*\)/i.test(code);
      },
    },
  ];

  return checkRequirements(code, requirements);
}

// Requirements for python-correct-6-5 (House)
export function checkHouseRequirements(code) {
  const requirements = [
    {
      id: "square-base",
      description: "Menggambar badan rumah dengan 80 langkah",
      check: (code) => {
        const hasSquareLoop = /for\s+\w+\s+in\s+range\s*\(\s*4\s*\)/i.test(
          code
        );
        const hasSquareAngle = /90/.test(code);
        const has80Distance = /forward\s*\(\s*80\s*\)/i.test(code);
        return hasSquareLoop && hasSquareAngle && has80Distance;
      },
    },
    {
      id: "roof-preparation",
      description: "Belok untuk memulai atap",
      check: (code) => {
        return /(left|right)\s*\(\s*30\s*\)/i.test(code);
      },
    },
    {
      id: "triangular-roof",
      description: "Menggambar atap segitiga dengan 80 langkah",
      check: (code) => {
        // Check for at least 6 forward(80) calls total (4 for square + 2 for triangle)
        // Or check for at least 2 additional forward calls after the square loop
        const forward80Matches = code.match(/forward\s*\(\s*80\s*\)/gi) || [];
        const hasSquareLoop = /for\s+\w+\s+in\s+range\s*\(\s*4\s*\)/i.test(
          code
        );

        if (hasSquareLoop && forward80Matches.length >= 4) {
          // If there's a square loop with forward(80), check if there are additional forward calls
          const codeAfterSquareLoop =
            code.split(/for\s+\w+\s+in\s+range\s*\(\s*4\s*\):/i)[1] || "";
          const additionalForwards =
            codeAfterSquareLoop.match(/forward\s*\(\s*80\s*\)/gi) || [];
          return additionalForwards.length >= 2;
        }

        // Fallback: just check total forward(80) calls
        return forward80Matches.length >= 6;
      },
    },
  ];

  return checkRequirements(code, requirements);
}

// Requirements for python-correct-6-4 (Octagon)
export function checkOctagonRequirements(code) {
  const requirements = [
    {
      id: "octagon-loop",
      description: "Menggunakan for loop untuk 8 sisi",
      check: (code) => {
        return /for\s+\w+\s+in\s+range\s*\(\s*8\s*\)/i.test(code);
      },
    },
    {
      id: "octagon-angle",
      description: "Menggunakan sudut yang benar untuk segi delapan",
      check: (code) => {
        return /45/.test(code) && /(left|right)\s*\(\s*45\s*\)/i.test(code);
      },
    },
    // {
    //   id: "turtle-import",
    //   description: "Mengimpor turtle library",
    //   check: (code) => {
    //     return /from\s+turtle\s+import\s+\*/i.test(code);
    //   },
    // },
    // {
    //   id: "turtle-object",
    //   description: "Membuat objek turtle",
    //   check: (code) => {
    //     return /turtle\.Turtle\(\)/i.test(code);
    //   },
    // },
  ];

  return checkRequirements(code, requirements);
}

// Helper function to check requirements
function checkRequirements(code, requirements) {
  const results = requirements.map((req) => ({
    ...req,
    passed: req.check(code),
  }));

  const totalPassed = results.filter((r) => r.passed).length;
  const totalRequirements = requirements.length;
  const allPassed = totalPassed === totalRequirements;

  return {
    requirements: results,
    totalPassed,
    totalRequirements,
    allPassed,
    progress: Math.round((totalPassed / totalRequirements) * 100),
  };
}

// Main function to get requirements for any exercise
export function getRequirements(exerciseId, code) {
  switch (exerciseId) {
    case "python-correct-7-4":
      return checkRainbowStarRequirements(code);
    case "python-correct-6-5":
      return checkHouseRequirements(code);
    case "python-correct-6-4":
      return checkOctagonRequirements(code);
    default:
      return null;
  }
}

// Create validation result similar to lesson 5 format
export function createValidationResult(exerciseId, code) {
  const requirements = getRequirements(exerciseId, code);
  if (!requirements) return null;

  const checks = {};
  requirements.requirements.forEach((req) => {
    checks[req.id] = req.passed;
  });

  return {
    valid: requirements.allPassed,
    checks: checks,
    requirements: requirements.requirements,
    progress: requirements.progress,
  };
}
