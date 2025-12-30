/**
 * 将对象作为参数添加到URL中
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4', c: ['1','2']}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4&c=1,2
 */
export function setObjToUrlParams(baseUrl, obj) {
    let parameters = '';
    for (const key in obj) {
        const value = obj[key];
        if (Array.isArray(value)) {
            parameters += `${key}=${encodeURIComponent(value.join(','))}&`;
        } else {
            parameters += `${key}=${encodeURIComponent(value)}&`;
        }
    }
    parameters = parameters.replace(/&$/, '');
    return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, parameters ? '?' : '') + parameters;
}

/**
 * 处理对象值，保持key不变
 * @param {Object} obj - 原始对象
 * @param {Function} handler - 值处理函数，参数：(value, key)，返回处理后的值
 * @returns {Object} 处理后的新对象
 */
export function processObjectValues(obj, handler) {
    // 空值校验
    if (typeof obj !== 'object' || obj === null) return {};

    // 方法1：Object.keys + 遍历（基础版）
    // const newObj = {};
    // Object.keys(obj).forEach(key => {
    //   newObj[key] = handler(obj[key], key); // 调用处理函数
    // });
    // return newObj;

    // 方法2：Object.fromEntries + Object.entries（简洁版，ES2019+）
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, handler(value, key)]));
}
