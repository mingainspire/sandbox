document.addEventListener('DOMContentLoaded', function() {
    const tutorialButton = document.getElementById('startTutorial');
    const tutorialContent = document.getElementById('tutorialContent');

    tutorialButton.addEventListener('click', function() {
        tutorialContent.style.display = tutorialContent.style.display === 'none' ? 'block' : 'none';
    });
});
