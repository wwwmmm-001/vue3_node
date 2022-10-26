<template>
    <div class="bc">
        <div class="body">
            <div class="msg">
                <strong>留言</strong><br>
                <textarea name="" id="" cols="30" rows="10" maxlength="800" v-model.lazy.trim="message"
                    placeholder="请输入内容"></textarea>
                <div>
                    <input type="text" class="name" v-model.lazy.trim="name" maxlength="12" placeholder="昵称"> <input type="text"
                        v-model.lazy.trim="email" class="email" maxlength="25" placeholder="email">
                </div>
                <input class="title" type="text" v-model.lazy.trim="title" maxlength="18" placeholder="标题">
                <div class="btn">
                    <button @click="submit">提交</button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
    name: 'MyLeaveMsg',
    setup() {
        const store = useStore()
        let Msg = reactive({
            message: '',
            name: '',
            email: '',
            title: ''
        })
        function submit() {
            let isnull = 0
            for (let i in Msg) {
                let val = Msg[`${i}`]
                if (val.length == 0) {
                    ElMessage({
                        showClose: true,
                        message: '请填写完整哦',
                        duration: 2000
                    })
                    isnull = 1
                    break
                }
            }
            if (isnull == 0) {
                store.dispatch('leaveMsg/PostLeaveMsg', Msg).then(result => {
                    if (result == 1) {
                        ElMessage({
                            showClose: true,
                            message: '提交成功!',
                            duration: 2000
                        })
                        Msg.email=''
                        Msg.name=''
                        Msg.message=''
                        Msg.title=''
                    }else{
                        ElMessage({
                            showClose: true,
                            message: '提交失败!',
                            duration: 2000
                        })
                    }
                })
            }
        }
        return {
            ...toRefs(Msg),
            submit
        }
    }
}
</script>

<style scoped lang="less">
.bc {
    width: 100%;
    height: 100vh;
    background-image: url(@/assets/bc.jpg);
    background-size: cover;
    .body {
        height: 100%;
        background-color: rgba(0, 0, 0, 0.35);
        display: flex;
        justify-content: center;
        align-items: center;

        .msg {
            width: 25vw;
            height: 23.5vw;
            padding: 1.6vw;
            box-sizing: border-box;
            background-color: rgb(240, 240, 240, .75);
            box-shadow: 0 0 5px 1px rgb(46, 45, 45);
            border-radius: 5px;
            font-size: .75vw;

            strong {
                font-size: 1.2vw;
            }

            textarea {
                padding: .35vw;
                margin-top: .65vw;
                border-radius: 6px;
                box-sizing: border-box;
                border: 1px solid rgb(147, 187, 189);
                outline: 0;
                min-width: 100%;
                max-width: 100%;
                max-height: 20%;
                max-height: 80%;
                transition: all .18s;

                overflow-y: scroll;
                scrollbar-width: none;
                /* firefox */
                -ms-overflow-style: none;

                /* IE 10+ */
                &::-webkit-scrollbar {
                    // chrome safari
                    display: none;
                }
            }

            textarea:focus {
                box-shadow: 0 0 3px 1px rgb(35, 213, 219);
            }

            div {
                display: flex;
                justify-content: space-between;
                margin-top: .3vw;

                input {
                    border: 1px solid rgb(147, 187, 189);
                    outline: 0;
                    font-size: 0.7vw;
                    width: 45%;
                    height: 1.5vw;
                    padding: .25vw .35vw;
                    border-radius: 6px;
                    transition: all .18s;
                }

            }

            .title {
                margin-top: .5vw;
                width: 100%;
                border: 1px solid rgb(147, 187, 189);
                outline: 0;
                height: 2.2vw;
                font-size: 0.8vw;
                padding: .2vw .35vw;
                border-radius: 6px;
                box-sizing: border-box;
                transition: all .18s;
            }

            input:focus {
                box-shadow: 0 0 3px 1px rgb(35, 213, 219);
            }

            .btn {
                margin-top: 1.35vw;
                width: 100%;

                button {
                    margin: 0 auto;
                    outline: 0;
                    width: 15%;
                    height: 1.6vw;
                    font-size: 1vw;
                    color: rgb(209, 202, 202);
                    border-radius: 7px;
                    border: 0;
                    transition: all .4s;
                    background-color: rgb(153, 147, 147);
                }

                button:hover {
                    width: 25%;
                    
                    color: aliceblue;
                    transition-delay: .1s;
                    cursor: pointer;
                }
            }

        }
    }
}
</style>