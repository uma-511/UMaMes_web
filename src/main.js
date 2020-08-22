import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import '@/styles/index.scss' // global css

import App from './App'
import router from './router/routers'
import permission from './components/Permission'
import dict from './components/Dict'
import store from './store'

import '@/icons' // icon
import './router/index' // permission control
import Router from 'vue-router'

Vue.use(mavonEditor)
Vue.use(permission)
Vue.use(dict)
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false
Vue.directive('longpress', {
  bind: function(el, binding, vNode) {
    // Make sure expression provided is a function
    if (typeof binding.value !== 'function') {
      // Fetch name of component
      const compName = vNode.context.name
      // pass warning to console
      let warn = `[longpress:] provided expression '${binding.expression}' is not a function, but has to be`
      if (compName) { warn += `Found in component '${compName}' ` }

      console.warn(warn)
    }

    // Define variable
    let pressTimer = null

    // Define funtion handlers
    // Create timeout ( run function after 1s )
    const start = (e) => {
      if (e.type === 'click' && e.button !== 0) {
        return
      }

      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          // Run function
          handler()
        }, 3000)
      }
    }

    // Cancel Timeout
    const cancel = (e) => {
      // Check if timer has a value or not
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }
    // Run Function
    const handler = (e) => {
      binding.value(e)
    }

    // Add Event listeners
    el.addEventListener('mousedown', start)
    el.addEventListener('touchstart', start)
    // Cancel timeouts if this events happen
    el.addEventListener('click', cancel)
    el.addEventListener('mouseout', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)
  }
})

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
require('babel-polyfill')

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
