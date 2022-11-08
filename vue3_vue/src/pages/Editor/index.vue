<template>
    <div class="editor">
        <p>1.上传封面图片</p>
        <el-upload :on-change="getFile" :limit="1" list-type="picture" :auto-upload="false">
            <el-button size="small" type="primary">选择图片上传,图片尽量不要超过5M,越小越好</el-button>
        </el-upload>
        <p>2.填写标题与介绍</p>
        <input type="text" placeholder="标题-不能超过25个字符" v-model.lazy="title1"><br>
        <input type="text" placeholder="介绍-不能超过60个字符" v-model.lazy="title2">
        <br>
        <p>3.编写内容</p>
        <div class="ql-container ql-snow">
            <quill-editor class="quill-editor" v-model:value="content" :options="state.editorOption"
                :disabled="state.disabled" @change="onEditorChange($event)" />
            <div class="ql-editor" v-html="show_content"></div>
        </div>
    </div>
    <button class="submit" @click="submitEditor">提交</button>
</template>


<script>
import { quillEditor } from 'vue3-quill'
import { reactive, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import 'quill/dist/quill.snow.css'

export default {
    components: {
        quillEditor
    },
    setup() {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            editorOption: {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ header: 1 }, { header: 2 }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ script: 'sub' }, { script: 'super' }],
                        [{ indent: '-1' }, { indent: '+1' }],
                        [{ direction: 'rtl' }],
                        [{ size: ['small', false, 'large', 'huge'] }],
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                        [{ color: [] }, { background: [] }],
                        [{ font: [] }],
                        [{ align: [] }],
                        ['clean'],
                        ['link']
                    ],



                },
                placeholder: "编辑您的内容...",
                theme: "snow",
            },
        })
        let content = ref('')
        let show_content = ref('')
        const onEditorChange = ({ quill, html, text }) => {
            show_content.value = html
        }

        // 图片转base64
        function getBase64(file) {
            return new Promise(function (resolve, reject) {
                let reader = new FileReader();
                let imgResult = "";
                reader.readAsDataURL(file);
                reader.onload = function () {
                    imgResult = reader.result;
                };
                reader.onerror = function (error) {
                    reject(error);
                };
                reader.onloadend = function () {
                    resolve(imgResult);
                };
            });
        };
        function getFile(file, fileList) {

            getBase64(file.raw).then(res => {
                files.img = res
            });
        }

        // 提交文件
        var files = {
            id: 0,
            title: "",
            detail: '',
            path: '',
            time: '',
            content: '',
            img: ''
        }
        onMounted(() => {
            // 提交所需要的id
            store.dispatch('editor/GetEditorId')
        })
        // 提交
        let timer = 0
        async function submitEditor() {
            if (timer) return
            if (store.state.editor.editor_Id) {
                timer = 1
                files.id = store.state.editor.editor_Id
                files.title = title1.value
                files.detail = title2.value
                files.time = getTime()
                files.path = `img${store.state.editor.editor_Id}`
                content.value = content.value.replace(/'/g, "\\'")
                files.content = content.value
                for (let i in files) {
                    if (files[i].length == 0) {
                        ElMessage({
                            showClose: true,
                            message: '没有填写完整哦,2s后可重新提交',
                            duration: 2000
                        })
                        setTimeout(()=>{
                            timer = 0
                        },2000)                        
                        return
                    }
                }

                let msg = ElMessage({
                    showClose: true,
                    message: '提交中,请稍等',
                    duration: 0
                })
                store.dispatch('editor/PostEditor', files).then((result) => {
                    msg.close()
                    if (result == '1') {
                        ElMessage({
                            showClose: true,
                            message: '提交成功',
                            duration: 1000
                        })
                        setTimeout(() => {
                            router.push({ path: '/home' })
                            timer = 0
                        }, 1000)

                    }
                    else if (result == '2') {
                        ElMessage({
                            showClose: true,
                            message: '数据库写入失败,可能存在需要转义特殊字符',
                            duration: 3000,
                            type: 'warning',
                        })
                        timer = 0
                    }
                    else if (result == '3') {
                        ElMessage({
                            showClose: true,
                            message: '图片写入失败',
                            duration: 3000,
                            type: 'warning',
                        })
                        timer = 0
                    }

                }).catch((err) => {
                    msg.close()
                    timer = 0
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: '提交失败',
                        duration: 3000,
                        type: 'warning',
                    })
                })

            } else {
                store.dispatch('editor/GetEditorId')
                ElMessage({
                    showClose: true,
                    message: '没有获取编号,正在重新发出请求',
                    duration: 2000,
                    type: 'warning',
                })
                timer = 0
            }

        }
        function getTime() {
            var date = new Date();
            let year = (date.getFullYear());
            let month = (date.getMonth() + 1);
            let day = (date.getDate());
            let hours = (date.getHours())
            let minus = (date.getMinutes())
            let seconds = (date.getSeconds())
            if (year < 10)
                year = "0" + year;
            if (month < 10)
                month = "0" + month;
            if (day < 10)
                day = "0" + day;
            if (hours < 10)
                hours = "0" + hours;
            if (minus < 10)
                minus = "0" + minus;
            if (seconds < 10)
                seconds = '0' + seconds;

            return `${year}:${month}:${day} - ${hours}:${minus}:${seconds}`
        }

        let title1 = ref('')
        let title2 = ref('')
        return { state, content, show_content, onEditorChange, getFile, title1, title2, submitEditor }
    }

}


</script>

<style lang="less">
.quill-editor {
    margin: 0 auto;
    width: 100%;
    height: 70vh;
}

.ql-toolbar {
    text-align: center;
}

.editor {
    margin: 0 auto;
    padding: 1vw;
    box-sizing: border-box;
    border: 1px rgb(97, 88, 88) solid;
    width: 65%;

    input {
        width: 50%;
        height: 2vw;
        padding: .3vw;
        margin-top: .3vw;
        border: 0;
        border-radius: 5px;
        font-size: .8vw;
        outline: 1px rgb(179, 177, 177) solid;
    }
}

.submit {
    position: fixed;
    border: 0;
    color: whitesmoke;
    background-color: rgba(80, 75, 75, .15);
    padding: .4vw 1vw;
    font-size: 1.2vw;
    border-radius: 10px;
    bottom: 10%;
    right: 5%;
    transition: all .2s;
}

.submit:hover {
    background-color: rgba(80, 75, 75);
    cursor: pointer;
}
</style>

