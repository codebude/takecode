document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const snippetsContainer = document.getElementById('snippets-container');
    const sidebar = document.getElementById('sidebar');
    const themeSelect = document.getElementById('theme-select');
    let dbData = null;
    let currentSnippets = [];
    let loadedCount = 0;
    const batchSize = 10;

    // Language mapping from db.json to Prism.js compatible names
    const languageMap = {
        'abap': 'abap',
        'abc': 'text',
        'actionscript': 'actionscript',
        'ada': 'ada',
        'alda': 'text',
        'apache_conf': 'apacheconf',
        'apex': 'apex',
        'applescript': 'applescript',
        'aql': 'aql',
        'asciidoc': 'asciidoc',
        'asl': 'text',
        'asp_vb_net': 'aspnet',
        'assembly_x86': 'asm6502',
        'autohotkey': 'autohotkey',
        'batchfile': 'batch',
        'bicep': 'bicep',
        'c_cpp': 'cpp',
        'c9search': 'text',
        'cirru': 'cirru',
        'clojure': 'clojure',
        'cobol': 'cobol',
        'coffee': 'coffeescript',
        'coldfusion': 'coldfusion',
        'crystal': 'crystal',
        'csharp': 'csharp',
        'csound_document': 'csound-document',
        'csound_orchestra': 'csound-orchestra',
        'csound_score': 'csound-score',
        'csp': 'csp',
        'css': 'css',
        'curly': 'text',
        'd': 'd',
        'dart': 'dart',
        'diff': 'diff',
        'django': 'django',
        'dockerfile': 'docker',
        'dot': 'dot',
        'drools': 'drools',
        'edifact': 'edifact',
        'eiffel': 'eiffel',
        'ejs': 'ejs',
        'elixir': 'elixir',
        'elm': 'elm',
        'erlang': 'erlang',
        'forth': 'forth',
        'fortran': 'fortran',
        'fsharp': 'fsharp',
        'fsl': 'fsl',
        'ftl': 'ftl',
        'gcode': 'gcode',
        'gherkin': 'gherkin',
        'gitignore': 'gitignore',
        'glsl': 'glsl',
        'gobstones': 'gobstones',
        'golang': 'go',
        'graphqlschema': 'graphql',
        'groovy': 'groovy',
        'haml': 'haml',
        'handlebars': 'handlebars',
        'haskell_cabal': 'cabal',
        'haskell': 'haskell',
        'haxe': 'haxe',
        'hjson': 'hjson',
        'html_elixir': 'html',
        'html_ruby': 'html',
        'html': 'html',
        'ini': 'ini',
        'io': 'io',
        'jack': 'jack',
        'jade': 'pug',
        'java': 'java',
        'javascript': 'javascript',
        'json': 'json',
        'json5': 'json5',
        'jsoniq': 'json',
        'jsp': 'jsp',
        'jssm': 'jssm',
        'jsx': 'jsx',
        'julia': 'julia',
        'kotlin': 'kotlin',
        'kusto': 'kusto',
        'latex': 'latex',
        'latte': 'latte',
        'less': 'less',
        'liquid': 'liquid',
        'lisp': 'lisp',
        'livescript': 'livescript',
        'logiql': 'logiql',
        'logtalk': 'logtalk',
        'lsl': 'lsl',
        'lua': 'lua',
        'luapage': 'luapage',
        'lucene': 'lucene',
        'makefile': 'makefile',
        'markdown': 'markdown',
        'mask': 'mask',
        'matlab': 'matlab',
        'maze': 'maze',
        'mediawiki': 'mediawiki',
        'mel': 'mel',
        'mikrotik': 'mikrotik',
        'mips': 'mipsasm',
        'mixal': 'mixal',
        'mushcode': 'mushcode',
        'mysql': 'sql',
        'nginx': 'nginx',
        'nim': 'nim',
        'nix': 'nix',
        'nsis': 'nsis',
        'nunjucks': 'nunjucks',
        'objectivec': 'objectivec',
        'ocaml': 'ocaml',
        'pascal': 'pascal',
        'perl': 'perl',
        'perl6': 'perl',
        'pgsql': 'sql',
        'php_laravel_blade': 'blade',
        'php': 'php',
        'pig': 'pig',
        'plain_text': 'text',
        'powershell': 'powershell',
        'praat': 'praat',
        'prisma': 'prisma',
        'prolog': 'prolog',
        'properties': 'properties',
        'protobuf': 'protobuf',
        'pug': 'pug',
        'puppet': 'puppet',
        'python': 'python',
        'qml': 'qml',
        'r': 'r',
        'raku': 'raku',
        'razor': 'razor',
        'rdoc': 'rdoc',
        'red': 'red',
        'redshift': 'sql',
        'regexp': 'regex',
        'rhtml': 'rhtml',
        'rst': 'rest',
        'ruby': 'ruby',
        'rust': 'rust',
        'sas': 'sas',
        'sass': 'sass',
        'sassdoc': 'sass',
        'scad': 'scad',
        'scala': 'scala',
        'scheme': 'scheme',
        'scrypt': 'scrypt',
        'scss': 'scss',
        'sh': 'bash',
        'sjs': 'sjs',
        'slim': 'slim',
        'smalltalk': 'smalltalk',
        'smarty': 'smarty',
        'smithy': 'smithy',
        'solidity': 'solidity',
        'soy_template': 'soy',
        'space': 'space',
        'sparql': 'sparql',
        'sql': 'sql',
        'sqlserver': 'sql',
        'stylus': 'stylus',
        'svg': 'svg',
        'swift': 'swift',
        'tcl': 'tcl',
        'terraform': 'hcl',
        'tex': 'tex',
        'text': 'text',
        'textile': 'textile',
        'toml': 'toml',
        'tsx': 'tsx',
        'turtle': 'turtle',
        'twig': 'twig',
        'typescript': 'typescript',
        'vala': 'vala',
        'vbscript': 'vbscript',
        'velocity': 'velocity',
        'verilog': 'verilog',
        'vhdl': 'vhdl',
        'visualforce': 'visualforce',
        'vue': 'vue',
        'wollok': 'wollok',
        'xml': 'xml',
        'xquery': 'xquery',
        'xsl': 'xsl',
        'yaml': 'yaml',
        'zeek': 'zeek'
    };

    // Function to get Prism.js compatible language name
    function getPrismLanguage(dbLanguage) {
        return languageMap[dbLanguage] || 'text';
    }

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
                    code.className = `language-${getPrismLanguage(content.language)}`;
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