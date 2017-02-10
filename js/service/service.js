/**
 * Created by Master on 2017/1/20.
 */
"use strict";
var app = angular.module('admin')
    .factory('getData', getData);
getData.$inject = ['$http', 'adminApi', 'requestService', 'transformParams'];
function getData($http, adminApi, requestService, transformParams) {
    return {
        //登录
        login: function (params) {
            return $http({
                url: adminApi.login,
                method: 'POST',
                data: $.param(params),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .then(function (res) {
                    if (res.status === 200) {
                        return res.data
                    }

                })
        },
        logout: function () {
            return $http.post(adminApi.logout)
                .then(function (res) {
                    return res.data
                })
        },

        //公司列表
        companylist: function (params) {
            return $http.get(adminApi.companyList, {params: params})
                .then(function (res) {
                    return res.data
                })
        },
        //公司详情
        companyDetail: function (id) {
            return $http.get(adminApi.companyDetail + id)
                .then(function (res) {
                    if (res.status == 200) {
                        return res.data
                    }
                })
        },
        //公司状态
        companyStatus: function (params) {
            return $http({
                url: adminApi.companyStatus,
                method: 'PUT',
                params: params
            })
                .then(function (res) {
                    if (res.status === 200) {
                        return res.data
                    }
                })
        },
        //修改公司
        companyEdit: function (id, params) {
            return $http({
                url: adminApi.companyEdit + '/' + id,
                method: 'PUT',
                data: params
            })
                .then(function (res) {
                    return res.data
                })
        },
        //添加公司
        companyAdd: function (params) {
            return $http({
                url: adminApi.companyEdit,
                method: 'POST',
                data: params

            })
                .then(function (res) {
                    return res.data
                })
        },
        //删除公司
        companyDel: function (id) {
            return $http({
                url: adminApi.companyEdit + '/' + id,
                method: 'DELETE'
            })
                .then(function (res) {
                    return res.data
                })
        },


        //职位列表
        professionList: function (params) {
            return $http.get(adminApi.professionList, {params: params}).then(function (res) {
                return res.data
            })
        },
        //职位详情
        professionDetail: function (id) {
            return $http.get(adminApi.professionDetail + id)
                .then(function (res) {
                    if (res.status == 200) {
                        return res.data
                    }
                })
        },
        //职位状态
        professionStatus: function (params) {
            return $http({
                url: adminApi.professionStatus,
                method: 'PUT',
                params: params
            })
                .then(function (res) {
                    if (res.status === 200) {
                        return res.data
                    }
                })
        },
        //修改职位
        professionEdit: function (id, params) {
            return $http({
                url: adminApi.professionEdit + '/' + id,
                method: 'PUT',
                data: params
            })
                .then(function (res) {
                    return res.data
                })
        },
        //添加职位
        professionAdd: function (params) {
            return $http({
                url: adminApi.professionEdit,
                method: 'POST',
                data: params

            })
                .then(function (res) {
                    return res.data
                })
        },
        //删除职位
        professionDel: function (id) {
            return $http({
                url: adminApi.professionEdit + '/' + id,
                method: 'DELETE'
            })
                .then(function (res) {
                    return res.data
                })
        },


        //Article列表
        articleList: function (params) {
            return $http.get(adminApi.articleList, {params: params})
                .then(function (res) {
                    return res.data
                })
        },
        //Article详情
        articleDetail: function (id) {
            return $http.get(adminApi.articleDetail + id)
                .then(function (res) {
                    if (res.status == 200) {
                        return res.data
                    }
                })
        },
        //Article状态

        articleStatus: /*   function(params){
         return  requestService(adminApi.articleStatus,'PUT',params)
         }*/

            function (params) {
                return $http({
                    url: adminApi.articleStatus,
                    method: 'PUT',
                    params: params
                })
                    .then(function (res) {
                        if (res.status === 200) {
                            return res.data
                        }
                    })
            },
        //修改Article
        articleEdit: function (id, params) {
            return $http({
                url: adminApi.articleEdit + '/' + id,
                method: 'PUT',
                data: $.param(params),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .then(function (res) {
                    return res.data
                })
        },
        //添加Article
        articleAdd: function (params) {
            /*      return  requestService(adminApi.articleDetail,'POST',params)*/
            return $http({
                url: adminApi.articleEdit,
                method: 'POST',
                data: $.param(params),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}

            })
                .then(function (res) {
                    return res.data
                })
        },
        //删除Article
        articleDel: function (id) {
            return $http({
                url: adminApi.articleEdit + '/' + id,
                method: 'DELETE'
            })
                .then(function (res) {
                    return res.data
                })
        },


        //获取所有基本账号信息
        managerList: function (ids) {
            var data;
            //根据是否传入id执行查询列表or单个账号信息
            ids ? '' : ids = '';
            return $http.get(adminApi.managerList + ids)
                .then(function (res) {
                    return ids ? managerDetail() : managerMsgList();
                    function managerDetail() {
                        return res.data
                    }

                    function managerMsgList() {
                        data = transformParams('ids', res.data.data.ids);
                        return $http.get(adminApi.managerMsgList + data)
                            .then(function (res) {
                                return res.data
                            })
                    }

                })
        },
        //账号对应用户信息
        roleDetail: function (array) {
            var params = transformParams('ids', array, 'roleID');
            return $http.get(adminApi.roleDetailList + params)
                .then(function (res) {
                    return res.data
                })
        },

        //搜索
        managerSearch: function (id) {
            var params;
            return $http.get(adminApi.roleList(id) + '/manager')
                .then(function (res) {
                    params = transformParams('ids', res.data.data.ids);
                    return $http.get(adminApi.managerMsgList + params)
                        .then(function (res) {
                            return res.data.data
                        });
                });
        },
        //编辑
        managerDetail: function (id, params) {
            return $http({
                url: adminApi.managerList + id,
                method: 'PUT',
                data: $.param(params),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .then(function (res) {
                    return res.data
                })
        },
        managerAdd: function (params) {
            return $http({
                url: adminApi.managerList,
                method: 'POST',
                data: $.param(params),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .then(function (res) {
                    return res.data
                })
        },
        //删除
        managerDel: function (id) {
            return $http({
                url: adminApi.managerList + id,
                method: 'DELETE'
            })
                .then(function (res) {
                    return res.data
                })
        },

        //修改密码
        pwdChange: function (params) {
            return $http({
                url: adminApi.pwdChange,
                method: 'PUT',
                data: $.param(params),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                return res.data
            })

        },


        //role
        role: function (rid) {
            rid = rid || '';
            return $http.get(adminApi.roleList(rid)).then(function (res) {
                return res.data;
            })
        },
        rolePerssions: function (params, TYPE, id) {
            /* TYPE !== 'GET' ? params = $.param(params) : '';*/
            if (TYPE === 'PUT' || TYPE === 'POST' || TYPE === 'DELETE') {
                return $http({
                    url: adminApi.editRole(id),
                    method: TYPE,
                    data: params
                }).then(function (res) {
                    return res.data
                });
            } else {
                return $http.get(adminApi.moduleEdit(id), {params: params}).then(function (res) {
                    return res.data
                });

            }
        },
        //所有角色
        roleList: function (ids) {
            var data;
            return $http.get(adminApi.roleList()).then(function (res) {
                ids ? data = ids : data = transformParams('ids', res.data.data.ids);
                return $http.get(adminApi.roleDetailList + data).then(function (res) {
                    return res.data
                })
            })
        },


        //用户module模块
        moduleMultiDetail: function (ids) {

            angular.isArray(ids) ? ids = transformParams('ids', ids) : '';
            return $http.get(adminApi.moduleMultiDetail(ids)).then(function (res) {
                return res.data
            })


        },
        //全部模块

        //查询、添加、修改、删除
        moduleDetail: function (params, TYPE, id) {
            TYPE !== 'GET' ? params = $.param(params) : '';
            if (TYPE === 'PUT' || TYPE === 'POST' || TYPE === 'DELETE') {
                return $http({
                    url: adminApi.moduleEdit(id),
                    method: TYPE,
                    data: params,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function (res) {
                    return res.data
                });
            } else {
                return $http.get(adminApi.moduleEdit(id), {params: params}).then(function (res) {
                    return res.data
                });

            }
        }

    }


}

//取对象key值并返回key=value&key=value形式
app.factory('fetchObjectKey', function (transformParams) {
    return function (obj) {
        var arr = [];
        var key;
        angular.forEach(obj, function (data, key) {
            arr.push(key);
        });
        //拼接参数
        key = transformParams('ids', arr);
        return key;
    }
});
//建立模块节点信息
app.factory('buildNodeList', function () {
    return function (arr) {
        var parentNode = [];
        //父节点列表
        angular.forEach(arr, function (data) {
            data.parentID === 0 ? parentNode.push(data) : '';
        });
        //将子节点作为属性放入父节点对象
        angular.forEach(parentNode, function (parent) {
            parent.moduleList = [];
            angular.forEach(arr, function (child) {
                parent.id === child.parentID ? parent.moduleList.push(child) : '';
            });
        });
        return parentNode
    }

});
/*//////////////////////////////////////////*/
angular.module('admin')
    .factory('requestService', requestService);
function requestService($http) {
    return function (url, method, data) {
        return $http({
            url: url,
            method: method,
            params: data
            /*headers:{'Content-Type': 'application/x-www-form-urlencoded'}*/
        }).then(function (res) {
            return res.data
        })
    }
}
//////////////////////////////////////////
//拼接请求参数(转化为key=value&key=value的形式)
angular.module('admin')
    .factory('transformParams', transformParams);
function transformParams() {
    return function (name, arr, oName) {
        var array = [];
        angular.forEach(arr, function (data) {
            return data[oName] ? array.push(name + '=' + data[oName]) : array.push(name + '=' + data);
        });
        return array.join('&');
    }
}


//数据临时存储
angular.module('admin')
    .factory('dataService', dataService);
function dataService() {
    var saveData = {};

    function set(data) {
        saveData = data
    }

    function get() {
        return saveData
    }

    return {
        set: set,
        get: get
    }
}

//清除
angular.module('admin')
    .factory('clean', clean);
function clean() {
    return function (obj) {
        for (var x in obj) {
            obj[x] = null
        }
        return obj
    }
}
//对象删除空属性
angular.module('admin')
    .factory('objClean', objClean);
function objClean() {
    return function (obj) {
        for (var x in obj) {
            !!obj[x] ? '' : delete obj[x];
        }
        return obj
    }
}
//本地存储
app.factory('LocalStorage', function () {
    return {
        remove: function (key) {
            return localStorage.removeItem(key)
        },
        set: function (key, value) {
            return localStorage.setItem(key, JSON.stringify(value));
        },
        get: function (key) {
            return JSON.parse(localStorage.getItem(key))
        }
    }
});
//url参数操作
app.factory('paramster', function ($location) {
    function set(params) {
        $location.search(params)
    }

    function get(param) {
        return param ? $location.search()[param] : $location.search()
    }

    return {
        set: set,
        get: get
    }
});
//去重
app.factory('duplicateRemoval', function () {
    return function (n, arr) {
        var inArr = false;
        arr[0] === null ? arr = [] : '';
        angular.forEach(arr, function (data, idx) {
            data === n ? remove(idx) : '';
        });
        function remove(idx) {
            arr.splice(idx, 1);
            inArr = true;
        }

        inArr ? '' : arr.push(n);
        return arr
    }
});

//将请求返回的权限对象设置元素位置，返回展示
angular.module('admin')
    .factory('permissionValue', function () {

        return function (tpls, obj) {//tpls：初始化时的perssions对象 obj：返回的perssions对象
            angular.forEach(obj, function (data, key) {
                inArr('update', data, 1);//设置元素位置
                inArr('delete', data, 2);//设置元素位置
                inArr('sort', data, 3);//设置元素位置
                /* obj[key]=[]*/
                tpls[key] = obj[key]
            });
            return tpls
        };
        //对象中存在对应的值则按照设置的位置设置这个值
        function inArr(n, arr, i) {
            var x = arr.indexOf(n);
            if (x >= 0) {
                return arr.indexOf(n) === i ? '' : (arr[x] = null, arr[+i] = n)
            }

        }
    });

//提交权限更改时，返回格式化权限对象
angular.module('admin')
    .factory('formatPermissions', function (LocalStorage) {

        var module = LocalStorage.get('module');

        return function (permisstion) {
            var permissionObj = {};
            //删除未选模块
            angular.forEach(permisstion, function (data, key) {
                data.length ? getParentID(key) : delete permisstion[key]
            });
            //删除该模块未选择权限，只保留所选权限
            function getParentID(key) {
                var stop = false;
                for (var i = permisstion[key].length; 0 < i; i--) {
                    permisstion[key][i - 1] ? '' : permisstion[key].splice(i - 1, 1)
                }
                //添加已选择项目的父元素，将其设置为[],否则无法加载后续子模块；
                angular.forEach(module, function (item) {
                    if (!stop) {
                        item.id == key ? (permissionObj[item.parentID] = [], permissionObj[key] = permisstion[key], stop = true) : '';
                    }
                })
            }
            return permissionObj
        }
    });
