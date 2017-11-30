import shallowEqual from 'shallowequal'
import {getShallowDiff, mapValues} from './object'

const defaultMapStateToProps = state => ({}) // eslint-disable-line no-unused-vars
const defaultMapDispatchToProps = dispatch => ({dispatch})

function wrapActionCreators(actionCreators) {
  return dispatch =>
    mapValues(actionCreators, actionCreator => (...args) =>
      dispatch(actionCreator(...args))
    )
}

const connect = (mapStateToProps, mapDispatchToProps) => {
  const mapState = mapStateToProps || defaultMapStateToProps
  const app = getApp()

  let mapDispatch
  if (typeof mapDispatchToProps === 'function') {
    mapDispatch = mapDispatchToProps
  } else if (!mapDispatchToProps) {
    mapDispatch = defaultMapDispatchToProps
  } else {
    mapDispatch = wrapActionCreators(mapDispatchToProps)
  }

  return pageConfig => {
    let changeTimer = null
    let lastChangeTime = 0
    const MIN_CHANGE_DELAY = 50

    function getMappedState() {
      const state = this.store.getState()
      const mappedState = mapState(state)

      // multi connect 时获取完整的 state
      if (pageConfig._isConnected) {
        return {
          ...pageConfig._getMappedState.call(this, state),
          ...mapState(state),
        }
      }
      return mappedState
    }

    function changeState() {
      const mappedState = getMappedState.call(this)
      if (!this.data || shallowEqual(this.data, mappedState)) {
        return
      }
      const finalState = getShallowDiff(this.data, mappedState)
      this.setData(finalState)
    }

    function handleChange(isImmediate) {
      if (!this._unsubscribe) {
        return
      }

      clearTimeout(changeTimer)

      if (isImmediate) {
        changeState.call(this)
        return
      }

      const now = Date.now()
      const delta = now - lastChangeTime
      if (delta > MIN_CHANGE_DELAY) {
        lastChangeTime = now
        changeState.call(this)
      } else {
        changeTimer = setTimeout(() => {
          lastChangeTime = now
          changeState.call(this)
        }, MIN_CHANGE_DELAY - delta)
      }
    }

    const {
      onLoad: _onLoad,
      onUnload: _onUnload,
      onHide: _onHide,
      onShow: _onShow,
    } = pageConfig
    const shouldSubscribe = Boolean(mapStateToProps)

    function subscribe() {
      this.store = app.store
      if (shouldSubscribe) {
        // 如果已经 connect 过，将旧的 subscribe 取消
        if (pageConfig._unsubscribe) {
          pageConfig._unsubscribe()
        }
        const unsubscribe = this.store.subscribe(handleChange.bind(this))
        this._unsubscribe = unsubscribe
        pageConfig._unsubscribe = unsubscribe
        handleChange.call(this, true)
      }
    }

    function onShow(options) {
      if (!this.subscribedReducer) {
        subscribe.call(this)
        this.subscribedReducer = true
      }

      if (typeof _onShow === 'function') {
        _onShow.call(this, options)
      }
    }

    function onLoad(options) {
      if (!this.subscribedReducer) {
        subscribe.call(this)
        this.subscribedReducer = true
      }

      if (typeof _onLoad === 'function') {
        _onLoad.call(this, options)
      }
    }

    function onHide() {
      if (typeof _onHide === 'function') {
        _onHide.call(this)
      }
      if (typeof this._unsubscribe === 'function') {
        this._unsubscribe()
        this.subscribedReducer = false
      }
    }

    function onUnload() {
      if (typeof _onUnload === 'function') {
        _onUnload.call(this)
      }
      if (typeof this._unsubscribe === 'function') {
        this._unsubscribe()
        this.subscribedReducer = false
      }
    }

    return Object.assign({}, pageConfig, mapDispatch(app.store.dispatch), {
      onLoad,
      onUnload,
      onShow,
      onHide,
      _isConnected: true,
      _getMappedState: getMappedState,
    })
  }
}

export default connect
