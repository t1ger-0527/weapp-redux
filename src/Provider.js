function Provider(store) {
  return function(appConfig) {
    return Object.assign({}, appConfig, {store})
  }
}

export default Provider
