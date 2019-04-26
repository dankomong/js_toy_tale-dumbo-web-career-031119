const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
let addToy = false
const createToyBtn = document.querySelector('input[type=submit]');
const toyDiv = document.getElementById('toy-collection')

// YOUR CODE HERE

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})


createToyBtn.parentElement.addEventListener('submit', (e) => {
  e.preventDefault();
  //we need to comm. w the server and manipulate the dom
  const inputName = document.querySelector('input[name=name]');
  const inputImage = document.querySelector('input[name=image]');

  //calling our post new toy function with input values
  postNewToy(inputName.value, inputImage.value).then(parsedData => {
    // turning parsedData into an array bc our function relies on parsedData being an arr
    // In this case, parsedData is a single object from a post.
    renderToyCard([parsedData])
  })
})

toyDiv.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const pTag = e.target.parentElement.querySelector('p');
    const divTag = e.target.parentElement
    // updates likes
    let likeCount = parseInt(pTag.dataset.likes)
    likeCount++;
    pTag.dataset.likes++;

    // calling patch request to pessimistically render
    updateLikes(divTag.dataset.id, pTag.dataset.likes).then(parsedData => {
      pTag.innerText = `${likeCount} Likes`
    })
  }
})


// OR HERE!

const divCollection = document.getElementById('toy-collection');

//function to get all toys
const getToys = () => {
  fetch('http://localhost:3000/toys')
  .then(resp => resp.json())
  .then(parsedData => renderToyCard(parsedData));
}

//function to post a new toy
const postNewToy = (name, image) => {
  return fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      'name': name,
      'image': image,
      'likes': 0
    })
  }).then(resp => resp.json());
}

//function to increase a like
const updateLikes = (id, likes) => {
  return fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      'likes': likes
    })
  }).then(res => res.json())
}


//function to render each toy card
const renderToyCard = (parsedData) => {
  parsedData.forEach(toy => {
    const newDiv = `<div data-id=${toy.id} class="card">
    <h2>${toy.name}</h2>
    <img src=${toy.image} class="toy-avatar" />
    <p data-likes=${toy.likes}>${toy.likes} Likes </p>
    <button class="like-btn">Like <3</button>
    <button class="delete-btn">Delete >:(</button>
    </div> `
    divCollection.innerHTML += newDiv;
  })
}


//calling the function to get all toys
getToys();
