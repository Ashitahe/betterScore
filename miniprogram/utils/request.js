// 请求云函数
export const request = (name, data) => {
    return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
            name,
            data,
            success: (data) => {
                resolve(data)
            },
            fail: (reason) => {
                reject(reason)
            }
        })
    })
}