const editor = grapesjs.init({
    container: '#gjs',
    height: '100vh',
    width: 'auto',
    storageManager: {
        type: 'local',
        autosave: true,
        autoload: true,
    },
    plugins: ['grapesjs-preset-webpage'],
    pluginsOpts: {
        'grapesjs-preset-webpage': {
            blocks: ['column1', 'column2', 'column3', 'text', 'link', 'image', 'video'],
            modalImportTitle: 'Import Template',
            modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS</div>',
            modalImportContent: function(editor) {
                return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
            },
        }
    },
    canvas: {
        styles: [
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
        ],
    },
    styleManager: {
        sectors: [{
            name: 'Dimension',
            open: false,
            buildProps: ['width', 'min-height', 'padding'],
        },{
            name: 'Typography',
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align'],
        },{
            name: 'Decorations',
            open: false,
            buildProps: ['opacity', 'border-radius', 'border', 'box-shadow', 'background'],
        }]
    },
});

// Add M2 Studios custom blocks
editor.BlockManager.add('cta-button', {
    label: 'CTA Button',
    category: 'M2 Studios',
    content: '<a href="#" class="btn btn-primary btn-lg">Join Our Dance Class</a>',
    attributes: { class: 'fa fa-hand-pointer-o' }
});

editor.BlockManager.add('dance-section', {
    label: 'Dance Section',
    category: 'M2 Studios',
    content: `
        <section style="padding: 60px 20px; text-align: center; background: #f8f9fa;">
            <h2 style="margin-bottom: 20px;">Movementz Factory Dance Studio</h2>
            <p style="margin-bottom: 30px;">Professional dance training in Coimbatore</p>
            <a href="#" class="btn btn-primary">Book a Class</a>
        </section>
    `
});

editor.BlockManager.add('photography-section', {
    label: 'Photography Section',
    category: 'M2 Studios',
    content: `
        <section style="padding: 60px 20px; text-align: center;">
            <h2 style="margin-bottom: 20px;">Momentz Photography</h2>
            <p style="margin-bottom: 30px;">Capturing your special moments</p>
            <a href="#" class="btn btn-secondary">View Portfolio</a>
        </section>
    `
});

// Save button functionality
editor.Panels.addButton('options', {
    id: 'save-db',
    className: 'fa fa-floppy-o',
    command: 'save-db',
    attributes: { title: 'Save Template' }
});

editor.Commands.add('save-db', {
    run: function(editor, sender) {
        sender && sender.set('active', 0);
        const html = editor.getHtml();
        const css = editor.getCss();
        
        // Save locally
        localStorage.setItem('gjsProject', JSON.stringify({html, css}));
        
        // Sync to GitHub
        if (typeof syncToGitHub === 'function') {
            syncToGitHub(html, css);
        } else {
            alert('Design saved locally!');
        }
    }
});

// Export button
editor.Panels.addButton('options', {
    id: 'export-template',
    className: 'fa fa-download',
    command: 'export-template',
    attributes: { title: 'Export Code' }
});

editor.Commands.add('export-template', {
    run: function(editor) {
        const html = editor.getHtml();
        const css = '<style>' + editor.getCss() + '</style>';
        const fullCode = html + css;
        
        // Copy to clipboard
        navigator.clipboard.writeText(fullCode);
        alert('Code copied to clipboard! Paste it into your main HTML file.');
    }
});

console.log('M2 Studios Visual Editor loaded successfully!');
