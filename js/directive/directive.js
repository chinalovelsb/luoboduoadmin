/**
 * Created by Master on 2017/1/20.
 */
"use strict";
angular.module('admin')
//后台所有表格
    .directive('listTable', function (getData, $filter, $state) {
        return {
            restrict: 'E',
            templateUrl: 'Pages/template/table.html',
            scope: {
                templateUrl: '=',//表格内容部分模板
                title: '=tableTitle',//表格表头部分
                listData: '=',//要展示的数据列表
                page: '=',//当前页码，用于模拟框确认后请求数据
                control: '&'//数据操作函数
            },
            controller: function ($scope) {

            },
            replace: 'true',
            link: function (scope, ele, attrs) {
                scope.Num = attrs.oNum || 1;//可限制单元格宽度，防止宽度变化过大跳动


                //需要确认的操作，选择对象传入，模拟框执行确认操作用
                scope.chioce = chioce;
                function chioce(obj, type) {
                    scope.choose = obj;
                    $('.btn-primary').removeAttr('disabled');
                    $('.btn-primary').css('display', 'inline-block');

                    //公司0、1：改状态，2：删除, 3:编辑
                    //4 职位该状态 5删除
                    //6  article状态 7删除
                    //8 账号删除
                    switch (type) {
                        case 0:
                            scope.fn = 'status';
                            scope.n = type;
                            $('.modal-body').html("<p>" + $filter('FreezedChange')(scope.choose) + "后 " + scope.choose.name + " 下的信息将" + (scope.choose.freezed ? '可继续使用' : '不可使用') + "</p><br><p>是否执行" + $filter('FreezedChange')(scope.choose) + "操作</p>");
                            break;
                        case 1:

                            $('.modal-body').html("<p>" + $filter('ApprovedChange')(scope.choose) + "后 " + scope.choose.name + " 将" + (scope.choose.approved ? '不再标记为推荐公司' : '被标记为推荐公司') + "</p><br><p>是否执行" + $filter('ApprovedChange')(scope.choose) + "操作</p>");
                            scope.fn = 'status';
                            scope.n = type;
                            break;
                        //删除
                        case 2:
                            scope.fn = 'del';
                            scope.n = '';
                            $('.modal-body').html("<p>删除后" + scope.choose.name + "的信息将被移除</p><br><p>是否执行删除操作？</p>");
                            break;
                        case 3:
                            $state.go('field.companyDetail', {'id': obj.id});
                            break;


                        //职位
                        case 4:
                            scope.fn = 'proStatus';
                            $('.modal-body').html("<p>" + $filter('changeStatus')(scope.choose) + "后 " + scope.choose.companyName + " 的 " + scope.choose.name + " 职位信息将" + (scope.choose.status ? '不再' : '') + "在前台展示</p><br><p>是否执行" + $filter('changeStatus')(scope.choose) + "操作？</p>")
                            break;
                        case 5:
                            scope.fn = 'prodel';
                            scope.n = '';
                            $('.modal-body').html("<p>删除后" + scope.choose.name + "的信息将无法使用及还原</p><br><p>是否执行删除操作？</p>");
                            break;

                        //article上下线
                        case 6:
                            scope.fn = 'articleStatus';
                            scope.n = '';
                            $('.modal-body').html("<p>" + $filter('ArChangeStatus')(scope.choose) + "后图片 " + scope.choose.title + " 将" + (scope.choose.status === 1 ? '' : '不再') + "在前台进行展示</p><br><p>是否执行" + $filter('ArChangeStatus')(scope.choose) + "操作？</p>")
                            break;
                        case 7:
                            scope.fn = 'Ardel';
                            scope.n = '';
                            $('.modal-body').html("<p>删除后" + scope.choose.title + " 图将直接下架并在本地删除</p><br><p>是否执行删除操作？</p>");
                            break;
                        case 8:
                            scope.fn = 'manager';
                            scope.n = '';
                            $('.modal-body').html("<p>删除后将删除所有关于账户" + scope.choose.name + " 的相关数据</p><br><p>是否执行删除操作？</p>");
                            break;
                        case 9:
                            scope.fn = 'module';
                            scope.n = '';
                            $('.modal-body').html("<p>删除这个模块后将不能使用该模块功能</p><br><p>是否执行删除操作？</p>");
                            break;
                        case 10:
                            scope.fn = 'role';
                            scope.n = '';
                            $('.modal-body').html("<p>删除后将删除所有关于该用户的及其账号的信息</p><br><p>是否执行删除操作？</p>");
                            break;
                    }
                }

                //模拟框文字内容及执行函数
                scope.submitData = Change;
                function Change(fn, type) {
                    $('.btn-primary').attr('disabled', 'true');
                    switch (fn) {
                        //公司部分
                        //改状态 type:状态类型
                        case 'status':
                            if (type === 0) {
                                params = {id: scope.choose.id, type: type, status: scope.choose.freezed ? 0 : 1};
                            } else {
                                params = {id: scope.choose.id, type: type, status: scope.choose.approved ? 0 : 1};
                            }

                            scope.control().statusChange(params).then(function (res) {
                                if (res.code === 0) {
                                    $('.modal-body').text('修改成功');
                                    $('.btn-primary').css('display', 'none');
                                    scope.control().getCompanyList({page: scope.page});
                                }
                            });
                            break;
                        //删除
                        case 'del':
                            scope.control().del(scope.choose.id).then(function (res) {
                                if (res.code === 0) {
                                    $('.modal-body').text('删除成功');
                                    $('.btn-primary').css('display', 'none');
                                    scope.control().getCompanyList({page: scope.page});
                                }
                            });
                            break;

                        //职位部分
                        //改状态
                        case 'proStatus':
                            var params = {id: scope.choose.id, status: scope.choose.status ? 0 : 1}
                            scope.control().statusChange(params).then(function (res) {
                                if (res.code === 0) {
                                    $('.modal-body').text('修改成功');
                                    $('.btn-primary').css('display', 'none');
                                    scope.control().getProfessionList({page: scope.page});
                                } else {
                                    $('.modal-body').text('如要上架职位，请先解冻职位所属的' + scope.choose.companyName + '公司');
                                    $('.btn-primary').css('display', 'none');
                                }
                            });
                            break;
                        case 'prodel':
                            scope.control().del(scope.choose.id).then(function (res) {
                                if (res.code === 0) {
                                    $('.modal-body').text('删除成功');
                                    $('.btn-primary').css('display', 'none');
                                    scope.control().getProfessionList({page: scope.page});
                                }
                            });
                            break;

                        //article操作
                        case 'articleStatus':
                            var params = {id: scope.choose.id, status: scope.choose.status === 2 ? 1 : 2}
                            scope.control().statusChange(params).then(function (res) {
                                if (res.code === 0) {
                                    $('.modal-body').text('修改成功');
                                    $('.btn-primary').css('display', 'none');
                                    scope.control().getarticleList({page: scope.page});
                                }
                            });
                            break;
                        case 'Ardel':
                            scope.control().del(scope.choose.id).then(function (res) {
                                if (res.code === 0) {
                                    $('.modal-body').text('删除成功');
                                    $('.btn-primary').css('display', 'none');
                                    scope.control().getarticleList({page: scope.page});
                                }
                            });
                            break;
                        case 'manager':
                            scope.control().del(scope.choose.id).then(function (res) {
                                if (res.code === 0) {
                                    $('.modal-body').text('删除成功');
                                    $('.btn-primary').css('display', 'none');
                                    scope.control().getmanagerList({page: scope.page});
                                }
                            });
                            break;
                        case 'module':
                            scope.control().del(scope.choose.id).then(function (res) {
                                if (res.code === 0) {
                                    $('.modal-body').text('删除成功');
                                    $('.btn-primary').css('display', 'none');
                                    scope.control().getModuleList({page: scope.page});
                                }
                            });
                            break;
                        case 'role':
                            scope.control().del(scope.choose.id).then(function (res) {
                                if (res.code === 0) {
                                    $('.modal-body').text('删除成功');
                                    $('.btn-primary').css('display', 'none');
                                    scope.control().getRoleList({page: scope.page});
                                }
                            });
                            break;

                    }

                }

            }

        }
    })
    //权限控制
    .directive('permissions', function (LocalStorage, $location, $state) {
        return {

            restrict: 'A',
            link: function (scope, ele, attrs, ctl) {
                var permissionCurrent = [];
                scope.permissions = LocalStorage.get('permissions');
                scope.module = LocalStorage.get('module');

                angular.forEach(scope.module, function (data) {
                    data.url === $state.current.name ? permissionCurrent = scope.permissions[data.id] : ''
                })
                //删除
                scope.del = inArr('delete');
                //编辑修改
                scope.edit = inArr('update');
                //添加
                scope.create = inArr('create');

                // console.log(permissionCurrent)
                //权限判断
                function inArr(n) {
                    return permissionCurrent.indexOf(n) < 0 ? false : true;
                }
            }
        }
    })

    //下拉菜单
    .directive('picker', function () {
        return {
            restrict: 'E',
            templateUrl: 'Pages/template/myOptions.html',
            scope: {
                options: '=',//传入数据
                selectedValue: '=ngModel',//输出当前选择值
                selectName: '@',//下拉选项名label
                optionClass: '@',//样式
                formName: '@',//表单名字
                selectedList: '='//输出列表时使用 如标签
            },
            replace: true,
            link: function (scope, ele, attrs) {
                scope.selectedValue = null;
                attrs.requiredNo ? scope.required = false : scope.required = true;//是否必填
                scope.removeItem = remove;//删除标签

                function remove(idx) {
                    scope.selectedList.splice(idx, 1)
                }

                if (scope.selectName == '*认证状态' || scope.selectName === '状态') {
                    scope.selectedValue = 0
                }
                if (scope.selectName == '*公司行业') {
                    scope.show = true;
                    scope.selectedList = [];
                    var i = 0;
                    //标签添加
                    scope.$watch('selectedValue', function (n) {
                        if (n !== null) {
                            var has = true;//判断重复
                            angular.forEach(scope.selectedList, function (data) {
                                if (data.industry === scope.selectedValue) {
                                    has = false
                                }
                            });
                            if (has)
                                scope.selectedList.push({'industry': n})
                        }
                    });

                    scope.text = '展开';
                    scope.change = function () {
                        i % 2 ? scope.text = '收起' : scope.text = '展开';
                        i++
                    };
                }
            }
        }
    })





    //三级联动
    .directive('linkage', function (LINKAGE, $filter) {
        return {
            templateUrl: 'Pages/template/linkage.html',
            restrict: 'E',
            scope: {
                pro: '=',//省
                city: '=',//市
                county: '=',//区县
                class: '@',
                formName: '@',
                labelName: '@'
            },
            replace: 'true',
            link: function (scope) {
                //初始化
                scope.PROVINCE = LINKAGE.PROVINCE;
                scope.CITY = [{CityID: null, CityName: '不限'}];
                scope.COUNTY = [{Id: null, countyName: '不限'}];
                scope.pro = scope.city = scope.county = null;
                //根据选择过滤
                scope.$watch('pro', function (n, o, scope) {
                    scope.CITY = $filter('FilterCity')(scope.pro);
                    n ? scope.pro = +n : ''
                });
                scope.$watch('city', function (n, o, scope) {
                    scope.COUNTY = $filter('FilterCounty')(scope.city);
                    n ? scope.city = +n : ''
                });
                scope.$watch('county', function (n, o, scope) {
                    n ? scope.county = +n : ''
                })
            }
        }
    })




    //上传
    .directive('upLoader', function (FileUploader) {
        return {
            restrict: 'E',
            templateUrl: 'Pages/template/upload.html',
            scope: {
                logoUrl: '=ngModel',//图片上传后地址
                id: '@',
                tabName: '@'
            },
            replace: 'true',
            link: function (scope, ele, attrs) {
                scope.class = attrs.class;
                scope.labelClass = attrs.labelClass;
                scope.uploader = new FileUploader({//实例化
                    url: '/lbd-admin/a/u/img/test',
                    queueLimit: 1
                });
                scope.clearItem = function () {//清空队列
                    scope.uploader.clearQueue()
                };
                scope.getUrl = function (files) {
                    scope.fileList = files;
                    scope.imgURL = window.URL.createObjectURL(scope.fileList[0]);//考虑性能用后清除
                };
                scope.uploader.onSuccessItem = function (item, response) {//上传成功返回地址
                    scope.logoUrl = response.data.url
                }
            }
        }
    })



    //标签
    .directive('tag', function () {
        return {
            restrict: 'E',
            templateUrl: 'Pages/template/tag.html',
            replace: 'true',
            scope: {
                tagList: '='
            },
            link: function (scope) {
                scope.tagList = [];
                scope.add = add;
                scope.removeItem = remove;
                function add() {
                    var tag = {'tag': scope.tag};
                    var _has = false;
                    angular.forEach(scope.tagList, function (data) {
                        if (data.tag === scope.tag) {
                            _has = true
                        }
                    });
                    _has || !scope.tag ? '' : scope.tagList.push(tag);
                }

                function remove(n) {
                    scope.tagList.splice(n, 1)
                }
            }
        }
    })



    //分页
    .directive('paging', function () {
        return {
            restrict: 'E',
            templateUrl: 'Pages/template/paging.html',
            scope: {
                totalItems: '=',
                currentPage: '=',
                pageChange: '&'
            },
            replace: 'true',
            link: function (scope, ele, attrs) {
                //页数按钮数量 每页显示条目
                scope.maxSize = attrs.maxSize;
                scope.itemsPerPage = attrs.itemsPerPage;
                //当前页数变化执行
                scope.$watch('currentPage', function (n) {
                    n ? scope.pageChange() : ''
                });
                //跳页
                scope.setPage = function () {
                    scope.pageNo <= 0 ? scope.currentPage = scope.pageNo = 1 : '';
                    scope.pageNo > scope.numPages ? scope.currentPage = scope.pageNo = scope.numPages : scope.currentPage = scope.pageNo;
                }
            }
        }
    })



    //职业二级联动
    .directive('proType', function (ProfessionConstant, $filter) {
        return {
            restrict: 'E',
            templateUrl: 'Pages/template/proType.html',
            scope: {
                category: '=',
                subCategory: '='
            },
            replace: 'true',
            link: function (scope, ele, attrs) {
                scope.CATEGORY = ProfessionConstant.category;
                scope.category = scope.subCategory = null;
                scope.class = attrs.class;
                scope.$watch('category', function (n) {
                    scope.SUBCATEGORY = $filter('proType')(scope.category);
                    n ? scope.pro = +n : ''
                });
                scope.optionClass = attrs.optionClass;
            }
        }
    })



    //时间选择
    .directive('timePicker', function () {
        return {
            restrict: 'E',
            templateUrl: 'Pages/template/TimePicker.html',
            scope: {
                startAt: '=',
                endAt: '=',
                clear: '='
            },
            replace: 'true',
            link: function (scope, ele, attrs) {
                var today = new Date();
                scope.labelName = attrs.labelName;
                scope.class = attrs.class;
                //打开关闭选择器
                scope.openSt = function () {
                    scope.openedStart = true
                };
                scope.openEnd = function () {
                    scope.openedEnd = true
                };
                //选择器配置
                scope.dateOptions = {
                    maxDate: new Date(today)
                };
                //输出时间戳
                scope.$watch('clear', function () {
                    scope.start = scope.end = null;
                });

                scope.$watch('start', function (n) {
                    n ? scope.startAt = scope.start.valueOf() : '';
                    scope.dateOptions2 = {
                        minDate: new Date(scope.startAt)
                    }
                });
                scope.$watch('end', function (n) {
                    n ? scope.endAt = scope.end.valueOf() : ''
                })
            }
        }
    })

    //复选框
    .directive('checkedbox', function (duplicateRemoval) {
        return {
            restrict: 'E',
            templateUrl: 'Pages/template/checkbox.html',
            scope: {
                childNodeTrue: '=',
                selecteAll: '=',
                selecteValue: '=ngModel',
                itName: '=',
                moduleChecked: '=',
                isChecked: '='
            },
            replace: 'true',
            link: function (scope, ele, attrs) {

                scope.selecteValue = [];

                //全选
                scope.$watch('selecteAll', function (n) {
                    /* scope.moduleChecked=n?n:false*/
                    scope.childNodeTrue = n ? n : false;

                });
                //大模块全选
                scope.$watch('moduleChecked', function (n) {

                    scope.childNodeTrue = n ? n : false;

                })
                //模塊子菜單全選
                scope.$watch('childNodeTrue', function (n) {
                    scope.selecteValue = n ? ['create', 'update', 'delete', 'sort'] : [];

                })

                //检查数组内是否有元素
                scope.check = function () {
                    var stop = false;
                    angular.forEach(scope.selecteValue, function (data) {
                        if (!stop) {
                            scope.isChecked = data ? stop = true : false;
                        }
                    })
                }

            }
        }
    })
