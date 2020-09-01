/**
 * 操作数据的方法
 */

const DRAWING_ITEMS = 'drawingItems'
const DRAWING_ITEMS_VERSION = '1.1'
const DRAWING_ITEMS_VERSION_KEY = 'DRAWING_ITEMS_VERSION'

export function getDrawingList () {
    // 加入缓存版本的概念，保证缓存数据与程序匹配
    const version = localStorage.getItem(DRAWING_ITEMS_VERSION_KEY)
    if (version !== DRAWING_ITEMS_VERSION) {
        localStorage.setItem(DRAWING_ITEMS_VERSION_KEY, DRAWING_ITEMS_VERSION)
        saveDrawingList([])
        return null
    }

    const str = localStorage.getItem(DRAWING_ITEMS)
    if (str) return JSON.parse(str)
    return null
}

export function saveDrawingList (list) {
    localStorage.setItem(DRAWING_ITEMS, JSON.stringify(list))
}
