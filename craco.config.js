const path = require("path");
module.exports = {
  webpack: {
    alias: {
      '@themes': path.resolve(__dirname, "src/themes/"),
      '@util': path.resolve(__dirname, "src/util/"),
      '@store': path.resolve(__dirname, "src/store/"),
      '@components': path.resolve(__dirname, "src/components/"),
      '@scenes': path.resolve(__dirname, "src/scenes/")
    }
  }
}