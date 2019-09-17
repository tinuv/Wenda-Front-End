<template>
  <div style="width: 270px;float: right;margin-right:10px">
    <Layout>
      <Content>
        <Card>
          <Row>
            <Col span="8" style="text-align:center">
              <RouterLink to="/creator/questions">
                <Icon type="md-paper" size="20" style="margin-bottom: 5px"/>
                <div>写回答</div>
              </RouterLink>
            </Col>
            <Col span="8" style="text-align:center">
              <Icon type="md-paper" size="20" style="margin-bottom: 5px"/>
              <div>写文章</div>
            </Col>
            <Col span="8" style="text-align:center">
              <Icon type="md-paper" size="20" style="margin-bottom: 5px"/>
              <div>写想法</div>
            </Col>
          </Row>
        </Card>

        <Card style="margin-top: 5px">
          <CellGroup>
            <Cell>
              <Icon type="md-cube" size="20" style="margin-right: 5px"/>
              我的收藏
              <Badge :count="10" slot="extra"/>
            </Cell>
            <Cell>
              <Icon type="md-help" size="20" style="margin-right: 5px"/>
              我关注的问题
              <Badge :count="10" slot="extra"/>
            </Cell>
          </CellGroup>
        </Card>
      </Content>
    </Layout>
  </div>
</template>

<script>
    export default {
        name: "SiderContent"
    }
</script>

<style scoped>

</style>
