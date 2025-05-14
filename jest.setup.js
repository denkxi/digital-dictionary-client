require('@testing-library/jest-dom');

// Polyfill for TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill for Response, Request, Headers
if (!global.Response) {
  const nodeFetch = require('node-fetch');
  global.Response = nodeFetch.Response;
  global.Request = nodeFetch.Request;
  global.Headers = nodeFetch.Headers;
  global.fetch = nodeFetch.default;
}

// Mock BroadcastChannel
class MockBroadcastChannel {
  constructor(channel) {
    this.channel = channel;
  }
  postMessage() {}
  addEventListener() {}
  removeEventListener() {}
  close() {}
}

global.BroadcastChannel = MockBroadcastChannel;

// Mock the window.matchMedia function which might be used by some components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
