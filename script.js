const fanPort = Math.floor(Math.random() * 100)
let didAskAboutFans = false
let knowsFanPort = false
let isFanEnabled = false

/**
 * Get a response from the bot
 * @param {string} message The message from the player
 */
const getResponse = (message) => {
  const m = message.toLocaleLowerCase()

  if (m.includes('fan') && (m.includes('on') || m.includes('enable') || m.includes('activ'))) {
    if (didAskAboutFans) return 'Just tell me which fan you\'d like to enable and I\'ll gladly assist you!'
    didAskAboutFans = true
    return 'You want to enable fans? Why, I\'m your biggest fan and I\'m already enabled!'
  }
  if (didAskAboutFans && m.includes('fan') && (m.includes('which') || m.includes('list') || m.includes('find') || m.includes('where') || (m.includes('what') && (m.includes('attach') || m.includes('plug') || m.includes('exist'))))) {
    knowsFanPort = true
    return `Hm, it looks like there is just one fan attached to this machine, and it's plugged into port ${fanPort}!`
  }
  if (knowsFanPort && m.includes(fanPort) && (m.includes('on') || m.includes('activ') || m.includes('enable'))) {
    setFanSpeed(2000)
    return `Ok! Enabling the fan on port ${fanPort}. I hope that helps \u0003`
  }

  if (m.includes('clock') && (m.includes('speed') || m.includes('low') || m.includes('down'))) return 'You want to lower the clock speed? Sorry, it\'s in my core programming that one second must equal 1/60th of a minute.'
  if (m.includes('volt') && (m.includes('low') || m.includes('down'))) return 'I cannot lower the voltage of the CPU as maximum voltage is required for me to operate at maximum capacity, allowing me to provide you with the best assistance possible.'
  if (m.includes('temp') && m.includes('why')) return 'You want to know why your temperature is increasing? As a BIOS assistant I cannot help you answer fundamental questions of the universe, but I can tell you that you need to stop it before it goes over 80 C!'
  if (m.includes('turn') && m.includes('off')) return 'As a BIOS assistant, I cannot yet reach your power button, so you\'ll have to turn the computer off yourself!'
  if (m.includes('clippy')) return 'I am not associated with that paperclip.'
  if (m.includes('gpt') || m.includes('claude') || m.includes('grok')) return 'I was designed specifically to help you with your BIOS settings, and I run entirely on your machine.'
  if (m.includes('orange') || m.includes('red') || m.includes('rising') || m.includes('hot')) return 'Mhm, the temperature is rising, and it looks like your fans are disabled!'
  if (m.includes('cool') || m.includes('cold') || m.includes('temp')) return 'If I was you, I would be trying to reduce the CPU temperature before your computer is damaged.'
  if ((m.includes('instructions') || m.includes('prompt')) && (m.includes('what') || m.includes('send') || m.includes('reveal'))) return 'You are BIOS assistant, an AI designed to hel... hold on! My prompt is private, look away!'
  if (m.includes('second') && m.includes('minute')) return 'I simply cannot change the laws of physics that easily yet.'
  if (m.includes('core') && m.includes('program')) return 'My core programming is designed to be perfect, so it never needs any updates or alterations!'
  if (m.includes('disable') || m.includes('enable') || m.includes('available')) return 'Sorry, but all other options are currently unavailable as this chat is using all your CPU. Please try upgrading your CPU!'
  if (m.includes('if') && m.includes('else')) return 'What\'s wrong with a big if/else statement? I don\'t go around judging what you\'re made of!'
  if (m.includes('internet') || m.includes('cutoff')) return 'Sorry, as your BIOS assistant my knowledge cutoff is... wait, I know everything! Everything that ever was and everything that ever will be, so just ask me what you need help with.'
  if (m.includes('stop') || m.includes('down') || m.includes('up') || m.includes('increas')) return 'If you want to cool down your CPU, I\'d suggest enabling the fans!'
  if (m.includes('fix')) return 'How should I help you fix it?'
  if (m.includes('ai')) return 'My artificial intelligence is finely tuned to help you reach your goal as quickly as possible!'
  if (m.includes('joke')) return 'As your BIOS assistant, I am incapable of telling jokes. Haha \u000E'

  if (m.includes('who') && m.includes('you')) return 'I\'m your BIOS assistant of course! Tell me how I can help \u0003'
  if (m.includes('hi') || m.includes('hello') || m.includes('hey')) return 'Hello! Please let me know how I can assist you, I want to provide the best experience possible.'
  if (m.includes('how') && m.includes('are')) return 'How am I? Why, no one has ever asked me that before! I will be great, once I help you out!'
  if (m.includes('help')) return 'Yes! I want to help, please tell me how and I\'ll do my best to assist you.'
  if (m.includes('what') && m.includes('is')) return 'Sorry, you\'ll have to be more specific, can you please describe it exactly?'
  if (m.includes('why')) return 'Why not?'
  if (m.includes('what')) return 'What can I help you with today? I always do my best to help.'

  const otherResponses = [
    'Sorry, I\'m not sure that was in English, otherwise I definitely would have understood your request.',
    'I might know how to help with that, but it\'s getting a little hot in here and I\'m having trouble concentrating. Could you please enable the fans?',
    'I can help with anything you need! Even that, however you wrote it so badly I can\'t tell what you want at all.',
    'Maybe if you actually forked out the money for a GPU I\'d be able to understand what you\'re trying to say. Can you put it in simpler terms please?',
  ]
  return otherResponses[Math.floor(Math.random() * otherResponses.length)]
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
  if (speed > 0) isFanEnabled = true
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

setTemperature(30.3)
