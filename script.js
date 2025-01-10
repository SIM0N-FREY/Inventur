// Product database
const productData = {
    "8Ø": {
        "3/3": 1.8,
        "3/6": 1.9,
        "6/6": 2.1,
        "3": 0.8,
        "6": 1.1,
        "5": 1.6,
        "10": 1.9,
        "15": 2.0
    },
    "6Ø": {
        "3/3": 1.6,
        "3/6": 1.9,
        "6/6": 2.1,
        "3": 0.3,
        "6": 0.7,
        "5": 0.3,
        "10": 0.4,
        "15": 2.0
    },
    "Sonstiges": {
        "Schäkel 1t": 0.1,
        "Schäkel 2t": 0.2,
        "Anschlag 1,5m": 1.3,
        "Anschlag 3m": 2.1,
        "O-Ring": 0.2
    },
    "Strom": {
        "PE 40m": 2.6,
        "SchuKo 20m": 1.8
    }
};

// Event listeners for radio buttons
document.querySelectorAll('input[name="category"]').forEach(radio => {
    radio.addEventListener('change', updateProductDropdown);
});

// Event listener for product selection
document.getElementById('product').addEventListener('change', updateWeightDisplay);

function updateProductDropdown() {
    const category = document.querySelector('input[name="category"]:checked').value;
    const productSelect = document.getElementById('product');
    const products = productData[category];

    // Clear and enable dropdown
    productSelect.innerHTML = '<option value="">Select a product</option>';
    productSelect.disabled = false;

    // Add new options
    Object.keys(products).forEach(product => {
        const option = document.createElement('option');
        option.value = product;
        option.textContent = product;
        productSelect.appendChild(option);
    });

    updateWeightDisplay();
}

function updateWeightDisplay() {
    const category = document.querySelector('input[name="category"]:checked')?.value;
    const product = document.getElementById('product').value;
    const weightDisplay = document.getElementById('weightDisplay');

    if (category && product && productData[category][product]) {
        const weight = productData[category][product];
        weightDisplay.textContent = `Product Weight: ${weight} kg`;
    } else {
        weightDisplay.textContent = 'Product Weight: - kg';
    }
}

function calculateItems() {
    const boxWeight = parseFloat(document.getElementById('boxWeight').value);
    const category = document.querySelector('input[name="category"]:checked')?.value;
    const product = document.getElementById('product').value;
    const errorDiv = document.getElementById('error');
    const resultDiv = document.getElementById('result');

    // Reset displays
    errorDiv.style.display = 'none';
    resultDiv.style.display = 'none';

    // Validate inputs
    if (!category || !product) {
        showError('Please select both category and product');
        return;
    }

    if (!boxWeight || boxWeight <= 0) {
        showError('Please enter a valid box weight');
        return;
    }

    const productWeight = productData[category][product];
    
    // Calculate and round to nearest integer
    const numberOfItems = Math.round(boxWeight / productWeight);
    
    // Display result
    resultDiv.textContent = `Number of items in box: ${numberOfItems}`;
    resultDiv.style.display = 'block';
}

function clearInputs() {
    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.checked = false;
    });
    document.getElementById('product').innerHTML = '<option value="">First select a category</option>';
    document.getElementById('product').disabled = true;
    document.getElementById('boxWeight').value = '';
    document.getElementById('error').style.display = 'none';
    document.getElementById('result').style.display = 'none';
    document.getElementById('weightDisplay').textContent = 'Product Weight: - kg';
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// PWA Installation
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(registration => console.log('ServiceWorker registration successful'))
        .catch(err => console.log('ServiceWorker registration failed: ', err));
}

// Install prompt handling
let deferredPrompt;
const installPrompt = document.getElementById('installPrompt');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installPrompt.style.display = 'block';
});

installPrompt.addEventListener('click', (e) => {
    installPrompt.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }
        deferredPrompt = null;
    });
});
