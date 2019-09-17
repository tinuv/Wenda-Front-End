<template>
  <div v-if="user.id!==undefined">
    <div v-for="answer in answers">
      <h3 @click="clickTitle(answer.issue.id)">{{answer.issue.title}}</h3>
      <div style="margin-top: 10px">
        <div v-if="spread===answer.id||answer.trimedContent.length<=100" style="margin-bottom: 5px">
          <div style="display: inline-block;margin-right: 10px;float: left;" @click="avatarClick(answer.answerer.id)">
            <Avatar :src="answer.answerer.userExtraInfo.avatarImg" size="large" shape="square"></Avatar>
          </div>
          <div style="display: inline-block;">
            <h4 style="margin-bottom: 0px">{{answer.answerer.userBasicInfo.username}}</h4>
            <div>&nbsp;{{answer.answerer.userExtraInfo.shortIntroduce}}</div>
          </div>
        </div>
        {{answer.trimedContent.length>100?answer.answerer.userBasicInfo.username+":":""}}
        <!--<div v-html="spread===-1?answer.trimedContent:answer.htmlContent" class="markdown-body">
        </div>-->
        <div v-html="spread===-1?answer.trimedContent:spread===answer.id?answer.htmlContent:answer.trimedContent"
             class="markdown-body">
        </div>
        <a v-on:click="spread = spread===-1?answer.id:spread===answer.id?-1:answer.id"
           v-if="answer.trimedContent.length>100">
          {{spread===answer.id?"【收起全文】":"【展开全文】"}}
        </a>
      </div>
      <!--<div style="margin-top: 20px">编辑于2019</div>-->
      <div style="margin-top: 10px;margin-bottom: 10px">
        <ButtonGroup>
          <Button type="primary" :disabled="user.favorAnswers.find(an => an.id === answer.id)!==undefined"
                  @click="favorAnswer(answer.id)">
            <Icon type="md-arrow-dropup" size="20"/>
            {{answer.pros===0?"":answer.pros+"人"}}赞同{{answer.pros===0?"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;":""}}
          </Button>
          <Button @click="opposeAnswer(answer.id)" type="primary"
                  :disabled="user.opposeAnswers.find(an => an.id === answer.id)!==undefined">
            {{answer.cons===0?"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;":answer.cons+"人"}}反对
            <Icon type="md-arrow-dropdown" size="20"/>
          </Button>
        </ButtonGroup>
        <div style="display: inline-block;margin-left: 50px;margin-right: 20px"
             v-on:click="commentSwitch(answer.id)">
          <Icon type="ios-chatbubbles" size="20"/>
          评论
        </div>
        <div style="display: inline-block" @click="collAnswer(answer.id)">
          <Icon type="ios-bookmark" size="20"
                :color="user.collectAnswer.find(an => an.id === answer.id)!==undefined?'#008ee4':'#4f5a6d'"/>
          收藏
        </div>
      </div>

      <Card v-if="commentsOn===answer.id">
        <Form style="margin-bottom: 10px">
          <Input placeholder="回复" style="width: 400px" v-model="answerCommentContent"></Input>
          <Button type="primary" @click="answerComment(answer.id)">回复</Button>
        </Form>
        <div v-for="comment in answer.comments" v-if="comment.replyUser===null">
          <div style="position: relative;margin-bottom: 5px;">
            <div style="display: inline-block" @click="avatarClick(comment.user.id)">
              <Avatar :src="comment.user.userExtraInfo.avatarImg"></Avatar>
            </div>
            <h3 style="display: inline-block">{{comment.user.userBasicInfo.username}}</h3>
          </div>
          <div style="margin-left: 35px;">{{comment['content']}}</div>
          <div style="position: relative;font-size: 25px">
            <div style="display: inline-block">
              <Icon type="md-thumbs-up" style="margin-left: 35px"/>
            </div>
            <div style="display: inline-block;margin-left: 30px"
                 @click="switchReplyComment(comment.id,answer.id)">
              <Icon type="ios-text"/>
            </div>
          </div>
          <Card v-if="replyCardOn===comment.id">
            <Form style="margin-bottom: 10px">
              <Input :placeholder="'回复'+comment.user.userBasicInfo.username+':'" style="width: 400px"
                     v-model="replyCommentContent1"></Input>
              <Button type="primary" @click="replyComment1(answer.id,comment.id,comment.user.id)">回复</Button>
            </Form>
            <div v-for="replyComment in replyComments">
              <div style="position: relative;margin-bottom: 5px;">
                <div style="display: inline-block" @click="avatarClick(replyComment.user.id)">
                  <Avatar :src="replyComment.user.userExtraInfo.avatarImg"></Avatar>
                </div>
                <h3 style="display: inline-block">{{replyComment.user.userBasicInfo.username}}&nbsp;&nbsp;&nbsp;回复&nbsp;&nbsp;&nbsp;{{replyComment.replyUser.userBasicInfo.username}}</h3>
              </div>
              <div style="margin-left: 35px;">{{replyComment['content']}}</div>
              <div style="position: relative;font-size: 25px">
                <div style="display: inline-block">
                  <Icon type="md-thumbs-up" style="margin-left: 35px"/>
                </div>
                <div style="display: inline-block;margin-left: 30px"
                     @click="replyInputShow=replyInputShow===-1?replyComment.id:replyInputShow===replyComment.id?-1:replyComment.id">
                  <Icon type="ios-text"/>
                </div>
                <Form style="margin-bottom: 10px;margin-left: 35px" v-if="replyInputShow===replyComment.id">
                  <Input :placeholder="'回复'+replyComment.user.userBasicInfo.username+':'" style="width: 400px"
                         v-model="replyCommentContent2"></Input>
                  <Button type="primary" @click="replyComment2(answer.id,comment.id,replyComment.user.id)">
                    回复
                  </Button>
                </Form>
              </div>
            </div>
          </Card>
          <hr style="opacity: 0.4;margin-top: 5px;margin-bottom: 5px"/>
        </div>
      </Card>
      <hr style="margin-bottom: 10px;opacity: 0.3"/>
    </div>
  </div>
</template>

<script>
    import qs from 'qs'

    export default {
        name: "RecommendContent",
        data() {
            return {
                answers: [],
                commentsOn: -1,
                answerCommentContent: "",
                replyCardOn: -1,
                replyInputShow: -1,
                replyCommentContent1: "",
                replyCommentContent2: "",
                replyComments: [],
                user: {},
                spread: -1
            }
        },
        methods: {
            getHotAnswers() {
                let url = window.location.href;
                let part = url.split("/");
                part = part[part.length - 1];
                let jwt = localStorage.getItem("jwt");
                this.$axios.get("/wenda/api/answer/hot", {
                    headers: {
                        'Authorization': jwt
                    }
                }).then(response => {
                    if (response['data']['success'] === true) {
                        this.answers = response['data']['data'];
                        let trimHtml = require('trim-html');
                        for (let i = 0; i < this.answers.length; i++) {
                            this.answers[i].trimedContent = trimHtml(this.answers[i].htmlContent, {more: true})['html']
                        }
                    } else {
                        this.$Message.error("获取答案错误，请稍后再试！")
                    }
                }).catch(error => {
                    this.$Message.error("获取答案出现了异常")
                })
            },


            commentSwitch(answerId) {
                this.commentsOn = this.commentsOn === -1 ? answerId : -1;
            },


            answerComment(answerId) {
                let jwt = localStorage.getItem("jwt");
                if (this.answerCommentContent !== "") {
                    this.$axios.post("/wenda/api/comment/answer/" + answerId, {
                        content: this.answerCommentContent
                    }, {
                        headers: {
                            'Authorization': jwt
                        }
                    }).then(response => {
                        if (response['data']['success'] === true) {
                            this.$Message.success("回复成功！");
                            this.replyCommentContent1 = "";
                            this.getHotAnswers();
                        } else {
                            this.$Message.error("获取答案错误，请稍后再试！")
                        }
                    }).catch(error => {
                        this.$Message.error("获取答案出现了异常")
                    })
                }
            },


            switchReplyComment(commentId, answerId) {
                this.replyCardOn = this.replyCardOn === -1 ? commentId : this.replyCardOn === commentId ? -1 : commentId;
                this.getReplyComment(commentId, answerId);
            },


            getReplyComment(commentId, answerId) {
                let jwt = localStorage.getItem("jwt");
                this.$axios.get("/wenda/api/comment/children?answerId=" + answerId + "&parentCommentId=" + commentId, {
                    headers: {
                        'Authorization': jwt
                    }
                }).then(response => {
                    if (response['data']['success'] === true) {
                        this.replyComments = response['data']['data'];
                    } else {
                        this.$Message.error("获取答案错误，请稍后再试！")
                    }
                }).catch(error => {
                    this.$Message.error("获取答案出现了异常")
                })
            },


            replyComment1(answerId, commentId, replyUserId) {
                let jwt = localStorage.getItem("jwt");
                if (this.replyCommentContent1 !== "") {
                    let requestBody = {
                        content: this.replyCommentContent1,
                        parentCommentId: commentId,
                        replyUserId: replyUserId,
                        answerId: answerId
                    };
                    this.$axios.post("/wenda/api/comment/reply", qs.stringify(requestBody), {
                        headers: {
                            'Authorization': jwt,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(response => {
                        if (response['data']['success'] === true) {
                            this.$Message.success("回复成功！");
                            this.getReplyComment(commentId, answerId);
                        } else {
                            this.$Message.error("获取答案错误，请稍后再试！")
                        }
                    }).catch(error => {
                        this.$Message.error("获取答案出现了异常")
                    })
                }
            },


            replyComment2(answerId, commentId, replyUserId) {
                let jwt = localStorage.getItem("jwt");
                if (this.replyCommentContent2 !== "") {
                    let requestBody = {
                        content: this.replyCommentContent2,
                        parentCommentId: commentId,
                        replyUserId: replyUserId,
                        answerId: answerId
                    };
                    this.$axios.post("/wenda/api/comment/reply", qs.stringify(requestBody), {
                        headers: {
                            'Authorization': jwt,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(response => {
                        if (response['data']['success'] === true) {
                            this.$Message.success("回复成功！");
                            this.getReplyComment(commentId, answerId);
                            this.replyCommentContent2 = ""
                        } else {
                            this.$Message.error("回复失败，请稍后再试！")
                        }
                    }).catch(error => {
                        this.$Message.error("回复出现异常")
                    })
                }
            },

            initData() {
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
                    } else {
                        this.$Message.error("获取用户失败，请稍后再试！")
                    }
                }).catch(error => {
                    this.$Message.error("获取用户出现了异常")
                })
            },


            favorAnswer(answerId) {
                let jwt = localStorage.getItem("jwt");
                let requestBody = {
                    answerId: answerId
                };
                this.$axios.post("/wenda/api/answer/favor", qs.stringify(requestBody), {
                    headers: {
                        'Authorization': jwt,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(response => {
                    if (response['data']['success'] === true) {
                        this.initData();
                        this.getHotAnswers();
                    } else {
                        this.$Message.error("赞同失败，请稍后再试！")
                    }
                }).catch(error => {
                    this.$Message.error("赞同出现异常")
                })
            },


            opposeAnswer(answerId) {
                let jwt = localStorage.getItem("jwt");
                let requestBody = {
                    answerId: answerId
                };
                this.$axios.post("/wenda/api/answer/oppose", qs.stringify(requestBody), {
                    headers: {
                        'Authorization': jwt,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(response => {
                    if (response['data']['success'] === true) {
                        this.initData();
                        this.getHotAnswers();
                    } else {
                        this.$Message.error("赞同失败，请稍后再试！")
                    }
                }).catch(error => {
                    this.$Message.error("赞同出现异常")
                })
            },


            collAnswer(answerId) {
                if (this.user.collectAnswer.find(an => an.id === answerId) === undefined) {
                    let jwt = localStorage.getItem("jwt");
                    let requestBody = {
                        answerId: answerId
                    };
                    this.$axios.post("/wenda/api/answer/collect", qs.stringify(requestBody), {
                        headers: {
                            'Authorization': jwt,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(response => {
                        if (response['data']['success'] === true) {
                            this.initData();
                        } else {
                            this.$Message.error("赞同失败，请稍后再试！")
                        }
                    }).catch(error => {
                        this.$Message.error("赞同出现异常")
                    })
                }
            },

            avatarClick(userId) {
                this.$router.push("/people/" + userId)
            },

            clickTitle(issueId) {
                this.$router.push("/question/" + issueId)
            }
        },
        mounted() {
            this.getHotAnswers();
            this.initData();
        }
    }
</script>

<style scoped>

</style>


<style>
  .ivu-menu-horizontal.ivu-menu-light:after {
    height: 0 !important;
  }

  .ivu-menu-vertical.ivu-menu-light:after {
    height: 0 !important;
  }

  .ivu-menu {
    position: inherit;
  }


  .markdown-body .octicon {
    display: inline-block;
    fill: currentColor;
    vertical-align: text-bottom;
  }

  .markdown-body .anchor {
    float: left;
    line-height: 1;
    margin-left: -20px;
    padding-right: 4px;
  }

  .markdown-body .anchor:focus {
    outline: none;
  }

  .markdown-body h1 .octicon-link,
  .markdown-body h2 .octicon-link,
  .markdown-body h3 .octicon-link,
  .markdown-body h4 .octicon-link,
  .markdown-body h5 .octicon-link,
  .markdown-body h6 .octicon-link {
    color: #1b1f23;
    vertical-align: middle;
    visibility: hidden;
  }

  .markdown-body h1:hover .anchor,
  .markdown-body h2:hover .anchor,
  .markdown-body h3:hover .anchor,
  .markdown-body h4:hover .anchor,
  .markdown-body h5:hover .anchor,
  .markdown-body h6:hover .anchor {
    text-decoration: none;
  }

  .markdown-body h1:hover .anchor .octicon-link,
  .markdown-body h2:hover .anchor .octicon-link,
  .markdown-body h3:hover .anchor .octicon-link,
  .markdown-body h4:hover .anchor .octicon-link,
  .markdown-body h5:hover .anchor .octicon-link,
  .markdown-body h6:hover .anchor .octicon-link {
    visibility: visible;
  }

  .markdown-body {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    color: #24292e;
    line-height: 1.5;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
    font-size: 16px;
    line-height: 1.5;
    word-wrap: break-word;
  }

  .markdown-body .pl-c {
    color: #6a737d;
  }

  .markdown-body .pl-c1,
  .markdown-body .pl-s .pl-v {
    color: #005cc5;
  }

  .markdown-body .pl-e,
  .markdown-body .pl-en {
    color: #6f42c1;
  }

  .markdown-body .pl-s .pl-s1,
  .markdown-body .pl-smi {
    color: #24292e;
  }

  .markdown-body .pl-ent {
    color: #22863a;
  }

  .markdown-body .pl-k {
    color: #d73a49;
  }

  .markdown-body .pl-pds,
  .markdown-body .pl-s,
  .markdown-body .pl-s .pl-pse .pl-s1,
  .markdown-body .pl-sr,
  .markdown-body .pl-sr .pl-cce,
  .markdown-body .pl-sr .pl-sra,
  .markdown-body .pl-sr .pl-sre {
    color: #032f62;
  }

  .markdown-body .pl-smw,
  .markdown-body .pl-v {
    color: #e36209;
  }

  .markdown-body .pl-bu {
    color: #b31d28;
  }

  .markdown-body .pl-ii {
    background-color: #b31d28;
    color: #fafbfc;
  }

  .markdown-body .pl-c2 {
    background-color: #d73a49;
    color: #fafbfc;
  }

  .markdown-body .pl-c2:before {
    content: "^M";
  }

  .markdown-body .pl-sr .pl-cce {
    color: #22863a;
    font-weight: 700;
  }

  .markdown-body .pl-ml {
    color: #735c0f;
  }

  .markdown-body .pl-mh,
  .markdown-body .pl-mh .pl-en,
  .markdown-body .pl-ms {
    color: #005cc5;
    font-weight: 700;
  }

  .markdown-body .pl-mi {
    color: #24292e;
    font-style: italic;
  }

  .markdown-body .pl-mb {
    color: #24292e;
    font-weight: 700;
  }

  .markdown-body .pl-md {
    background-color: #ffeef0;
    color: #b31d28;
  }

  .markdown-body .pl-mi1 {
    background-color: #f0fff4;
    color: #22863a;
  }

  .markdown-body .pl-mc {
    background-color: #ffebda;
    color: #e36209;
  }

  .markdown-body .pl-mi2 {
    background-color: #005cc5;
    color: #f6f8fa;
  }

  .markdown-body .pl-mdr {
    color: #6f42c1;
    font-weight: 700;
  }

  .markdown-body .pl-ba {
    color: #586069;
  }

  .markdown-body .pl-sg {
    color: #959da5;
  }

  .markdown-body .pl-corl {
    color: #032f62;
    text-decoration: underline;
  }

  .markdown-body details {
    display: block;
  }

  .markdown-body summary {
    display: list-item;
  }

  .markdown-body a {
    background-color: transparent;
  }

  .markdown-body a:active,
  .markdown-body a:hover {
    outline-width: 0;
  }

  .markdown-body strong {
    font-weight: inherit;
    font-weight: bolder;
  }

  .markdown-body h1 {
    font-size: 2em;
    margin: .67em 0;
  }

  .markdown-body img {
    border-style: none;
  }

  .markdown-body code,
  .markdown-body kbd,
  .markdown-body pre {
    font-family: monospace, monospace;
    font-size: 1em;
  }

  .markdown-body hr {
    box-sizing: content-box;
    height: 0;
    overflow: visible;
  }

  .markdown-body input {
    font: inherit;
    margin: 0;
  }

  .markdown-body input {
    overflow: visible;
  }

  .markdown-body [type=checkbox] {
    box-sizing: border-box;
    padding: 0;
  }

  .markdown-body * {
    box-sizing: border-box;
  }

  .markdown-body input {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  .markdown-body a {
    color: #0366d6;
    text-decoration: none;
  }

  .markdown-body a:hover {
    text-decoration: underline;
  }

  .markdown-body strong {
    font-weight: 600;
  }

  .markdown-body hr {
    background: transparent;
    border: 0;
    border-bottom: 1px solid #dfe2e5;
    height: 0;
    margin: 15px 0;
    overflow: hidden;
  }

  .markdown-body hr:before {
    content: "";
    display: table;
  }

  .markdown-body hr:after {
    clear: both;
    content: "";
    display: table;
  }

  .markdown-body table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  .markdown-body td,
  .markdown-body th {
    padding: 0;
  }

  .markdown-body details summary {
    cursor: pointer;
  }

  .markdown-body h1,
  .markdown-body h2,
  .markdown-body h3,
  .markdown-body h4,
  .markdown-body h5,
  .markdown-body h6 {
    margin-bottom: 0;
    margin-top: 0;
  }

  .markdown-body h1 {
    font-size: 32px;
  }

  .markdown-body h1,
  .markdown-body h2 {
    font-weight: 600;
  }

  .markdown-body h2 {
    font-size: 24px;
  }

  .markdown-body h3 {
    font-size: 20px;
  }

  .markdown-body h3,
  .markdown-body h4 {
    font-weight: 600;
  }

  .markdown-body h4 {
    font-size: 16px;
  }

  .markdown-body h5 {
    font-size: 14px;
  }

  .markdown-body h5,
  .markdown-body h6 {
    font-weight: 600;
  }

  .markdown-body h6 {
    font-size: 12px;
  }

  .markdown-body p {
    margin-bottom: 10px;
    margin-top: 0;
  }

  .markdown-body blockquote {
    margin: 0;
  }

  .markdown-body ol,
  .markdown-body ul {
    margin-bottom: 0;
    margin-top: 0;
    padding-left: 0;
  }

  .markdown-body ol ol,
  .markdown-body ul ol {
    list-style-type: lower-roman;
  }

  .markdown-body ol ol ol,
  .markdown-body ol ul ol,
  .markdown-body ul ol ol,
  .markdown-body ul ul ol {
    list-style-type: lower-alpha;
  }

  .markdown-body dd {
    margin-left: 0;
  }

  .markdown-body code,
  .markdown-body pre {
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;
    font-size: 12px;
  }

  .markdown-body pre {
    margin-bottom: 0;
    margin-top: 0;
  }

  .markdown-body input::-webkit-inner-spin-button,
  .markdown-body input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }

  .markdown-body .border {
    border: 1px solid #e1e4e8 !important;
  }

  .markdown-body .border-0 {
    border: 0 !important;
  }

  .markdown-body .border-bottom {
    border-bottom: 1px solid #e1e4e8 !important;
  }

  .markdown-body .rounded-1 {
    border-radius: 3px !important;
  }

  .markdown-body .bg-white {
    background-color: #fff !important;
  }

  .markdown-body .bg-gray-light {
    background-color: #fafbfc !important;
  }

  .markdown-body .text-gray-light {
    color: #6a737d !important;
  }

  .markdown-body .mb-0 {
    margin-bottom: 0 !important;
  }

  .markdown-body .my-2 {
    margin-bottom: 8px !important;
    margin-top: 8px !important;
  }

  .markdown-body .pl-0 {
    padding-left: 0 !important;
  }

  .markdown-body .py-0 {
    padding-bottom: 0 !important;
    padding-top: 0 !important;
  }

  .markdown-body .pl-1 {
    padding-left: 4px !important;
  }

  .markdown-body .pl-2 {
    padding-left: 8px !important;
  }

  .markdown-body .py-2 {
    padding-bottom: 8px !important;
    padding-top: 8px !important;
  }

  .markdown-body .pl-3,
  .markdown-body .px-3 {
    padding-left: 16px !important;
  }

  .markdown-body .px-3 {
    padding-right: 16px !important;
  }

  .markdown-body .pl-4 {
    padding-left: 24px !important;
  }

  .markdown-body .pl-5 {
    padding-left: 32px !important;
  }

  .markdown-body .pl-6 {
    padding-left: 40px !important;
  }

  .markdown-body .f6 {
    font-size: 12px !important;
  }

  .markdown-body .lh-condensed {
    line-height: 1.25 !important;
  }

  .markdown-body .text-bold {
    font-weight: 600 !important;
  }

  .markdown-body:before {
    content: "";
    display: table;
  }

  .markdown-body:after {
    clear: both;
    content: "";
    display: table;
  }

  .markdown-body > :first-child {
    margin-top: 0 !important;
  }

  .markdown-body > :last-child {
    margin-bottom: 0 !important;
  }

  .markdown-body a:not([href]) {
    color: inherit;
    text-decoration: none;
  }

  .markdown-body blockquote,
  .markdown-body dl,
  .markdown-body ol,
  .markdown-body p,
  .markdown-body pre,
  .markdown-body table,
  .markdown-body ul {
    margin-bottom: 16px;
    margin-top: 0;
  }

  .markdown-body hr {
    background-color: #e1e4e8;
    border: 0;
    height: .25em;
    margin: 24px 0;
    padding: 0;
  }

  .markdown-body blockquote {
    border-left: .25em solid #dfe2e5;
    color: #6a737d;
    padding: 0 1em;
  }

  .markdown-body blockquote > :first-child {
    margin-top: 0;
  }

  .markdown-body blockquote > :last-child {
    margin-bottom: 0;
  }

  .markdown-body kbd {
    background-color: #fafbfc;
    border: 1px solid #c6cbd1;
    border-bottom-color: #959da5;
    border-radius: 3px;
    box-shadow: inset 0 -1px 0 #959da5;
    color: #444d56;
    display: inline-block;
    font-size: 11px;
    line-height: 10px;
    padding: 3px 5px;
    vertical-align: middle;
  }

  .markdown-body h1,
  .markdown-body h2,
  .markdown-body h3,
  .markdown-body h4,
  .markdown-body h5,
  .markdown-body h6 {
    font-weight: 600;
    line-height: 1.25;
    margin-bottom: 16px;
    margin-top: 24px;
  }

  .markdown-body h1 {
    font-size: 2em;
  }

  .markdown-body h1,
  .markdown-body h2 {
    border-bottom: 1px solid #eaecef;
    padding-bottom: .3em;
  }

  .markdown-body h2 {
    font-size: 1.5em;
  }

  .markdown-body h3 {
    font-size: 1.25em;
  }

  .markdown-body h4 {
    font-size: 1em;
  }

  .markdown-body h5 {
    font-size: .875em;
  }

  .markdown-body h6 {
    color: #6a737d;
    font-size: .85em;
  }

  .markdown-body ol,
  .markdown-body ul {
    padding-left: 2em;
  }

  .markdown-body ol ol,
  .markdown-body ol ul,
  .markdown-body ul ol,
  .markdown-body ul ul {
    margin-bottom: 0;
    margin-top: 0;
  }

  .markdown-body li {
    word-wrap: break-all;
  }

  .markdown-body li > p {
    margin-top: 16px;
  }

  .markdown-body li + li {
    margin-top: .25em;
  }

  .markdown-body dl {
    padding: 0;
  }

  .markdown-body dl dt {
    font-size: 1em;
    font-style: italic;
    font-weight: 600;
    margin-top: 16px;
    padding: 0;
  }

  .markdown-body dl dd {
    margin-bottom: 16px;
    padding: 0 16px;
  }

  .markdown-body table {
    display: block;
    overflow: auto;
    width: 100%;
  }

  .markdown-body table th {
    font-weight: 600;
  }

  .markdown-body table td,
  .markdown-body table th {
    border: 1px solid #dfe2e5;
    padding: 6px 13px;
  }

  .markdown-body table tr {
    background-color: #fff;
    border-top: 1px solid #c6cbd1;
  }

  .markdown-body table tr:nth-child(2n) {
    background-color: #f6f8fa;
  }

  .markdown-body img {
    background-color: #fff;
    box-sizing: content-box;
    max-width: 100%;
  }

  .markdown-body img[align=right] {
    padding-left: 20px;
  }

  .markdown-body img[align=left] {
    padding-right: 20px;
  }

  .markdown-body code {
    background-color: rgba(27, 31, 35, .05);
    border-radius: 3px;
    font-size: 85%;
    margin: 0;
    padding: .2em .4em;
  }

  .markdown-body pre {
    word-wrap: normal;
  }

  .markdown-body pre > code {
    background: transparent;
    border: 0;
    font-size: 100%;
    margin: 0;
    padding: 0;
    white-space: pre;
    word-break: normal;
  }

  .markdown-body .highlight {
    margin-bottom: 16px;
  }

  .markdown-body .highlight pre {
    margin-bottom: 0;
    word-break: normal;
  }

  .markdown-body .highlight pre,
  .markdown-body pre {
    background-color: #f6f8fa;
    border-radius: 3px;
    font-size: 85%;
    line-height: 1.45;
    overflow: auto;
    padding: 16px;
  }

  .markdown-body pre code {
    background-color: transparent;
    border: 0;
    display: inline;
    line-height: inherit;
    margin: 0;
    max-width: auto;
    overflow: visible;
    padding: 0;
    word-wrap: normal;
  }

  .markdown-body .commit-tease-sha {
    color: #444d56;
    display: inline-block;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;
    font-size: 90%;
  }

  .markdown-body .blob-wrapper {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .markdown-body .blob-wrapper-embedded {
    max-height: 240px;
    overflow-y: auto;
  }

  .markdown-body .blob-num {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    color: rgba(27, 31, 35, .3);
    cursor: pointer;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;
    font-size: 12px;
    line-height: 20px;
    min-width: 50px;
    padding-left: 10px;
    padding-right: 10px;
    text-align: right;
    user-select: none;
    vertical-align: top;
    white-space: nowrap;
    width: 1%;
  }

  .markdown-body .blob-num:hover {
    color: rgba(27, 31, 35, .6);
  }

  .markdown-body .blob-num:before {
    content: attr(data-line-number);
  }

  .markdown-body .blob-code {
    line-height: 20px;
    padding-left: 10px;
    padding-right: 10px;
    position: relative;
    vertical-align: top;
  }

  .markdown-body .blob-code-inner {
    color: #24292e;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;
    font-size: 12px;
    overflow: visible;
    white-space: pre;
    word-wrap: normal;
  }

  .markdown-body .pl-token.active,
  .markdown-body .pl-token:hover {
    background: #ffea7f;
    cursor: pointer;
  }

  .markdown-body kbd {
    background-color: #fafbfc;
    border: 1px solid #d1d5da;
    border-bottom-color: #c6cbd1;
    border-radius: 3px;
    box-shadow: inset 0 -1px 0 #c6cbd1;
    color: #444d56;
    display: inline-block;
    font: 11px SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;
    line-height: 10px;
    padding: 3px 5px;
    vertical-align: middle;
  }

  .markdown-body :checked + .radio-label {
    border-color: #0366d6;
    position: relative;
    z-index: 1;
  }

  .markdown-body .tab-size[data-tab-size="1"] {
    -moz-tab-size: 1;
    tab-size: 1;
  }

  .markdown-body .tab-size[data-tab-size="2"] {
    -moz-tab-size: 2;
    tab-size: 2;
  }

  .markdown-body .tab-size[data-tab-size="3"] {
    -moz-tab-size: 3;
    tab-size: 3;
  }

  .markdown-body .tab-size[data-tab-size="4"] {
    -moz-tab-size: 4;
    tab-size: 4;
  }

  .markdown-body .tab-size[data-tab-size="5"] {
    -moz-tab-size: 5;
    tab-size: 5;
  }

  .markdown-body .tab-size[data-tab-size="6"] {
    -moz-tab-size: 6;
    tab-size: 6;
  }

  .markdown-body .tab-size[data-tab-size="7"] {
    -moz-tab-size: 7;
    tab-size: 7;
  }

  .markdown-body .tab-size[data-tab-size="8"] {
    -moz-tab-size: 8;
    tab-size: 8;
  }

  .markdown-body .tab-size[data-tab-size="9"] {
    -moz-tab-size: 9;
    tab-size: 9;
  }

  .markdown-body .tab-size[data-tab-size="10"] {
    -moz-tab-size: 10;
    tab-size: 10;
  }

  .markdown-body .tab-size[data-tab-size="11"] {
    -moz-tab-size: 11;
    tab-size: 11;
  }

  .markdown-body .tab-size[data-tab-size="12"] {
    -moz-tab-size: 12;
    tab-size: 12;
  }

  .markdown-body .task-list-item {
    list-style-type: none;
  }

  .markdown-body .task-list-item + .task-list-item {
    margin-top: 3px;
  }

  .markdown-body .task-list-item input {
    margin: 0 .2em .25em -1.6em;
    vertical-align: middle;
  }

  .markdown-body hr {
    border-bottom-color: #eee;
  }

  .markdown-body .pl-0 {
    padding-left: 0 !important;
  }

  .markdown-body .pl-1 {
    padding-left: 4px !important;
  }

  .markdown-body .pl-2 {
    padding-left: 8px !important;
  }

  .markdown-body .pl-3 {
    padding-left: 16px !important;
  }

  .markdown-body .pl-4 {
    padding-left: 24px !important;
  }

  .markdown-body .pl-5 {
    padding-left: 32px !important;
  }

  .markdown-body .pl-6 {
    padding-left: 40px !important;
  }

  .markdown-body .pl-7 {
    padding-left: 48px !important;
  }

  .markdown-body .pl-8 {
    padding-left: 64px !important;
  }

  .markdown-body .pl-9 {
    padding-left: 80px !important;
  }

  .markdown-body .pl-10 {
    padding-left: 96px !important;
  }

  .markdown-body .pl-11 {
    padding-left: 112px !important;
  }

  .markdown-body .pl-12 {
    padding-left: 128px !important;
  }
</style>
