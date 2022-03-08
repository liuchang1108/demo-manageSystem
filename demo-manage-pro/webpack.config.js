module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        enforce: "pre",
        loader: "eslint-loader",
        include: [path.resolve(__dirname, 'src')]// 指定检查的目录
      }]
  };