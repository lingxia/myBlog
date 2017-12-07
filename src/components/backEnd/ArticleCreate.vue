<template lang="html">
  <el-row>
    <el-col :span="24">
      <el-form ref="articleCreate" :model="article">
        <el-row style="margin-top:10px">
          <el-col :span='10' :push="1">
            <el-form-item label="文章标题" label-width="90px" prop="title">
              <el-input v-model="article.title" style="width:260px" placeholder="请在此处输入标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :push="3" >
            <el-form-item label="所属分类" label-width="90px" prop="classify">
              <el-select v-model="article.classify" multiple placeholder="请选择分类">
                <el-option v-for="item in classifyList" :label="item.classify" :value="item.classify" :key="item._id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px">
          <el-col :span='10' :push="1">
            <el-form-item class="show" prop="abstract" >
               <el-input type="textarea" v-model="article.abstract" :rows="5" placeholder="请输入文章摘要"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :push="3">
               <el-upload
                  action='/api/file/upload'
                  name='pic'
                  :limit='1'
                  :multiple='false'
                  :auto-upload='true'
                  :on-success='handleSucess'
                  :on-remove='handleRemove'
                  :on-error='handleError'
                  :on-exceed='handleExceed'
               >
                  <el-button size="small" type="primary">点击上传</el-button>
               </el-upload>
               <img :src="article.abstractImg" style='width:200px;' />
          </el-col>
        </el-row>
        <el-row style="margin-top:10px">
            <mavon-editor ref='articleEditor' v-model="article.content" @imgAdd='imgAdd' @imgDel='imgDel' @change="changeContent">
            </mavon-editor>
        </el-row>
        <el-form-item style="padding:20px 20px 0 0 " >
          <el-button type="primary" style="float:right;" size='small' @click="createArticle" :loading="load">{{btnText}}</el-button>
            <el-button style="float:right;margin-right:10px" size='small' @click="cancle" :loading="load">取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import api from '../../api/index'
import marked from 'marked'
import hlj from 'highlight.js'
import  'highlight.js/styles/atom-one-dark.css'
export default {
  data(){
    return {
      article:{
        classify:[],//文章所属分类，多选
        title:'',//文章标题
        abstract:'',//文章摘要
        abstractImg:'',//摘要图片，放在文章列表中用
        contentRaw:'', //文章经过markdown渲染后的内容
        articleImgs:{},//文章中的图片
        content:''//文章内容
      },
      classifyList:[], //分类下拉列表
      load:false,
      btnText:"立即发布"
    }
  },
  methods:{

    //摘要图片上传相关钩子函数
    //1,图片上传成功
    handleSucess(res){
      if(res.code == 200){
          this.article.abstractImg = res.filepath;        
      }else{
         this.$notify({
          title:'失败',
          message:res.message,
          type:'error'
        })
      }
    },
    //2,摘要图片上传失败
    handleError(err){
      alert(err);
    },
    //3,超出了最大上传数目
    handleExceed(files, fileList){
      alert("文章摘要只能上传一个");
    },
    //4,移除摘要图片
    handleRemove(){
      var filepath = this.article.abstractImg;
      api.deleteOne({
        filepath:filepath
      }).then(({data:{code, message}})=>{
          if(code==200){
            this.article.abstractImg = '';
          }else{
            this.$notify({
              title:'失败',
              message:'上传失败',
              type:'error'
            })
          }
      })
    },
    //文章中图片上传
    imgAdd(pos, fileObj){
      var formData = new FormData();
      formData.append('pic',fileObj);
      api.uploadOne(formData)
      .then(({data:{code,filename,filepath,originalname}})=>{
          if(code==200){
            var filepath = filepath.replace(/\\/g, '/');
            filepath = window.location.protocol + '//' + window.location.host + '/' + filepath;
            this.$refs.articleEditor.$img2Url(pos,filepath);
            this.$refs.articleEditor.$imgUpdateByUrl(pos, filepath);
            this.article.articleImgs[pos] = filepath;
          }else{
            this.$notify({
              title:'失败',
              message:'上传失败',
              type:'error'
            })
          }
      });
    },
    //文章中图片删除
    imgDel(pos){
      var filepath = this.article.articleImgs[pos];
      api.deleteOne({
        filepath:filepath
      }).then(({data:{code, message}})=>{
          if(code==200){
            delete this.article.articleImgs[pos];
          }else{
            this.$notify({
              title:'失败',
              message:'删除失败',
              type:'error'
            })
          }
      })
    },
    //md渲染后的内容
    changeContent(value, render){
        this.article.contentRaw = render;
    },
    // 发布文章
    createArticle(){
        this.$refs.articleCreate.validate(valid=>{
          if(valid){
            this.$confirm("确认提交吗?","提示",{})
                .then(()=>{
                  this.load = true;
                    this.btnText = "发布中"
                    // 发送的文章信息
                    api.createArticle({
                      ...this.article
                    }).then(({data:{code,message}})=>{
                            this.btnText="立即发布";
                            this.editLoading = false;
                            if(code==200){
                                  this.$notify({
                                    title:'成功',
                                    message,
                                    type:'success'
                                  })
                            }else if(code==401){
                              this.$notify({
                                title:'失败',
                                message,
                                type:'error'
                              })
                              return false
                            }
                            setTimeout(()=>{
                              this.$router.push({path:'/admin/articleList'})
                            },500)
                        })
                })
                .catch((error)=>{
                })
          }
        })
    },
    // 取消
    cancle(){
      this.$router.push({path:'/admin/articleList'});
    }
  },
  computed:{},
  mounted(){
      api.getClassify()
        .then(({data:{code,lists}})=>{
          if(code==200){
            this.classifyList = lists
          }
        })
  }
}
</script>
<style lang="css" >
</style>