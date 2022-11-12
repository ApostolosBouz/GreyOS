/*
    GreyOS - Trinity (Version: 1.0)

    File name: trinity.js
    Description: This file contains the Trinity - System services management module.

    Coded by George Delaportas (G0D)
    Copyright © 2021 - 2022
    Open Software License (OSL 3.0)
*/

// Trinity
function trinity()
{
    var self = this;

    function utilities()
    {
        
    }

    this.set_service = function(func_name, func_args = [], commands)
    {
        new_bat.set_function(func_name, function(func_args) { commands; });
    };

    this.execute = function(func_name, func_args = [])
    {
        return new_bat.exec(func_name, func_args);
    };

    this.init = function()
    {
        new_bat.init();

        return true;
    };

    this.cosmos = function(cosmos_object)
    {
        if (utils_sys.validation.misc.is_undefined(cosmos_object))
            return false;

        cosmos = cosmos_object;

        dev_box = cosmos.hub.access('dev_box');

        new_bat = dev_box.get('bat');

        return true;
    };

    var is_service_active = false,
        cosmos = null,
        dev_box = null,
        new_bat = null,
        utils_sys = new vulcan(),
        utils_int = new utilities();
}
