<template>
    <div class="body">
        <div class="login">
            <h2>LOGIN</h2>
            <div class="EnterUser">
                <input type="text" placeholder="账户" v-model.lazy="user">
                <input type="password" placeholder="密码" v-model.lazy="password">
            </div>    
            <button @click="Login">登录</button>
        </div>
    </div>
</template>

<script>
    import { ref } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    export default{
        name:'MyLogin',
        setup(){
            const store=useStore()
            const router=useRouter()
            let user=ref()
            let password=ref()

            async function Login(){
                let result=await store.dispatch('login/PostLogin',JSON.stringify({user:user.value,password:password.value}));
                if(result==1){
                    router.push({
                        path:'home'
                    })
                }
            }
            return {
                Login,
                user,
                password
            }
        }
    }
</script>

 
<style scoped lang="less">
    .body{
        width: 100vw;
        height: 100vh;
        background: url(./Img/LoginBackgroundImg.jpg) no-repeat;
        background-size: cover;
        background-position:top -6vw left 0;
        .login{
            position: absolute;
            border-radius: 10px;
            box-sizing: border-box;
            text-align: center;
            width: 25vw;
            height: 17vw;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            

            background: rgba(255, 255, 255, 0.2);
            -webkit-backdrop-filter: blur(8px);
            backdrop-filter: blur(8px);
            box-shadow:inset 0 0 6px rgba(255, 255, 255, 0.2);
            padding: 1.3vw;
            // login h2
            h2{
                color: #F8F8FF;
                text-shadow: 0 0 1px gray,0 0 1px gray,0 0 1px gray,0 0 1px gray;
            }
            // 输入账号密码
            .EnterUser{
                box-sizing: border-box;
                padding-top: 1.8vw;
                input::-webkit-input-placeholder { /* WebKit browsers */ 
                color:#625C5C;
                font-weight: 545; 
                } 

                input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */ 
                color:#625C5C;
                font-weight: 545; 
                } 

                input::-moz-placeholder { /* Mozilla Firefox 19+ */ 
                color:#625C5C;
                font-weight: 545;
                } 

                input:-ms-input-placeholder { /* Internet Explorer 10+ */ 
                color:#625C5C;
                font-weight: 545;
                } 

                input{
                    width: 9.9vw;
                    height:.86vw;
                   border: none;
                   outline: 0;
                   border-bottom: 2px solid rgba(102, 139,139,.6);
                   background-color: rgba(0, 0, 0,0);
                   padding: .7vw;
                };
                input:first-child{
                    margin-bottom: .9vw;
                }
                input:hover{
                    transform: scale(1.1,1.1);
                }
                input:focus{
                    transform: scale(1.1,1.1);
                }
            }
            button{
                margin-top: 1.8vw;
                width: 4vw;
                height: 2.3vw;
                border-radius: 10px;
                border: none;
                background-color: rgba(70, 130, 180, .8);
                outline: 0;
                font-size: 1vw;
                color: 	rgba(240, 255, 255, .8);
            }
            button:hover{
                cursor: pointer;
            }
        }
    }
    
</style>
<style>
    .el-message__content {
        font-size: 16px
    }
</style>