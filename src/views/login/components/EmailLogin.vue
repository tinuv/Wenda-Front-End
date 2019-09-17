<template>
  <Form style="margin-top: 20px">
    <FormItem>
      <Input type="text" placeholder="电子邮件" v-model="email" size="large">
        <Icon type="ios-mail" slot="prepend"/>
        <Select v-model="postfix" slot="append" style="width: 120px">
          <Option value="@qq.com">@qq.com</Option>
          <Option value="@outlook.com">@outlook.com</Option>
          <Option value="@163.com">@163.com</Option>
          <Option value="@gmail.com">@gmail.com</Option>
        </Select>
      </Input>
    </FormItem>
    <FormItem>
      <Input type="text" placeholder="验证码" v-model="verificationCode" size="large">
        <Icon type="ios-key" slot="prepend"/>
        <a slot="append" style="width: 120px;" v-on:click="getVerificationCode">{{ verificationInfo }}</a>
      </Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="login" long>登录/注册</Button>
    </FormItem>
  </Form>
</template>

<script>
    import qs from 'qs'

    export default {
        name: "EmailLogin",
        data() {
            return {
                email: "",
                verificationCode: "",
                postfix: "",
                isVerificationCodeSend: false,
                verificationInfo: "获取验证码",
                totalTime: 60,
                type: ""
            }
        },
        methods: {
            /**
             * 登录
             */
            login: function () {
                if (this.email === "" || this.postfix === "" || this.verificationCode === "") {
                    this.$Message.warning("请填写完整的登录信息！")
                } else {
                    let requestBody = {
                        email: this.email + this.postfix,
                        verificationCode: this.verificationCode
                    };
                    this.$axios.post("/wenda/api/verification-login", qs.stringify(requestBody), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(response => {
                        if (response['data']['success'] === true) {
                            console.log(response);
                            let jwt = response['headers']['authorization'];
                            localStorage.setItem("jwt", jwt);
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
                            this.$router.push("/home");
                        }
                    }).catch(error => {
                        this.$Message.error("登录异常，请稍后再试！")
                    })
                }
            },
            /**
             * 获取验证码
             */
            getVerificationCode: function () {
                if (this.isVerificationCodeSend === false) {
                    if (this.email === "" || this.postfix === "") {
                        this.$Message.warning("请填写完整的登录信息！")
                    } else {
                        let requestBody = {
                            email: this.email + this.postfix
                        };
                        this.$axios.post("/wenda/api/register/verification", qs.stringify(requestBody), {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            }
                        ).then(res => {
                            if (res['data']['success'] === true) {
                                this.isVerificationCodeSend = true;
                                this.type = res['data']['type'];
                                this.$Message.success("验证码已成功发送，请查看您的邮件！");
                                let interval = window.setInterval(() => {
                                    if (this.totalTime <= 0) {
                                        this.totalTime = 60;
                                        this.verificationInfo = "获取验证码";
                                        this.isVerificationCodeSend = false;
                                        clearInterval(interval);
                                    } else {
                                        this.totalTime--;
                                        this.verificationInfo = this.totalTime + "秒后可以获取验证码";
                                    }
                                }, 1000);
                            } else {
                                this.$Message.error("获取验证码失败");
                            }
                        }).catch(err => {
                            this.$Message.error("出现了异常，请稍后再试！");
                        })
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
