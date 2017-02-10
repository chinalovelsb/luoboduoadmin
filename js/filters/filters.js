/**
 * Created by Master on 2017/1/8.
 */
"use strict";
angular.module('admin')
//城市
    .filter('city', function (LINKAGE) {
        var city;
        return function (responseData) {
            angular.forEach(LINKAGE.CITY, function (data) {
                if (responseData.city == data.CityID) {
                    return city = data.CityName
                }
            });
            return city
        }
    })
    //区县
    .filter('county', function (LINKAGE) {
        var county;
        return function (responseData) {
            angular.forEach(LINKAGE.COUNTY, function (data) {
                if (responseData.county == data.Id) {
                    return county = data.countyName
                }
            });
            return county
        }
    })

    //转时间
    /* .filter('timestamp', function () {
     return function (joinTime) {
     var date = new Date(joinTime).toLocaleDateString().replace(/\//g, "-");
     var t = new Date(joinTime).toTimeString().split(' ')[0].replace(/:/g, ' : ');
     return date + '　' + t;
     }
     })
     //选择日期+当前时间 时间戳
     .filter('timestamp2', function () {
     return function (joinTime) {
     var date =Date.parse(joinTime)/!*.toString().substring(0,7);*!/
     /!* var t=Date.parse(Date()).toString().substring(8);
     date=parseInt(date+t)*!/
     return date
     }
     })*/

    //薪资
    .filter('compensation', function (Salary) {
        var compensation;
        return function (responseData) {
            angular.forEach(Salary, function (data) {
                if (responseData.compensation == data.type) {
                    return compensation = data.compensation
                }
            });
            return compensation
        }
    })
    //公司类型
    .filter('industry', function (CompanyConstant) {
        return function (responseData) {
            var industry = [];
            angular.forEach(responseData, function (data) {
                var industryItem = data.name || data.type || data;
                angular.forEach(CompanyConstant.Industry, function (data) {
                    if (industryItem.name === data.type || industryItem === data.type || industryItem.industry === data.type) {
                        return industry.push(data.name)
                    }
                });
            });
            return industry
        }
    })
    //经验
    .filter('experience', function (experience) {
        var value;
        return function (obj) {
            angular.forEach(experience, function (item) {
                if (obj.experience == item.type) {
                    return value = item.name
                }
            });
            return value
        }
    })
    //学历
    .filter('education', function (education) {
        var value;
        return function (obj) {
            angular.forEach(education, function (item) {
                if (obj.education == item.type) {
                    return value = item.name
                }
            });
            return value
        }
    })
    //融资规模
    .filter('financingtype', function (financingtype) {
        var value;
        return function (obj) {
            angular.forEach(financingtype, function (item) {
                if (obj.financing == item.type) {
                    return value = item.name
                }
            });
            return value
        }
    })
    //认证状态
    .filter('Approved', function (Approved) {
        var result = '';
        return function (obj) {
            angular.forEach(Approved, function (data) {
                if (obj.approved == data.type) {
                    return result = data.name
                }
            });
            return result
        }
    })
    //改变认证状态
    .filter('ApprovedChange', function (Approved) {
        var result = '';
        return function (obj) {
            angular.forEach(Approved, function (data) {
                if (obj.approved == data.type) {
                    return result = '解除'
                } else {
                    return result = '认证'
                }
            });
            return result
        }
    })
    //冻结状态
    .filter('Freezed', function (Freezed) {
        var result = '';
        return function (obj) {
            angular.forEach(Freezed, function (data) {
                if (obj.freezed == data.type) {
                    return result = data.name
                }

            });
            return result
        }
    })
    //改变冻结状态
    .filter('FreezedChange', function (Freezed) {
        var result = '';
        return function (obj) {
            angular.forEach(Freezed, function (data) {
                if (obj.freezed == data.type) {
                    return result = '解冻'
                } else {
                    return result = '冻结'
                }

            });
            return result
        }
    })
    //联动
    .filter('FilterCity', function (LINKAGE) {
        return function (proID) {
            var city = [{"CityID": null, "CityName": "不限"}];
            angular.forEach(LINKAGE.CITY, function (data) {
                if (data.ProID == proID) {
                    city.push(data)
                }
            });
            return city;
        }
    })
    .filter('FilterCounty', function (LINKAGE) {
        return function (CityID) {
            var county = [{"Id": null, "countyName": "不限"}];
            angular.forEach(LINKAGE.COUNTY, function (data) {
                if (data.CityID == CityID) {
                    county.push(data)
                }
            });
            return county;
        }
    })
    .filter('Linkage', function (Site) {
        return function (city) {
            var county = [{"Id": null, "countyName": "不限"}];
            angular.forEach(Site.COUNTY, function (data) {
                if (city == data.CityID) {
                    county.push(data)
                }
            });
            return county;
        }
    })

    //职位上下架
    .filter('status', function (ProfessionConstant) {
        var result = '';
        return function (obj) {
            angular.forEach(ProfessionConstant.status, function (data) {
                if (obj.status == data.type) {
                    return result = data.name
                }

            });
            return result
        }
    })
    //上下架
    .filter('changeStatus', function (ProfessionConstant) {
        var result = '';
        return function (obj) {
            angular.forEach(ProfessionConstant.status, function (data) {
                if (obj.status == data.type) {
                    return result = '下架'
                } else {
                    return result = '上架'
                }

            });
            return result
        }
    })
    //职位类别
    .filter('category', function (ProfessionConstant) {
        var value;
        return function (obj) {
            var stop = false;
            angular.forEach(ProfessionConstant.category, function (item) {

                if (obj.category == item.type && !stop) {
                    stop = true;
                    return value = item.name;

                }
            });
            return value
        }
    })
    .filter('proType', function (ProfessionConstant) {
        return function (category) {
            var subcategory = [{type: null, name: '不限'}];
            if (category != null) {
                var stop = false;
                angular.forEach(ProfessionConstant.subCategory, function (data) {
                    if (data.type === category && !stop) {
                        subcategory = data.data;
                        stop = true
                    }
                });
            }
            return subcategory;
        }
    })

    /* .filter('Article',function () {
     var result='';
     return function (obj,constant) {
     angular.forEach(constant,function (data) {
     if (obj.type==data.type){
     return result = data.name
     }

     });
     return result
     }
     })*/
    //Article参数转文字
    .filter('Article', function (ArticleConstant) {
        var result = '';
        return function (obj, type) {
            angular.forEach(ArticleConstant[type], function (data) {
                if (obj[type] === data.type) {
                    return result = data.name
                }
            });
            return result
        }
    })
    //Article改变状态显示
    .filter('ArChangeStatus', function (ArticleConstant) {
        var result = '';
        return function (obj) {
            angular.forEach(ArticleConstant.status, function (data) {
                if (obj.status == data.type) {
                    return result = '下线'
                } else {
                    return result = '上线'
                }
            });
            return result
        }
    })
;
