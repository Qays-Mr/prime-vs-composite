const $ = document

const numbersWrapper = $.querySelector('#numbers-container')
const moveableBox = $.querySelector('.moveable-box')
const basePowerWrapper = $.querySelector('.basePowerWrapper')
const numbers = $.querySelector('.number')
const numbersOptions = $.querySelectorAll('.radio-input')
const selectedOption = $.querySelector('.radio-input:checked')
const topRangeContainer = $.querySelector('.top-range')
const minRange = $.querySelector('#min-range')
const maxRange = $.querySelector('#max-range')
const minThumb = $.querySelector('.thumb-min')
const maxThumb = $.querySelector('.thumb-max')
const minRangeValue = $.querySelector('#min-range-value')
const maxRangeValue = $.querySelector('#max-range-value')
const minNumberRange = $.querySelector('#min-number-range-field')
const maxNumberRange = $.querySelector('#max-number-range-field')
const lineRange = $.querySelector('.line-range')
const allNumberCounter = $.querySelector('#all-numbers-counter')
const primeNumberCounter = $.querySelector('#primes-numbers-counter')
const compositeNumberCounter = $.querySelector('#composite-numbers-counter')

let topRangeWidth = topRangeContainer.offsetWidth 
const thumbWidth = minThumb.offsetWidth

// Initial settings

function initialSettings() {
    let settings = {
        maxNumber: 1500,
        maxValue: 2,
        minValue: 2 
    }

    maxRange.max = settings.maxNumber 
    minRange.max = settings.maxNumber 

    maxRange.value = settings.maxValue
    minRange.value = settings.minValue

    setMinRange()
    setMaxRange()
}

// Stopping across each other 
function getGap(rangeEl_1, rangeEl_2) {
    let gap = maxRange.value - minRange.value
    gap <= 0 ? rangeEl_1.value = rangeEl_2.value : numbers
}

// change styles of thumb and value boxes
function changeRangeStyles(lineRangeWidth) {
    lineRangeWidth <= 87 ? topRangeContainer.classList.add('change') : topRangeContainer.classList.remove('change')
}

// setting thumbs position
function setThumbPosition(thumbEl, rangeValue) {
    let leftThumbDistance = (topRangeWidth - thumbWidth) / (maxRange.max / rangeValue)
    thumbEl.style.left = leftThumbDistance + 'px'
}

// Set min range
function setMinRange(numberValue) {
    numberValue ? minRange.value = numberValue : null
    getGap(minRange, maxRange)
    
    setThumbPosition(minThumb ,minRange.value, 'minRange')
    lineRange.style.left = (topRangeWidth - thumbWidth) / (maxRange.max / minRange.value) + 'px'    

    minRangeValue.innerText = minRange.value
    minNumberRange.value = minRange.value

    changeRangeStyles(lineRange.offsetWidth)
}

// Set max range
function setMaxRange(numberValue) {
    numberValue ? maxRange.value = numberValue : null
    getGap(maxRange, minRange)

    setThumbPosition(maxThumb ,maxRange.value, 'maxRange')
    lineRange.style.right = (topRangeWidth - thumbWidth) - ((topRangeWidth - thumbWidth) / (maxRange.max / maxRange.value)) + 'px'

    maxRangeValue.innerText = maxRange.value
    maxNumberRange.value = maxRange.value

    changeRangeStyles(lineRange.offsetWidth)
}

// Set option name in LS
function setSelectedOptionInLS(optionName) {
    localStorage.setItem('option', optionName)
}

setSelectedOptionInLS(selectedOption.dataset.optionName)

// Change option
numbersOptions.forEach(numberOption => {
    numberOption.addEventListener('change', () => {
        emptyingNumbersWrapper()

        let numbersArr = JSON.parse(localStorage.getItem('numbersArr'))

        setSelectedOptionInLS(numberOption.dataset.optionName)

        numbersArr = choosingNumberType(numbersArr)
        addNumbersToDOM(numbersArr)
    })
})

// Setting the factors in math form. instance => 2 ** 5 . 3 ** 3
function setFactorsInMathForm(factors) {

    let factorsEls = []

    let powerBaseNumbers = factors.reduce((obj, currentItem) => {
        return {...obj, [currentItem]: (obj[currentItem] || 0) + 1}
    }, 0)

    for(const baseNumber in powerBaseNumbers) {
        factorsEls.push(`${baseNumber}<sup>${powerBaseNumbers[baseNumber]}</sup>`)
    }

    return factorsEls
}

// Find all the factors of the target number
function findNumberFactors(num) {
    let factors = []
    let divisor = 2

    while(num >= divisor) {
        if(num % divisor === 0) {
            factors.push(divisor)
            num /= divisor
        }else {
            divisor++
        }
    }

    return setFactorsInMathForm(factors)
}


// Tracking the position of the target number
function moveableBoxTracking(e) {
    const isComposite = e.target.className.includes('composite')

    if(isComposite) {
        moveableBox.classList.add('change')

        let targetNumber = +e.target.innerText
        let leftDistance = e.target.offsetLeft - (moveableBox.offsetWidth - e.target.offsetWidth) / 2
        let topDistance = e.target.offsetTop - numbersWrapper.scrollTop

        moveableBox.style.left = leftDistance + 'px'
        moveableBox.style.top = topDistance  +  'px'

        let factorsEls = findNumberFactors(targetNumber)
        
        basePowerWrapper.innerHTML = factorsEls.join(' x ')

    }
    
}

// Hide moveable box after mouse leaving
function hideMoveableBox() {
    moveableBox.classList.remove('change')
}

// Check if the number is prime or composite
function isPrime(num) {
    for(let j = 2 ; j < num ; j++) {
        if(!(num % j)) return false // it's not prime
    }        
    return true // it's prime
}

function choosingNumberType(numbersArr) {
    let optionName = localStorage.getItem('option')

    if(optionName === 'prime-options') {
        numbersArr = numbersArr.filter(numberObj => numberObj.prime)
    }else if(optionName === 'composite-options') {
        numbersArr = numbersArr.filter(numberObj => !numberObj.prime)
    }
    
    return numbersArr
}

function addNumbersToDOM(numbersArr) {
    numbersArr.forEach(numberObj => {
        numbersWrapper.insertAdjacentHTML('beforeend', `
            <div class='flex-centering number ${numberObj.prime ? 'prime' : 'composite'}'>${numberObj.num}</div>
        `)
    })
}

function countingNumbers(numbersArr) {
    allNumberCounter.innerText = numbersArr.length
    primeNumberCounter.innerText = numbersArr.filter(numberObj => numberObj.prime).length
    compositeNumberCounter.innerText = numbersArr.filter(numberObj => !numberObj.prime).length
}

// Type: prime | composite
function dividingNumbersByType(num1, num2) {
    let numbersArr = []
    let diff = num2 - num1
    let counter = num1 - 1

    for(let i = 0; i < diff ; i++) {
        counter++
        numbersArr.push({num: counter, prime: isPrime(counter)})
    }

    countingNumbers(numbersArr)

    localStorage.setItem('numbersArr', JSON.stringify(numbersArr))
    
    numbersArr = choosingNumberType(numbersArr)

    addNumbersToDOM(numbersArr)
}

numbersWrapper.addEventListener('mouseover', moveableBoxTracking)
numbersWrapper.addEventListener('mouseleave', hideMoveableBox)

function emptyingNumbersWrapper() {
    numbersWrapper.innerHTML = ''
}

minRange.addEventListener('input', () => {
    emptyingNumbersWrapper()
    setMinRange()
    dividingNumbersByType(+minRange.value, +maxRange.value)
})
maxRange.addEventListener('input', () => {
    emptyingNumbersWrapper()
    setMaxRange()
    dividingNumbersByType(+minRange.value, +maxRange.value)
})

window.addEventListener('resize', () => {
    topRangeWidth = topRangeContainer.offsetWidth 
    setMinRange()
    setMaxRange()
})

window.addEventListener('load', () => {
    initialSettings()
})

minNumberRange.addEventListener('change', () => {
    emptyingNumbersWrapper()
    setMinRange(minNumberRange.value)
    dividingNumbersByType(+minRange.value, +maxRange.value)
})

maxNumberRange.addEventListener('change', () => {
    emptyingNumbersWrapper()
    setMaxRange(maxNumberRange.value)
    dividingNumbersByType(+minRange.value, +maxRange.value)
})