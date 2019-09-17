<template>
  <Form style="margin-top: 20px">
    <FormItem>
      <Input type="text" placeholder="Email" v-model="email" size="large">
        <Icon type="ios-mail" slot="prepend"/>
        <Select v-model="postfix" slot="append" style="width: 120px">
          <Option value="@qq.com">@qq.com</Option>
          <Option value="@outlook.com">@outlook.com</Option>
          <Option value="@163.com">@163.com</Option>
          <Option value="@gmail.com">@gmail.com</Option>
          <Option value="@tinuv.me">@tinuv.me</Option>
        </Select>
      </Input>
    </FormItem>
    <FormItem>
      <Input type="text" placeholder="Password" v-model="password" size="large">
        <Icon type="ios-key" slot="prepend"/>
      </Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="login" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
    import qs from 'qs'

    export default {
        name: "PasswordLogin",
        data() {
            return {
                email: "",
                password: "",
                postfix: ""
            }
        },
        methods: {
            login: function () {
                if (this.email === "" || this.password === "" || this.postfix === "") {
                    this.$Message.warning("请填写完整登录信息！");
                } else {
                    let requestBody = {
                        email: this.email + this.postfix,
                        password: this.password
                    };
                    this.$axios.post("/wenda/api/password-login", qs.stringify(requestBody), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(response => {
                        if (response['data']['success'] === true) {
                            let jwt = response['headers']['authorization'];
                            localStorage.setItem("jwt", jwt);
                            this.$router.push("home")
                        } else {
                            this.$Message.error("登录失败");
                        }
                    }).catch(error => {
                        this.$Message.error("出现了异常")
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
