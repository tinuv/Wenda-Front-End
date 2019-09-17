<template>
  <div>
    <Card style="width: 500px;margin: auto;margin-top: 100px">
      <Alert type="warning">本项目仅适配PC端，使用PC端能获取最好的体验</Alert>
      使用测试账号登录:
      <CellGroup>
        <Cell>账号:tinuv@qq.com</Cell>
        <Cell>密码:123</Cell>
      </CellGroup>
    </Card>

    <Card style="margin: auto;width: 500px;margin-top: 50px">
      <Menu mode="horizontal" @on-select="menuItemSelect" active-name="EmailLogin">
        <MenuItem name="EmailLogin">邮件登录</MenuItem>
        <MenuItem name="PasswordLogin">密码登录</MenuItem>
      </Menu>
      <EmailLogin v-if="selection==='EmailLogin'"></EmailLogin>
      <PasswordLogin v-if="selection==='PasswordLogin'"></PasswordLogin>
    </Card>
  </div>
</template>

<script>
    import EmailLogin from "./components/EmailLogin";
    import PasswordLogin from "./components/PasswordLogin";

    export default {
        name: "Login",
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        components: {
            EmailLogin,
            PasswordLogin
        },
        data() {
            return {
                selection: "EmailLogin"
            }
        },
        methods: {
            menuItemSelect: function (name) {
                this.selection = name;
            }
        }
    }
</script>

<style scoped>

</style>
