<template>
  <Card style="width: 1000px;margin: 0 auto;background: #fff;">
    <div style="margin-bottom: 10px">
      <Tag color="primary" v-for="tag in question.tags" key="tag.id">{{tag.tag}}</Tag>
    </div>
    <div>
      <div class="markdown-body" style="margin-bottom: 5px">
        <h3>{{question.title}}</h3>
      </div>
      <div class="markdown-body" v-html="question.htmlContent"></div>
    </div>
    <div style="margin-top: 20px;margin-bottom: 10px">
      <Button @click="focusQuestion" type="primary" :disabled="fqButtonDisabled" style="margin-right: 5px">关注问题</Button>
      <Button style="margin-right: 5px">写回答</Button>
      <Button style="margin-right: 5px">邀请回答</Button>
    </div>
  </Card>
</template>

<script>
    import qs from 'qs'


    export default {
        name: "Question",
        data() {
            return {
                question: {},
                fqButtonDisabled: false,
                user: {}
            }
        },
        methods: {
            /**
             * 根据问题ID获取问题详情
             */
            getQuestionById() {
                let url = window.location.href;
                let part = url.split("/");
                part = part[part.length - 1];
                let jwt = localStorage.getItem("jwt");
                this.$axios.get("/wenda/api/issue/" + part, {
                    headers: {
                        'Authorization': jwt
                    }
                }).then(response => {
                    if (response['data']['success'] === true) {
                        this.question = response['data']['data'];
                        let trimHtml = require('trim-html');
                        this.question.htmlContent = trimHtml(this.question.htmlContent, {more: true})['html']
                    } else {
                        this.$Message.error("获取答案错误，请稍后再试！")
                    }
                }).catch(error => {
                    this.$Message.error("获取回答出现了异常")
                })
            },
            /**
             * 关注问题
             */
            focusQuestion() {
                let requestBody = {
                    questionId: this.question.id
                };
                let jwt = localStorage.getItem("jwt");
                this.$axios.post("/wenda/api/issue/focus", qs.stringify(requestBody), {
                    headers: {
                        'Authorization': jwt
                    }
                }).then(response => {
                    if (response["data"]["success"] === true) {
                        this.fqButtonDisabled = true;
                    } else {
                        this.$Message.error("关注问题出现错误，请稍后再试！")
                    }
                }).catch(error => {
                    this.$Message.error("关注问题出现异常，请稍后再试！")
                })
            },
            /**
             * 获取个人用户信息
             */
            getUser() {
                let jwt = localStorage.getItem("jwt");
                let a = jwt.split(" ");
                a = a[1].split(".")[1];
                a = Base64.decode(a);
                a = JSON.parse(a);
                a = JSON.parse(a['sub']);
                let userId = a["userId"];
                this.$axios.get("/wenda/api/user/" + userId, {
                    headers: {
                        'Authorization': jwt
                    }
                }).then(response => {
                    if (response['data']['success'] === true) {
                        this.user = response['data']['data'];
                        this.fqButtonDisabled = this.isUserFocusQuestion();
                    } else {
                        this.$Message.error("获取用户失败，请稍后再试！")
                    }
                }).catch(error => {
                    this.$Message.error("获取用户出现了异常")
                })
            },
            /**
             * 判断用户是否关注了问题
             */
            isUserFocusQuestion() {
                let questionId = this.question.id;
                let watchQuestion = this.user.watchIssue;
                for (let i = 0; i < watchQuestion.length; i++) {
                    if (questionId === watchQuestion[i].id) {
                        return true;
                    }
                }
                return false;
            }
        },
        mounted() {
            this.getQuestionById();
            this.getUser();
        }
    }
</script>

<style scoped>

</style>

<style>
  body {
    background-color: #f6f6f6;
  }
</style>
