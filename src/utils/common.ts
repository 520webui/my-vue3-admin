/** *
 * 格式化总数 数字加 ,
*/
export function format_number (n: string) {
  var b = parseInt(n).toString();
  var len = b.length;
  if (len <= 3) { return b; }
  var r = len % 3;
  // @ts-ignore
    return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
}

/**
 * 排序
 * */
 export function sortData (data: any[], field: string | number) {
  return data.sort((a, b) => {
      return b[field] * 1 - a[field] * 1
  })
}

/**
 * 分割数组创建二维数组封装
 * @param data 数组
 * @param senArrLen 需要分割成子数组的长度
 */
 export function splitArr (data: string | any[], senArrLen: number) {
  // 处理成len个一组的数据
  let data_len = data.length;
  let arrOuter_len = data_len % senArrLen === 0 ? data_len / senArrLen : parseInt((data_len / senArrLen) + '') + 1;
  let arrSec_len = data_len > senArrLen ? senArrLen : data_len;// 内层数组的长度
  let arrOuter = new Array(arrOuter_len);// 最外层数组
  let arrOuter_index = 0;// 外层数组的子元素下标
  // console.log(data_len % len);
  for (let i = 0; i < data_len; i++) {
      if (i % senArrLen === 0) {
          arrOuter_index++;
          let len = arrSec_len * arrOuter_index;
          // 将内层数组的长度最小取决于数据长度对len取余，平时最内层由下面赋值决定
          arrOuter[arrOuter_index - 1] = new Array(data_len % senArrLen);
          if (arrOuter_index === arrOuter_len)// 最后一组
              data_len % senArrLen === 0 ?
                  len = data_len % senArrLen + senArrLen * arrOuter_index :
                  len = data_len % senArrLen + senArrLen * (arrOuter_index - 1);
          let arrSec_index = 0;// 第二层数组的索引
          for (let k = i; k < len; k++) { // 第一层数组的开始取决于第二层数组长度*当前第一层的索引
              arrOuter[arrOuter_index - 1][arrSec_index] = data[k];
              arrSec_index++;
          }
      }
  }
  console.log(arrOuter, 'arrOuter');
  return arrOuter
}
