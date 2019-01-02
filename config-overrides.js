module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.worker/,
    use: { loader: 'worker-loader' },
  });
  config.output.globalObject = 'this';
  return config;
};
