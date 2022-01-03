const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const {
    OPENID
  } = cloud.getWXContext()
  const {
    collectionName,
    userInfo,
    _id,
    ...params
  } = event
  console.log('更新的id', _id);
  try {
    return await db.collection('' + collectionName + '').where({
      open_id: OPENID,
      _id,
    }).update({
      data: params,
    })
  } catch (e) {
    console.error(e)
  }
}