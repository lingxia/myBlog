// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import './assets/css/commen.css'//这里的样式可以覆盖index.css
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
 // use
Vue.use(mavonEditor);
Vue.use(ElementUI);
Vue.use(iView);
import router from './routes/index'
// import store from './store/index'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // store,
  template: '<App/>',
  components: { App }//此处的components用在了上面的template里面用来编译
})

