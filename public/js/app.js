// Import language mapper
import { getPrismLanguage } from './language-mapper.js';

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const snippetsContainer = document.getElementById('snippets-container');
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const themeToggle = document.getElementById('theme-toggle');
    let dbData = null;
    let currentSnippets = [];
    let loadedCount = 0;
    const batchSize = 10;

    // Theme handling
    function setPrismTheme(isDark) {
        const prismLink = document.getElementById('prism-theme');
        if (isDark) {
            prismLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-okaidia.min.css';
        } else {
            prismLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css';
        }
    }

    function applyTheme(theme) {
        const html = document.documentElement;
        localStorage.setItem('theme', theme);
        let isDark = false;
        if (theme === 'dark') {
            html.classList.add('dark');
            themeToggle.textContent = '🌙';
            isDark = true;
        } else if (theme === 'light') {
            html.classList.remove('dark');
            themeToggle.textContent = '☀️';
            isDark = false;
        } else { // auto
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                html.classList.add('dark');
                isDark = true;
            } else {
                html.classList.remove('dark');
                isDark = false;
            }
            themeToggle.textContent = '🌓';
        }
        setPrismTheme(isDark);
    }

    // Load saved theme or default to auto
    const savedTheme = localStorage.getItem('theme') || 'auto';
    applyTheme(savedTheme);

    // Theme toggle click
    themeToggle.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'auto';
        let nextTheme;
        if (currentTheme === 'auto') {
            nextTheme = 'light';
        } else if (currentTheme === 'light') {
            nextTheme = 'dark';
        } else {
            nextTheme = 'auto';
        }
        applyTheme(nextTheme);
    });

    // Listen for system theme changes when in auto mode
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('theme') === 'auto') {
            if (e.matches) {
                document.documentElement.classList.add('dark');
                setPrismTheme(true);
            } else {
                document.documentElement.classList.remove('dark');
                setPrismTheme(false);
            }
        }
    });

    // Sidebar toggle
    window.toggleSidebar = function() {
        // Check if we're on mobile (screen width < 768px)
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // Mobile: toggle overlay behavior
            const isOpen = sidebar.classList.contains('sidebar-mobile-open');
            if (isOpen) {
                sidebar.classList.remove('sidebar-mobile-open');
                sidebar.classList.add('sidebar-mobile-hidden');
                sidebarBackdrop.classList.remove('show');
            } else {
                sidebar.classList.add('sidebar-mobile-open');
                sidebar.classList.remove('sidebar-mobile-hidden');
                sidebarBackdrop.classList.add('show');
            }
        } else {
            // Desktop: toggle width behavior
            sidebar.classList.toggle('sidebar-hidden');
        }
    };

    // Initialize sidebar state based on screen size
    function initializeSidebar() {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            // Mobile: ensure mobile classes are set correctly and remove desktop classes
            sidebar.classList.remove('sidebar-hidden');
            sidebar.classList.add('sidebar-mobile-hidden');
            sidebar.classList.remove('sidebar-mobile-open');
            sidebarBackdrop.classList.remove('show');
        } else {
            // Desktop: remove all mobile classes and ensure desktop state
            sidebar.classList.remove('sidebar-mobile-hidden');
            sidebar.classList.remove('sidebar-mobile-open');
            sidebarBackdrop.classList.remove('show');
            // Don't automatically show sidebar on desktop - let user control it
        }
    }

    // Initialize sidebar on load
    initializeSidebar();

    // Handle window resize
    window.addEventListener('resize', initializeSidebar);

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        const isMobile = window.innerWidth < 768;
        if (isMobile && sidebar.classList.contains('sidebar-mobile-open')) {
            // Check if click is outside sidebar
            if (!sidebar.contains(e.target) && e.target.id !== 'sidebar-toggle') {
                sidebar.classList.remove('sidebar-mobile-open');
                sidebar.classList.add('sidebar-mobile-hidden');
                sidebarBackdrop.classList.remove('show');
            }
        }
    });

    // Clear search function
    window.clearSearch = function() {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    };

    // Load db.json
    fetch('data/db.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            dbData = data;
            const activeSnippets = data.snippets.filter(s => !s.isDeleted);
            // Initialize all snippets with first tab active
            currentSnippets = activeSnippets.map(snippet => ({
                ...snippet,
                activeTabIndex: 0
            }));
            loadedCount = 0;
            const initialBatch = currentSnippets.slice(0, batchSize);
            renderSnippets(initialBatch, true);
            loadedCount += initialBatch.length;

            // Load more snippets if needed to fill viewport
            setTimeout(() => {
                loadMoreIfNeeded();
            }, 100);
            renderTree(data.folders, activeSnippets);
        })
        .catch(error => {
            console.error('Error loading db.json:', error);
            // Show prominent error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'fixed inset-0 bg-red-50 dark:bg-red-900 flex items-center justify-center z-50';
            errorDiv.innerHTML = `
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md mx-4 text-center border-2 border-red-200 dark:border-red-700">
                    <div class="text-red-600 dark:text-red-400 mb-4">
                        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Database File Missing</h2>
                    <p class="text-gray-600 dark:text-gray-300 mb-6">
                        The <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">db.json</code> file could not be found or loaded.
                    </p>
                    <div class="text-left bg-gray-50 dark:bg-gray-700 p-4 rounded mb-6">
                        <p class="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>To fix this:</strong></p>
                        <ol class="text-sm text-gray-600 dark:text-gray-400 list-decimal list-inside space-y-1">
                            <li>Ensure <code>db.json</code> exists in the <code>data/</code> directory</li>
                            <li>Check that the file is accessible and not corrupted</li>
                            <li>Verify the web server is serving static files correctly</li>
                        </ol>
                    </div>
                    <button onclick="location.reload()" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Retry
                    </button>
                </div>
            `;
            document.body.appendChild(errorDiv);
        });

    // Search functionality
    const clearSearchButton = document.getElementById('clear-search');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const activeSnippets = dbData.snippets.filter(s => !s.isDeleted);

        if (query.trim() === '') {
            // No search query - show all snippets with first tab active and no highlighting
            currentSnippets = activeSnippets.map(snippet => ({
                ...snippet,
                activeTabIndex: 0, // Always show first tab when no search
                highlightedContent: snippet.content.map(content => ({
                    ...content,
                    highlightedValue: content.value // No highlighting
                }))
            }));
        } else {
            // Filter snippets and determine which tab should be active
            const filteredSnippets = activeSnippets.filter(snippet => {
                let hasMatch = false;
                let activeTabIndex = 0;

                // Check name
                if (matchesQuery(snippet.name, query)) {
                    hasMatch = true;
                }
                // Check description
                if (snippet.description && matchesQuery(snippet.description, query)) {
                    hasMatch = true;
                }

                // Check content fragments and highlight matches
                const highlightedContent = snippet.content.map((content, index) => {
                    const highlightedValue = highlightSearchMatches(content.value, query);
                    if (highlightedValue !== content.value && !hasMatch) {
                        // This fragment contains matches and no other match found yet
                        hasMatch = true;
                        activeTabIndex = index;
                    }
                    return {
                        ...content,
                        highlightedValue: highlightedValue
                    };
                });

                if (hasMatch) {
                    snippet.activeTabIndex = activeTabIndex;
                    snippet.highlightedContent = highlightedContent;
                    return true;
                }
                return false;
            }).map(snippet => ({
                ...snippet,
                activeTabIndex: snippet.activeTabIndex || 0, // Default to first tab if not set
                highlightedContent: snippet.highlightedContent || snippet.content.map(content => ({
                    ...content,
                    highlightedValue: content.value
                }))
            }));

            currentSnippets = filteredSnippets;
        }

        loadedCount = 0;

        // For search results, load all at once since users expect to see all results
        // For no search, use batch loading
        if (query.trim() === '') {
            const initialBatch = currentSnippets.slice(0, batchSize);
            renderSnippets(initialBatch, true);
            loadedCount += initialBatch.length;

            // Load more snippets if needed to fill viewport
            setTimeout(() => {
                loadMoreIfNeeded();
            }, 100);
        } else {
            // Load all search results at once
            renderSnippets(currentSnippets, true);
            loadedCount = currentSnippets.length;
        }

        // Show/hide clear button
        clearSearchButton.style.display = e.target.value ? 'block' : 'none';
    });

    // Sidebar toggle
    sidebar.addEventListener('click', (e) => {
        if (e.target.classList.contains('folder')) {
            e.target.classList.toggle('open');
        } else if (e.target.classList.contains('snippet-item')) {
            const snippetId = e.target.dataset.snippetId;
            ensureSnippetLoadedAndScroll(snippetId);
        }
    });

    // Function to ensure a snippet is loaded and scroll to it
    function ensureSnippetLoadedAndScroll(snippetId) {
        const snippetIndex = currentSnippets.findIndex(s => s.id === snippetId);
        if (snippetIndex === -1) return; // Snippet not in current results

        // If snippet is already loaded, just scroll to it
        if (snippetIndex < loadedCount) {
            const element = document.getElementById(`snippet-${snippetId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }

        // Load all snippets up to and including the target snippet
        const snippetsToLoad = currentSnippets.slice(loadedCount, snippetIndex + 1);
        renderSnippets(snippetsToLoad, false);
        loadedCount += snippetsToLoad.length;

        // Now scroll to the snippet
        setTimeout(() => {
            const element = document.getElementById(`snippet-${snippetId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

    // Function to load more snippets if needed to fill viewport
    function loadMoreIfNeeded() {
        const container = snippetsContainer;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        // If content doesn't fill viewport and we haven't loaded too many initially, load one more batch
        if (scrollHeight <= clientHeight && loadedCount < currentSnippets.length && loadedCount < batchSize * 3) {
            const nextBatch = currentSnippets.slice(loadedCount, loadedCount + batchSize);
            renderSnippets(nextBatch, false);
            loadedCount += nextBatch.length;

            // Check once more if still needed (but limit to prevent loading everything)
            setTimeout(() => {
                loadMoreIfNeeded();
            }, 50);
        }
    }

    // Infinite scroll
    let scrollTimeout;
    snippetsContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollTop = snippetsContainer.scrollTop;
            const clientHeight = snippetsContainer.clientHeight;
            const scrollHeight = snippetsContainer.scrollHeight;

            // Load more when within 300px of bottom
            if (scrollTop + clientHeight >= scrollHeight - 300) {
                if (loadedCount < currentSnippets.length) {
                    const nextBatch = currentSnippets.slice(loadedCount, loadedCount + batchSize);
                    renderSnippets(nextBatch, false);
                    loadedCount += nextBatch.length;
                }
            }
        }, 100);
    });

    // Function to check if text matches query (supports regex)
    function matchesQuery(text, query) {
        if (!query.trim()) return false;
        try {
            const regex = new RegExp(query); // case-sensitive
            return regex.test(text);
        } catch (error) {
            // If regex is invalid, fall back to literal string search
            return text.includes(query);
        }
    }

    // Function to highlight search matches in text
    function highlightSearchMatches(text, query) {
        if (!query.trim()) return text;

        const highlightLimit = window.MASSCODE_CONFIG?.SEARCH_HIGHLIGHT_LIMIT ?? 3;

        try {
            // Try to use the query as a regex pattern
            const regex = new RegExp(`(${query})`, 'g'); // case-sensitive, global
            let matchCount = 0;
            return text.replace(regex, (match, group1) => {
                matchCount++;
                if (highlightLimit === -1 || matchCount <= highlightLimit) {
                    return `<mark class="search-highlight">${group1}</mark>`;
                }
                return group1; // Return without highlighting for matches beyond limit
            });
        } catch (error) {
            // If regex is invalid, escape special characters and search as literal string
            const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedQuery})`, 'g');
            let matchCount = 0;
            return text.replace(regex, (match, group1) => {
                matchCount++;
                if (highlightLimit === -1 || matchCount <= highlightLimit) {
                    return `<mark class="search-highlight">${group1}</mark>`;
                }
                return group1; // Return without highlighting for matches beyond limit
            });
        }
    }

    function renderSnippets(snippets, clear = false) {
        if (clear) {
            snippetsContainer.innerHTML = '';
        }
        snippets.forEach(snippet => {
            const snippetDiv = document.createElement('div');
            snippetDiv.className = 'bg-white rounded-lg shadow-md mb-4 p-4 dark:bg-gray-700 dark:shadow-lg transition-colors';
            snippetDiv.id = `snippet-${snippet.id}`;

            const title = document.createElement('h2');
            title.className = 'text-xl font-semibold text-gray-800 mb-2 dark:text-white';
            title.textContent = snippet.name;
            snippetDiv.appendChild(title);

            if (snippet.tagsIds.length > 0) {
                const tagsDiv = document.createElement('div');
                tagsDiv.className = 'mb-2';
                snippet.tagsIds.forEach(tagId => {
                    const tag = dbData.tags.find(t => t.id === tagId);
                    if (tag) {
                        const tagSpan = document.createElement('span');
                        tagSpan.className = 'inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm mr-2 dark:bg-gray-600 dark:text-gray-200';
                        tagSpan.textContent = tag.name;
                        tagsDiv.appendChild(tagSpan);
                    }
                });
                snippetDiv.appendChild(tagsDiv);
            }

            if (snippet.description) {
                const desc = document.createElement('p');
                desc.className = 'text-gray-600 mb-2 dark:text-gray-300';
                desc.textContent = snippet.description;
                snippetDiv.appendChild(desc);
            }

            // Render content - use tabs for multiple fragments
            if (snippet.content.length === 1) {
                // Single fragment - render normally
                const content = snippet.content[0];
                const highlightedContent = snippet.highlightedContent ? snippet.highlightedContent[0] : content;
                if (content.value.trim()) {
                    const pre = document.createElement('pre');
                    pre.className = 'bg-gray-100 rounded p-4 overflow-x-auto mb-4 dark:bg-gray-900 relative';
                    const code = document.createElement('code');
                    code.className = `language-${getPrismLanguage(content.language)}`;
                    // Use highlighted content if available, otherwise use original content
                    const displayContent = highlightedContent.highlightedValue || content.value;
                    // For HTML content, encode HTML entities to prevent rendering
                    const finalContent = getPrismLanguage(content.language) === 'html'
                        ? displayContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
                        : displayContent;
                    code.innerHTML = finalContent;
                    pre.appendChild(code);

                    // Add copy button
                    const copyButton = document.createElement('button');
                    copyButton.className = 'copy-to-clipboard-button';
                    copyButton.innerHTML = '📋';
                    copyButton.title = 'Copy to clipboard';
                    copyButton.onclick = async () => {
                        try {
                            await navigator.clipboard.writeText(content.value);
                            copyButton.innerHTML = '✅';
                            setTimeout(() => copyButton.innerHTML = '📋', 2000);
                        } catch (err) {
                            console.error('Failed to copy: ', err);
                            copyButton.innerHTML = '❌';
                            setTimeout(() => copyButton.innerHTML = '📋', 2000);
                        }
                    };
                    pre.appendChild(copyButton);

                    snippetDiv.appendChild(pre);
                    Prism.highlightElement(code);
                }
            } else {
                // Multiple fragments - use tabs
                const tabsContainer = document.createElement('div');
                tabsContainer.className = 'mb-4';

                // Tab navigation
                const tabNav = document.createElement('div');
                tabNav.className = 'flex space-x-1 mb-4 border-b border-gray-200 dark:border-gray-600';

                // Tab panels container
                const tabPanels = document.createElement('div');
                tabPanels.className = 'relative';

                // Determine which tab should be active (from search results or default to first)
                const activeTabIndex = snippet.activeTabIndex !== undefined ? snippet.activeTabIndex : 0;

                snippet.content.forEach((content, index) => {
                    if (!content.value.trim()) return;

                    // Create tab button
                    const tabButton = document.createElement('button');
                    tabButton.className = `px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                        index === activeTabIndex
                            ? 'bg-gray-100 text-gray-900 border-b-2 border-blue-500 dark:bg-gray-700 dark:text-white'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'
                    }`;
                    tabButton.textContent = content.label || `Fragment ${index + 1}`;
                    tabButton.dataset.tabIndex = index;

                    // Create tab panel
                    const tabPanel = document.createElement('div');
                    tabPanel.className = `tab-panel ${index === activeTabIndex ? 'block' : 'hidden'}`;
                    tabPanel.dataset.tabIndex = index;

                    const pre = document.createElement('pre');
                    pre.className = 'bg-gray-100 rounded p-4 overflow-x-auto dark:bg-gray-900 relative';
                    const code = document.createElement('code');
                    code.className = `language-${getPrismLanguage(content.language)}`;
                    // Use highlighted content if available, otherwise use original content
                    const highlightedContent = snippet.highlightedContent ? snippet.highlightedContent[index] : content;
                    const displayContent = highlightedContent.highlightedValue || content.value;
                    // For HTML content, encode HTML entities to prevent rendering
                    const finalContent = getPrismLanguage(content.language) === 'html'
                        ? displayContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
                        : displayContent;
                    code.innerHTML = finalContent;
                    pre.appendChild(code);

                    // Add copy button
                    const copyButton = document.createElement('button');
                    copyButton.className = 'copy-to-clipboard-button';
                    copyButton.innerHTML = '📋';
                    copyButton.title = 'Copy to clipboard';
                    copyButton.onclick = async () => {
                        try {
                            await navigator.clipboard.writeText(content.value);
                            copyButton.innerHTML = '✅';
                            setTimeout(() => copyButton.innerHTML = '📋', 2000);
                        } catch (err) {
                            console.error('Failed to copy: ', err);
                            copyButton.innerHTML = '❌';
                            setTimeout(() => copyButton.innerHTML = '📋', 2000);
                        }
                    };
                    pre.appendChild(copyButton);

                    tabPanel.appendChild(pre);
                    Prism.highlightElement(code);

                    // Tab switching functionality
                    tabButton.addEventListener('click', () => {
                        // Update tab buttons
                        tabNav.querySelectorAll('button').forEach(btn => {
                            btn.className = btn.className.replace(
                                'bg-gray-100 text-gray-900 border-b-2 border-blue-500 dark:bg-gray-700 dark:text-white',
                                'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'
                            );
                        });
                        tabButton.className = tabButton.className.replace(
                            'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700',
                            'bg-gray-100 text-gray-900 border-b-2 border-blue-500 dark:bg-gray-700 dark:text-white'
                        );

                        // Update tab panels
                        tabPanels.querySelectorAll('.tab-panel').forEach(panel => {
                            panel.classList.add('hidden');
                            panel.classList.remove('block');
                        });
                        tabPanel.classList.remove('hidden');
                        tabPanel.classList.add('block');
                    });

                    tabNav.appendChild(tabButton);
                    tabPanels.appendChild(tabPanel);
                });

                tabsContainer.appendChild(tabNav);
                tabsContainer.appendChild(tabPanels);
                snippetDiv.appendChild(tabsContainer);
            }

            snippetsContainer.appendChild(snippetDiv);
        });
    }

    function renderTree(folders, snippets) {
        const folderMap = {};
        folders.forEach(folder => {
            folderMap[folder.id] = { ...folder, children: [], snippets: [] };
        });

        // Group snippets by folder
        snippets.forEach(snippet => {
            if (folderMap[snippet.folderId]) {
                folderMap[snippet.folderId].snippets.push(snippet);
            }
        });

        // Build tree
        const rootFolders = [];
        folders.forEach(folder => {
            if (!folder.parentId || !folderMap[folder.parentId]) {
                rootFolders.push(folderMap[folder.id]);
            } else {
                folderMap[folder.parentId].children.push(folderMap[folder.id]);
            }
        });

        function buildTree(folders) {
            const ul = document.createElement('ul');
            ul.className = 'tree';
            folders.forEach(folder => {
                const li = document.createElement('li');
                const folderDiv = document.createElement('div');
                folderDiv.className = 'folder';
                folderDiv.textContent = folder.name;
                li.appendChild(folderDiv);

                if (folder.snippets.length > 0 || folder.children.length > 0) {
                    const subUl = document.createElement('ul');
                    folder.children.forEach(child => {
                        subUl.appendChild(buildTree([child]).firstChild);
                    });
                    folder.snippets.forEach(snippet => {
                        const snippetLi = document.createElement('li');
                        snippetLi.className = 'snippet-item';
                        snippetLi.textContent = snippet.name;
                        snippetLi.dataset.snippetId = snippet.id;
                        subUl.appendChild(snippetLi);
                    });
                    li.appendChild(subUl);
                }
                ul.appendChild(li);
            });
            return ul;
        }

        const tree = buildTree(rootFolders);
        document.getElementById('sidebar-content').appendChild(tree);
    }
});
