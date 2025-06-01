// DOM elements
const contentContainer = document.getElementById('content-container');
const navLinks = document.querySelectorAll('.nav-link');

// Content loader
async function loadContent(page) {
    try {
        const response = await fetch(`content/${page}.html`);
        if (!response.ok) throw new Error('Content not found');
        contentContainer.innerHTML = await response.text();
        
        // Initialize page-specific JS if needed
        initPageScripts(page);
    } catch (error) {
        contentContainer.innerHTML = `<div class="error">Page not found</div>`;
        console.error(error);
    }
}

// Navigation handler
function handleNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('href').substring(1);
            window.history.pushState({}, '', e.target.href);
            loadContent(page);
        });
    });
}

// Initialize page-specific scripts
function initPageScripts(page) {
    if (page === 'home') initHomePage();
    if (page === 'contact') initContactForm();
}

// Home page initialization
function initHomePage() {
    // Load blog posts via AJAX
    fetch('api/posts.json')
        .then(response => response.json())
        .then(posts => {
            const postsContainer = document.createElement('div');
            postsContainer.className = 'blog-posts';
            
            posts.forEach(post => {
                postsContainer.innerHTML += `
                    <article class="post-card">
                        <h2>${post.title}</h2>
                        <p>${post.excerpt}</p>
                        <button class="read-more" data-id="${post.id}">Read More</button>
                    </article>
                `;
            });
            
            contentContainer.appendChild(postsContainer);
            
            // Add event listeners to buttons
            document.querySelectorAll('.read-more').forEach(btn => {
                btn.addEventListener('click', () => {
                    loadBlogPost(btn.dataset.id);
                });
            });
        });
}

// Load single blog post
async function loadBlogPost(postId) {
    try {
        const response = await fetch(`api/posts/${postId}.json`);
        const post = await response.json();
        
        contentContainer.innerHTML = `
            <article class="single-post">
                <h1>${post.title}</h1>
                <div class="post-meta">By ${post.author} • ${post.date}</div>
                <div class="post-content">${post.content}</div>
                <button id="back-to-home">Back to Home</button>
            </article>
        `;
        
        document.getElementById('back-to-home').addEventListener('click', () => {
            loadContent('home');
        });
    } catch (error) {
        console.error('Failed to load post:', error);
    }
}

// Initial setup
function init() {
    // Load default page
    const initialPage = window.location.hash.substring(1) || 'home';
    loadContent(initialPage);
    
    // Setup navigation
    handleNavigation();
    
    // Handle browser history
    window.addEventListener('popstate', () => {
        const page = window.location.hash.substring(1) || 'home';
        loadContent(page);
    });
}

// Start the application
document.addEventListener('DOMContentLoaded', init);