/**
 * Format 工具函数测试
 */
import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatNumber,
  formatFileSize,
  formatCurrency,
  formatPercent
} from './format';

describe('format', () => {
  describe('formatDate', () => {
    it('应该使用默认格式正确格式化日期', () => {
      const date = new Date('2024-01-15 10:30:45');
      const result = formatDate(date);
      expect(result).toBe('2024-01-15 10:30:45');
    });

    it('应该使用自定义格式格式化日期', () => {
      const date = new Date('2024-01-15 10:30:45');
      const result = formatDate(date, 'YYYY-MM-DD');
      expect(result).toBe('2024-01-15');
    });

    it('应该处理字符串日期', () => {
      const result = formatDate('2024-01-15 10:30:45');
      expect(result).toBe('2024-01-15 10:30:45');
    });

    it('应该处理时间戳', () => {
      const timestamp = new Date('2024-01-15 10:30:45').getTime();
      const result = formatDate(timestamp);
      expect(result).toBe('2024-01-15 10:30:45');
    });
  });

  describe('formatNumber', () => {
    it('应该正确格式化整数', () => {
      const result = formatNumber(1234567);
      expect(result).toBe('1,234,567');
    });

    it('应该正确格式化小数', () => {
      const result = formatNumber(1234.56);
      expect(result).toBe('1,234.56');
    });

    it('应该处理负数', () => {
      const result = formatNumber(-1234567);
      expect(result).toBe('-1,234,567');
    });

    it('应该处理零', () => {
      const result = formatNumber(0);
      expect(result).toBe('0');
    });
  });

  describe('formatFileSize', () => {
    it('应该正确格式化字节', () => {
      const result = formatFileSize(500);
      expect(result).toBe('500.00 B');
    });

    it('应该正确格式化 KB', () => {
      const result = formatFileSize(1024);
      expect(result).toBe('1.00 KB');
    });

    it('应该正确格式化 MB', () => {
      const result = formatFileSize(1024 * 1024);
      expect(result).toBe('1.00 MB');
    });

    it('应该处理 0 字节', () => {
      const result = formatFileSize(0);
      expect(result).toBe('0 B');
    });
  });

  describe('formatCurrency', () => {
    it('应该使用默认货币符号格式化', () => {
      const result = formatCurrency(1234.56);
      expect(result).toBe('¥1,234.56');
    });

    it('应该使用自定义货币符号格式化', () => {
      const result = formatCurrency(1234.56, '$');
      expect(result).toBe('$1,234.56');
    });

    it('应该处理零', () => {
      const result = formatCurrency(0);
      expect(result).toBe('¥0');
    });
  });

  describe('formatPercent', () => {
    it('应该使用默认小数位格式化百分比', () => {
      const result = formatPercent(0.1234);
      expect(result).toBe('12.34%');
    });

    it('应该使用自定义小数位格式化百分比', () => {
      const result = formatPercent(0.1234, 1);
      expect(result).toBe('12.3%');
    });

    it('应该处理 0', () => {
      const result = formatPercent(0);
      expect(result).toBe('0.00%');
    });

    it('应该处理 1', () => {
      const result = formatPercent(1);
      expect(result).toBe('100.00%');
    });
  });
});
