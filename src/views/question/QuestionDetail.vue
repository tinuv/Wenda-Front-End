<template>
  <div style="margin: 0 auto;">
    <Nav></Nav>
    <Question></Question>
    <div style="margin: 0 auto">
      <AnswerEditor :style="{margin: '5px auto'}"></AnswerEditor>
    </div>
    <div style="margin: 0 auto">
      <AnswerList :style="{margin: '5px auto'}"></AnswerList>
    </div>
  </div>
</template>

<script>
    import Question from "./Question";
    import AnswerEditor from "./AnswerEditor";
    import AnswerList from "./AnswerList";
    import Nav from "../main/Header/Menu/Nav";

    export default {
        name: "QuestionDetail",
        components: {
            Question,
            AnswerEditor,
            AnswerList,
            Nav
        },
        methods: {
            checkToken() {
                let jwt = localStorage.getItem("jwt");
                if (jwt === null) {
                    this.$router.push({
                        path: "/login"
                    })
                } else {
                    let a = jwt.split(" ");
                    a = a[1].split(".")[1];
                    a = Base64.decode(a);
                    a = JSON.parse(a);
                    let currentTime = Date.parse(new Date()) / 1000;
                    if (currentTime < a['exp']) {
                        if (JSON.parse(a['sub'])['basicInfoFlag'] === false) {
                            this.$router.push({
                                path: "/register"
                            })
                        }
                    } else {
                        this.$router.push({
                            path: "/login"
                        })
                    }
                }
            }
        },
        mounted() {
            this.checkToken();
        }
    }
</script>

<style scoped>

</style>
