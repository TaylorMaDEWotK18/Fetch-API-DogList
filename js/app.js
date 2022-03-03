const select = document.getElementById('breeds');
const card = document.querySelector('.card'); 
const form = document.querySelector('form');

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------

function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .catch(error => console.log('Looks like there was an error', error))
}

Promise.all([
    fetchData('https://dog.ceo/api/breeds/list'),
    fetchData('https://dog.ceo/api/breeds/image/random')
])
.then(data => {
    const breedList = data[0].message;
    const randomImage = data[1].message;

    generateOptions(breedList);
    generateImage(randomImage);
})

// After creating the Promise.all method above we can now delete the original fetch requests below, yet we can keep them just in case any promise in the Promise.all fails to load and it does'nt completely crash (it being ALL or NOTHING in all with the Promise.all method)

// fetchData('https://dog.ceo/api/breeds/list')
//     .then(data => generateOptions(data.message))

// fetchData('https://dog.ceo/api/breeds/image/random')
//     .then(data => generateImage(data.message))

// Below are the original fetch() methods used before adding the reusing fetchData function above!    

// fetch('https://dog.ceo/api/breeds/list')
//     .then(response => response.json())
//     .then(data => generateOptions(data.message))

// fetch('https://dog.ceo/api/breeds/image/random')
//     .then(response => response.json())
//     .then(data => generateImage(data.message))

// Next, I'm going to create a fetch request that uses the breed name images, random end point to return a random image from the selected breed when a user clicks the image, or anywhere in the card div, as you can see here in the final demo. And when a user selects a breed, will also let them know they can click to display another random image of the selected breed.

function fetchBreedImage() {
    const breed = select.value;
    const img = card.querySelector('img');
    const p = card.querySelector('p');

    fetchData(`https://dog.ceo/api/breed/${breed}/images/random`)
        .then(data => {
            img.src = data.message;
            img.alt = breed;
            p.textContent = `Click to view more ${breed}s`;
        })
}




// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------
function generateOptions(data) {
    const options = data.map(item => `
        <option value = "${item}">${item}</option>
    `);
    select.innerHTML = options;
}

function generateImage(data) {
    const html = `
        <img src="${data}" alt>
        <p>Click here to view image of ${select.value}s</p>
    `;
    card.innerHTML = html;
}

function checkStatus(response)  {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------
 select.addEventListener('change', fetchBreedImage);
 card.addEventListener('click', fetchBreedImage);
 form.addEventListener('submit', postData);

// ------------------------------------------
//  POST DATA
// ------------------------------------------
function postData(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;

    fetch('https://jsonplaceholder.typicode.com/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, comment})
    }) 
        .then(checkStatus)
        .then(res => res.json())
        .then(data => console.log(data))
}