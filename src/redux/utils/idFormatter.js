export const idFormatter = (id) => {
    let num = ''
    for (let i=0;i<7-String(id).length; i++) {
        num = num + '0'
    }
    return num + String(id)
}