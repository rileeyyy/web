let elementCount = 0;
let selectedElement = null;

document.getElementById('addButton').addEventListener('click', toggleElementMenu);
document.querySelectorAll('#elementMenu button').forEach(button => {
    button.addEventListener('click', () => addElement(button.dataset.type));
});

function toggleElementMenu() {
    const menu = document.getElementById('elementMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function addElement(type) {
    elementCount++;
    const element = document.createElement('div');
    element.className = `element ${type}`;
    element.id = `element${elementCount}`;
    element.dataset.type = type;
    element.style.left = '50px';
    element.style.top = '50px';
    element.style.width = '200px';
    element.style.height = 'auto';
    
    switch(type) {
        case 'banner':
            element.innerHTML = 'banner';
            element.style.backgroundColor = '#3B82F6';
            element.style.color = 'white';
            break;
        case 'text':
            element.innerHTML = 'text';
            break;
        case 'image':
            element.innerHTML = '<img src="placeholder" alt="placeholder" style="max-width:100%;height:auto;">';
            break;
        case 'button':
            element.innerHTML = 'click me!';
            element.style.backgroundColor = '#10B981';
            element.style.color = 'white';
            break;
        case 'marquee':
            element.innerHTML = '<span>marquee</span>';
            break;
    }
    
    document.getElementById('canvas').appendChild(element);
    element.addEventListener('click', showProperties);
    makeElementDraggable(element);
    toggleElementMenu();
}


function makeElementDraggable(element) {
    interact(element).draggable({
        listeners: {
            move(event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        }
    });
}


function showProperties(event) {
    selectedElement = event.target.closest('.element');
    const type = selectedElement.dataset.type;
    
    document.getElementById('elementWidth').value = selectedElement.offsetWidth;
    document.getElementById('elementHeight').value = selectedElement.offsetHeight;
    
    const specificProps = document.getElementById('specificProperties');
    specificProps.innerHTML = '';
    
    switch(type) {
        case 'banner':
        case 'button':
            specificProps.innerHTML = `
                <label class="block mb-2">
                    <span class="text-gray-700">text:</span>
                    <input type="text" id="elementText" class="mt-1 w-full rounded-md border-gray-300 shadow-sm" value="${selectedElement.textContent}">
                </label>
                <label class="block mb-2">
                    <span class="text-gray-700">background color:</span>
                    <input type="color" id="elementBgColor" class="mt-1 w-full rounded-md border-gray-300 shadow-sm" value="${rgb2hex(selectedElement.style.backgroundColor)}">
                </label>
                <label class="block mb-2">
                    <span class="text-gray-700">text color:</span>
                    <input type="color" id="elementTextColor" class="mt-1 w-full rounded-md border-gray-300 shadow-sm" value="${rgb2hex(selectedElement.style.color)}">
                </label>
            `;
            if (type === 'button') {
                specificProps.innerHTML += `
                    <label class="block mb-2">
                        <span class="text-gray-700">url:</span>
                        <input type="text" id="elementUrl" class="mt-1 w-full rounded-md border-gray-300 shadow-sm" value="${selectedElement.getAttribute('href') || '#'}">
                    </label>
                `;
            }
            break;
        case 'text':
            specificProps.innerHTML = `
                <label class="block mb-2">
                    <span class="text-gray-700">text:</span>
                    <input type="text" id="elementText" class="mt-1 w-full rounded-md border-gray-300 shadow-sm" value="${selectedElement.textContent}">
                </label>
                <label class="block mb-2">
                    <span class="text-gray-700">color:</span>
                    <input type="color" id="elementTextColor" class="mt-1 w-full rounded-md border-gray-300 shadow-sm" value="${rgb2hex(selectedElement.style.color)}">
                </label>
                <label class="block mb-2">
                    <span class="text-gray-700">font size (px):</span>
                    <input type="number" id="elementFontSize" class="mt-1 w-full rounded-md border-gray-300 shadow-sm" value="${parseInt(selectedElement.style.fontSize) || 16}">
                </label>
            `;
            break;
        case 'image':
            specificProps.innerHTML = `
                <label class="block mb-2">
                    <span class="text-gray-700">image url:</span>
                    <input type="text" id="elementImageUrl" class="mt-1 w-full rounded-md border-gray-300 shadow-sm" value="${selectedElement.querySelector('img').src}">
                </label>
                <label class="block mb-2">
                    <span class="text-gray-700">alt text:</span>
                    <input type="text" id="elementAltText" class="mt-1 w-full rounded-md border-gray-300 shadow-sm" value="${selectedElement.querySelector('img').alt}">
                </label>
            `;
            break;
        case 'marquee':
            specificProps.innerHTML = `
                <label class="block mb-2">
                    <span class="text-gray-700">text:</span>
                    <input type="text" id="elementText" class="mt-1 w-full rounded-md border-gray-300 shadow-sm" value="${selectedElement.textContent}">
                </label>
                <label class="block mb-2">
                    <span class="text-gray-700">speed (1-10):</span>
                    <input type="number" id="elementSpeed" min="1" max="10" class="mt-1 w-full rounded-md border-gray-300 shadow-sm" value="${selectedElement.dataset.speed || 5}">
                </label>
            `;
            break;
    }
    specificProps.innerHTML += `
    <button id="deleteElement" class="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        delete
    </button>
    `;
    document.getElementById('properties').style.display = 'block';
    document.getElementById('deleteElement').addEventListener('click', deleteSelectedElement);
}


function deleteSelectedElement() {
    if (selectedElement) {
        selectedElement.remove();
        document.getElementById('properties').style.display = 'none';
        selectedElement = null;
    }
}

document.getElementById('applyProperties').addEventListener('click', applyProperties);

function applyProperties() {
    if (selectedElement) {
        const type = selectedElement.dataset.type;
        selectedElement.style.width = `${document.getElementById('elementWidth').value}px`;
        selectedElement.style.height = `${document.getElementById('elementHeight').value}px`;
        
        switch(type) {
            case 'banner':
            case 'button':
                selectedElement.textContent = document.getElementById('elementText').value;
                selectedElement.style.backgroundColor = document.getElementById('elementBgColor').value;
                selectedElement.style.color = document.getElementById('elementTextColor').value;
                if (type === 'button') {
                    selectedElement.setAttribute('href', document.getElementById('elementUrl').value);
                }
                break;
            case 'text':
                selectedElement.textContent = document.getElementById('elementText').value;
                selectedElement.style.color = document.getElementById('elementTextColor').value;
                selectedElement.style.fontSize = `${document.getElementById('elementFontSize').value}px`;
                break;
            case 'image':
                selectedElement.querySelector('img').src = document.getElementById('elementImageUrl').value;
                selectedElement.querySelector('img').alt = document.getElementById('elementAltText').value;
                break;
            case 'marquee':
                selectedElement.textContent = document.getElementById('elementText').value;
                selectedElement.dataset.speed = document.getElementById('elementSpeed').value;
                updateMarqueeAnimation(selectedElement);
                break;
        }
    }
    document.getElementById('properties').style.display = 'none';
}

function updateMarqueeAnimation(element) {
    const speed = element.dataset.speed;
    element.querySelector('span').style.animation = `marquee ${15 - speed}s linear infinite`;
}


document.getElementById('generateHTML').addEventListener('click', generateHTML);


function generateHTML() {
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>my website :D</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
        .marquee { overflow: hidden; white-space: nowrap; }
        .marquee span { display: inline-block; padding-left: 100%; animation: marquee 15s linear infinite; }
    </style>
</head>
<body>
    <div id="canvas" class="w-full h-[600px] relative bg-white overflow-hidden">
`;
    const elements = document.querySelectorAll('#canvas > div');
    elements.forEach(element => {
        const type = element.dataset.type;
        const style = `position: absolute; left: ${element.style.left}; top: ${element.style.top}; transform: ${element.style.transform}; width: ${element.style.width}; height: ${element.style.height};`;
        
        switch(type) {
            case 'banner':
                html += `        <div style="${style} background-color: ${element.style.backgroundColor}; color: ${element.style.color};" class="p-4 text-center">${element.textContent}</div>\n`;
                break;
            case 'text':
                html += `        <p style="${style} color: ${element.style.color}; font-size: ${element.style.fontSize};">${element.textContent}</p>\n`;
                break;
            case 'image':
                const img = element.querySelector('img');
                html += `        <img src="${img.src}" alt="${img.alt}" style="${style} max-width: 100%; height: auto;">\n`;
                break;
            case 'button':
                html += `        <a href="${element.getAttribute('href') || '#'}" style="${style} background-color: ${element.style.backgroundColor}; color: ${element.style.color};" class="inline-block py-2 px-4 rounded">${element.textContent}</a>\n`;
                break;
            case 'marquee':
                const speed = element.dataset.speed || 5;
                html += `        <div style="${style}" class="marquee">
            <span style="animation-duration: ${15 - speed}s;">${element.textContent}</span>
        </div>\n`;
                break;
        }
    });

    html += `    </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'generated.html';
    a.click();
}

function rgb2hex(rgb) {
    if (rgb.startsWith('#')) return rgb;
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!rgb) return '#000000';
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

document.addEventListener('DOMContentLoaded', function() {
});