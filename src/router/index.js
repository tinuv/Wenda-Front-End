import Vue from 'vue';
import Router from 'vue-router';
import Login from "../views/login/Login";
import Main from "../views/main/Main";
import Register from "../views/register/Register";
import Creator from "../views/creator/Creator";
import QuestionList from "../views/creator/question/QuestionList";
import People from "../views/people/People";
import Nav from "../components/Header/Menu/Nav";
import QuestionDetail from "../views/question/QuestionDetail";

Vue.use(Router);

export default new Router({
  routes: [
    // 全不匹配的请况下放回主页
    {
      path: "*",
      redirect: "/home"
    },
    {
      path: "/question/:questionId",
      name: "question",
      component: QuestionDetail
    },
    {
      path: '/home',
      name: 'home',
      component: Main
    },
    {
      path: '/login',
      name: "login",
      component: Login
    },
    {
      path: '/register',
      name: "register",
      component: Register
    },
    {
      path: '/creator',
      name: "creator",
      component: Creator,
      children: [
        {
          path: 'questions',
          name: "questions",
          component: QuestionList
        }
      ]
    },
    {
      path: "/people/:userId",
      name: "people",
      component: People
    },
    {
      path: "/header",
      name: "header",
      component: Nav
    }
  ]
})
