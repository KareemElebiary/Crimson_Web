/**
 * Portfolio XML Loader
 * Loads portfolio data from XML file and dynamically generates portfolio items
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    loadPortfolioFromXML();
    setupPortfolioFilters();
});

/**
 * Load portfolio data from XML file using AJAX
 */
function loadPortfolioFromXML() {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                parseAndDisplayPortfolio(xhr.responseXML);
            } else {
                console.error('Error loading portfolio XML:', xhr.status);
                displayPortfolioError();
            }
        }
    };

    xhr.open('GET', 'portfolio.xml', true);
    xhr.send();
}

/**
 * Parse XML and display portfolio items
 * @param {XMLDocument} xml - The XML document containing portfolio data
 */
function parseAndDisplayPortfolio(xml) {
    const portfolioGrid = document.querySelector('.portfolio-grid');

    if (!portfolioGrid) {
        console.error('Portfolio grid container not found');
        return;
    }

    // Clear existing content
    portfolioGrid.innerHTML = '';

    // Get all project nodes from XML
    const projects = xml.getElementsByTagName('project');

    if (projects.length === 0) {
        portfolioGrid.innerHTML = '<p class="no-projects">No projects found.</p>';
        return;
    }

    // Loop through each project and create HTML elements
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];

        // Extract data from XML nodes
        const id = getXMLNodeValue(project, 'id');
        const title = getXMLNodeValue(project, 'title');
        const category = getXMLNodeValue(project, 'category');
        const description = getXMLNodeValue(project, 'description');
        const image = getXMLNodeValue(project, 'image');
        const technologies = getXMLNodeValue(project, 'technologies');
        const url = getXMLNodeValue(project, 'url');
        const featured = getXMLNodeValue(project, 'featured');

        // Create portfolio item element
        const portfolioItem = createPortfolioItem({
            id: id,
            title: title,
            category: category,
            description: description,
            image: image,
            technologies: technologies,
            url: url,
            featured: featured
        });

        // Add to portfolio grid
        portfolioGrid.appendChild(portfolioItem);
    }

    // Add animation to portfolio items
    animatePortfolioItems();
}

/**
 * Get text content from XML node
 * @param {Element} parent - Parent XML element
 * @param {string} tagName - Tag name to search for
 * @returns {string} - Text content of the node
 */
function getXMLNodeValue(parent, tagName) {
    const node = parent.getElementsByTagName(tagName)[0];
    return node ? node.textContent : '';
}

/**
 * Create portfolio item HTML element
 * @param {Object} data - Portfolio item data
 * @returns {HTMLElement} - Portfolio item element
 */
function createPortfolioItem(data) {
    // Create main container
    const item = document.createElement('div');
    item.className = 'portfolio-item';
    item.setAttribute('data-category', data.category);
    item.setAttribute('data-id', data.id);

    if (data.featured === 'true') {
        item.classList.add('featured');
    }

    // Create image container
    const imageDiv = document.createElement('div');
    imageDiv.className = 'portfolio-image';

    const img = document.createElement('img');
    img.src = data.image;
    img.alt = data.title;
    img.onerror = function () {
        this.src = 'CrimsonWeb.png'; // Fallback image
    };

    imageDiv.appendChild(img);

    // Create overlay container
    const overlay = document.createElement('div');
    overlay.className = 'portfolio-overlay';

    const title = document.createElement('h3');
    title.textContent = data.title;

    const description = document.createElement('p');
    description.textContent = data.description;

    const tech = document.createElement('span');
    tech.className = 'portfolio-tech';
    tech.textContent = data.technologies;

    overlay.appendChild(title);
    overlay.appendChild(description);
    overlay.appendChild(tech);

    // Add click event if URL exists
    if (data.url && data.url !== '#') {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function () {
            window.location.href = data.url;
        });
    }

    // Assemble the item
    item.appendChild(imageDiv);
    item.appendChild(overlay);

    return item;
}

/**
 * Setup portfolio filter buttons
 */
function setupPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(function (btn) {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            // Filter portfolio items
            filterPortfolioItems(filter);
        });
    });
}

/**
 * Filter portfolio items by category
 * @param {string} category - Category to filter by ('all' or specific category)
 */
function filterPortfolioItems(category) {
    const items = document.querySelectorAll('.portfolio-item');

    items.forEach(function (item) {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.5s ease-in-out';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Animate portfolio items on load
 */
function animatePortfolioItems() {
    const items = document.querySelectorAll('.portfolio-item');

    items.forEach(function (item, index) {
        setTimeout(function () {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            setTimeout(function () {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
}

/**
 * Display error message if XML loading fails
 */
function displayPortfolioError() {
    const portfolioGrid = document.querySelector('.portfolio-grid');

    if (portfolioGrid) {
        portfolioGrid.innerHTML = '<p class="error-message">Unable to load portfolio. Please try again later.</p>';
    }
}

// Add CSS for portfolio tech display
const style = document.createElement('style');
style.textContent = `
    .portfolio-tech {
        display: block;
        font-size: 0.85em;
        color: #dc143c;
        margin-top: 8px;
        font-weight: 500;
    }
    
    .portfolio-item.featured {
        border: 2px solid #dc143c;
    }
    
    .no-projects,
    .error-message {
        text-align: center;
        padding: 40px;
        color: #fff;
        font-size: 1.2em;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
