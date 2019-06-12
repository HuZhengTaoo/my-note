
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
          {text:'serverless',link:'/video/serverless/'},
          {text:'7yue-node',link:'/video/7yue-node/'}
        ]
        },
        { text:'阅读',link:'/read/'},
        { text:'分享',link:'/share/'},
        { text: '前端进阶学习', items:[
          {text:'mdn',link:'/mdn/'},
          {text:'你不知道的js',link:'/donot/'},
          {text:'es6',link:'/es6/'},
          {text:'面试',link:'/interview/'},
          {text:'vue源码',link:'/video/vue/'}
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
          ['1-1','导学node'],
          ['2-1','异步变成的那点事'],
          ['3-1','路由系统'],
          ['4-1','异步异常与原句异常处理'],
          ['5-1','校验器和数据表'],
          ['6-1','用户身份系统'],
          ['7-1','JWT令牌与Auth权限控制中间件'],
          ['8-1','使用Lin-UI与在小程序中使用npm']
        ],
        '/video/nignx/':[
          ['','概述']
        ],
        '/video/koa-wechat/':[
          ['','概述'],
          ['day3','day3']
        ],
        '/interview/':[
          ['','概述'],
          ['basic','基础'],
          ['this','this'],
          ['closure','闭包'],
          ['prototype','原型链']
        ],
        '/read/':[
          ['','介绍'],
          ['人类简史','人类简史']
        ],
        '/share/':[
          ['','概述'],
          ['poster','海报生成踩坑']
        ],
        '/video/vue/':[
          ['','概述'],
          ['chapter1','第一章']
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
