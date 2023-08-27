import {getCosAuth} from "@/services/common";
import {message} from "antd";

const cos = new window.COS({
  // getAuthorization 必选参数
  getAuthorization(options, callback) {
    getCosAuth().then(data => callback(data));
  }
})

export function randomString(len = 12) {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const maxPos = chars.length;
  let str = '';
  for (let i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}

function checkImageFormat(imageFile) {
  const allowedFormats = ["jpg", "jpeg", "png", "bmp", "gif"];
  const fileExtension = imageFile.name.split(".").pop().toLowerCase();
  return allowedFormats.includes(fileExtension);
}
const uploadBasic = ({file, ext}, callback) => {
  const id = randomString();
  cos.uploadFile({
    Bucket: 'mano-1315917957', /* 填写自己的 bucket，必须字段 */
    Region: 'ap-shanghai',     /* 存储桶所在地域，必须字段 */
    Key: `images/${id}.${ext}`,              /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
    Body: file, // 上传文件对象
    SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB 使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
  }).then(data => {
    const url = `https://${data.Location}`;
    callback && callback(url, id);
  }).catch(err => {
    console.log('上传出错', err);
  });
};

const uploadFile = ({file, ext}, callback) => {
  if (!checkImageFormat(file)) {
    message.error(`${file.name}的格式暂不支持上传。`);
    return;
  }
  uploadBasic({file, ext}, callback);
};

export {
  uploadFile,
  uploadBasic,
};
