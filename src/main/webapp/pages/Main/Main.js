Application.$controller("MainPageController", ["$scope", function($scope) {
    "use strict";

    /* perform any action on widgets/variables within this block */
    $scope.onPageReady = function() {
        $scope.Widgets.OrdersContainer.show = false;
        $scope.Widgets.OrderStatusContainer.show = false;
        $scope.Widgets.OrderLocationContainer.show = false;
        $scope.Widgets.OrderDetailContainer.show = false;
        $scope.Widgets.OrdersByProductContainer.show = false;
        $scope.Widgets.OrdersByStoreContainer.show = false;
        $scope.Widgets.OrdersByUserContainer.show = false;
        $scope.Widgets.OrdersByProductAndStoreContainer.show = false;
        $scope.Widgets.OEByStoreContainer.show = false;
        $scope.Widgets.OEByProductAndStoreContainer.show = false;
    };

    $scope.askWatsonWatsonresponse = function($isolateScope) {
        var data = $isolateScope.watsonresponse;
        var output_text = _.get(data, 'output.text');

        /* check for a message from chat */
        if (typeof output_text != 'undefined') {
            console.log('output.text = ', output_text[0]);
            /* if order by store, show list of orders */
            if (output_text[0].startsWith('(--OMS_GET_ORDERS_BY_STORE--)')) {
                var input = _.get(data, 'input');
                output_text[0] = 'I will find you a list of orders by store number ' + input.text;
                $scope.Variables.store.dataSet = {
                    "dataValue": input.text
                };
                /* if order by user, show list of orders by named user */
            } else if (output_text[0].startsWith('(--OMS_GET_ORDERS_USER--)')) {
                var input = _.get(data, 'input');
                output_text[0] = 'I will find a list of orders by user ' + input.text;
                $scope.Variables.user.dataSet = {
                    "dataValue": input.text
                };
            } else if (output_text[0].startsWith('(--OMS_GET_ORDER_STATUS--)')) {
                var input = _.get(data, 'input');
                output_text[0] = 'I will find you the status of order number ' + input.text;
                $scope.Variables.order_for_status.dataSet = {
                    "dataValue": input.text
                };
                $scope.Variables.order_for_location.dataSet = {
                    "dataValue": input.text
                };

            } else if (output_text[0].startsWith('(--OMS_GET_ORDER_DETAIL--)')) {
                var input = _.get(data, 'input');
                output_text[0] = 'I will find you the line items from order number ' + input.text;
                $scope.Variables.order_for_detail.dataSet = {
                    "dataValue": input.text
                };
            } else if (output_text[0].startsWith('(--OMS_GET_ORDERS--)')) {
                output_text[0] = 'Here is a list of all recent orders'
                var counter = $scope.Variables.forceOrdersInvoke.dataSet.dataValue;
                counter += 1;
                $scope.Variables.forceOrdersInvoke.dataSet = {
                    "dataValue": counter
                };
            } else if (output_text[0].startsWith('(--OMS_GET_ORDERS_BY_PRODUCT--)')) {
                var context = _.get(data, 'context');

                console.log('context: ', context.product);
                output_text[0] = 'I will find you the orders with ' + context.product;
                $scope.Variables.product.dataSet = {
                    "dataValue": context.product
                };
            } else if (output_text[0].startsWith('(--OMS_GET_ORDERS_BY_PRODUCT_AND_STORE--)')) {
                var input = _.get(data, 'input');
                var context = _.get(data, 'context');

                console.log('input: ', input);
                console.log('context: ', context.product);
                output_text[0] = 'I will find you the orders with ' + context.product + ' for store number ' + input.text;
                $scope.Variables.product_for_product_and_store.dataSet = {
                    "dataValue": context.product
                };
                $scope.Variables.store_for_product_and_store.dataSet = {
                    "dataValue": input.text
                };
            } else if (output_text[0].startsWith('(--OMS_GET_EXCEPTIONS_BY_STORE--)')) {
                var input = _.get(data, 'input');
                var context = _.get(data, 'context');

                output_text[0] = 'I will find you the order exceptions for store number ' + context.store;
                $scope.Variables.store_for_exceptions_by_store.dataSet = {
                    "dataValue": context.store
                };

            } else if (output_text[0].startsWith('(--OMS_GET_EXCEPTIONS_BY_PRODUCT_AND_STORE--)')) {
                var input = _.get(data, 'input');
                var context = _.get(data, 'context');
                var entities = _.get(data, 'entities');
                var entity_value;

                entities.forEach(function(entity, index) {
                    if (entity.entity == 'Products') {
                        entity_value = entity.value;
                    }
                });
                console.log('input: ', input);
                console.log('context: ', context.store);
                output_text[0] = 'I will find you the order exceptions for ' + entity_value + ' for store number ' + context.store;
                $scope.Variables.product_for_exceptions_by_product_and_store.dataSet = {
                    "dataValue": entity_value
                };
                $scope.Variables.store_for_exceptions_by_product_and_store.dataSet = {
                    "dataValue": context.store
                };

            };
        };
    };

    $scope.svcOrdersByProductonResult = function(variable, data) {
        if (data.results.PRODUCT != '') {
            $scope.Widgets.OrdersContainer.show = false;
            $scope.Widgets.OrderStatusContainer.show = false;
            $scope.Widgets.OrderLocationContainer.show = false;
            $scope.Widgets.OrderDetailContainer.show = false;
            $scope.Widgets.OrdersByProductContainer.show = true;
            $scope.Widgets.OrdersByStoreContainer.show = false;
            $scope.Widgets.OrdersByUserContainer.show = false;
            $scope.Widgets.OrdersByProductAndStoreContainer.show = false;
            $scope.Widgets.OEByStoreContainer.show = false;
            $scope.Widgets.OEByProductAndStoreContainer.show = false;
        };
    };

    $scope.svcOrderStatusonResult = function(variable, data) {
        if (data.results.ORDER_NBR != '') {
            $scope.Widgets.OrdersContainer.show = false;
            $scope.Widgets.OrderStatusContainer.show = true;
            $scope.Widgets.OrderLocationContainer.show = true;
            $scope.Widgets.OrderDetailContainer.show = false;
            $scope.Widgets.OrdersByProductContainer.show = false;
            $scope.Widgets.OrdersByStoreContainer.show = false;
            $scope.Widgets.OrdersByUserContainer.show = false;
            $scope.Widgets.OrdersByProductAndStoreContainer.show = false;
            $scope.Widgets.OEByStoreContainer.show = false;
            $scope.Widgets.OEByProductAndStoreContainer.show = false;

        };

    };

    $scope.svcOrderDetailonResult = function(variable, data) {
        /*
        if (data.results.ORDER_NBR != '') {
            $scope.Widgets.OrdersContainer.show = false;
            $scope.Widgets.OrderStatusContainer.show = false;
            $scope.Widgets.OrderLocationContainer.show = false;
            $scope.Widgets.OrderDetailContainer.show = true;
            $scope.Widgets.OrdersByProductContainer.show = false;
            $scope.Widgets.OrdersByStoreContainer.show = false;
            $scope.Widgets.OrdersByUserContainer.show = false;
            $scope.Widgets.OrdersByProductAndStoreContainer.show = false;
            $scope.Widgets.OEByStoreContainer.show = false;
            $scope.Widgets.OEByProductAndStoreContainer.show = false;
        };
        */
    };

    $scope.svcOrdersonResult = function(variable, data) {
        if ($scope.Variables.forceOrdersInvoke.dataSet.dataValue > 0) {
            $scope.Widgets.OrdersContainer.show = true;
            $scope.Widgets.OrderStatusContainer.show = false;
            $scope.Widgets.OrderLocationContainer.show = false;
            $scope.Widgets.OrderDetailContainer.show = false;
            $scope.Widgets.OrdersByProductContainer.show = false;
            $scope.Widgets.OrdersByStoreContainer.show = false;
            $scope.Widgets.OrdersByUserContainer.show = false;
            $scope.Widgets.OrdersByProductAndStoreContainer.show = false;
            $scope.Widgets.OEByStoreContainer.show = false;
            $scope.Widgets.OEByProductAndStoreContainer.show = false;
        };
    };

    $scope.svcOrdersByUseronResult = function(variable, data) {
        if (data.results.DW_CREATE_USER_ID != '') {
            $scope.Widgets.OrdersContainer.show = false;
            $scope.Widgets.OrderStatusContainer.show = false;
            $scope.Widgets.OrderLocationContainer.show = false;
            $scope.Widgets.OrderDetailContainer.show = false;
            $scope.Widgets.OrdersByProductContainer.show = false;
            $scope.Widgets.OrdersByStoreContainer.show = false;
            $scope.Widgets.OrdersByUserContainer.show = true;
            $scope.Widgets.OrdersByProductAndStoreContainer.show = false;
            $scope.Widgets.OEByStoreContainer.show = false;
            $scope.Widgets.OEByProductAndStoreContainer.show = false;
        };
    };

    $scope.svcOrdersByStoreonResult = function(variable, data) {
        if (data.results.DEST_FACILITY_ID != '') {
            $scope.Widgets.OrdersContainer.show = false;
            $scope.Widgets.OrderStatusContainer.show = false;
            $scope.Widgets.OrderLocationContainer.show = false;
            $scope.Widgets.OrderDetailContainer.show = false;
            $scope.Widgets.OrdersByProductContainer.show = false;
            $scope.Widgets.OrdersByStoreContainer.show = true;
            $scope.Widgets.OrdersByUserContainer.show = false;
            $scope.Widgets.OrdersByProductAndStoreContainer.show = false;
            $scope.Widgets.OEByStoreContainer.show = false;
            $scope.Widgets.OEByProductAndStoreContainer.show = false;
        };
    };

    $scope.svcOrdersByProductAndStoreonResult = function(variable, data) {
        $scope.Widgets.OrdersContainer.show = false;
        $scope.Widgets.OrderStatusContainer.show = false;
        $scope.Widgets.OrderLocationContainer.show = false;
        $scope.Widgets.OrderDetailContainer.show = false;
        $scope.Widgets.OrdersByProductContainer.show = false;
        $scope.Widgets.OrdersByStoreContainer.show = false;
        $scope.Widgets.OrdersByUserContainer.show = false;
        $scope.Widgets.OrdersByProductAndStoreContainer.show = true;
        $scope.Widgets.OEByStoreContainer.show = false;
        $scope.Widgets.OEByProductAndStoreContainer.show = false;
    };

    $scope.svcOrderExceptionsByStoreonResult = function(variable, data) {
        $scope.Widgets.OrdersContainer.show = false;
        $scope.Widgets.OrderStatusContainer.show = false;
        $scope.Widgets.OrderLocationContainer.show = false;
        $scope.Widgets.OrderDetailContainer.show = false;
        $scope.Widgets.OrdersByProductContainer.show = false;
        $scope.Widgets.OrdersByStoreContainer.show = false;
        $scope.Widgets.OrdersByUserContainer.show = false;
        $scope.Widgets.OrdersByProductAndStoreContainer.show = false;
        $scope.Widgets.OEByStoreContainer.show = true;
        $scope.Widgets.OEByProductAndStoreContainer.show = false;
    };

    $scope.svcOrderExceptionsByProductAndStoreonResult = function(variable, data) {
        $scope.Widgets.OrdersContainer.show = false;
        $scope.Widgets.OrderStatusContainer.show = false;
        $scope.Widgets.OrderLocationContainer.show = false;
        $scope.Widgets.OrderDetailContainer.show = false;
        $scope.Widgets.OrdersByProductContainer.show = false;
        $scope.Widgets.OrdersByStoreContainer.show = false;
        $scope.Widgets.OrdersByUserContainer.show = false;
        $scope.Widgets.OrdersByProductAndStoreContainer.show = false;
        $scope.Widgets.OEByStoreContainer.show = false;
        $scope.Widgets.OEByProductAndStoreContainer.show = true;
    };

    $scope.svcOrderLocationonResult = function(variable, data) {

    };


    $scope.grid1Click = function($event, $isolateScope, $rowData) {
        console.log('The row data with index: ', $rowData);
        $scope.Variables.order_for_detail.dataSet = {
            "dataValue": $rowData.ORDER_NBR
        };
        $scope.Widgets.OrderDetailContainer.show = true;
    };


    $scope.grid5Click = function($event, $isolateScope, $rowData) {
        console.log('The row data with index: ', $rowData);
        $scope.Variables.order_for_detail.dataSet = {
            "dataValue": $rowData.ORDER_NBR
        };
        $scope.Widgets.OrderDetailContainer.show = true;


    };


    $scope.grid4_1Click = function($event, $isolateScope, $rowData) {
        console.log('The row data with index: ', $rowData);
        $scope.Variables.order_for_detail.dataSet = {
            "dataValue": $rowData.ORDER_NBR
        };
        $scope.Widgets.OrderDetailContainer.show = true;
    };


    $scope.grid6Click = function($event, $isolateScope, $rowData) {
        console.log('The row data with index: ', $rowData);
        $scope.Variables.order_for_detail.dataSet = {
            "dataValue": $rowData.ORDER_NBR
        };
        $scope.Widgets.OrderDetailContainer.show = true;
    };


    $scope.grid7Click = function($event, $isolateScope, $rowData) {
        console.log('The row data with index: ', $rowData);
        $scope.Variables.order_for_detail.dataSet = {
            "dataValue": $rowData.ORDER_NBR
        };
        $scope.Widgets.OrderDetailContainer.show = true;
    };


    $scope.grid1Rowdblclick = function($event, $isolateScope, $rowData) {
        console.log('The order number selected is: ', $rowData.ORDER_NBR);
        $scope.Widgets.askWatson.send($rowData.ORDER_NBR.toString());
        $scope.Widgets.askWatson.enablechat();
    };


    $scope.grid5Rowdblclick = function($event, $isolateScope, $rowData) {
        console.log('The order number selected is: ', $rowData.ORDER_NBR);
        $scope.Widgets.askWatson.send($rowData.ORDER_NBR.toString());
        $scope.Widgets.askWatson.enablechat();
    };

}]);

Application.$controller("grid1Controller", ["$scope",
    function($scope) {
        "use strict";
        $scope.ctrlScope = $scope;
    }
]);

Application.$controller("grid3Controller", ["$scope",
    function($scope) {
        "use strict";
        $scope.ctrlScope = $scope;
    }
]);

Application.$controller("grid4Controller", ["$scope",
    function($scope) {
        "use strict";
        $scope.ctrlScope = $scope;
    }
]);

Application.$controller("grid4_1Controller", ["$scope",
    function($scope) {
        "use strict";
        $scope.ctrlScope = $scope;
    }
]);

Application.$controller("grid5Controller", ["$scope",
    function($scope) {
        "use strict";
        $scope.ctrlScope = $scope;

        $scope.customRowAction = function($event, $rowData) {
            console.log('The order number selected is: ', $rowData.ORDER_NBR);
            $scope.Widgets.askWatson.send($rowData.ORDER_NBR.toString());
            $scope.Widgets.askWatson.enablechat();
        };

    }
]);

Application.$controller("grid6Controller", ["$scope",
    function($scope) {
        "use strict";
        $scope.ctrlScope = $scope;
    }
]);

Application.$controller("grid7Controller", ["$scope",
    function($scope) {
        "use strict";
        $scope.ctrlScope = $scope;
    }
]);

Application.$controller("grid8Controller", ["$scope",
    function($scope) {
        "use strict";
        $scope.ctrlScope = $scope;
    }
]);

Application.$controller("grid9Controller", ["$scope",
    function($scope) {
        "use strict";
        $scope.ctrlScope = $scope;
    }
]);

Application.$controller("grid11Controller", ["$scope",
    function($scope) {
        "use strict";
        $scope.ctrlScope = $scope;
    }
]);