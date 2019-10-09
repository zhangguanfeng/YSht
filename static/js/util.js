// /**
//  * 通用类
//  */
// OC = function () {};
// OC.prototype = {
//   // 判断是否为空,如果为空返回true，否则返回false
//   isEmpty: function (text) {
//     if (text == undefined || text == null || text == '' || text == 'null' ||
//       text == 'undefined') {
//       return true;
//     } else {
//       text = text.replace(/(\s*$)/g, '');
//       if (text == '') {
//         return true;
//       }
//     }
//     return false;
//   },
//   // 英文、数字正则表达式，验证通过返回 true；
//   numValid: function (text) {
//     var patten = new RegExp(/^[0-9]+$/);
//     return patten.test(text);
//   },
//   // 英文、数字正则表达式
//   enNumValid: function (text) {
//     var patten = new RegExp(/^[a-zA-Z0-9]+$/);
//     return patten.test(text);
//   },
//   // 英文、数字、-、_验证
//   cValid: function (text) {
//     var patten = new RegExp(/^[a-zA-Z][\w-_]{5,19}$/);
//     return patten.test(text);
//   },
//   // 中文、英文、数字、-、_验证
//   zcValid: function (text) {
//     var patten = RegExp(/^[\u4E00-\u9FA5A-Za-z0-9_-]+$/);
//     return patten.test(text);
//   },
//   // 以字母开头正则表达式，英文、数字、-、_验证
//   enStartValid: function (text) {
//     var patten = new RegExp(/^[a-zA-Z][a-zA-Z0-9_]*$/);
//     return patten.test(text);
//   },
//   // 中文_验证
//   cnValid: function (text) {
//     var patten = RegExp(/^[\u4E00-\u9FA5]+$/);
//     return patten.test(text);
//   },
//   //mobile
//   mobileValid: function (text) {
//     var patten = RegExp(/^1\d{10}$/);
//     return patten.test(text);
//   },
//   //email
//   emailValid: function (text) {
//     var patten = RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/);
//     return patten.test(text);
//   },
//   //字母&符号&数字至少2种;8-16位数
//   pwdValid: function (text) {
//     var patten = RegExp(/^((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{8,16}$/);
//     return patten.test(text);
//   },
//   //图片验证
//   photoValid: function (text) {
//     var photos = ['.jpg', '.png', '.jpeg'];
//     photoExt = text.substr(text.lastIndexOf(".")).toLowerCase(); //获得文件后缀名
//     var flag = false;
//     for (var i = 0; i < photos.length; i++) {
//       if (photos[i] == photoExt) {
//         flag = true;
//         break;
//       }
//     }
//     return flag;
//   },
//   //excel valid
//   excelValid: function (text) {
//     var excels = ['.xlsx'];
//     excelExt = text.substr(text.lastIndexOf(".")).toLowerCase(); //获得文件后缀名
//     var flag = false;
//     for (var i = 0; i < excels.length; i++) {
//       if (excels[i] == excelExt) {
//         flag = true;
//         break;
//       }
//     }
//     return flag;
//   },
//   //日期格式化
//   dateFormat: function (date, fmt) {
//     if (fmt == undefined) {
//       fmt = 'yyyy-MM-dd';
//     }
//     var o = {
//       "M+": date.getMonth() + 1, //月份   
//       "d+": date.getDate(), //日   
//       "h+": date.getHours(), //小时   
//       "m+": date.getMinutes(), //分   
//       "s+": date.getSeconds(), //秒   
//       "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
//       "S": date.getMilliseconds()
//       //毫秒   
//     };
//     if (/(y+)/.test(fmt)) {
//       fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "")
//         .substr(4 - RegExp.$1.length));
//     }
//     for (var k in o) {
//       if (new RegExp("(" + k + ")").test(fmt)) {
//         fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) :
//           (("00" + o[k]).substr(("" + o[k]).length)));
//       }
//     }
//     return fmt;
//   },

//   //json数据的日期格式化
//   jsonDateFormat: function (value, format) {
//     if (value == null || value == '') {
//       return '';
//     } else {
//       return this.dateFormat(new Date(value.time), format);
//     }
//   },

//   /**
//    * 客户端js实现图片预览
//    * fileElId 选择文件的input type=file的id
//    * imgElId 预览的image 的id
//    */
//   previewUploadImg: function (fileElId, imgElId) {
//     var file = document.getElementById(fileElId);
//     var pic = document.getElementById(imgElId);
//     var isIE = navigator.userAgent.match(/MSIE/) != null;
//     var isIE6 = navigator.userAgent.match(/MSIE 6.0/) != null;
//     if (isIE) {
//       file.select();
//       var reallocalpath = document.selection.createRange().text;
//       // IE6浏览器设置img的src为本地路径可以直接显示图片
//       if (isIE6) {
//         pic.src = reallocalpath;
//       } else {
//         // 非IE6版本的IE由于安全问题直接设置img的src无法显示本地图片，但是可以通过滤镜来实现
//         pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image',src=\"" +
//           reallocalpath + "\")";
//         // 设置img的src为base64编码的透明图片 取消显示浏览器默认图片
//         pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
//       }
//     } else {
//       var reader = new FileReader();
//       reader.readAsDataURL(file.files[0]);
//       reader.onload = function (e) {
//         pic.src = this.result;
//       };
//     }
//   }
// };
// oc = new OC();
// export { //很关键
// 	oc
//   }
import {
  Message
} from 'element-ui';

function isEmpty(text) {
  if (text == undefined || text == null || text == '' || text == 'null' ||
    text == 'undefined') {
    return true;
  } else {
    text = text.replace(/(\s*$)/g, '');
    if (text == '') {
      return true;
    }
  }
  return false;
}

function isMobile(text) {
  // var patten = RegExp(/^0?1[3|4|5|8][0-9]\d{8}$/);
  // return patten.test(text);
  return !(/^1[34578]\d{9}$/.test(text));
}

function isOtherName(text){
 return (/^[a-z\d]+$/).test(text)
}

function isNumber(value) {

  var patrn = /^(-)?\d+(\.\d+)?$/;
  if (patrn.exec(value) == null || value == "") {
    return false
  } else {
    return true
  }

}

function limitImg(file) {
  console.log(file.type)
  // const isJPG = file.type === 'image/jpeg';
  var testmsg = /^image\/(jpeg|png|jpg|JPG|JPEG)$/.test(file.type)
  const isLt3M = file.size / 1024 / 1024 < 3;
  // var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)                
  // const extension = testmsg === 'jpg'  
  // const extension2 = testmsg === 'png'  
  // const extension3 = testmsg === 'jpeg'
  // const extension4 = testmsg === 'JPG'
  // const extension5 = testmsg === 'JPEG'
  if (!testmsg) {
    Message.error('上传图片只能是 图片 格式!');
  }
  if (!isLt3M) {
    Message.error('上传图片大小不能超过 3MB!');
  }
  return testmsg && isLt3M
}
function limitFile(file) {
  console.log(file.type)
  // const isJPG = file.type === 'image/jpeg';

  const isLt5M = file.size / 1024 / 1024 < 5;
  // var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)                
  // const extension = testmsg === 'jpg'  
  // const extension2 = testmsg === 'png'  
  // const extension3 = testmsg === 'jpeg'
  // const extension4 = testmsg === 'JPG'
  // const extension5 = testmsg === 'JPEG'
 
  if (!isLt5M) {
    Message.error('上传文件大小不能超过 5MB!');
  }
  return isLt5M
}
function limitApk(file) {
  console.log(file.type)
  // const isJPG = file.type === 'image/jpeg';
  // var testmsg=/^image\/(jpeg|png|jpg|JPG|JPEG)$/.test(file.type)
  const isLt100M = file.size / 1024 / 1024 < 100;
  var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
  const extension = testmsg === 'apk'
  if (!extension) {
    Message.error('上传APP只能是 apk 格式!');
  }
  if (!isLt100M) {
    Message.error('上传图片大小不能超过 100MB!');
  }
  return extension && isLt100M
}

function limitVideo(file) {
  console.log(file.type)
  // const isJPG = file.type === 'image/jpeg';
  // var testmsg=/^image\/(jpeg|png|jpg|JPG|JPEG)$/.test(file.type)
  const isLt100M = file.size / 1024 / 1024 < 60;
  var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
  const extension = testmsg === 'mp4'
  if (!extension) {
    Message.error('上传视频只能是 mp4 格式!');
  }
  if (!isLt100M) {
    Message.error('上传视频大小不能超过 60MB!');
  }
  return extension && isLt100M
}
function formatDate(timestamp) { 
  if(timestamp==""){
    return ""
  }
  var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y+M+D+h+m+s;
} 
function strLength(str) {
  if (str == null) return 0;
  if (typeof str != "string"){
    str += "";
  }

  return str.replace(/[^\x00-\xff]/g,"01").length;
}
export { //很关键
  isEmpty,
  isMobile,
  isNumber,
  limitImg,
  limitApk,
  limitVideo,
  isOtherName,
  formatDate,
  strLength,
  limitFile
}
