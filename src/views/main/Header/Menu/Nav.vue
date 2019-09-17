<style>
  .profile {
    float: right;
    position: relative;
  }
</style>

<template>
  <div style="text-align: center; height:70px;">
    <Menu mode="horizontal" style="width: 100%;position: fixed" active-name="index" @on-select="menuSelect">
      <MenuOption></MenuOption>
      <Search></Search>
      <Info></Info>
    </Menu>
  </div>
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
        },
        methods: {
            menuSelect(name) {
                if (name==="index"){
                    this.$router.push("/home")
                }
            }
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
