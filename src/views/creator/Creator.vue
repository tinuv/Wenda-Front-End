<template>
  <div class="layout">
    <Nav></Nav>
    <Layout style="width: 60%;margin: 0 auto">
      <Sider hide-trigger :style="{background: '#fff'}">
        <Menu active-name="3-1" theme="light" width="auto" :open-names="['1']">
          <MenuGroup title="功能">
            <MenuItem name="3-1" @click="">问题推荐</MenuItem>
          </MenuGroup>
        </Menu>
      </Sider>
      <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
        <router-view></router-view>
      </Content>
    </Layout>
  </div>
</template>

<script>
    import QuestionList from "./question/QuestionList";
    import Nav from "../main/Header/Menu/Nav";

    export default {
        name: "Creator",
        components: {Nav, QuestionList},
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
  .layout {
    border: 1px solid #fff;
    background: #f6f6f6;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
</style>
<style>
  .ivu-menu-horizontal.ivu-menu-light:after {
    height: 0 !important;
  }

  .ivu-menu-vertical.ivu-menu-light:after {
    height: 0 !important;
  }
</style>

