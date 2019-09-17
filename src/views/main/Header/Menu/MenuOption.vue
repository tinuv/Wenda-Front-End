<template>
  <div style="display: inline-block;width: 400px;">
    <MenuItem name="index" v-on:click="indexClick">首页</MenuItem>
    <MenuItem name="explore">发现</MenuItem>
    <MenuItem name="answer">等你来答</MenuItem>
    <MenuItem name="todo"><a href="http://120.27.244.40/static/about.html">关于</a></MenuItem>
  </div>
</template>

<script>
    export default {
        name: "MenuOption",
        methods:{
            indexClick(){
              console.log("click")
            },
        }
    }
</script>

<style scoped>

</style>
