/* eslint-disable no-magic-numbers */

const DEFAULT_CONFIG = {
  MIN_X: 1,
  MAX_X: 100,
  RANGE_X: 100,
  MIN_Y: 2,
  MAX_Y: 10,
  LOOP_INTERVAL: 100,
  LINE_WIDTH: 3,
  LINE_JOIN: 'miter',
  COLOR: '#FF0',
  BACKGROUND: '#000',
  CACHE_COUNT: 10,
  WIDTH: 2,
  HEIGHT: 2
};

export default function createConfig(customConfig = {}) {
  const config = Object.assign({}, DEFAULT_CONFIG, customConfig);

  return {
    config,
    updateConfig: (newConfig) => Object.assign(config, newConfig)
  };
}
