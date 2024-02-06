const flipSound = new Audio('./DEV/sound/flip3.wav'),
    correctSound = new Audio('./DEV/sound/correct.mp3'),
    wrongSound = new Audio('./DEV/sound/wrong.wav')

const input = document.querySelector("input"),
    previewContainer = document.querySelector(".previewImage__container"),
    pageRefresherContainer = document.querySelector(".pageRefresher__container"),
    imageSelectorLabel =  document.querySelector(".imageSelectorLabel"),
    imageSelectorText = document.querySelector(".imageSelector__text"),
    cardCreatorContainer = document.querySelector(".cardCreator__container"),
    flipCardWrapper = document.querySelector(".flipCard__wrapper"),
    flipCardContainer = document.querySelector(".flipCard__container"),
    adviceArea = document.querySelector(".adviceArea"),
    overlay = document.querySelector(".overlay")
    
const imageArray=[],
listOfFlippedCards=[]

input.addEventListener("change", function(){
    const files = input.files
    
    for(let i =0; i<files.length;i++){
        imageArray.push(files[i])
    }
    displayPreviews()

    if (files.length){
        cardCreatorContainer.classList.remove("cardCreator__container--hidden");
        previewContainer.classList.remove("previewImage__container--hidden");
        adviceArea.classList.add("adviceArea--hidden")
    }
})

function displayPreviews(){
    let images = ""
    imageArray.forEach((image, index) => {
        images += `<div class="previewImage">
                        <img src="${URL.createObjectURL(image)}" alt="preview of ${image.name}">
                        <span class="previewImage__close" onclick="deletePreview(${index})"></span>
                    </div>`
    })
    previewContainer.innerHTML = images
}

function deletePreview(index){
      imageArray.splice(index,1)
      displayPreviews()
}

function displayCards(listToDisplay){
    const cardsOrdered=[]
    listToDisplay.forEach((image,index) => {
        const cleanName = image.name.replace(/\.[^/.]+$/, "")

        cardsOrdered.push(
        `<div class="flipCard" >
            <div data-isnotflipped="true" data-cardid="${index}" class="flipCard__inner" onclick="flipCard(this)">
                <div class="flipCard__front"><img src="DEV/img/back.jpg" alt="back of the card"></div>
                <div class="flipCard__back"><img src="${URL.createObjectURL(image)}" alt="${cleanName}"></div>
            </div>
        </div>`,
        `<div class="flipCard" >
            <div data-isnotflipped="true" data-cardid="${index}" class="flipCard__inner" onclick="flipCard(this)">
                <div class="flipCard__front"><img src="DEV/img/back.jpg" alt="back of the card"></div>
                <div class="flipCard__back">${cleanName}</div>
            </div>
        </div>`
        )
        

    })

    const cardsRandomized = cardsOrdered.sort(() => Math.random() - 0.5).join('')
    flipCardContainer.innerHTML=cardsRandomized

    previewContainer.classList.add("previewImage__container--hidden")
    cardCreatorContainer.classList.add("cardCreator__container--hidden")
    flipCardWrapper.classList.remove("flipCard__wrapper--hidden")
    pageRefresherContainer.classList.remove("pageRefresher__container--hidden")
    imageSelectorLabel.classList.add("buttonGeneral--transformed")

    textRemover(imageSelectorText)
}

let firstCard = null,
    firstCardId=null,
    secondCard = null

function flipCard(currentElement){
    if (currentElement.dataset.isnotflipped==="true"){
        openCard(currentElement)
        flipSound.play()
        if(!firstCardId){
            firstCardId = currentElement.dataset.cardid
            firstCard=currentElement
        }
        else {
            if(firstCardId===currentElement.dataset.cardid){
                // both card match
                openCard(currentElement)
                correctSound.play()
                firstCard.classList.add("flipCard__inner--right")
                currentElement.classList.add("flipCard__inner--right")

                firstCardId=null
            }
            else{
                //cards mismatch
                wrongSound.play()
                firstCardId=null
                overlay.classList.remove("overlay--hidden")
                secondCard = currentElement

                firstCard.classList.add("flipCard__inner--wrong")
                secondCard.classList.add("flipCard__inner--wrong")
            }
        }
    }
}

function closeCard(el){
    el.classList.remove("flipCard--flipped")
    el.dataset.isnotflipped="true"
}

function openCard(el){
    el.classList.add("flipCard--flipped")
    el.dataset.isnotflipped="false"
}

function showAllCards(){
    document.querySelectorAll('.flipCard__inner').forEach((element) => {
        openCard(element)
      });
}

function hideAllCards(){
    document.querySelectorAll('.flipCard__inner').forEach((element) => {
        closeCard(element)
    });
}

function textRemover(element){
    let text = element.textContent;

    let timerId = setInterval(() => {
        if (text.length<1){
          clearInterval(timerId);
        }
        text=text.slice(0,-1);
        element.textContent=text;
    }, 50);
}

function overlayRemover(){
    firstCard&&closeCard(firstCard)
    secondCard&&closeCard(secondCard)

    overlay.classList.add("overlay--hidden")
    flipSound.play()
    firstCard.classList.remove("flipCard__inner--wrong")
    secondCard.classList.remove("flipCard__inner--wrong")

    firstCard=null
    secondCard=null
}