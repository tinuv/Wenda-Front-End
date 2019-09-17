// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import iView from "iview";
import 'iview/dist/styles/iview.css';
// axios,网络请求
import Axios from "axios";
import Base64 from 'js-base64';
/**
 * markdown编辑器
 */
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import router from './router';

Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(mavonEditor);
Vue.use(Base64);


Vue.prototype.$axios = Axios;


new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
