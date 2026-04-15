import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
	  component: () => import('../views/Login.vue'),
	  meta: { requiresAuth: true }
    },
	{
	  path: '/login',
	  name: 'login',
	  component: () => import('../views/Login.vue'),
	  meta: { requiresAuth: false }
	},

	{
	  path: '/tokenLogin',
	  name: 'tokenLogin',
	  component: () => import('../views/TokenLogin.vue'),
	  meta: { requiresAuth: false }
	},
	{
	  path: '/main',
	  name: 'Main',
	  component: () => import('../views/Main.vue'),
	  meta: { requiresAuth: true },
	   children:[{
		   path: '/main/home',
		   name: 'Home2',
		   component: () => import('../views/Home.vue')
	   },
	   {
	   		path: '/main/addcar',
	   		name: 'AddCar',
	   		component: () => import('../views/jt808/AddCar.vue')
	   },
	   {
	        path:"/main/postsitionrealtime",
			name:"实时定位",
		   component: () => import('../views/jt808/PoststionRealtime.vue')
	    },
		{
		     path:"/main/postsitionrealtimegroup",
					name:"分组监控",
				   component: () => import('../views/jt808/PoststionRealtimeGroup.vue')
		 },

		{
	        path:"/main/postsitionhistory",
	        name:"轨迹回放",
		    component: () => import('../views/jt808/PoststionHistory.vue'),
	        props: route => ({ carid2: route.query.carid,carno2:route.query.carno })
	    },
		{
	        path:"/main/jt808props",
	        name:"设备属性",
		    component: () => import('../views/jt808/JT808Prop.vue'),
	    },{
	        path:"/main/jt808params",
	        name:"设备参数",
		    component: () => import('../views/jt808/JT808Param.vue'),
	    },{
			path:"/main/grid",
			name:"Grid",
			component: () => import('../views/lingx/GridTemplate.vue'),
	        props: route => ({ ecode: route.query.ecode,mcode:route.query.mcode })
		},{
			path:"/main/gridcascade",
			name:"GridCascade",
			component: () => import('../views/lingx/GridCascade.vue'),
	        props: route => ({ ecode: route.query.ecode,mcode:route.query.mcode })
		},{
			path:"/main/tree",
			name:"Tree",
			component: () => import('../views/lingx/TreeTemplate.vue'),
	        props: route => ({ ecode: route.query.ecode,mcode:route.query.mcode })
		},{
          path:"/main/systemconfig",
          name:"系统配置",
          component: () => import('../views/lingx/SystemConfig.vue'),
        },{
          path:"/main/mileage_day",
          name:"里程统计(天)",
          component: () => import('../views/report/MileageDay.vue'),
        },{
          path:"/main/mileage_month",
          name:"里程统计(月)",
          component: () => import('../views/report/MileageMonth.vue'),
        },{
          path:"/main/offlinedata",
          name:"离线统计",
          component: () => import('../views/report/OfflineData.vue'),
        },{
          path:"/main/alarmstatistics",
          name:"报警统计",
          component: () => import('../views/report/AlarmStatistics.vue'),
        },{
          path:"/main/websockethexstring",
          name:"实时报文",
          component: () => import('../views/jt808/WebSocketHexString.vue'),
        },{
          path:"/main/serverinfo",
          name:"运行状态",
          component: () => import('../views/lingx/ServerInfo.vue'),
        },{
			path:"/main/apicallinfo",
			name:"API统计",
			component: () => import('../views/lingx/ApiCallInfo.vue'),
		}]
	}
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem("isLogin") === "true"
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
     // query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})
export default router