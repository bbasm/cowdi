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