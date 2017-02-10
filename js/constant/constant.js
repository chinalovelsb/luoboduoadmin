/**
 * Created by Master on 2017/1/20.
 */
//后台接口
angular.module('admin')
    .constant('adminApi', {
            //登录
            login: '/lbd-admin/a/login',
            logout: '/lbd-admin/a/logout',
            //公司接口
            companyList: '/lbd-admin/a/company/search',
            //公司详情
            companyDetail: '/lbd-admin/a/company/',
            //公司状态
            companyStatus: '/lbd-admin/a/u/company/status',
            //修改、添加、删除公司
            companyEdit: '/lbd-admin/a/u/company',

            //职位列表
            professionList: '/lbd-admin/a/profession/search',
            //职位明细
            professionDetail: '/lbd-admin/a/profession/',
            //修改、添加、删除职业
            professionEdit: '/lbd-admin/a/u/profession',
            //修改职位状态-上架/下架
            professionStatus: '/lbd-admin/a/u/profession/status',

            //Article列表
            articleList: '/lbd-admin/a/article/search',
            //详情
            articleDetail: '/lbd-admin/a/article/',
            //状态
            articleStatus: '/lbd-admin/a/u/article/status',
            //修改、添加、删除
            articleEdit: '/lbd-admin/a/u/article',

            //后台管理
            //查询/删除/修改账号
            managerList: '/lbd-admin/a/u/manager/',
            //批量用户详细列表
            managerMsgList: '/lbd-admin/a/u/multi/manager?',
            //添加编辑用户
            managerAdd: '/lbd-admin/a/u/manager',

            //单个角色+权限
            /*/a/u/role/{rid}/module*/
            //查找角色
            roleList: function (rid) {
                return rid ? '/lbd-admin/a/u/role/' + rid : '/lbd-admin/a/u/role/'
            },
            //增加角色
            addRole: '/lbd-admin/a/u/role',
            //修改、删除
            editRole: function (id) {
                return id ? '/lbd-admin/a/u/role/' + id : '/lbd-admin/a/u/role'
            },
            //批量角色详情
            roleDetailList: '/lbd-admin/a/u/multi/role?',

            //模块
            //批量查询模块
            moduleMultiDetail: function (params) {
                return "/lbd-admin/a/u/multi/module?" + params;
            },
            //修改/编辑/删除
            moduleEdit: function (id) {
                return id ? "/lbd-admin/a/u/module/" + id : "/lbd-admin/a/u/module/";
            },
            //密码
            pwdChange: '/lbd-admin/a/u/pwd'


        }
    )
