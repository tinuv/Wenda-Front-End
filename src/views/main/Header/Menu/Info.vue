<template>
  <div style="width: 300px;display: inline-block;">
    <div style="width: 300px;display: inline-block;" v-if="user.id!==undefined">
      <Row>
        <Col span="8">
          <Dropdown>
            通知
            <DropdownMenu slot="list">
              <DropdownItem>驴打滚</DropdownItem>
              <DropdownItem>炸酱面</DropdownItem>
              <DropdownItem disabled>豆汁儿</DropdownItem>
              <DropdownItem>冰糖葫芦</DropdownItem>
              <DropdownItem divided>北京烤鸭</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Col>
        <Col span="8">
          <Dropdown>
            <Avatar size="large" :src="user.userExtraInfo.avatarImg"></Avatar>
            <DropdownMenu slot="list">
              <DropdownItem>
                <RouterLink :to="'/people/'+user.id">个人页面</RouterLink>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>
    </div>

  </div>
</template>

<script>


    export default {
        name: "Info",
        components: {

        },
        data() {
            return {
                user: {}
            }
        },
        methods: {
            initData() {
                let jwt = localStorage.getItem("jwt");
                let a = jwt.split(" ");
                a = a[1].split(".")[1];
                a = Base64.decode(a);
                a = JSON.parse(a);
                a = JSON.parse(a['sub']);
                let userId = a["userId"];
                this.$axios.get("/wenda/api" + "/user/" + userId, {
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
                    this.$Message.error("获取用户出现异常")
                })
            }
        },
        mounted() {
            this.initData();
        }
    }
</script>

<style scoped>

</style>
