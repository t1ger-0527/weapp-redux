import deepEqual from 'deep-equal'
export const mapValues = (obj, fn) =>
  Object.keys(obj).reduce((o, key) => {
    const value = obj[key]
    o[key] = fn(value, key, obj)
    return o
  }, {})

export const getShallowDiff = (oldObj = {}, newObj = {}) => {
  const finalObj = {}
  Object.keys(newObj).map(key => {
    if (!deepEqual(finalObj[key], newObj[key])) {
      finalObj[key] = newObj[key]
    }
  })

  return finalObj
}
