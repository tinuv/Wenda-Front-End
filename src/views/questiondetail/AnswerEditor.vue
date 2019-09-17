<template>
  <Card style="width: 1000px">
    <div slot="title">
      <Avatar :src="user.userExtraInfo.avatarImg"></Avatar>
    </div>
    <div>
      <div class="mavonEditor">
        <mavon-editor @change="textChange" v-model="MarkdownContent"/>
      </div>
    </div>
    <Divider></Divider>
    <div>
      <Button type="primary" @click="commitAnswer">提交回答</Button>
    </div>
  </Card>
</template>

<script>
    import qs from 'qs'

    export default {
        name: "AnswerEditor",
        data() {
            return {
                MarkdownContent: "",
                HtmlContent: "",
                user: {}
            }
        },
        props: [],
        methods: {
            /**
             * 提交回答
             */
            commitAnswer() {
                let url = window.location.href;
                let part = url.split("/");
                part = part[part.length - 1];
                let requestBody = {
                    markdownContent: this.MarkdownContent,
                    htmlContent: this.HtmlContent,
                    issueId: part
                };
                let jwt = localStorage.getItem("jwt");
                if (this.MarkdownContent !== "" && this.HtmlContent !== "") {
                    this.$axios.post("/wenda/api/answer", qs.stringify(requestBody), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': jwt
                        }
                    }).then(response => {
                        if (response['data']['success'] === true) {
                            this.$Message.success("发布答案成功");
                        } else {
                            this.$Message.error("发布答案失败请稍后再试！");
                        }
                    }).catch(error => {
                        console.log(error);
                        this.$Message.error("登录错误，请稍后再试！")
                    })
                }
            },
            /**
             * 监听编辑器编辑的变化
             * @param value markdown文字
             * @param render html文字
             */
            textChange(value, render) {
                this.MarkdownContent = value;
                this.HtmlContent = render;
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
                        this.isAnsweredQuestion();
                    } else {
                        this.$Message.error("获取用户失败，请稍后再试！")
                    }
                }).catch(error => {
                    this.$Message.error("获取用户出现了异常")
                })
            },
            /**
             * 判断是否回答了问题
             */
            isAnsweredQuestion() {
                let url = window.location.href;
                let part = url.split("/");
                part = part[part.length - 1];
                let answers = this.user.answers;
                for (let i = 0; i < answers.length; i++) {
                    if (part === answers[i].issue.id+"") {
                        this.MarkdownContent = answers[i].markdownContent;
                        this.HtmlContent = answers[i].htmlContent;
                        return true;
                    }
                }
                return false;
            }
        },
        mounted() {
            this.getUser();
        }
    }
</script>


<style scoped>

</style>


<style>
  .v-note-wrapper {
    max-height: 300px;
    position:inherit
  }
</style>
