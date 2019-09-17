<template>
  <Card style="width: 30%;margin: 10% auto">
    <Form label-position="left">
      <FormItem label="用户名">
        <Input type="text" placeholder="用户名" v-model="user.username"></Input>
      </FormItem>
      <FormItem label="密码">
        <Input type="text" placeholder="密码" v-model="user.password"></Input>
      </FormItem>
      <FormItem label="手机号码">
        <Input type="tel" placeholder="手机号码" v-model="user.phoneNum"></Input>
      </FormItem>
      <FormItem label="生日">
        <DatePicker type="date" placeholder="选择一个日期" v-model="user.birthday" format="yyyy-MM-dd"></DatePicker>
      </FormItem>
      <FormItem label="性别">
        <RadioGroup v-model="user.gender">
          <Radio label="男" value="男">男</Radio>
          <Radio label="女" value="女">女</Radio>
          <Radio label="保密" value="保密">保密</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="行业">
        <Select v-model="user.profession">
          <Option value="Java工程师">Java工程师</Option>
          <Option value="前端工程师">前端工程师</Option>
          <Option value="大数据工程师">大数据工程师</Option>
        </Select>
      </FormItem>
    </Form>
    <Button type="primary" long @click="register">注册</Button>
  </Card>
</template>

<script>
    import qs from 'qs'


    export default {
        name: "Register",
        data() {
            return {
                user: {
                    username: "",
                    password: "",
                    phoneNum: "",
                    birthday: "",
                    gender: "",
                    profession: ""
                }
            }
        },
        methods: {
            register() {
                let user = this.user;
                let jwt = localStorage.getItem("jwt");
                let a = jwt.split(" ");
                a = a[1].split(".")[1];
                a = Base64.decode(a);
                a = JSON.parse(a);
                let email = JSON.parse(a['sub'])['email'];
                let password = user.password;
                if (user.username !== "" && user.password !== "" && user.phoneNum !== "" && user.birthday !== "" && user.gender !== "" && user.profession !== "") {
                    this.$axios.post("/wenda/api/register/register", user, {
                        headers: {
                            'Authorization': jwt
                        }
                    }).then(response => {
                        if (response['data']['success'] === true) {
                            console.log(email);
                            console.log(password);
                            let requestBody = {
                                email: email,
                                password: password
                            };
                            this.$axios.post("/wenda/api/password-login", qs.stringify(requestBody), {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            }).then(response => {
                                if (response['data']['success'] === true) {
                                    console.log(response);
                                    let jwt = response['headers']['authorization'];
                                    localStorage.setItem("jwt", jwt);
                                    this.$router.push("/home");
                                } else {
                                    this.$Message.error("获取凭证失败");
                                }
                            }).catch(error => {
                                this.$Message.error("获取凭证出现异常")
                            })
                        } else {
                            this.$Message.error("注册失败，请稍后在试！")
                        }
                    }).catch(error => {
                        console.log(error);
                        this.$Message.error("出现了异常，请稍后再试！")
                    })
                } else {
                    this.$Message.warning("请填写完整注册信息！");
                }
            }
        },
        mounted() {
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
                if (currentTime > a['exp']) {
                    this.$router.push({
                        path: "/login"
                    });
                }
                if (JSON.parse(a['sub'])['basicInfoFlag'] === true) {
                    this.$router.push({
                        path: "/home"
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
