
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
          {text:'node-serve',link:'/video/node-serve/'},
          {text:'nginx',link:'/video/nignx/'},
          {text:'微信公众号开发',link:'/video/koa-wechat/'},
          {text:'http',link:'/video/http/'},
          {text:'serverless',link:'/video/serverless/'}
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
          ['promise','promise'],
          ['login','login'],
          ['log','log'],
          ['pm2','pm2'],
          ['koa2','koa2'],
          ['middleware','middleware'],
          ['promise','promise'],
          ['save','save'],
          ['stream','stream']
        ],
        '/video/http/':[
          ['','概述'],
          ['1-1','1-1'],
          ['1-2','1-2'],
          ['2-1','2-1'],
          ['2-2','2-2'],
          ['2-3','2-3'],
          ['2-4','2-4'],
          ['2-5','2-5'],
          ['2-6','2-6']
        ],
        '/video/serverless/':[
          ['','概述'],
          ['1-1','快速上手小程序云开发'],
          ['2-1','云开发-基础概念'],
          ['3-1','数据库项目实战']
        ],
        '/video/7yue-node/':[
          ['','概述'],
          ['1-1','导学node']
        ],
        '/video/nignx/':[
          ['','概述']
        ],
        '/video/koa-wechat/':[
          ['','概述'],
          ['day3','day3']
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
