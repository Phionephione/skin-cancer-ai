document.addEventListener('DOMContentLoaded', () => {
    // Nav Elements
    const navSingle = document.getElementById('nav-single');
    const navMulti = document.getElementById('nav-multi');
    
    // Sections
    const uploadSection = document.getElementById('upload-section');
    const resultsSingle = document.getElementById('results-single');
    const resultsMulti = document.getElementById('results-multi');
    const loadingState = document.getElementById('loading-state');
    const dropZone = document.getElementById('drop-zone');
    
    // Inputs & Buttons
    const fileInput = document.getElementById('file-input');
    const btnResetSingle = document.getElementById('btn-reset-single');
    const btnResetMulti = document.getElementById('btn-reset-multi');
    const btnDownloadPdf = document.getElementById('btn-download-pdf');

    // State
    let currentMode = 'single'; // 'single' or 'multi'
    let lastPdfBase64 = null;

    // --- NAVIGATION ---
    navSingle.addEventListener('click', (e) => {
        e.preventDefault();
        navSingle.classList.add('active');
        navMulti.classList.remove('active');
        currentMode = 'single';
        resetUI();
    });

    navMulti.addEventListener('click', (e) => {
        e.preventDefault();
        navMulti.classList.add('active');
        navSingle.classList.remove('active');
        currentMode = 'multi';
        resetUI();
    });

    // --- DRAG AND DROP ---
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    // --- RESET ACTIONS ---
    btnResetSingle.addEventListener('click', resetUI);
    btnResetMulti.addEventListener('click', resetUI);
    
    // --- PDF DOWNLOAD ---
    btnDownloadPdf.addEventListener('click', () => {
        if (!lastPdfBase64) return;
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${lastPdfBase64}`;
        link.download = 'Medical_AI_Report.pdf';
        link.click();
    });

    function resetUI() {
        uploadSection.classList.remove('hidden');
        resultsSingle.classList.add('hidden');
        resultsMulti.classList.add('hidden');
        dropZone.classList.remove('hidden');
        loadingState.classList.add('hidden');
        fileInput.value = '';
        lastPdfBase64 = null;
    }

    async function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPG/PNG).');
            return;
        }

        // Show Loading
        dropZone.classList.add('hidden');
        loadingState.classList.remove('hidden');

        const formData = new FormData();
        formData.append('file', file);

        try {
            if (currentMode === 'single') {
                const res = await fetch('/api/analyze', { method: 'POST', body: formData });
                if(!res.ok) throw new Error("API request failed");
                const data = await res.json();
                renderSingleResults(data);
            } else {
                const res = await fetch('/api/detect', { method: 'POST', body: formData });
                if(!res.ok) throw new Error("API request failed");
                const data = await res.json();
                renderMultiResults(data);
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred during analysis.');
            resetUI();
        }
    }

    function renderSingleResults(data) {
        uploadSection.classList.add('hidden');
        resultsSingle.classList.remove('hidden');

        document.getElementById('res-original').src = data.original;
        document.getElementById('res-heatmap').src = data.heatmap;
        
        const resText = document.getElementById('res-text');
        resText.textContent = data.result;
        resText.className = 'diagnosis-result ' + (data.result === 'Melanoma' ? 'melanoma' : 'benign');

        document.getElementById('res-conf-text').textContent = data.confidence.toFixed(2) + '%';
        
        // Animated progress bar
        setTimeout(() => {
            document.getElementById('res-conf-bar').style.width = data.confidence + '%';
        }, 100);

        if (data.pdf) {
            lastPdfBase64 = data.pdf;
            btnDownloadPdf.classList.remove('hidden');
        } else {
            btnDownloadPdf.classList.add('hidden');
        }
    }

    function renderMultiResults(data) {
        uploadSection.classList.add('hidden');
        resultsMulti.classList.remove('hidden');

        document.getElementById('multi-original').src = data.original;
        document.getElementById('spots-count-text').textContent = `Found ${data.count} spots.`;

        const list = document.getElementById('spots-list');
        list.innerHTML = '';

        if (data.spots.length === 0) {
            list.innerHTML = '<li style="color:var(--text-muted); padding:1rem;">No discernible spots found.</li>';
            return;
        }

        data.spots.forEach((spot, index) => {
            const isMelanoma = spot.result === 'Melanoma';
            const li = document.createElement('li');
            li.className = 'spot-item';
            
            li.innerHTML = `
                <img src="${spot.image}" alt="Spot ${index + 1}">
                <div class="spot-info">
                    <h4 style="color: ${isMelanoma ? '#ef4444' : '#10b981'}">Spot ${index + 1}: ${spot.result}</h4>
                    <p>Confidence: ${spot.confidence.toFixed(2)}%</p>
                </div>
                <div class="spot-status ${isMelanoma ? 'status-danger' : 'status-safe'}"></div>
            `;
            list.appendChild(li);
        });
    }
});
