document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('download-btn');
    const videoUrlInput = document.getElementById('video-url');
    const statusMsg = document.getElementById('status-message');
    const progressContainer = document.getElementById('progress-container');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    downloadBtn.addEventListener('click', async () => {
        const url = videoUrlInput.value.trim();
        
        if (!url) {
            showStatus('Please paste a valid YouTube URL', 'error');
            return;
        }

        if (!url.includes('youtube.com/') && !url.includes('youtu.be/')) {
            showStatus('Please enter a valid YouTube link', 'error');
            return;
        }

        // Start UI loading state
        setLoading(true);
        showStatus('Analyzing video...', 'success');
        
        try {
            // In a real app with progress updates, we might use WebSockets or SSE.
            // For this version, we'll start the download.
            
            const downloadUrl = `/download?url=${encodeURIComponent(url)}`;
            
            // We create a temporary link to trigger the browser's download dialog
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            
            // Reset after a delay
            setTimeout(() => {
                document.body.removeChild(link);
                setLoading(false);
                showStatus('Download started! Check your downloads folder.', 'success');
            }, 3000);

        } catch (error) {
            console.error(error);
            showStatus('An error occurred. Please try again.', 'error');
            setLoading(false);
        }
    });

    function showStatus(msg, type) {
        statusMsg.textContent = msg;
        statusMsg.className = 'status-message ' + type;
    }

    function setLoading(isLoading) {
        if (isLoading) {
            downloadBtn.classList.add('btn-loading');
            downloadBtn.disabled = true;
            progressContainer.style.display = 'block';
            
            // Simulate progress for UX
            let progress = 0;
            const interval = setInterval(() => {
                if (progress < 90) {
                    progress += Math.random() * 5;
                    progressFill.style.width = `${progress}%`;
                    progressText.textContent = `Processing: ${Math.round(progress)}%`;
                } else {
                    clearInterval(interval);
                }
            }, 500);
            
            downloadBtn._interval = interval;
        } else {
            downloadBtn.classList.remove('btn-loading');
            downloadBtn.disabled = false;
            clearInterval(downloadBtn._interval);
            progressFill.style.width = '100%';
            progressText.textContent = 'Ready!';
            
            setTimeout(() => {
                progressContainer.style.display = 'none';
                progressFill.style.width = '0%';
            }, 2000);
        }
    }
});
