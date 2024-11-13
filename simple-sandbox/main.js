document.addEventListener('DOMContentLoaded', function() {
    const tutorialButton = document.getElementById('startTutorial');
    const tutorialContent = document.getElementById('tutorialContent');
    const questionInput = document.getElementById('questionInput');
    const submitQuestionButton = document.getElementById('submitQuestion');

    tutorialButton.addEventListener('click', function() {
        tutorialContent.style.display = tutorialContent.style.display === 'none' ? 'block' : 'none';
    });

    submitQuestionButton.addEventListener('click', function() {
        const question = questionInput.value;
        if (question) {
            handleQuestionSubmission(question);
        }
    });
});

function handleQuestionSubmission(question) {
    console.log('Question submitted:', question);
    // Add logic to handle the question and trigger events
}
