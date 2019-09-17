<style>
  .profile {
    float: right;
    position: relative;
  }
</style>

<template>
    <div style="text-align: center;">
      <Menu mode="horizontal" style="width: 100%;position: fixed">
        <MenuOption></MenuOption>
        <Search></Search>
        <Info></Info>
      </Menu>
    </div>
  <!--
  <div style="background: #fff;margin-bottom: 10px">
    <Menu mode="horizontal" :style="{width: '100%',height:'100%'}">
      <div style="width: 50%;margin: 0 auto">
        <div>
          <MenuItem name="index">首页</MenuItem>
          <MenuItem name="recommend">推荐</MenuItem>
          <MenuItem name="answer">回答</MenuItem>
        </div>
        <div class="profile">
          <MenuItem name="notifications">
            <Avatar icon="ios-notifications" size="large"/>
          </MenuItem>
          <MenuItem name="chatbubbles">
            <Avatar icon="ios-chatbubbles" size="large"/>
          </MenuItem>
          <MenuItem name="person">
            <Avatar icon="ios-person" size="large"/>
          </MenuItem>
        </div>
      </div>
    </Menu>
    <Search></Search>
  </div>-->
</template>

<script>

    import Search from "./Search";
    import MenuOption from "./MenuOption";
    import Info from "./Info";

    export default {
        name: "Nav",
        components: {
            MenuOption,
            Search,
            Info
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
