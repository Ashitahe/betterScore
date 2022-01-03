// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const {
    OPENID
  } = cloud.getWXContext()
  const {
    collectionName,
    userInfo,
    ...params
  } = event
  try {
    // 整理数据库查询参数
    const query = {
      open_id: OPENID,
      ...params,
    }
    return await db.collection('' + collectionName + '').where(query).get()
  } catch (e) {
    console.error(e)
  }
}