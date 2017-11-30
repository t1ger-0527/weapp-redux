# Weapp Redux
Unofficial Redux binding for weapp(Wechat mini programs / 微信小程序).
Performance optimized.

## Installation
```
$ npm install --save weapp-redux
```

## Usage

To use `redux`, you need to bind your store to the app.
```javascript
// your App.js
import Redux from 'redux'
import {Provider} from 'weapp-redux-binding'

const store = Redux.createStore(
  yourReducer,
  {},
)

App(
  Provider(store)({
    // your app config here, like below.
    onLaunch() {
      // do something
    }
  })
)
```

Just like `react-redux`, you can get the data from store, and bind actions to your page.
```javascript
// your SomePage.js
import {connect} from 'weapp-redux-binding'
import {someActionBindingsHere} from 'actions/someData'

const pageConfig = {
  // your page config here, like below.
  onLoad() {
    // you can access your actions and data in pageConfig like this.
    this.someAction(this.data.someDataField)
  },
}

Page(
  connect(
    (state) => ({
      someDataField: state.someData.someField,
    }),
    {someAction: someActionBindingsHere}
  )(pageConfig)
)
```

You can access your data and actions in your `index.wxml`, for example:
```xml
<view bindtap="someAction">
  {{someDataField}}
</view>
```

## Note
- You can safely connect twice in your pageConfig definition, `weapp-redux-binding` makes sure your page will only respond to state change once.
- Your page will not respond to state change once it leaves the screen (for example, `wx.navigateTo`), but it will reload with the latest state if it comes back to screen.
- The `setData` is throttled, due to weapp's slow `setData` respond. The DELAY is 50ms.(production tested, 50ms is the perfect delay).
- This binding is working well with all redux middlewares. 

## Who is using it?
Currently, all weapps in Zhihu is using this redux binding in production for over half year. Those apps are:

- 知乎 Live ![weapp code](https://zhstatic.zhihu.com/zWechat/live-wechat-app-code.jpg)
- 知乎训练营 ![weapp code](https://zhstatic.zhihu.com/zWechat/alchemy-wechat-app-code.jpg)
- 说话的地方 ![weapp code](https://zhstatic.zhihu.com/zWechat/tinker-wechat-app-code.jpg)

## Contributing
We use [yarn](https://yarnpkg.com) to manage packages. So once you have downloaded this repo, run:
```
$ yarn
```

## License
MIT
