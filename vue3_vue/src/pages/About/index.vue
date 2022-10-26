<template>
    <div class="About">
        <div class="detail">
            <ul>
                <li>
                    <div class="one">
                        <h3>基本信息</h3>
                        <p>姓名: 郭杰 , 01年 , 20-23大专(大数据技术与应用) , 现宜宾</p>
                        <p class="small">之前自学接触过python爬虫,了解简单使用过一些框架</p>
                        <p style="margin-bottom: .3vw;">于6月末-今 学习前端</p>
                    </div>


                    <hr><br>
                </li>
                <li>
                    <div class="two">
                        <h3>掌握技术</h3>
                        <table>
                            <tr>
                                <td><i>1.</i><strong>HTML5,CSS3</strong></td>
                                <td>能作出简单的动画及页面交互效果</td>
                            </tr>
                            <tr>
                                <td><i>2.</i><strong>JavaScript</strong></td>
                                <td>能对接收的数据作出处理，配合html展现在页面</td>
                            </tr>
                            <tr>
                                <td><i>3.</i><strong>nodeJS</strong></td>
                                <td>可以处理简单的get,post请求,连接mysql做到基本的数据的入库和发送</td>
                            </tr>
                            <tr>
                                <td><i>4.</i><strong>ajax</strong></td>
                                <td>能发出基本的get post请求</td>
                            </tr>
                            <tr>
                                <td><i>5.</i><strong>vue 2,3</strong></td>
                                <td>能配合使用其生态（ router \ vuex \ element ui \ element plus ）,完成单页面应用开发</td>
                            </tr>
                            <tr>
                                <td><i>6.</i><strong>swiper,axios,iconfont</strong></td>
                                <td>能简单应用</td>
                            </tr>
                        </table>
                    </div>

                </li>
                <hr><br>
                <div class="three">
                    <h3>项目经验</h3>
                    &nbsp;&nbsp;&nbsp;&nbsp;<strong>使用Vue2</strong> 配合bilibili尚硅谷视频完成 <strong>尚品汇</strong> 前端部分 <br>
                    &nbsp;&nbsp;&nbsp;&nbsp;<strong>使用Vue3</strong> 配合nodejs-express, mysql, element plus, iconfont, swiper,
                    axios, vue3-quill, v-lazy <strong>搭建本网站</strong><br>
                </div>
                <li>                    
                    <hr><br>
                    <div class="four">
                        <h3>源码</h3>
                    </div>
                </li>

            </ul>
        </div>
        <div class="web">
            <h1>注意</h1><br>
            <div class="header_">
                <img src="./images/music.png" alt="">
                <p>初始化时,切换歌曲不能自动播放,需要先点击一次播放<br>
                有时切换歌曲后点击播放按钮无效, 因为判断src资源加载完成返回后才能播放(这里播放歌曲是等待资源加载完成)</p>
            </div>
            <div class="home_">
                <img src="./images/home.png" alt="">
            </div>
            <div class="look_img">
                <img src="./images/look_img.png" alt="">
                <img src="./images/look_img_magnifying.png" alt="">
            </div>
            <div class="anime_">
                <img src="./images/anime.png" alt="">
            </div>
        </div><br><br>
    </div>
</template>

<script>
import { ref } from 'vue'
export default {
    name: 'MyAbout',

    setup() {
        let letter = ref(null)

        return {
            letter
        }
    }
}
</script>

<style lang="less" scoped>
.About {
    width: 100%;
    padding-top: 2vw;
    background-color: rgb(250, 250, 250);    
    min-height: 100vh;
    box-sizing: border-box;
    height: 110%;
    .detail {
        box-shadow: 0 0 3px 1px rgb(161, 147, 147);
        background-color: rgb(240, 240, 240);
        width: 50%;
        margin: 0 auto;
        padding-top: 2vw;
        padding-left: 2vw;
        box-sizing: border-box;
        font-size: .9vw;
        padding: 1vw 1vw 3vw 1vw;
        height: 110%;
        strong {
            font-size: .85vw;
            font-weight: 550;
            line-height: 2vw;
        }

        i {
            color: rgb(14, 113, 170);
            font-size: 1vw;
            padding-right: .5vw;
        }

        table {
            td {
                padding-right: 1vw;
            }

            tr {
                border-bottom: 1px solid gray;
            }
        }

        p {
            padding-top: .65vw;
            line-height: 1.5vw;
        }

        .small {
            color: cadetblue;
        }

        .top {
            padding-top: .5vw;
        }

        .one {
            animation: oneInit 1s;
        }

        .two {
            animation: twoInit 2s;
        }

        .three {
            animation: oneInit 2s;
        }

        @keyframes oneInit {
            from {
                opacity: 0;
                transform: translateX(30%);
            }

            to {
                opacity: 1;
            }

        }

        @keyframes twoInit {
            from {
                opacity: 0;
                transform: translateX(-30%);
            }

            to {
                opacity: 1;
            }

        }
    }
    .web{
        box-shadow: 0 0 3px 1px rgb(161, 147, 147);
        box-sizing: border-box;
        padding: 1vw;
        width: 80%;
        margin: 0 auto;
        margin-top: 3vw;
        text-align: center;
        .header_{
            
            margin-bottom: 5vw;
            img{
                display: inline-block;
                max-height: 40vw;
                vertical-align: middle;
            }
            p{
                font-size: .9vw;
                width: 40%;
                display: inline-block;
            }
        }
        .home_{
            text-align: center;
            margin-bottom: 5vw;
        }
        .anime_{
            margin-top: 5vw;
            img{
                max-width: 80%;
            }
        }
    }
}
</style>