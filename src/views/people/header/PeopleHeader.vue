<template>
  <div>
    <div style="width: 1000px;margin: 0 auto" v-if="user.id!==undefined">
      <Card>
        <Upload
          action="/wenda/api/upload/img"
          :show-upload-list="false"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :headers="{'Authorization':jwt}"
          :on-success="uploadBackgroundSuccess"
          :disabled="pageUserId!==loginUserId"
          :on-error="uploadBackgroundError">
          <img :src="user.userExtraInfo.backgroundImg" width="100%">
        </Upload>


        <Upload style="width: 150px;height: 150px;position: relative;transform: translate(40px,-50px)"
                action="/wenda/api/upload/img"
                :show-upload-list="false"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :headers="{'Authorization':jwt}"
                :disabled="pageUserId!==loginUserId"
                :on-success="uploadAvatarSuccess"
                :on-error="uploadAvatarError">
          <Avatar shape="square" size="large"
                  style="width: 150px;height: 150px;position: relative;transform: translate(40px,-50px)"
                  :src="user.userExtraInfo.avatarImg">
          </Avatar>
        </Upload>


        <div style="transform: translate(250px,-120px);width: 700px">

          <CellGroup>
            <Form style="margin-bottom: 25px">
              <h2>{{user.userBasicInfo.username}}</h2>
            </Form>


            <Form style="margin-bottom: 20px">
              <h3 style="margin-bottom: 10px">性别</h3>
              <RadioGroup v-model="user.userBasicInfo.gender" style="margin-right: 30px;width: 450px">
                <Radio label="男">男</Radio>
                <Radio label="女">女</Radio>
                <Radio label="保密">保密</Radio>
              </RadioGroup>
              <Button type="primary" @click="genderUpdate" :disabled="pageUserId!==loginUserId">修改</Button>
            </Form>

            <Form style="margin-bottom: 20px">
              <h3 style="margin-bottom: 10px">个人简介</h3>
              <Input v-model="user.userExtraInfo.introduce" style="width: 450px;margin-right: 30px"/>
              <Button type="primary" @click="IntroduceUpdate" :disabled="pageUserId!==loginUserId">修改</Button>
            </Form>

            <Form style="margin-bottom: 20px">
              <h3 style="margin-bottom: 10px">行业</h3>
              <Select v-model="user.userBasicInfo.profession" style="margin-right: 30px;width: 450px">
                <Option value="Java工程师">Java工程师</Option>
                <Option value="前端工程师">前端工程师</Option>
                <Option value="大数据工程师">大数据工程师</Option>
              </Select>
              <Button type="primary" @click="professionUpdate" :disabled="pageUserId!==loginUserId">修改</Button>
            </Form>


            <Form title="一句话介绍" style="margin-bottom: 20px">
              <h3 style="margin-bottom: 10px">一句话介绍</h3>
              <Input placeholder="" v-model="user.userExtraInfo.shortIntroduce"
                     style="width: 450px;margin-right: 30px"/>
              <Button type="primary" @click="sIntroduceUpdate" :disabled="pageUserId!==loginUserId">修改</Button>
            </Form>


            <Form style="margin-bottom: 20px">
              <h3 style="margin-bottom: 10px">居住地</h3>
              <CellGroup style="width: 450px;margin-bottom: 10px">
                <Cell v-for="c in user.userExtraInfo.city" :key="c.id">
                  {{ c.cityName }}
                  <Icon type="md-close" slot="extra" size="20" @click="cityDelete(c.id)" v-if="pageUserId===loginUserId"/>
                </Cell>
              </CellGroup>
              <Button shape="circle" icon="md-add" type="primary" @click="cityModal=true"
                      style="margin-left: 10px" :disabled="pageUserId!==loginUserId">
              </Button>
            </Form>


            <Form style="width: 450px;margin-bottom: 20px">
              <h3 style="margin-bottom: 10px">职业经历</h3>
              <CellGroup style="width: 450px;margin-bottom: 10px">
                <Cell v-for="c in user.userExtraInfo.company" :key="c.id">
                  {{ c.companyName }}·{{c.position}}
                  <Icon type="md-close" slot="extra" size="20" @click="companyDelete(c.id)" v-if="pageUserId===loginUserId"/>
                </Cell>
              </CellGroup>
              <Button style="margin-left: 10px" shape="circle" icon="md-add" type="primary"
                      @click="professionExpModal=true" :disabled="pageUserId!==loginUserId">
              </Button>
            </Form>


            <Form style="width: 450px;margin-bottom: 20px">
              <h3 style="margin-bottom: 10px">教育经历</h3>
              <CellGroup style="width: 450px;margin-bottom: 10px">
                <Cell v-for="c in user.userExtraInfo.school" :key="c.id">
                  {{ c.schoolName }}·{{c.major}}
                  <Icon type="md-close" slot="extra" size="20" @click="schoolDelete(c.id)" v-if="pageUserId===loginUserId"/>
                </Cell>
              </CellGroup>
              <Button style="margin-left: 10px" shape="circle" icon="md-add" type="primary"
                      @click="educationExpModal=true" :disabled="pageUserId!==loginUserId">
              </Button>
            </Form>


          </CellGroup>
        </div>
      </Card>

      <Modal v-model="cityModal">
        <Form>
          <FormItem label="居住地">
            <Input v-model="city"></Input>
          </FormItem>
        </Form>
        <Button slot="footer" type="primary" @click="cityUpdate">确定</Button>
      </Modal>


      <Modal v-model="professionExpModal">
        <Form>
          <FormItem label="公司">
            <Input v-model="company.name"></Input>
          </FormItem>
          <FormItem label="职位">
            <Input v-model="company.position"></Input>
          </FormItem>
        </Form>
        <Button slot="footer" type="primary" @click="professionExpUpdate">确定</Button>
      </Modal>


      <Modal v-model="educationExpModal">
        <Form>
          <FormItem label="学校">
            <Input v-model="school.name"></Input>
          </FormItem>
          <FormItem label="专业">
            <Input v-model="school.major"></Input>
          </FormItem>
          <FormItem label="学历">
            <Select v-model="school.qualification">
              <Option value="本科以下">本科以下</Option>
              <Option value="本科">本科</Option>
              <Option value="硕士">硕士</Option>
              <Option value="博士">博士</Option>
            </Select>
          </FormItem>
          <FormItem label="入学年份">
            <DatePicker type="month" v-model="school.attendance"></DatePicker>
          </FormItem>
          <FormItem label="毕业年份">
            <DatePicker type="month" v-model="school.graduation"></DatePicker>
          </FormItem>
        </Form>
        <Button slot="footer" type="primary" @click="educationExpUpdate">确定</Button>
      </Modal>
    </div>
  </div>

</template>

<script>
    import qs from 'qs'

    export default {
        name: "PeopleHeader",
        data() {
            return {
                value: "",
                professionExpModal: false,
                educationExpModal: false,
                user: {},
                originUser: {},
                jwt: "",
                cityModal: false,
                city: "",
                company: {},
                school: {},
                loginUserId: -1,
                pageUserId: -1
            }
        },
        methods: {
            /**
             * 头像上传成功
             */
            uploadAvatarSuccess(response) {
                if (response['success'] === true) {
                    this.user.userExtraInfo.avatarImg = response["data"];
                    let jwt = localStorage.getItem("jwt");
                    let requestBody = {
                        avatarImg: this.user.userExtraInfo.avatarImg,
                        userExtraInfoId: this.user.userExtraInfo.id
                    };
                    this.$axios.post("/wenda/api/userextrainfo/avatar", qs.stringify(requestBody), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': jwt
                        }
                    }).then(response => {
                        if (response['data']['success'] === true) {
                            this.$Message.success("修改成功!");
                        } else {
                            this.$Message.error("修改失败，请稍后再试!");
                            this.user.userExtraInfo.avatarImg = this.originUser.userExtraInfo.avatarImg;
                        }
                    }).catch(error => {
                        this.$Message.error("修改出现异常，请稍后再试！")
                    })
                } else {
                    this.$Message.error("上传失败，请稍后再试！")
                }
            },
            /**
             * 头像上传失败
             */
            uploadAvatarError() {
                this.$Message.error("上传失败，请稍后再试！")
            },
            /**
             * 背景上传成功回调
             */
            uploadBackgroundSuccess(response) {
                if (response['success'] === true) {
                    this.user.userExtraInfo.backgroundImg = response["data"];
                    let jwt = localStorage.getItem("jwt");
                    let requestBody = {
                        backgroundImg: this.user.userExtraInfo.backgroundImg,
                        userExtraInfoId: this.user.userExtraInfo.id
                    };
                    this.$axios.post("/wenda/api/userextrainfo/background", qs.stringify(requestBody), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': jwt
                        }
                    }).then(response => {
                        if (response['data']['success'] === true) {
                            this.$Message.success("修改成功!");
                        } else {
                            this.$Message.error("修改失败，请稍后再试!");
                            this.user.userExtraInfo.backgroundImg = this.originUser.userExtraInfo.backgroundImg;
                        }
                    }).catch(error => {
                        this.$Message.error("修改出现异常，请稍后再试！")
                    })
                } else {
                    this.$Message.error("上传失败，请稍后再试！")
                }
            },
            /**
             *  背景上传失败
             */
            uploadBackgroundError(error) {
                this.$Message.error("上传失败，请稍后再试！")
            },
            /**
             * 性别更新
             */
            genderUpdate() {
                if (this.user.userBasicInfo.gender !== this.originUser.userBasicInfo.gender) {
                    let jwt = localStorage.getItem("jwt");
                    let requestBody = {
                        gender: this.user.userBasicInfo.gender,
                        userBasicInfoId: this.user.userBasicInfo.id
                    };
                    this.$axios.post("/wenda/api/userbasicinfo/gender", qs.stringify(requestBody), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': jwt
                        }
                    }).then(response => {
                        if (response['data']['success'] === true) {
                            this.$Message.success("修改成功!");
                        } else {
                            this.$Message.error("修改失败，请稍后再试!");
                            this.user.userBasicInfo.gender = this.originUser.userBasicInfo.gender;
                        }
                    }).catch(error => {
                        this.$Message.error("修改出现异常，请稍后再试！")
                    })
                } else {
                    this.$Message.warning("你没有修改信息！");
                }
            },
            /**
             * 简单介绍更新
             */
            sIntroduceUpdate() {
                if (this.user.userExtraInfo.shortIntroduce !== this.originUser.userExtraInfo.shortIntroduce) {
                    let jwt = localStorage.getItem("jwt");
                    let requestBody = {
                        shortIntroduce: this.user.userExtraInfo.shortIntroduce,
                        userExtraInfoId: this.user.userExtraInfo.id
                    };
                    this.$axios.post("/wenda/api/userextrainfo/shortintroduce", qs.stringify(requestBody), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': jwt
                        }
                    }).then(response => {
                        if (response['data']['success'] === true) {
                            this.$Message.success("修改成功!");
                        } else {
                            this.$Message.error("修改失败，请稍后再试!");
                            this.user.userExtraInfo.shortIntroduce = this.originUser.userExtraInfo.shortIntroduce;
                        }
                    }).catch(error => {
                        this.$Message.error("修改出现异常，请稍后再试！")
                    })
                } else {
                    this.$Message.warning("你没有修改信息！");
                }
            },
            /**
             * 修改职业
             */
            professionUpdate() {
                if (this.user.userBasicInfo.profession !== this.originUser.userBasicInfo.profession) {
                    let jwt = localStorage.getItem("jwt");
                    let requestBody = {
                        profession: this.user.userBasicInfo.profession,
                        userBasicInfoId: this.user.userBasicInfo.id
                    };
                    this.$axios.post("/wenda/api/userbasicinfo/profession", qs.stringify(requestBody), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': jwt
                        }
                    }).then(response => {
                        if (response['data']['success'] === true) {
                            this.$Message.success("修改成功!");
                        } else {
                            this.$Message.error("修改失败，请稍后再试!");
                            this.user.userBasicInfo.profession = this.originUser.userBasicInfo.profession;
                        }
                    }).catch(error => {
                        this.$Message.error("修改出现异常，请稍后再试！")
                    })
                } else {

                }
            },
            /**
             * 更新个人介绍
             */
            IntroduceUpdate() {
                if (this.user.userExtraInfo.introduce !== this.originUser.userExtraInfo.introduce) {
                    let jwt = localStorage.getItem("jwt");
                    let requestBody = {
                        introduce: this.user.userExtraInfo.introduce,
                        userExtraInfoId: this.user.userExtraInfo.id
                    };
                    this.$axios.post("/wenda/api/userextrainfo/introduce", qs.stringify(requestBody), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': jwt
                        }
                    }).then(response => {
                        if (response['data']['success'] === true) {
                            this.$Message.success("修改成功!");
                        } else {
                            this.$Message.error("修改失败，请稍后再试!");
                            this.user.userExtraInfo.introduce = this.originUser.userExtraInfo.introduce;
                        }
                    }).catch(error => {
                        this.$Message.error("修改出现异常，请稍后再试！")
                    })
                } else {
                    this.$Message.warning("你没有修改信息！");
                }
            },
            /**
             * 居住地修改
             */
            cityUpdate() {
                if (this.city !== "") {
                    let jwt = localStorage.getItem("jwt");
                    let requestBody = {
                        cityName: this.city,
                        userExtraInfoId: this.user.userExtraInfo.id
                    };
                    this.$axios.post("/wenda/api/city", qs.stringify(requestBody), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': jwt
                        }
                    }).then(response => {
                        if (response['data']['success'] === true) {
                            this.$Message.success("修改成功!");
                            this.cityModal = false;
                            this.city = "";
                            this.initData();
                        } else {
                            this.$Message.error("修改失败，请稍后再试!");
                            this.cityModal = false;
                            this.user.userExtraInfo.city = this.originUser.userExtraInfo.city;
                        }
                    }).catch(error => {
                        this.$Message.error("修改出现异常，请稍后再试！");
                        this.cityModal = false;
                    })
                } else {
                    this.$Message.warning("你没有修改信息！");
                }
            },


            professionExpUpdate() {
                if (this.company.name !== undefined && this.company.position !== undefined) {
                    let jwt = localStorage.getItem("jwt");
                    let requestBody = {
                        companyName: this.company.name,
                        position: this.company.position,
                        userExtraInfoId: this.user.userExtraInfo.id
                    };
                    this.$axios.post("/wenda/api/company", qs.stringify(requestBody), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': jwt
                        }
                    }).then(response => {
                        if (response['data']['success'] === true) {
                            this.$Message.success("修改成功!");
                            this.professionExpModal = false;
                            this.company = {};
                            this.initData();
                        } else {
                            this.$Message.error("修改失败，请稍后再试!");
                            this.professionExpModal = false;
                            this.user.userExtraInfo.company = this.originUser.userExtraInfo.company;
                        }
                    }).catch(error => {
                        this.$Message.error("修改出现异常，请稍后再试！")
                        this.professionExpModal = false;
                    })
                } else {
                    this.$Message.warning("请填写完整信息！");
                }
            },


            educationExpUpdate() {
                if (this.school.name !== undefined && this.school.major !== undefined && this.school.qualification !== undefined && this.school.attendance && this.school.graduation !== undefined) {
                    let jwt = localStorage.getItem("jwt");
                    let requestBody = {
                        schoolName: this.school.name,
                        major: this.school.major,
                        qualification: this.school.qualification,
                        attendance: this.school.attendance,
                        graduation: this.school.graduation,
                        userExtraInfoId: this.user.userExtraInfo.id
                    };
                    this.$axios.post("/wenda/api/school", qs.stringify(requestBody), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': jwt
                        }
                    }).then(response => {
                        if (response['data']['success'] === true) {
                            this.$Message.success("修改成功!");
                            this.educationExpModal = false;
                            this.school = {};
                            this.initData();
                        } else {
                            this.$Message.error("修改失败，请稍后再试!");
                            this.user.userExtraInfo.school = this.originUser.userExtraInfo.school;
                            this.educationExpModal = false;
                        }
                    }).catch(error => {
                        this.$Message.error("修改出现异常，请稍后再试！");
                        this.educationExpModal = false;
                    })
                } else {
                    this.$Message.warning("请填写完整信息！");
                }
            },


            cityDelete(id) {
                let jwt = localStorage.getItem("jwt");
                this.$axios.delete("/wenda/api/city/" + id, {
                    headers: {
                        'Authorization': jwt
                    }
                }).then(response => {
                    if (response['data']['success'] === true) {
                        this.$Message.success("删除成功!");
                        this.initData();
                    } else {
                        this.$Message.error("删除失败，请稍后再试!");
                        this.user.userExtraInfo.city = this.originUser.userExtraInfo.city;
                    }
                }).catch(error => {
                    this.$Message.error("删除出现异常，请稍后再试！");
                })
            },

            companyDelete(id) {
                let jwt = localStorage.getItem("jwt");
                this.$axios.delete("/wenda/api/company/" + id, {
                    headers: {
                        'Authorization': jwt
                    }
                }).then(response => {
                    if (response['data']['success'] === true) {
                        this.$Message.success("删除成功!");
                        this.initData();
                    } else {
                        this.$Message.error("删除失败，请稍后再试!");
                        this.user.userExtraInfo.company = this.originUser.userExtraInfo.company;
                    }
                }).catch(error => {
                    this.$Message.error("删除出现异常，请稍后再试！");
                })
            },


            schoolDelete(id) {
                let jwt = localStorage.getItem("jwt");
                this.$axios.delete("/wenda/api/school/" + id, {
                    headers: {
                        'Authorization': jwt
                    }
                }).then(response => {
                    if (response['data']['success'] === true) {
                        this.$Message.success("删除成功!");
                        this.initData();
                    } else {
                        this.$Message.error("删除失败，请稍后再试!");
                        this.user.userExtraInfo.school = this.originUser.userExtraInfo.school;
                    }
                }).catch(error => {
                    this.$Message.error("删除出现异常，请稍后再试！");
                })
            },


            initData() {
                let url = window.location.href;
                let part = url.split("/");
                part = part[part.length - 1];
                let jwt = localStorage.getItem("jwt");
                let a = jwt.split(" ");
                a = a[1].split(".")[1];
                a = Base64.decode(a);
                a = JSON.parse(a);
                a = JSON.parse(a['sub']);
                this.loginUserId = a['userId']+"";
                this.pageUserId = part;
                console.log(part);
                console.log(this.loginUserId);
                console.log(part===this.loginUserId);
                this.jwt = jwt;
                this.$axios.get("/wenda/api/user/" + part, {
                    headers: {
                        'Authorization': jwt
                    }
                }).then(response => {
                    if (response['data']['success'] === true) {
                        this.user = response['data']['data'];
                        let originUser = JSON.stringify(this.user);
                        this.originUser = JSON.parse(originUser);
                    } else {
                        this.$Message.error("获取个人信息错误，请稍后再试！")
                    }
                }).catch(error => {
                    this.$Message.error("获取个人信息异常，请稍后再试！")
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

<style>
  .ivu-cell {
    overflow: inherit
  }
</style>
