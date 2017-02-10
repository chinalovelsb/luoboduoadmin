/**
 * Created by Master on 2017/1/20.
 */
"use strict";
//登录
angular.module('admin')
    .controller('LoginController', LoginController);
LoginController.$inject = ['getData', '$state', '$cookieStore', 'LocalStorage'];
function LoginController(getData, $state, $cookieStore, LocalStorage) {
    var vm = this;
    vm.login = login;
    vm.status = $cookieStore.get('status');
    vm.status ? $state.go('field.welcome') : '';
    function login() {
        var params = {name: vm.user, pwd: vm.pwd};
        getData.login(params).then(function (res) {
            if (res.code === 0) {
                //保持登录状态
                vm.save ? $cookieStore.put('status', true, {expirse: new Date().getDate() + 1}) : '';

                //登录用户信息
                $cookieStore.put('user', res.data, {expirse: new Date().getDate() + 1});
                //用户模块权限
                LocalStorage.get('permissions') ? '' : getData.role(res.data.role.id).then(function (res) {
                        LocalStorage.set('permissions', res.data.role.permissionsSet);
                        $state.go('field.welcome')
                    })
            } else {
                alert(res.message)
            }
        })
    }
}

//////////////////////////////////主面板
angular.module('admin')
    .controller('PanelController', PanelController);
PanelController.$inject = ['$scope', '$location', '$cookieStore', 'getData', '$state', 'LocalStorage', 'fetchObjectKey', 'buildNodeList'];
function PanelController($scope, $location, $cookieStore, getData, $state, LocalStorage, fetchObjectKey, buildNodeList) {
    var vm = this;
    var user = $cookieStore.get('user');
    user ? _success() : $state.go('login');
    function _success() {
        $scope.role = user.role.name;
        $scope.manager = user.manager.name;
        $scope.msgCollapsed = false;
        $scope.Url = $location.url();
        $scope.change = function (n) {
            $scope.Url = n
        };
        //登出
        $scope.logout = function () {
            getData.logout().then(function (res) {
                LocalStorage.remove('permissions');
                LocalStorage.remove('module');
                $cookieStore.remove('user');
                $cookieStore.remove('status');
                alert(res.message);
                $state.go('login')
            })
        };
        //加载模块
        if (LocalStorage.get('module')) {
            vm.sideBar = buildNodeList(LocalStorage.get('module'));
        } else {
            getData.moduleMultiDetail(fetchObjectKey(LocalStorage.get('permissions'))).then(function (res) {
                vm.sideBar = buildNodeList(res.data.moduleList);
                LocalStorage.set('module', res.data.moduleList);
            })
        }
    }
}

////////////////////////////////////////公司列表页
angular.module('admin')
    .controller('CompanyListController', CompanyListController);
CompanyListController.$inject = ['getData', 'CompanyConstant', 'DirectiveData', 'clean'];
function CompanyListController(getData, CompanyConstant, DirectiveData, clean) {
    var vm = this;
    //默认参数
    var params = {page: vm.currentPage, size: 10};
    vm.CompanyConstant = CompanyConstant;
    vm.title = DirectiveData.companyTitle;   //表格表头
    vm.templateUrl = 'Pages/template/companyList.html';  //列表模板

    vm.companyFn = companyFn;  //修改公司参数函数
    vm.pageChanged = pageChanged;//页数变化执行

    vm.search = searchData;//搜索
    vm.clean = clear;//清除

    vm.companyFn().getCompanyList(params);//载入页面获取公司数据
    vm.clean();//搜索条件初始化

    function clear() {
        vm.company = clean(vm.company)
    }

    //翻页
    function pageChanged() {
        params.page = vm.currentPage;
        vm.companyFn().getCompanyList(params);
    }

    //搜索
    function searchData() {
        params = vm.company;
        vm.companyFn().getCompanyList(params)
    }

    //公司参数
    function companyFn() {
        return {
            //获取列表
            getCompanyList: function (params) {
                getData.companylist(params).then(function (res) {
                    vm.companyList = res.data;
                    vm.totalItems = res.total;
                })
            },
            //删除
            del: function (id) {
                return getData.companyDel(id)
            },
            //公司状态
            statusChange: function (params) {
                return getData.companyStatus(params)
            }
        }
    }
}


angular.module('admin')
//公司编辑
    .controller('CompanyEditController', CompanyEditController);
CompanyEditController.$inject = [/*'$scope',*/'CompanyConstant', '$stateParams', 'getData', '$location', '$state', '$filter'];
function CompanyEditController(/*$scope,*/CompanyConstant, $stateParams, getData, $location, $state) {
    var vm = this;

    vm.CompanyConstant = CompanyConstant;
    //id获取与存取
    vm.id = $stateParams.id || $location.search().id;
    $location.search({'id': vm.id});
    //url中存在id则请求id参数
    vm.id ? request() : '';
    vm.saveChange = saveChange;
    function request() {
        getData.companyDetail(vm.id).then(function (res) {
            vm.companyDetail = res.data;
            vm.industry = vm.companyDetail.industryList[0].industry;
            vm.companyDetail.company.phone = +vm.companyDetail.company.phone

        })
    }

    //保存编辑、修改
    function saveChange() {
        //根据id执行编辑或添加
        if (!!vm.id) {
            getData.companyDetail(vm.id, vm.companyDetail).then(function (res) {
                res.code == 0 ? $state.go('field.companyList') : ''
            })
        } else {
            getData.companyAdd(vm.companyDetail).then(function (res) {
                alert(res.message)
            })
        }
    }
}

//////////////////////////////////////////职位信息
angular.module('admin')
    .controller('ProfessionMsgController', ProfessionMsgController);
ProfessionMsgController.$inject = ['ProfessionConstant', 'getData', '$location', '$stateParams', 'clean'];
function ProfessionMsgController(ProfessionConstant, getData, $location, $stateParams, clean) {
    var vm = this;
    var params = {page: vm.currentPage, size: 10};
    //公司id
    vm.companyId = $stateParams.companyId || $location.search().companyId;
    vm.companyName = $stateParams.companyName || $location.search().companyName;
    $location.search({'companyId': vm.companyId, 'companyName': vm.companyName});
    //职业列表参数
    vm.ProfessionConstant = ProfessionConstant;
    vm.templateUrl = 'Pages/template/professionList.html';
    //显示公司在找 、显示所有职位
    vm.professionFn = professionFn;
    vm.companyId ? companyPro() : professionFn().getProfessionList(params);

    function companyPro() {

        professionFn().getProfessionList({'companyId': +vm.companyId});
    }


    //条件清除
    vm.clear = false;
    vm.clean = function () {
        vm.profession = clean(vm.profession);
        vm.clear = !vm.clear;
    };
    //翻页执行
    vm.pageChange = pageChange;
    function pageChange() {
        params = vm.profession;
        params.page = vm.currentPage;
        vm.professionFn().getProfessionList(params)
    }


    //职位相关函数
    function professionFn() {
        return {
            //获取列表
            getProfessionList: function (params) {
                getData.professionList(params).then(function (res) {
                    vm.professionList = res.data;
                    vm.totalItems = res.total;
                })
            },
            //搜索
            search: function () {

                params = vm.profession;

                professionFn().getProfessionList(params)
            },
            //删除
            del: function (id) {
                return getData.professionDel(id)
            },
            //公司状态
            statusChange: function status(params) {
                return getData.professionStatus(params)
            }
        }
    }
}

/////////////////////////职位编辑
angular.module('admin')
    .controller('ProfessionEditController', ProfessionEditController);
ProfessionEditController.$inject = ['ProfessionConstant', 'getData', '$stateParams', '$state', '$location'];
function ProfessionEditController(ProfessionConstant, getData, $stateParams, $state, $location) {
    var vm = this;
    vm.ProfessionConstant = ProfessionConstant;

    //id获取与存取
    vm.id = $stateParams.id || $location.search().id;
    vm.companyId = $stateParams.companyId || $location.search().companyId;
    $location.search({'id': vm.id, 'companyId': vm.companyId});

    //url中存在id则请求id参数进行编辑
    vm.id ? request() : setCompanyData();

    function request() {
        getData.professionDetail(vm.id).then(function (res) {
            vm.professionDetail = res.data;
        })
    }

    //设置公司标签
    function setCompanyData() {
        getData.companyDetail(vm.companyId).then(function (res) {
            vm.professionDetail.companyName = res.data.company.name;
            vm.professionDetail.tags = res.data.tagList;
        })
    }

    //取消
    vm.cancel = cancel;
    function cancel() {
        $state.go('field.positionList', {
            companyId: $stateParams.companyId,
            'companyName': vm.professionDetail.companyName
        })
    }

    vm.saveChange = saveChange;
    //保存编辑、修改
    function saveChange() {
        //根据id执行编辑或添加
        var params = {};
        if (!!vm.id) {
            params.tags = vm.professionDetail.tags;
            delete vm.professionDetail.tags;
            params.profession = vm.professionDetail;
            getData.professionEdit(vm.id, params).then(function (res) {
                res.code == 0 && !$stateParams.companyId ? $state.go('field.positionList') : $state.go('field.positionList', {
                        companyId: vm.companyId,
                        'companyName': vm.professionDetail.companyName
                    });
            })
        } else {
            params.tags = vm.professionDetail.tags;
            delete vm.professionDetail.tags;
            params.profession = vm.professionDetail;
            params.profession.companyId = vm.companyId;
            getData.professionAdd(params).then(function (res) {
                alert(res.message);
                $state.go('field.positionList', {
                    'companyId': vm.companyId,
                    'companyName': vm.professionDetail.companyName
                });
            })
        }
    }


}

////////////////////////////////////Article信息
angular.module('admin')
    .controller('articleMsgController', articleMsgController);
articleMsgController.$inject = ['ArticleConstant', 'getData', '$location', '$stateParams', 'clean'];
function articleMsgController(ArticleConstant, getData, $location, $stateParams, clean) {
    var vm = this;
    var params = {page: vm.currentPage, size: 10};
    vm.clear = false;
    //公司id
    vm.companyId = $stateParams.companyId || $location.search().companyId;
    $location.search({'companyId': vm.companyId});
    //职业列表参数
    vm.ArticleConstant = ArticleConstant;
    vm.templateUrl = 'Pages/template/articleList.html';
    //显示公司在找 、显示所有职位
    vm.articleFn = articleFn;
    vm.companyId ? companyPro() : articleFn().getarticleList(params);

    function companyPro() {
        articleFn().getarticleList({'companyId': +vm.companyId});
    }

    //条件清除
    vm.clean = function () {
        vm.article = clean(vm.article);
        vm.clear = !vm.clear;
    };
    //翻页执行
    vm.pageChange = pageChange;
    function pageChange() {
        params = {page: vm.currentPage, size: 10};
        vm.articleFn().getarticleList(params)
    }

    //职位相关函数传入指令调用
    function articleFn() {
        return {
            //获取列表
            getarticleList: function (params) {
                getData.articleList(params).then(function (res) {
                    vm.articleList = res.data.articleList;
                    vm.totalItems = res.data.total;
                })
            },
            //搜索
            search: function () {
                params = vm.article;
                vm.sort = vm.article.type !== 3 && vm.article.type != null;
                articleFn().getarticleList(params)
            },
            //删除
            del: function (id) {
                return getData.articleDel(id)
            },
            //公司状态
            statusChange: function status(params) {
                return getData.articleStatus(params)
            }
        }
    }
}

////////////////////////////////////////Article编辑
angular.module('admin')
    .controller('articleEditController', articleEditController);
articleEditController.$inject = ['ArticleConstant', '$stateParams', '$location', 'getData', '$state'];
function articleEditController(ArticleConstant, $stateParams, $location, getData, $state) {
    var vm = this;
    vm.ArticleConstant = ArticleConstant;
    vm.id = $stateParams.id || $location.search().id;
    $location.search({'id': vm.id});

    //根据ID判断编辑、新增
    vm.id ? edit() : '';
    vm.saveChange = saveChange;
    function edit() {
        getData.articleDetail(vm.id).then(function (res) {
            vm.article = res.data.article;
            vm.article.industry === "" ? vm.article.industry = null : ''
        })
    }

    //保存更改
    function saveChange(n) {
        vm.article.status = n;
        //根据id执行编辑或添加
        if (!!vm.id) {
            getData.articleEdit(vm.id, vm.article).then(function (res) {
                res.code == 0 ? $state.go('field.articleList') : '';

            })
        } else {
            getData.articleAdd(vm.article).then(function (res) {
                alert(res.message)
            })
        }
    }
}

////////////////////////////////////////////role列表
angular.module('admin')
    .controller('roleMsgController', roleMsgController);
roleMsgController.$inect = ['getData', 'BackStageConstant', ' $state'];
function roleMsgController(getData, BackStageConstant, $state) {
    var vm = this;
    vm.role = true;
    vm.templateUrl = 'Pages/template/roleList.html';
    vm.tabelTitle = BackStageConstant.roleTitle;

    request();
    function request(params) {
        //请求role列表
        getData.roleList(params).then(function (res) {
            vm.dataList = res.data.roleList;
        })
    }

    vm.add = add;
    function add() {
        $state.go('field.roleDetail', {id: null})
    }

    //传入指令给指令调用
    vm.DataFn = function () {
        return {
            getRoleList: function () {
                request()
            },
            del: function (id) {
                return getData.rolePerssions('', 'DELETE', id)
            }
        }
    }
}

/////////////////////////////role编辑
angular.module('admin')
    .controller('roleDetailController', roleDetailController);
roleDetailController.$inect = ['getData', 'buildNodeList', 'paramster', '$state', 'permissionValue', 'formatPermissions'];
function roleDetailController(getData, buildNodeList, paramster, $state, permissionValue, formatPermissions) {
    var vm = this;
    var params = {};

    vm.id = paramster.get('id');
    moduleListDetail();
    //全部模块信息
    function moduleListDetail() {

        //获取所有模块ID
        return getData.moduleDetail('', 'GET', '').then(function (res) {

            //所有id对应信息
            getData.moduleMultiDetail(res.data.ids).then(function (res) {
                //建立节点关系
                return vm.moduleList = buildNodeList(res.data.moduleList);
            }).then(function () {
                //
                vm.id ? permission() : '';
                function permission() {
                    getData.role(vm.id).then(function (res) {
                        //将返回数据赋值
                        vm.role = permissionValue(vm.role, res.data.role.permissionsSet);
                        vm.name = res.data.role.name;
                    })
                }
            });
        })
    }

    //清除
    vm.cencel = function () {
        $state.go('field.role')
    };
    //保存
    vm.saveChange = saveChange;
    function saveChange() {

        params.name = vm.name;
        params.permissionsSet = formatPermissions(vm.role);

        vm.id ? edit() : add();
        //添加role
        function add() {
            getData.rolePerssions(params, 'POST').then(function (res) {
                alert(res.message);
                res.code === 0 ? $state.go('field.role') : '';
            })
        }

        //删除role
        function edit() {
            params.id = vm.id;
            getData.rolePerssions(params, 'PUT', vm.id).then(function (res) {
                alert(res.message);
                res.code === 0 ? $state.go('field.role') : '';
            })
        }
    }
}


///////////////////////////////////////账号列表
angular.module('admin')
//manager
    .controller('managerMsgController', managerMsgController);

managerMsgController.$inect = ['getData', 'BackStageConstant', 'clean', '$state'];
function managerMsgController(getData, BackStageConstant, clean, $state) {
    var vm = this;
    var roleList;
    vm.roleNameList = [{'type': null, 'name': '全部'}];
    vm.manager = true;
    vm.templateUrl = 'Pages/template/manager.html';
    vm.tabelTitle = BackStageConstant.managerTitle;
    managerFn().getmanagerList();

    vm.add = add;
    function add() {
        $state.go('field.managerDetail')
    }

    vm.clean = function () {
        clean(vm.managerDetail)
    };

    vm.search = search;
    function search() {
        if (vm.ids) {
            getData.managerSearch(vm.ids).then(function (res) {
                vm.dataList = res.managerList;
                getName();
            })
        } else {
            managerFn().getmanagerList();
        }

    }

    //所有用户下拉菜单
    getData.roleList().then(function (res) {
        vm.roleList = res.data.roleList;
        vm.roleList.unshift({name: '全部', id: ''});
        vm.ids = '';
    });

    //
    function getName() {
        //获取用户组类型信息
        getData.roleDetail(vm.dataList).then(function (res) {
            roleList = res.data.roleList;
            //将用户名传进账户对象
            angular.forEach(vm.dataList, function (data, $index) {
                data.roleName = roleList[$index].name;
            })
        })
    }

    //方便指令调用
    vm.DataFn = managerFn;
    function managerFn() {
        return {
            getmanagerList: function () {
                //全部账号列表
                getData.managerList().then(function (res) {
                    vm.dataList = res.data.managerList;
                    //账户对应用户名
                    getName();
                })
            },
            del: function (id) {
                return getData.managerDel(id)
            }

        }
    }

}

////////////////////////////////////////用户列表
angular.module('admin')
    .controller('ManagerEditController', ManagerEditController);
ManagerEditController.$inject = ['getData', '$stateParams', '$location', '$state'];
function ManagerEditController(getData, $stateParams, $location, $state) {
    var vm = this;
    vm.id = $stateParams.id || $location.search().id;
    $location.search({'id': vm.id});
    getData.roleList().then(function (res) {
        vm.roleList = res.data.roleList;
        vm.roleList.unshift({name: '全部', id: ''});

    });
    vm.id ? request() : vm.roleID = '';
    //所有用户下拉菜单

    function request() {
        getData.managerList(vm.id).then(function (res) {
            vm.managerDetail = res.data.manager;
            vm.roleID = vm.managerDetail.roleID;
        })
    }

    vm.saveChange = saveChange;
    function saveChange() {
        vm.managerDetail.roleID = vm.roleID;
        return (vm.id ? getData.managerDetail(vm.id, vm.managerDetail) : getData.managerAdd(vm.managerDetail)).then(function (res) {
            alert(res.message);
            res.code === 0 ? $state.go('field.manager') : ''
        });
    }
}


//////////////////////////密码修改
angular.module('admin')
    .controller('pwdController', pwdController);
//pwd
pwdController.$inject = ['getData'];
function pwdController(getData) {
    var vm = this;
    vm.saveChange = saveChange;
    function saveChange() {
        getData.pwdChange(vm.password).then(function (res) {
            alert(res.message)
        })
    }
}

////////////////////////////module管理
angular.module('admin')
    .controller('moduleController', moduleController);
moduleController.$inject = ['getData', 'BackStageConstant', '$state'];
function moduleController(getData, BackStageConstant, $state) {
    var vm = this;
    vm.module = true;
    var params = {page: 1, size: 10};
    vm.templateUrl = 'Pages/template/module.html';
    vm.tabelTitle = BackStageConstant.moduleTitle;
    vm.pageChange = moduleListDetail;

    vm.add = function () {
        $state.go('field.moduleDetail')
    };
    moduleListDetail();

    //获取全部模块信息
    function moduleListDetail() {
        params.page = vm.currentPage;
        //获取所有模块ID
        getData.moduleDetail(params, 'GET', '').then(function (res) {
            vm.totalItems = res.data.total;
            //所有id对应信息
            getData.moduleMultiDetail(res.data.ids).then(function (res) {
                vm.dataList = res.data.moduleList;
            })
        })
    }

    //给指令调用
    vm.DataFn = DataFn;
    function DataFn() {
        return {
            del: function (id) {
                return getData.moduleDetail('', 'DELETE', id)
            },
            getModuleList: function () {
                moduleListDetail()
            }
        }
    }
}


//////////////////////////////////////module编辑
angular.module('admin')
    .controller('moduleEditController', moduleEditController);
//
moduleEditController.$inject = ['getData', 'paramster', '$state'];
function moduleEditController(getData, paramster, $state) {
    var vm = this;
    var id = paramster.get('id');
    id ? moduleEdit() : vm.saveChange = moduleAdd;
    //编辑模块
    function moduleEdit() {
        getData.moduleDetail('', 'GET', id).then(function (res) {
            vm.module = res.data.module;
        });
        vm.saveChange = saveChange;
    }

    //保存修改
    function saveChange() {
        getData.moduleDetail(vm.module, 'PUT', id).then(function (res) {
            (res.code === 0 ? $state.go('field.module') : '').then(function () {
                alert(res.message)
            })
        })
    }

    //添加新模块
    function moduleAdd() {
        getData.moduleDetail(vm.module, 'POST').then(function (res) {
            res.code === 0 ? $state.go('field.module') : alert(res.message);

        });
    }
}


















