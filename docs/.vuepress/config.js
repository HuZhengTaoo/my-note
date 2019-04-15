
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
        { text:'视频学习',items:[
          {text:'music',link:'/video/music/'},
          {text:'node-serve',link:'/video/node-serve/'}
        ]
        },
        { text:'阅读',link:'/read/'},
        { text:'分享',link:'/share/'},
        { text: '前端进阶学习', items:[
          {text:'mdn',link:'/mdn/'},
          {text:'你不知道的js',link:'/donot/'},
          {text:'es6',link:'/es6/'}
         ] 
        },
      ],
      sidebar: {
        '/video/music/':[
          ['','音乐学习'],
          ['jsonp','jsonp']
        ],
        '/video/node-serve/':[
          ['','node-serve'],
          ['http','http'],
          ['create-project','从0搭建项目'],
          ['promise','promise']
        ],
        '/read/':[
          ['','介绍'],
          ['人类简史','人类简史']
        ],
        '/share/':[
          ['','概述'],
          ['poster','海报生成踩坑']
        ],
        '/mdn/':[
          ['','概述'],
          ['object','Object'],
          ['array','Array']
        ],
        '/donot/':[
          ['','概述']
        ],
        
        '/es6':[
          ['','概述']
        ]
      }
  }     
}
