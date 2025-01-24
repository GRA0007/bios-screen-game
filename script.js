/**
 * Get a response from the bot
 * @param {string} message The message from the player
 */
const getResponse = (message) => {
  return 'Sorry, I\'m not sure how to help with that, please rephrase.'
}

/**
 * Set the output text
 * @param {string} text The text to display
 */
const setOutput = (text) => {
  const outputEl = document.querySelector('output')
  if (outputEl) outputEl.innerHTML = text
}

/**
 * Set the temperature display
 * @param {number} temperature Between 0 and 100
 */
const setTemperature = (temperature) => {
  const tempEl = document.querySelector('#temp')
  const tempChartEl = document.querySelector('#tempChart')
  if (tempEl) tempEl.innerHTML = temperature
  if (tempChartEl) {
    const progress = temperature / 100
    tempChartEl.innerHTML = `${'\u2588'.repeat(Math.floor(progress*15))}${'\u2591'.repeat(15-Math.floor(progress*15))}${progress > .7 ? (progress > .85 ? ' !!!' : ' !') : ''}`
    if (progress <= .3) return tempChartEl.className = 'low'
    if (progress <= .5) return tempChartEl.className = 'medium'
    if (progress <= .7) return tempChartEl.className = 'high'
    if (progress <= .85) return tempChartEl.className = 'veryHigh'
    return tempChartEl.className = 'horrible'
  }
}

/**
 * Set the fan speed display
 * @param {number} speed in RPM
 */
const setFanSpeed = (speed) => {
  const fanEl = document.querySelector('#fanSpeed')
  if (fanEl) fanEl.innerHTML = speed
}

const navItems = document.querySelectorAll('nav section p')
const notAvailableDialog = document.querySelector('#notAvailable')
const chat = document.querySelector('#chat')
const messages = document.querySelector('#messages')
const input = document.querySelector('textarea')
let selectedItem = 0

/**
 * Select an item from the nav
 * @param {number} index Index of the item to select
 */
const selectItem = (index) => {
  navItems.forEach((item, i) => {
    item.classList.toggle('selected', index === i)
  })
  selectedItem = index
}

/**
 * Sends a bot response with an animation
 * @param {string} response The bot response
 */
const sendResponse = async (response) => {
  input.disabled = true
  const newMessage = document.createElement('p')
  messages.append(newMessage)
  for (const chunk of response.split(' ')) {
    newMessage.innerText = `${newMessage.innerText ? `${newMessage.innerText} ` : ''}${chunk}`
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 100))
  }
  input.disabled = false
  input.focus()
}

// Listen for keyboard events
document.addEventListener('keydown', (e) => {
  if (!chat.classList.contains('open')) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (selectedItem === 0) return selectItem(navItems.length - 1)
      return selectItem(selectedItem - 1)
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (selectedItem === navItems.length - 1) return selectItem(0)
      return selectItem(selectedItem + 1)
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const newIndex = selectedItem + 7
      if (newIndex < navItems.length) return selectItem(newIndex)
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const newIndex = selectedItem - 7
      if (newIndex >= 0) return selectItem(newIndex)
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (notAvailableDialog.open) return notAvailableDialog.close()

      if (selectedItem === 0) {
        chat.classList.add('open')
        input.focus()
      } else {
        notAvailableDialog.showModal()
      }
    }
    if (e.key === 'Escape' || e.key === 'F10') {
      if (notAvailableDialog.open && e.key === 'Escape') return false
      e.preventDefault()
      notAvailableDialog.showModal()
    }
  } else {
    if (e.key === 'Escape') {
      e.preventDefault()
      chat.classList.remove('open')
    }
  }
})

// Capture events on the input
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    e.stopPropagation()
    const userMessage = input.value
    const newMessage = document.createElement('p')
    newMessage.classList.add('you')
    newMessage.append(document.createTextNode(userMessage))
    messages.append(newMessage)
    input.value = ''

    sendResponse(getResponse(userMessage))
  }
})

setTemperature(30)
