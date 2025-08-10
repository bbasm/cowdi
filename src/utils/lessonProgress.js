// Utility functions for tracking lesson progress

export function getLessonProgress(lessonNum) {
  const progress = localStorage.getItem(`lesson-${lessonNum}-progress`);
  return progress ? JSON.parse(progress) : { completed: false };
}

export function setLessonProgress(lessonNum, data) {
  localStorage.setItem(`lesson-${lessonNum}-progress`, JSON.stringify(data));
  // Dispatch custom event to notify components of progress change
  window.dispatchEvent(new CustomEvent('lessonProgressUpdated', { 
    detail: { lessonNum, data } 
  }));
}

export function isLessonCompleted(lessonNum) {
  const progress = getLessonProgress(lessonNum);
  return progress.completed === true;
}

export function markLessonCompleted(lessonNum) {
  setLessonProgress(lessonNum, { 
    completed: true, 
    completedAt: new Date().toISOString() 
  });
}

export function canAccessLesson(lessonNum) {
  // Lesson 1 is always accessible
  if (lessonNum <= 1) return true;
  
  // For other lessons, check if previous lesson requirements are completed
  return isLessonRequirementsCompleted(lessonNum - 1);
}

// Special check for lesson 5 validation exercise
export function setLesson5ValidationStatus(isValid) {
  const currentProgress = getLessonProgress(5);
  setLessonProgress(5, {
    ...currentProgress,
    validationCompleted: isValid,
    completed: isValid
  });
}

export function isLesson5ValidationCompleted() {
  const progress = getLessonProgress(5);
  return progress.validationCompleted === true;
}

// Check if specific exercise requirements are completed
export function checkExerciseRequirements(lessonNum, exerciseId) {
  const progress = getLessonProgress(lessonNum);
  return progress[exerciseId] === true;
}

// Mark specific exercise as completed
export function markExerciseCompleted(lessonNum, exerciseId) {
  const currentProgress = getLessonProgress(lessonNum);
  setLessonProgress(lessonNum, {
    ...currentProgress,
    [exerciseId]: true
  });
}

// All mustFix exercises that need to be completed per lesson
const MUSTFIX_EXERCISES = {
  1: ['python-hello-error-1-1'],
  2: ['python-hello-error-2-5', 'python-hello-error-2-6'],
  3: ['python-hello-error-3-5'],
  4: ['python-hello-error-4-7'],
  5: ['python-hello-correct-5-6'],
  6: ['python-correct-6-4'],
  7: ['python-correct-7-4']
};

// Mark mustFix exercise as completed
export function markMustFixCompleted(lessonNum, exerciseId) {
  const currentProgress = getLessonProgress(lessonNum);
  const mustFixProgress = currentProgress.mustFixCompleted || {};
  
  setLessonProgress(lessonNum, {
    ...currentProgress,
    mustFixCompleted: {
      ...mustFixProgress,
      [exerciseId]: true
    },
    [exerciseId]: true // Keep backward compatibility
  });
}

// Check if all mustFix exercises in a lesson are completed
export function isLessonMustFixCompleted(lessonNum) {
  const progress = getLessonProgress(lessonNum);
  const mustFixExercises = MUSTFIX_EXERCISES[lessonNum] || [];
  
  return mustFixExercises.every(exerciseId => {
    return progress.mustFixCompleted?.[exerciseId] === true || progress[exerciseId] === true;
  });
}

// Check if all required exercises in a lesson are completed
export function isLessonRequirementsCompleted(lessonNum) {
  // First check if all mustFix exercises are completed
  if (!isLessonMustFixCompleted(lessonNum)) {
    return false;
  }
  
  const progress = getLessonProgress(lessonNum);
  
  switch (lessonNum) {
    case 5:
      return progress.validationCompleted === true;
    case 6:
      return progress['python-correct-6-4'] === true;
    case 7:
      return progress['python-correct-7-4'] === true;
    default:
      return true; // No additional specific requirements beyond mustFix
  }
}

// Get list of incomplete mustFix exercises for a lesson
export function getIncompleteMustFixExercises(lessonNum) {
  const progress = getLessonProgress(lessonNum);
  const mustFixExercises = MUSTFIX_EXERCISES[lessonNum] || [];
  
  return mustFixExercises.filter(exerciseId => {
    return !(progress.mustFixCompleted?.[exerciseId] === true || progress[exerciseId] === true);
  });
}