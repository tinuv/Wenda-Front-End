<style>
  .sider {
    width: 70%;
  }
</style>


<template>
  <div style="margin: 0px auto;position: relative;width: 1000px">
    <div style="width: 700px;float: left;margin-left: 1.5%">
      <Card>
        <Menu slot="title" mode="horizontal" active-name="recommend" :on-select="menuSelect">
          <MenuItem name="recommend">推荐</MenuItem>
          <MenuItem name="focus">关注</MenuItem>
          <MenuItem name="hot">热榜</MenuItem>
        </Menu>
        <RecommendContent></RecommendContent>
      </Card>
    </div>
    <SiderContent></SiderContent>
  </div>
</template>

<script>
    import RecommendContent from "./RecommendContent";
    import SiderContent from "./SiderContent";


    export default {
        name: "WebContent",
        components: {RecommendContent, SiderContent},
        data() {
            return {}
        },
        methods: {
            menuSelect(name){
                console.log("sjdfiawd");
                console.log(name)
            }
        },
        mounted() {
        }

    }
</script>

<style scoped>

</style>


