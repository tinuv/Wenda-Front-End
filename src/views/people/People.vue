<template>
  <PeopleHeader></PeopleHeader>
</template>

<script>
    import PeopleHeader from "./header/PeopleHeader";

    export default {
        name: "People",
        components: {
            PeopleHeader
        },
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

</style>
