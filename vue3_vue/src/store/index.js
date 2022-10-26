import { createStore } from 'vuex'
import login from './login'
import basicMsg from './basicMsg'
import blogs from './blogs'
import lookimg from './lookImg'
import look from './look'
import header from './header'
import editor from './Editor'
import leaveMsg from './leaveMsg'
import article from './article'
import collect from './collect'
export default createStore({
    modules:{
        login,
        basicMsg,
        blogs,
        lookimg,
        look,
        header,
        editor,
        leaveMsg,
        article,
        collect
    }
})