async function fetchImages() {
    const url = `http://nasa.hubsquadron.org:8001/images/`;
    console.log('Fetching data from URL:', url); // Логування URL
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('Error fetching data:', response.statusText);
            return [];
        }

        const data = await response.json();
        console.log('Fetched data:', data); // Лог для перевірки отриманих даних
        
        return data.images || []; // Повертаємо масив зображень або порожній масив
    } catch (error) {
        console.error('Fetch error:', error);
        return []; // Повертаємо порожній масив у разі помилки
    }
}

async function fetchImage(imageName) {
    const url = `http://nasa.hubsquadron.org:8001/images/${imageName}`;
    console.log('Fetching image from URL:', url); // Логування URL
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('Error fetching image:', response.statusText);
            return null;
        }

        // Тут вам потрібно буде обробити двійкові дані
        const blob = await response.blob(); // Отримуємо зображення як Blob
        const imageUrl = URL.createObjectURL(blob); // Створюємо URL для зображення
        return imageUrl; // Повертаємо URL для використання в src
    } catch (error) {
        console.error('Fetch image error:', error);
        return null; // Повертаємо null у разі помилки
    }
}

async function displayImages(images,startTime, endTime) {
    const imageListContainer = document.getElementById('image-list');

    // Очищуємо попередні дані
    imageListContainer.innerHTML = '';

    for (const imageName of images) {
        const dateString = imageName.split('_')[imageName.split('_').length - 1].split(".")[0];

        const imageDate = new Date(dateString);
        const startDate = new Date(startTime);
        const endDate = new Date(endTime)

        if (imageDate >= startDate && imageDate <= endDate) {
            console.log(imageDate)
            const imageUrl = await fetchImage(imageName); // Отримуємо URL зображення
            if (imageUrl) {
                const duration = imageName.split('_').pop().split('.')[0]; // Отримуємо тривалість з назви зображення
                const date = imageName.split('_')[2]; // Отримуємо дату з назви зображення

                // Створюємо елемент зображення
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl; // Встановлюємо URL зображення
                imgElement.alt = 'Алерт';
                imgElement.style.width = '100%'; // Встановлюємо ширину зображення

                // Створюємо елемент для інформації
                const infoElement = document.createElement('div');
                infoElement.textContent = `Date: ${date}, Duration: ${duration} sec`;
                infoElement.style.color = 'black'; // Встановлюємо колір тексту

                // Додаємо елементи до контейнера
                imageListContainer.appendChild(imgElement);
                imageListContainer.appendChild(infoElement);
            }
        }
    }
}

async function monitorActivity() {
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;

   if (!startTime || !endTime) {
       alert('Enter dates, please!');
      return;
   }
    const images = await fetchImages();
    await displayImages(images,startTime,endTime);

    const radarImage = document.getElementById('radar-image');
    const messageElement = document.getElementById('message');

    if (images.length > 0) {
        radarImage.src = 'img/red.jpg'; // Change to red image
        messageElement.textContent = 'Abnormal activity detected!'; // Update message
    } else {
        radarImage.src = 'img/green.jpg'; // Change back to green image
        messageElement.textContent = 'No abnormal activity detected'; // Revert message
    }
    
}

// setInterval(monitorActivity, 15000);
// Додайте обробник події на кнопку
document.getElementById('fetch-images').addEventListener('click', monitorActivity);
