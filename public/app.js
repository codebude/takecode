document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const snippetsContainer = document.getElementById('snippets-container');
    const sidebar = document.getElementById('sidebar');
    const themeSelect = document.getElementById('theme-select');
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
            isDark = true;
        } else if (theme === 'light') {
            html.classList.remove('dark');
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
        }
        themeSelect.value = theme;
        setPrismTheme(isDark);
    }

    // Load saved theme or default to auto
    const savedTheme = localStorage.getItem('theme') || 'auto';
    applyTheme(savedTheme);

    // Theme selector change
    themeSelect.addEventListener('change', (e) => {
        applyTheme(e.target.value);
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
        sidebar.classList.toggle('sidebar-hidden');
    };

    // Clear search function
    window.clearSearch = function() {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    };

    // Load db.json
    fetch('data/db.json')
        .then(response => response.json())
        .then(data => {
            dbData = data;
            const activeSnippets = data.snippets.filter(s => !s.isDeleted);
            currentSnippets = activeSnippets;
            loadedCount = 0;
            const initialBatch = currentSnippets.slice(0, batchSize);
            renderSnippets(initialBatch, true);
            loadedCount += initialBatch.length;
            renderTree(data.folders, activeSnippets);
        })
        .catch(error => console.error('Error loading db.json:', error));

    // Search functionality
    const clearSearchButton = document.getElementById('clear-search');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const activeSnippets = dbData.snippets.filter(s => !s.isDeleted);
        const filteredSnippets = activeSnippets.filter(snippet =>
            snippet.name.toLowerCase().includes(query) ||
            snippet.description?.toLowerCase().includes(query) ||
            snippet.content.some(content => content.value.toLowerCase().includes(query))
        );
        currentSnippets = filteredSnippets;
        loadedCount = 0;
        const initialBatch = currentSnippets.slice(0, batchSize);
        renderSnippets(initialBatch, true);
        loadedCount += initialBatch.length;

        // Show/hide clear button
        clearSearchButton.style.display = e.target.value ? 'block' : 'none';
    });

    // Sidebar toggle
    sidebar.addEventListener('click', (e) => {
        if (e.target.classList.contains('folder')) {
            e.target.classList.toggle('open');
        } else if (e.target.classList.contains('snippet-item')) {
            const snippetId = e.target.dataset.snippetId;
            const element = document.getElementById(`snippet-${snippetId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Infinite scroll
    snippetsContainer.addEventListener('scroll', () => {
        if (snippetsContainer.scrollTop + snippetsContainer.clientHeight >= snippetsContainer.scrollHeight - 100) {
            if (loadedCount < currentSnippets.length) {
                const nextBatch = currentSnippets.slice(loadedCount, loadedCount + batchSize);
                renderSnippets(nextBatch, false);
                loadedCount += nextBatch.length;
            }
        }
    });

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

            snippet.content.forEach(content => {
                if (content.value.trim()) {
                    // Add fragment name as subheading if multiple fragments
                    if (snippet.content.length > 1 && content.label) {
                        const subheading = document.createElement('h4');
                        subheading.className = 'text-lg font-medium text-gray-700 mb-2 dark:text-gray-200';
                        subheading.textContent = content.label;
                        snippetDiv.appendChild(subheading);
                    }

                    const pre = document.createElement('pre');
                    pre.className = 'bg-gray-100 rounded p-4 overflow-x-auto mb-4 dark:bg-gray-900 relative';
                    const code = document.createElement('code');
                    code.className = `language-${LanguageMapper.getPrismLanguage(content.language)}`;
                    code.textContent = content.value;
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
            });

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