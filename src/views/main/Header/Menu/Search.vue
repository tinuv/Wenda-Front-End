<template>
  <div style="display: inline-block;width: 300px">
    <Row>
      <Col span="14">
        <Input placeholder="搜索">
          <Icon type="ios-search" slot="suffix"/>
        </Input>
      </Col>
      <Col span="2">
        &nbsp;
      </Col>
      <Col span="8">
        <Button type="primary" v-on:click="showModal">提问</Button>
      </Col>
    </Row>


    <Modal v-model="modalShow" width="50%" :closable="false" ok-text="发布" cancel-text="取消发布">
      <div slot="header">
        <div style="display: inline-block">
          <Avatar icon="ios-person" size="large"/>
        </div>
        <div style="display: inline-block;margin-left: 1%;width: 80%">
          <Input size="large" placeholder="问题标题" v-model="issueTitle"></Input>
        </div>
      </div>
      <div>
        <div class="mavonEditor">
          <mavon-editor @change="textChange"/>
        </div>
        <div style="margin-top: 2%">
          <Tag v-for="tag in tags" :key="tag" :name="tag" :closable="true" @on-close="handleClose">{{ tag }}</Tag>
          <Button icon="ios-add" type="dashed" size="small" @click="handleAdd">添加标签</Button>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="publish">发布问题</Button>
      </div>
    </Modal>
  </div>
</template>

<script>

    export default {
        name: "Search",
        data() {
            return {
                modalShow: false,
                issueTitle: "",
                issueMarkdownContent: "",
                issueHtmlContent: "",
                tags: [],
                newTag: ""
            }
        },
        methods: {
            showModal() {
                this.modalShow = true;
            },
            publish() {
                if (this.tags.length !== 0 && this.issueTitle !== "" && this.issueContent !== "") {
                    let boxedTags = [];
                    for (let i = 0; i < this.tags.length; i++) {
                        boxedTags.push({
                            tag: this.tags[i],
                        })
                    }
                    this.$axios.post("/wenda/api/issue", {
                            tags: boxedTags,
                            title: this.issueTitle,
                            markdownContent: this.issueMarkdownContent,
                            htmlContent: this.issueHtmlContent
                        }
                    ).then(response => {
                        console.log(response);
                        if (response['data']['success'] === true) {
                            this.$Message.success("发布成功!")
                        } else {
                            this.$Message.error("发布失败，请稍后再试!");
                        }
                        this.modalShow = false;
                    }).catch(error => {
                        console.log(error);
                        this.$Message.error("出现了异常");
                        this.modalShow = false;
                    })
                }
            },
            cancel() {
                if (this.tags.length !== 0 || this.issueTitle !== "" || this.issueContent !== "") {
                    this.modalShow = false;
                } else {
                    this.modalShow = false;
                }
            },
            handleAdd() {
                this.$Modal.confirm({
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: this.newTag,
                                autofocus: true,
                                placeholder: '输入标签'
                            },
                            on: {
                                input: (val) => {
                                    this.newTag = val;
                                }
                            }
                        })
                    },
                    onOk: () => {
                        if (this.newTag !== "") {
                            this.tags.push(this.newTag);
                            this.newTag = "";
                        } else {
                            this.$Message.error("请输入标签内容！")
                        }
                    }
                });
            },
            handleClose(event, name) {
                const index = this.tags.indexOf(name);
                this.tags.splice(index, 1);
            },
            textChange(value, render) {
                console.log(value);
                this.issueMarkdownContent = value;
                this.issueHtmlContent = render;
            }

        }
    }


</script>

<style scoped>

</style>
