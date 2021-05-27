import { useState, useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'

/**
 * Try to find the DOM element by ID each paint cycle for a maximum of 800 cycles
 * @param {string} item Menu item to find by id
 * @param {function} setReload Callback function to when the item was found
 * @param {number} counter Iteration limit
 */
const findEl = (item, setReload, counter = 0) => {
  if (counter > 800) {
    // eslint-disable-next-line no-console
    console.error(
      'Unable to render the sidebar menu pointers.',
      `Element ${item} not found.`
    )
    return false
  }
  if (document.getElementById(item)) {
    setReload(true)
    return true
  }
  window.requestAnimationFrame(() => findEl(item, setReload, counter + 1))
  return false
}

const scrollToHash = (hash, retry = 0) => {
  if (document.getElementById(hash)) {
    document.getElementById(hash).scrollIntoView()
    return
  }

  if (retry < 100) {
    window.requestAnimationFrame(() => scrollToHash(hash, retry + 1))
  }
}

/**
 * Hook to trigger a rerender of the menu when the DOM is ready
 * need in order to make scrollspy works on reload
 * @param {array} menuItems An array of strings with the menu items list
 */
const useTermsMenu = (menuItems) => {
  const [reloadMenu, setReload] = useState(false)

  const history = useHistory()

  useLayoutEffect(() => {
    const hash = history.location.hash.replace('#', '')
    // force scroll to current section
    const animationFrame = window.requestAnimationFrame(() => scrollToHash(hash))

    return () => {
      window.cancelAnimationFrame(animationFrame)
    }
  }, [history.location.hash])

  useLayoutEffect(() => {
    window.requestAnimationFrame(() => findEl(menuItems[0], setReload))
  }, [menuItems])

  return [
    menuItems,
    reloadMenu
  ]
}

export default useTermsMenu
