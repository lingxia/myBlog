<template lang="html">
  <el-row>
    <el-col :span="24">
      <el-form ref="articleCreate" :model="article" v-loading="listLoading">
        <el-row style="margin-top:20px">
          <el-col :span='10' :push="1">
            <el-form-item label="文章标题" label-width="90px" prop="title">
              <el-input v-model="article.title" style="width:260px" placeholder="请在此处输入标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :push="3" >
            <el-form-item label="所属分类" label-width="90px" prop="classify">
              <el-select v-model="article.classify" multiple placeholder="请选择分类">
                <el-option  v-for="item in classifyList" :label="item.classify" :value="item.classify" :key="item._id"></el-option>
            </el-select>
            </el-form-item>
          </el-col>
      </el-row>
        <el-row style="margin-top:20px">
          <el-col>
            <!-- 摘要 -->
            <el-form-item class="show" prop="abstract" >
               <el-input type="textarea" v-model="article.abstract" :rows="5" placeholder="请在此处编辑摘要"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
         <mavon-editor prop="content" v-model="article.content" @change="changeContent">
        </mavon-editor>
        <el-form-item style="padding:20px 20px 0 0 " >
          <el-button type="primary" style="float:right;" size='small' @click="editArticle" :loading="load">{{btnText}}</el-button>
            <el-button style="float:right;margin-right:10px" size='small' @click="cancle">返回</el-button>
      </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import api from '../../api/index'
import marked from 'marked';
import hlj from 'highlight.js'
import  'highlight.js/styles/atom-one-dark.css'
// import NProgress from 'NProgress'
export default {
  data(){
    return {
      article:{
        id:'',
        title:'',
        classify:[],
        abstract:'',
        content:'',
        contentRaw:''
      },
      classifyList:[],
      load:false,
      btnText:"立即更新",
      listLoading:false
    }
  },
  methods:{
    // $imgAdd(pos, file){
    //   console.log(pos)
    //   console.log(file)
    // },
    changeContent(value, render){
        this.article.contentRaw = render;
    },
    // 更新文章
    editArticle(){
        this.$refs.articleCreate.validate(valid=>{
          if(valid){

            this.$confirm("确认提交吗?","提示",{})
                .then(()=>{
                  this.load = true;
                    // 换成真实API的时候可以直接提交this.article
                    this.btnText = "更新中"

                    api.editArticle({
                      ...this.article
                    })
                        .then((res)=>{
                            this.btnText="立即更新";
                            this.editLoading = false;

                            if(res.data.code==200){

                                  this.$notify({
                                    title:'成功',
                                    message:'更新成功',
                                    type:'success'
                                  })
                                  setTimeout(()=>{
                                    this.$router.push({path:'/admin/articleList'})
                                  },500)
                            }
                        }).catch((err)=>{
                          console.log(err);
                        })
                })
                .catch((error)=>{
                  // 这里数据在换成真实api的时候要替换掉,直接用this.article
                })
          }
        })
    },
    initial(){
      this.listLoading=true
      setTimeout(()=>{
        this.listLoading  =false
        api.getOneArticle({id:this.$route.params.postId})
          .then(({data:{code,oneArticle:{_id,classify,title,content,abstract,contentRaw}}})=>{
            if(code==200){
              this.article.id = _id
              this.article.classify = classify
              this.article.title = title
              this.article.content = content
              this.article.abstract = abstract
              this.article.contentRaw = contentRaw
            }
          })
        api.getClassify()
            .then(({data:{code,lists}})=>{
              if(code==200){
                  this.classifyList = lists
              }
            })
      },500)

    },
    // 取消
    cancle(){
      this.$router.push({path:'/admin/articleList'});
    }
  },
  computed:{},
  mounted(){
    this.initial()
  }
}
</script>


<style scoped>
  
</style>