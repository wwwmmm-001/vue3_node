
let goUpTimer = 0
// 点击窗口向下移动100vh
function showAll_goUp(go) {
    clearInterval(goUpTimer)
    go=Math.floor(go)
    let EveryMove = 0
    // 窗口距离顶部距离
    let pageY = 0
    goUpTimer = setInterval(() => {
        pageY = window.pageYOffset
        EveryMove = (pageY - go) / 18        
        EveryMove > 0 ? EveryMove = Math.ceil(EveryMove) : EveryMove = Math.floor(EveryMove)
        if (document.documentElement.scrollTop == go) {
            clearInterval(goUpTimer)
            goUpTimer = null
        }
        document.documentElement.scrollTop = pageY - EveryMove
    }, 6)

}
export default showAll_goUp  
