// Requirement checker for specific Python turtle exercises

// Requirements for python-correct-7-4 (Rainbow Star)
export function checkRainbowStarRequirements(code) {
  const requirements = [
    {
      id: 'colors-list',
      description: 'Membuat list warna (minimal 5 warna)',
      check: (code) => {
        const hasColorsList = /colors?\s*=\s*\[.*\]/i.test(code);
        const colorCount = (code.match(/["'][^"']*["']/g) || []).length;
        return hasColorsList && colorCount >= 5;
      }
    },
    {
      id: 'star-loop',
      description: 'Menggunakan for loop untuk menggambar bintang (5 kali)',
      check: (code) => {
        return /for\s+\w+\s+in\s+range\s*\(\s*5\s*\)/i.test(code);
      }
    },
    {
      id: 'color-change',
      description: 'Mengganti warna sebelum setiap garis (pencolor)',
      check: (code) => {
        return /pencolor\s*\(/i.test(code) && /colors?\[/i.test(code);
      }
    },
    {
      id: 'star-angle',
      description: 'Menggunakan sudut yang benar untuk bintang (144 derajat)',
      check: (code) => {
        return /144/.test(code) && /(left|right)\s*\(\s*144\s*\)/i.test(code);
      }
    },
    {
      id: 'turtle-movement',
      description: 'Menggunakan forward untuk menggambar garis',
      check: (code) => {
        return /forward\s*\(/i.test(code);
      }
    }
  ];

  return checkRequirements(code, requirements);
}

// Requirements for python-correct-6-5 (House)
export function checkHouseRequirements(code) {
  const requirements = [
    {
      id: 'square-base',
      description: 'Menggambar badan rumah (persegi 4 sisi)',
      check: (code) => {
        const hasSquareLoop = /for\s+\w+\s+in\s+range\s*\(\s*4\s*\)/i.test(code);
        const hasSquareAngle = /90/.test(code);
        return hasSquareLoop && hasSquareAngle;
      }
    },
    {
      id: 'roof-preparation',
      description: 'Memposisikan kura-kura untuk atap (belokan untuk menghadap atas)',
      check: (code) => {
        return /(left|right)\s*\(\s*(30|60)\s*\)/i.test(code);
      }
    },
    {
      id: 'triangular-roof',
      description: 'Menggambar atap segitiga',
      check: (code) => {
        // Check for triangle drawing (3 sides or specific triangle pattern)
        const hasTriangleLoop = /for\s+\w+\s+in\s+range\s*\(\s*3\s*\)/i.test(code);
        const hasTriangleAngle = /120/.test(code);
        return hasTriangleLoop && hasTriangleAngle;
      }
    },
    {
      id: 'connected-shapes',
      description: 'Menghubungkan badan rumah dengan atap (tanpa penup)',
      check: (code) => {
        const penUpCount = (code.match(/penup/gi) || []).length;
        const penDownCount = (code.match(/pendown/gi) || []).length;
        return penUpCount <= penDownCount; // Should not lift pen unnecessarily
      }
    },
    {
      id: 'turtle-movement',
      description: 'Menggunakan forward untuk menggambar garis',
      check: (code) => {
        return /forward\s*\(/i.test(code);
      }
    }
  ];

  return checkRequirements(code, requirements);
}

// Requirements for python-correct-6-4 (Octagon)
export function checkOctagonRequirements(code) {
  const requirements = [
    {
      id: 'octagon-loop',
      description: 'Menggunakan for loop untuk 8 sisi',
      check: (code) => {
        return /for\s+\w+\s+in\s+range\s*\(\s*8\s*\)/i.test(code);
      }
    },
    {
      id: 'octagon-angle',
      description: 'Menggunakan sudut yang benar untuk segi delapan (45 derajat)',
      check: (code) => {
        return /45/.test(code) && /(left|right)\s*\(\s*45\s*\)/i.test(code);
      }
    },
    {
      id: 'turtle-movement',
      description: 'Menggunakan forward untuk menggambar garis',
      check: (code) => {
        return /forward\s*\(/i.test(code);
      }
    },
    {
      id: 'turtle-import',
      description: 'Mengimpor turtle library',
      check: (code) => {
        return /from\s+turtle\s+import\s+\*/i.test(code);
      }
    },
    {
      id: 'turtle-object',
      description: 'Membuat objek turtle',
      check: (code) => {
        return /turtle\.Turtle\(\)/i.test(code);
      }
    }
  ];

  return checkRequirements(code, requirements);
}

// Helper function to check requirements
function checkRequirements(code, requirements) {
  const results = requirements.map(req => ({
    ...req,
    passed: req.check(code)
  }));

  const totalPassed = results.filter(r => r.passed).length;
  const totalRequirements = requirements.length;
  const allPassed = totalPassed === totalRequirements;

  return {
    requirements: results,
    totalPassed,
    totalRequirements,
    allPassed,
    progress: Math.round((totalPassed / totalRequirements) * 100)
  };
}

// Main function to get requirements for any exercise
export function getRequirements(exerciseId, code) {
  switch (exerciseId) {
    case 'python-correct-7-4':
      return checkRainbowStarRequirements(code);
    case 'python-correct-6-5':
      return checkHouseRequirements(code);
    case 'python-correct-6-4':
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
  requirements.requirements.forEach(req => {
    checks[req.id] = req.passed;
  });

  return {
    valid: requirements.allPassed,
    checks: checks,
    requirements: requirements.requirements,
    progress: requirements.progress
  };
}