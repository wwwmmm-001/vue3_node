
export default {
    namespaced: true,
    state: {
        // 此处给music板块使用,与header中的music_index关联,控制双击播放
        music_index: 0,
        // 此处全局 配合 music的id 实现active样式
        music_active: {},
        // header 控制自身和 music 的音量
        volume:30,
        // 控制header和music不能同时播放
        // 0 header 播放 1 music 播放
        play_pause:0

    },
    mutations: {
        changeMusic_Index(state, value) {
            state.music_index = value
        },
        changeMusic_Active(state, value) {
            state.music_active = value
        },
        change_Volume(state, value) {
            state.volume = value
        },
        changePlay_Pause(state, value) {
            state.play_pause = value
        },

    }
}