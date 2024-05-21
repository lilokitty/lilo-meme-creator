document.addEventListener('DOMContentLoaded', () => {
    const backgrounds = ['background1.png', 'background2.png', 'background3.png', 'background4.png', 'background5.png'];
    const hats = ['bonnet.jpg', 'cowboy hat.jpg', 'tophat.jpg', 'rainbowbbhat.jpg', 'luckyhat.jpg'];
    const clothes = ['clothes1.png', 'clothes2.png', 'clothes3.png', 'clothes4.png', 'clothes5.png'];
    const mouths = ['mouth1.png', 'mouth2.png', 'mouth3.png', 'mouth4.png', 'mouth5.png'];
    const attributes = ['attribute1.png', 'attribute2.png', 'attribute3.png', 'attribute4.png', 'attribute5.png'];
    const accessories = ['accessory1.png', 'accessory2.png', 'accessory3.png', 'accessory4.png', 'accessory5.png'];

    const baseImageSrc = 'assets/lilo.jpg'; //path to lilo
    const previewCanvas = document.getElementById('avatar-preview');
    const previewCtx = previewCanvas.getContext('2d');
    const finalCanvas = document.getElementById('avatar-canvas');
    const finalCtx = finalCanvas.getContext('2d');

    function populateOptions(sectionId, options) {
        const section = document.getElementById(sectionId);
        section.innerHTML = ''; // Clear any existing options
        options.forEach(option => {
            const img = document.createElement('img');
            img.src = `assets/${option}`;
            img.classList.add('option');
            img.setAttribute('loading', 'lazy');
            img.addEventListener('click', () => selectOption(sectionId, option));
            section.appendChild(img);
        });
    }

    function selectOption(sectionId, option) {
        const section = document.getElementById(sectionId);
        section.querySelectorAll('img').forEach(img => {
            img.classList.remove('selected');
            if (img.src.includes(option)) {
                img.classList.add('selected');
            }
        });
        updatePreview();
    }

    function initialize() {
        populateOptions('background-options', backgrounds);
        populateOptions('hat-options', hats);
        populateOptions('clothes-options', clothes);
        populateOptions('mouth-options', mouths);
        populateOptions('attributes-options', attributes);
        populateOptions('accessories-options', accessories);
        loadBaseImage();
    }

    function loadBaseImage() {
        const baseImage = new Image();
        baseImage.src = baseImageSrc;
        baseImage.onload = () => {
            previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            previewCtx.drawImage(baseImage, 0, 0, previewCanvas.width, previewCanvas.height);
        };
    }

    function updatePreview() {
        loadBaseImage();
        const selectedOptions = document.querySelectorAll('.option.selected');
        selectedOptions.forEach(option => {
            const img = new Image();
            img.src = option.src;
            img.onload = () => {
                previewCtx.drawImage(img, 0, 0, previewCanvas.width, previewCanvas.height);
            };
        });
    }

    function validateSelections() {
        const sections = ['background-options', 'hat-options', 'clothes-options', 'mouth-options', 'attributes-options', 'accessories-options'];
        for (const sectionId of sections) {
            const selected = document.querySelector(`#${sectionId} .selected`);
            if (!selected) {
                alert(`Please select an option for ${sectionId.replace('-options', '').replace('-', ' ')}.`);
                return false;
            }
        }
        return true;
    }

    function showLoadingSpinner() {
        document.getElementById('loading-spinner').style.display = 'block';
    }

    function hideLoadingSpinner() {
        document.getElementById('loading-spinner').style.display = 'none';
    }

    function downloadImage() {
        if (!validateSelections()) {
            return;
        }

        showLoadingSpinner();

        const selectedOptions = document.querySelectorAll('.option.selected');
        const images = [baseImageSrc];

        selectedOptions.forEach(option => {
            images.push(option.src);
        });

        let loadedImagesCount = 0;
        const imageElements = images.map(src => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loadedImagesCount++;
                if (loadedImagesCount === images.length) {
                    finalCtx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
                    images.forEach((src, index) => {
                        const img = new Image();
                        img.src = src;
                        img.onload = () => {
                            finalCtx.drawImage(img, 0, 0, finalCanvas.width, finalCanvas.height);
                            if (index === images.length - 1) {
                                const link = document.createElement('a');
                                link.download = 'avatar.png';
                                link.href = finalCanvas.toDataURL('image/png');
                                link.click();
                                hideLoadingSpinner();
                            }
                        };
                    });
                }
            };
            return img;
        });
    }

    document.getElementById('download-avatar').addEventListener('click', downloadImage);

    initialize();
});




