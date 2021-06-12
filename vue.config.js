// vue.config.js
module.exports = {
  // this line added for fixing blank page in index.html
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  css: {
    loaderOptions: {     
      scss: {
        additionalData: `@import "@/assets/scss/app.scss";`
      },
    }
  }
}