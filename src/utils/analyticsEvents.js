const createDataLayer = () => {
  window.dataLayer = []
}

export const sendEvent = (data) => {
  if (!window.dataLayer) {
    createDataLayer()
  }

  window.dataLayer.push(data)
}
