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
  
  // For other lessons, check if previous lesson is completed
  return isLessonCompleted(lessonNum - 1);
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

// Check if all required exercises in a lesson are completed
export function isLessonRequirementsCompleted(lessonNum) {
  const progress = getLessonProgress(lessonNum);
  
  switch (lessonNum) {
    case 6:
      return progress['python-correct-6-4'] === true && progress['python-correct-6-5'] === true;
    case 7:
      return progress['python-correct-7-4'] === true;
    default:
      return true; // No specific requirements
  }
}