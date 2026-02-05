/**
 * 格式化工具函数
 * @description 提供常用的格式化工具函数
 */

/**
 * 格式化日期
 * @param date - 日期对象或时间戳
 * @param format - 格式化字符串（如 'YYYY-MM-DD HH:mm:ss'）
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | number | string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = typeof date === 'number' || typeof date === 'string' ? new Date(date) : date;
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 格式化数字为千分位
 * @param num - 数字
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 格式化文件大小
 * @param bytes - 字节数
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * 格式化货币
 * @param amount - 金额
 * @param currency - 货币符号（默认为 '¥'）
 * @returns 格式化后的货币字符串
 */
export function formatCurrency(amount: number, currency: string = '¥'): string {
  return `${currency}${formatNumber(amount)}`;
}

/**
 * 格式化百分比
 * @param value - 数值（0-1）
 * @param decimals - 小数位数（默认为 2）
 * @returns 格式化后的百分比字符串
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
