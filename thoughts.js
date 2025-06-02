async function loadThought(thoughtId) {
    try {
        const response = await fetch('./content/thoughts/' + thoughtId + '.json');

        if (!response.ok) {
            console.log('Failed to fetch thought' + thoughtId);
        }

        return await response.json();
    } catch (error) {
        console.error("Error loading thought:", error);
        return {
            title: "Error Loading Thought",
            content: "Could not load the requested content."
        };
    }
}

function displayThought(thought) {
    const contentContainer = document.getElementById("content-container");

    contentContainer.innerHTML = `
    <article class="thought">
      <h2>${thought.title}</h2>
      <div class="thought-meta">
        ${thought.date ? `<time>${new Date(thought.date).toLocaleDateString()}</time>` : ''}
        ${thought.tags ? `<div class="tags">${thought.tags.map(tag => `<span>#${tag}</span>`).join('')}</div>` : ''}
      </div>
      <div class="thought-content">
        ${thought.content}
      </div>
    </article>
  `;
}

// Usage example
const thoughtId = "thought1";

loadThought(thoughtId)
    .then(data => {
        console.log("Loaded thought:", data);
        displayThought(data);
    });


