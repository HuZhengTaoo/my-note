
module.exports = {
  title: '爱棋道技术组',
  head: [
    ['link', { rel: 'icon',href: `/logo.jpeg` }]
 ],
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
      sidebarDepth: 2,
      lastUpdated: 'Last Updated',
      serviceWorker: {
        updatePopup: true
      },
      activeHeaderLinks: true,
             
      nav: [
        { text:'音乐学习',link:'/music/'}
      ],
      sidebar: {
        '/music/':[
          ['','音乐学习'],
          ['jsonp','jsonp']
        ]
      }
  }     
}
