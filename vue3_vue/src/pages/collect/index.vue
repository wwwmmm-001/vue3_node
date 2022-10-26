<template>
    <div>
        <div class="header">
            <div class="search">
                <input type="text" placeholder=" ...." maxlength="30" v-model="searchVal" @keydown.enter="search">
                <span @click="search">
                    <el-icon>
                        <Search />
                    </el-icon>
                </span>
            </div>

        </div>
    </div>
    <div class="content">
        <table>
            <thead>
                <tr>
                    <th class="one">资源名称</th>
                    <th class="two">字幕</th>
                    <th class="three">时间</th>
                </tr>
            </thead>
            <tbody @click="copy">
                <tr v-for="data in download" :key="data.id">
                    <td :data-download="data.download">{{data.name}}<i>{{data.quality}}</i></td>
                    <td>{{data.subtitle}}</td>
                    <td>{{data.time}}</td>
                </tr>
                <tr class="last">
                    <br>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="floor">
        <a href="https://bangumi.moe/" target="_blank">萌番组</a>
        <a href="https://www.acg23.com/" target="_blank">ACG23</a>
    </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
export default {
    name: 'MyCollect',
    setup() {
        const store = useStore()
        let searchVal = ref('')
        onMounted(() => {
            store.dispatch('collect/GetCollect')
        })
        let download = computed(() => {
            return store.state.collect.download
        })
        function copy(e) {
            if (e.target.getAttribute('data-download')) {
                let copyText = e.target.getAttribute('data-download')
                const input = document.createElement('textarea');
                document.body.appendChild(input);
                input.innerHTML = copyText;
                input.setAttribute('code', 1);
                input.select();
                document.execCommand("Copy");
                ElMessage({
                    showClose: true,
                    message: '复制好喽',
                    duration: 1000
                })
                var list = document.getElementsByTagName('textarea');
                var inputList = Array.prototype.slice.call(list);
                inputList.forEach((item) => {
                    if (item.getAttribute('code')) document.body.removeChild(item);
                });
            }





        }
        let timer = 0
        let elMessage = 0
        let timer_search = ref(0)
        async function search() {
            if (timer) return
            timer = setTimeout(() => timer = null, 500)
            if (elMessage) elMessage.close()
            elMessage = ElNotification({
                message: 'loading...',
                duration: 0,
            })
            await store.dispatch('collect/GetCollectSearch', searchVal.value)
            timer_search.value = 1
        }
        watch(timer_search, () => {
            if (elMessage) elMessage.close()
            timer_search.value = 0
        })
        return {
            download,
            copy,
            searchVal,
            search,
        }
    }

}
</script>

<style scoped lang="less">
.header {
    width: 100%;
    height: 2.4vw;
    box-sizing: border-box;
    background-color: rgb(22, 80, 90);
    text-align: center;

    .search {
        position: relative;
        height: 100%;
    }

    input {
        position: absolute;
        top: 50%;
        left: 40%;
        transform: translate(-50%, -50%);
        height: 80%;
        box-sizing: border-box;
        font-size: .8vw;
        border-radius: 5px;
        border: 1px solid rgb(170, 210, 211);
        padding: .1vw .2vw;
        outline: 0;
        transition: all .3s;
        width: 18%;
    }

    span {
        position: absolute;
        display: block;
        top: 44%;
        left: 50.2%;
        transform: translate(-50%, -50%);
        width: 2%;
        height: 79.5%;
        border-radius: 5px;
        background-color: rgb(241, 242, 242);
        opacity: .5;
        transition: all .33s;

        .el-icon {
            font-size: 1vw;
            color: rgb(44, 46, 48);
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }

    input:focus {
        box-shadow: 0 0 3px 1px rgb(35, 213, 219);
    }

    input:focus+span {
        top: 50%;
        opacity: 1;
    }

    span:hover {
        top: 50%;
        opacity: 1;
    }

}

.content {
    margin: 0 auto;
    margin-top: 2vw;
    width: 55%;

    table {
        border: 1px solid #ddd;
        width: 100%;
        border-top: 1px solid #999;
        border-left: 1px solid #999;
        border-spacing: 0;
        font-size: .9vw;
        margin-bottom: 1vw;

        /*去掉单元格间隙*/
        th,
        td {
            border-bottom: 1px solid #999;
            border-right: 1px solid #999;
        }

        td:nth-child(2) {
            color: black;
        }

        thead {
            font-size: .9vw;

            .one {
                width: 40%;
            }

            .two {
                width: 5%;
            }

            .three {
                width: 10%;
            }
        }

        td {
            box-sizing: border-box;
            color: rgb(75, 68, 175);
            font-size: .8vw;
            padding: .5vw .8vw;

            i {
                padding-left: .1vw;
                font-style: normal;
                color: black;
            }
        }

        tbody {
            tr:nth-child(2n-1) {
                background-color: rgb(223, 224, 224);
            }

            tr:last-child {
                background-color: rgb(255, 255, 255);
            }

            tr {
                transition: all.15s;

                td:first-child:hover {
                    cursor: pointer;

                }
            }

            tr:hover {
                background-color: rgb(156, 211, 105);
            }

            tr:last-child:hover {
                background-color: rgb(255, 255, 255);
            }
        }

    }
}

.floor {
    width: 55%;
    height: 2vw;
    margin: 0 auto;
    margin-bottom: 6vw;
    background-color: rgba(0, 171, 214, 0.4);
    font-size: .8vw;
    border-radius: 8px;
    display: flex;
    align-items: center;

    a {
        display: inline-block;
        color: darkblue;
        padding: .1vw 1vw;
        border-right: 1px solid rgb(124, 106, 106);
        text-decoration: underline;
    }
}
</style>