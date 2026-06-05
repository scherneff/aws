/*
 * Embed Feedback Block
 * Renders an inline "Did you find what you were looking for?" feedback widget
 */

export default function decorate(block) {
  block.textContent = '';

  // Thumbs up SVG icon
  const thumbsUpSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" fill="currentColor" aria-hidden="true">
    <path d="M1 14h2.5a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm14.39-5.66A2 2 0 0 0 13.5 6H9.9l.57-2.72a2.17 2.17 0 0 0-.57-1.93l-.67-.67a.5.5 0 0 0-.63-.06L5.5 3V13l2.83 1.42a2 2 0 0 0 .89.21h4.28a2 2 0 0 0 1.96-1.62l.83-4.17a2 2 0 0 0-.9-2.5z"/>
  </svg>`;

  // Thumbs down SVG icon
  const thumbsDownSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" fill="currentColor" aria-hidden="true">
    <path d="M15 1h-2.5a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1H15a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM.61 6.66A2 2 0 0 0 2.5 9h3.6l-.57 2.72a2.17 2.17 0 0 0 .57 1.93l.67.67a.5.5 0 0 0 .63.06L10.5 12V2L7.67.58A2 2 0 0 0 6.78.37H2.5A2 2 0 0 0 .54 2l-.83 4.17a2 2 0 0 0 .9 2.5z"/>
  </svg>`;

  // Build the widget structure
  const textColumn = document.createElement('div');
  textColumn.className = 'embed-feedback-text';

  const heading = document.createElement('h2');
  heading.textContent = 'Did you find what you were looking for today?';
  textColumn.append(heading);

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Let us know so we can improve the quality of the content on our pages';
  textColumn.append(subtitle);

  const buttonsColumn = document.createElement('div');
  buttonsColumn.className = 'embed-feedback-buttons';

  const yesBtn = document.createElement('button');
  yesBtn.type = 'button';
  yesBtn.setAttribute('aria-label', 'Yes, give us positive feedback');
  yesBtn.innerHTML = `<span class="embed-feedback-btn-label">Yes</span>${thumbsUpSvg}`;
  yesBtn.addEventListener('click', () => {
    block.classList.add('embed-feedback-submitted');
    block.innerHTML = '<div class="embed-feedback-thanks"><h2>Thank you for your feedback!</h2><p>Your input helps us improve our content.</p></div>';
  });

  const noBtn = document.createElement('button');
  noBtn.type = 'button';
  noBtn.setAttribute('aria-label', 'No, give us constructive feedback');
  noBtn.innerHTML = `<span class="embed-feedback-btn-label">No</span>${thumbsDownSvg}`;
  noBtn.addEventListener('click', () => {
    block.classList.add('embed-feedback-submitted');
    block.innerHTML = '<div class="embed-feedback-thanks"><h2>Thank you for your feedback!</h2><p>We appreciate your input and will work to improve.</p></div>';
  });

  buttonsColumn.append(yesBtn, noBtn);

  const content = document.createElement('div');
  content.className = 'embed-feedback-content';
  content.append(textColumn, buttonsColumn);

  block.append(content);
}
