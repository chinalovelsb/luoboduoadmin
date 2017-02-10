/**
 * Created by Master on 2017/1/18.
 */
"use strict";
angular.module('admin', ['ui.router'/*,'oc.lazyload'*/, 'ui.bootstrap', 'ngAnimate', 'ngSanitize', 'angularFileUpload', 'ngCookies'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
        //登录
            .state('login', {
                url: '/login',
                templateUrl: 'Pages/login.html',
                controller: 'LoginController',
                controllerAs: 'vm'

            })

            .state('field', {
                url: '/panel',
                templateUrl: 'Pages/admin.html',
                controller: 'PanelController',
                controllerAs: 'vm'

            })
            .state('field.welcome', {
                url: '/welcome',
                templateUrl: 'Pages/welcome.html'
            })
            /////信息管理
            //公司列表
            .state('field.companyList', {
                url: '/companyMsg',
                templateUrl: 'Pages/companyMsg.html',
                controller: 'CompanyListController',
                controllerAs: 'vm'

            })
            .state('field.companyDetail', {
                url: '/companyEdit',
                templateUrl: 'Pages/companyEdit.html',
                controller: 'CompanyEditController',
                controllerAs: 'vm',
                params: {id: null}

            })
            //职位列表
            .state('field.positionList', {
                url: '/professionMsg',
                templateUrl: 'Pages/professionMsg.html',
                controller: 'ProfessionMsgController',
                controllerAs: 'vm',
                params: {companyId: null, companyName: null}


            })
            .state('field.professionDetail', {
                url: '/professionEdit',
                templateUrl: 'Pages/professionEdit.html',
                controller: 'ProfessionEditController',
                controllerAs: 'vm',
                params: {
                    id: null,
                    companyId: null
                }
            })
            //article管理
            .state('field.articleList', {
                url: '/articleMsg',
                templateUrl: 'Pages/articleMsg.html',
                controller: 'articleMsgController',
                controllerAs: 'vm',
                params: {companyId: null}


            })
            .state('field.articleDetail', {
                url: '/articleEdit',
                templateUrl: 'Pages/articleEdit.html',
                controller: 'articleEditController',
                controllerAs: 'vm',
                params: {id: null}
            })


            //////后台管理
            //用户管理
            .state('field.role', {
                url: '/role',
                templateUrl: 'Pages/backstage.html',
                controller: 'roleMsgController',
                controllerAs: 'vm',
            })
            .state('field.roleDetail', {
                url: '/roleDetail?id',
                templateUrl: 'Pages/roleDetail.html',
                controller: 'roleDetailController',
                controllerAs: 'vm',
            })

            //账号管理
            .state('field.manager', {
                url: '/managerMsg',
                templateUrl: 'Pages/backstage.html',
                controller: 'managerMsgController',
                controllerAs: 'vm',
            })
            .state('field.managerDetail', {
                url: '/managerEdit',
                templateUrl: 'Pages/managerEdit.html',
                controller: 'ManagerEditController',
                controllerAs: 'vm',
                params: {id: null}
            })
            //密码管理
            .state('field.pwd', {
                url: '/pwd',
                templateUrl: 'Pages/pwd.html',
                controller: 'pwdController',
                controllerAs: 'vm',
            })
            //模块管理
            .state('field.module', {
                url: '/module',
                templateUrl: 'Pages/backstage.html',
                controller: 'moduleController',
                controllerAs: 'vm',
            })
            .state('field.moduleDetail', {
                url: '/moduleEdit?id',
                templateUrl: 'Pages/moduleEdit.html',
                controller: 'moduleEditController',
                controllerAs: 'vm',
            })


    })
