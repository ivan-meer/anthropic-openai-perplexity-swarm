import {
  formatTimestamp,
  shouldShowTimestamp,
  parseCommand,
  validateMessage,
  groupMessagesByDate,
  calculateStats,
  formatBytes,
  debounce,
  throttle,
  sanitizeInput,
  parseMarkdown,
  generateMessageId,
  calculateTokens
} from '../utils';

describe('ChatPage Utils', () => {
  describe('formatTimestamp', () => {
    it('formats timestamp correctly', () => {
      const date = new Date('2024-01-01T12:00:00');
      expect(formatTimestamp(date)).toBe('12:00');
    });

    it('handles different date formats', () => {
      const timestamp = '2024-01-01T12:00:00';
      expect(formatTimestamp(timestamp)).toBe('12:00');
    });

    it('returns empty string for invalid date', () => {
      expect(formatTimestamp('invalid')).toBe('');
    });
  });

  describe('shouldShowTimestamp', () => {
    it('shows timestamp for first message', () => {
      const messages = [
        { timestamp: new Date('2024-01-01T12:00:00') }
      ];
      expect(shouldShowTimestamp(messages, 0)).toBe(true);
    });

    it('shows timestamp when time gap is significant', () => {
      const messages = [
        { timestamp: new Date('2024-01-01T12:00:00') },
        { timestamp: new Date('2024-01-01T12:30:00') }
      ];
      expect(shouldShowTimestamp(messages, 1)).toBe(true);
    });

    it('hides timestamp for consecutive messages within threshold', () => {
      const messages = [
        { timestamp: new Date('2024-01-01T12:00:00') },
        { timestamp: new Date('2024-01-01T12:01:00') }
      ];
      expect(shouldShowTimestamp(messages, 1)).toBe(false);
    });
  });

  describe('parseCommand', () => {
    it('parses command with arguments', () => {
      const input = '/command arg1 arg2';
      expect(parseCommand(input)).toEqual({
        command: 'command',
        args: ['arg1', 'arg2']
      });
    });

    it('parses command without arguments', () => {
      const input = '/command';
      expect(parseCommand(input)).toEqual({
        command: 'command',
        args: []
      });
    });

    it('returns null for non-command input', () => {
      const input = 'not a command';
      expect(parseCommand(input)).toBeNull();
    });
  });

  describe('validateMessage', () => {
    it('validates message length', () => {
      const longMessage = 'a'.repeat(5001);
      expect(validateMessage(longMessage)).toBe(false);
    });

    it('validates message content', () => {
      expect(validateMessage('')).toBe(false);
      expect(validateMessage('   ')).toBe(false);
      expect(validateMessage('valid message')).toBe(true);
    });

    it('handles special characters', () => {
      expect(validateMessage('message with 👍')).toBe(true);
      expect(validateMessage('message with \n newline')).toBe(true);
    });
  });

  describe('groupMessagesByDate', () => {
    it('groups messages by date', () => {
      const messages = [
        { timestamp: new Date('2024-01-01T12:00:00') },
        { timestamp: new Date('2024-01-01T13:00:00') },
        { timestamp: new Date('2024-01-02T12:00:00') }
      ];

      const grouped = groupMessagesByDate(messages);
      expect(Object.keys(grouped)).toHaveLength(2);
    });

    it('sorts messages within groups', () => {
      const messages = [
        { timestamp: new Date('2024-01-01T13:00:00') },
        { timestamp: new Date('2024-01-01T12:00:00') }
      ];

      const grouped = groupMessagesByDate(messages);
      const dates = Object.keys(grouped);
      expect(grouped[dates[0]][0].timestamp.getHours()).toBe(12);
    });
  });

  describe('calculateStats', () => {
    it('calculates message statistics', () => {
      const messages = [
        { sender: 'user', text: 'Hello' },
        { sender: 'ai', text: 'Hi there' }
      ];

      const stats = calculateStats(messages);
      expect(stats.totalMessages).toBe(2);
      expect(stats.userMessages).toBe(1);
      expect(stats.aiMessages).toBe(1);
    });

    it('calculates average response time', () => {
      const messages = [
        { sender: 'user', timestamp: new Date('2024-01-01T12:00:00') },
        { sender: 'ai', timestamp: new Date('2024-01-01T12:00:10') }
      ];

      const stats = calculateStats(messages);
      expect(stats.averageResponseTime).toBe(10);
    });
  });

  describe('formatBytes', () => {
    it('formats bytes to human readable size', () => {
      expect(formatBytes(1024)).toBe('1.0 KB');
      expect(formatBytes(1024 * 1024)).toBe('1.0 MB');
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1.0 GB');
    });

    it('handles small values', () => {
      expect(formatBytes(100)).toBe('100 B');
    });

    it('handles zero', () => {
      expect(formatBytes(0)).toBe('0 B');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('debounces function calls', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 1000);

      debouncedFunc();
      debouncedFunc();
      debouncedFunc();

      expect(func).not.toHaveBeenCalled();

      jest.runAllTimers();

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('calls function with latest arguments', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 1000);

      debouncedFunc('first');
      debouncedFunc('second');
      debouncedFunc('third');

      jest.runAllTimers();

      expect(func).toHaveBeenCalledWith('third');
    });
  });

  describe('throttle', () => {
    jest.useFakeTimers();

    it('throttles function calls', () => {
      const func = jest.fn();
      const throttledFunc = throttle(func, 1000);

      throttledFunc();
      throttledFunc();
      throttledFunc();

      expect(func).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1000);
      throttledFunc();

      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe('sanitizeInput', () => {
    it('removes HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello';
      expect(sanitizeInput(input)).toBe('Hello');
    });

    it('preserves safe markdown', () => {
      const input = '**bold** *italic*';
      expect(sanitizeInput(input)).toBe('**bold** *italic*');
    });

    it('handles special characters', () => {
      const input = '& < > " \'';
      expect(sanitizeInput(input)).toBe('&amp; &lt; &gt; &quot; &#39;');
    });
  });

  describe('parseMarkdown', () => {
    it('parses basic markdown', () => {
      expect(parseMarkdown('**bold**')).toBe('<strong>bold</strong>');
      expect(parseMarkdown('*italic*')).toBe('<em>italic</em>');
      expect(parseMarkdown('`code`')).toBe('<code>code</code>');
    });

    it('parses code blocks', () => {
      const input = '```javascript\nconst x = 1;\n```';
      expect(parseMarkdown(input)).toContain('class="language-javascript"');
    });

    it('handles nested markdown', () => {
      const input = '**bold _italic_ text**';
      expect(parseMarkdown(input)).toBe('<strong>bold <em>italic</em> text</strong>');
    });
  });

  describe('generateMessageId', () => {
    it('generates unique IDs', () => {
      const id1 = generateMessageId();
      const id2 = generateMessageId();
      expect(id1).not.toBe(id2);
    });

    it('includes timestamp in ID', () => {
      const id = generateMessageId();
      expect(id).toMatch(/\d{13}/);
    });
  });

  describe('calculateTokens', () => {
    it('calculates tokens for simple text', () => {
      const text = 'Hello world';
      expect(calculateTokens(text)).toBeGreaterThan(0);
    });

    it('handles special characters', () => {
      const text = 'Hello 👋 world!';
      expect(calculateTokens(text)).toBeGreaterThan(0);
    });

    it('handles empty input', () => {
      expect(calculateTokens('')).toBe(0);
    });
  });
});
