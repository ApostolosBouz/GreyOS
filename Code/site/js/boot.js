/*
    GreyOS - Bootstrap facility (Version: 3.0)

    File name: boot.js
    Description: This file contains the bootstrap facility.

    Coded by George Delaportas (G0D)
    Copyright © 2013 - 2021
    Open Software License (OSL 3.0)
*/

// Run high quality, secure and verified code
"use strict";

// GreyOS - Bootstrap script
function boot_script()
{
    // GreyOS
    var greyos = new meta_os();

    // Initialize required OS infrastructure for this script
    var os_boot = greyos.boot.start();
    var os_loader = greyos.boot.loader();
    var os_environment = greyos.boot.environment();
    var os_hypervisor = greyos.system.hypervisor.console();
    var os_vm = greyos.system.hypervisor.vm();
    var os_keys = greyos.system.io.keyboard();
    var os_timers = greyos.system.timers();
    var os_utils = greyos.utilities.general();
    var os_benchmark = greyos.utilities.benchmark();
    var os_settings = greyos.settings();

    // Set global settings
    os_settings.set('boot_mode', 0);        // Boot modes: Normal (0) / Development (1)
    os_settings.set('theme', 'tomorrow');   // Themes: 'bubble_gum', 'tomorrow'
    os_settings.set('max_apps', 16);        // Maximum number of allowed active apps per session
    os_settings.set('apps_per_view', 18);   // Apps per stack bar view
    os_settings.set('stack_bars', 4);       // Number of stack bars

    // Initialization script
    var init_script = function()
    {
        // List of containers
        var containers_list = [matrix, dev_box, app_box, colony];

        // List of system services
        var sys_services = [swarm, hive, forest, ui_controls, dock, user_profile, eagle, 
                            tik_tok, trinity, octopus, parrot, owl, infinity, nature, chameleon];

        // List of development tools
        var dev_tools = [bee];

        // List of user applications
        var user_apps = [krator, coyote, radio_dude, cloud_edit, i_bassoon, i_quakejs, i_minecraft, i_webgl_preview];

        // Add a VM to the hypervisor
        os_hypervisor.add([os_vm]);

        // Attach containers to the VM
        os_vm.hub.attach(containers_list);

        /* ================= Populate containers ================= */

        // Matrix - System services container
        var matrix_container = os_vm.hub.access('matrix');

        // Put services in the container
        matrix_container.put(sys_services);

        //console.log(matrix_container.list());

        // Dev Box - Development tools container
        var dev_box_container = os_vm.hub.access('dev_box');

        // Add development tools in the container
        dev_box_container.add(dev_tools);

        //console.log(dev_box_container.list());

        // App Box - Integrated/User applications container
        var app_box_container = os_vm.hub.access('app_box');

        // Add user applications in the container
        app_box_container.add(user_apps);

        //console.log(app_box_container.list());

        // Colony - Bee keeper container
        var bees_container = os_vm.hub.access('colony');

        // Set maximum allowed active apps (bees) per session
        bees_container.max(os_settings.get('max_apps'));

        //console.log(bees_container.list());

        /* ======================================================= */

        function auth_verification()
        {
            var data = 'gate=auth&mode=status';
    
            ajax_factory(data, function()
                               {
                               	   load_desktop_ui();
                               },
                               function()
                               {
                                    load_login_ui();
                               },
                               function()
                               {
                                    // Nothing...
                               });

            return true;
        }

        function load_login_ui()
        {
            // Iniatilaze loading screen
            var load_screen = new loading_screen();

            // Show the loading screen while everything is loading
            load_screen.show();

            // Load basic services and UI infrastructure
            var new_trinity = matrix_container.get('trinity');
            var new_parrot = matrix_container.get('parrot');
            var new_chameleon = matrix_container.get('chameleon');
            var new_nature = matrix_container.get('nature');
            var new_swarm = matrix_container.get('swarm');

            // Initialize system monitoring service
            new_trinity.init();

            // Set the theme in use
            new_chameleon.set(os_settings.get('theme'));

            // Preload (cache) Bee theme for better graphics performance on load
            new_nature.theme(['bee']);
            new_nature.apply('new');

            // Apply desktop theme
            os_utils.graphics.apply_theme('/site/themes/' + new_chameleon.get(), new_chameleon.get());

            // Initialize only the sound service (no UI)
            new_parrot.init();

            // Initialize desktop module
            new_swarm.init('desktop', 47, 100, window.innerWidth - 70, window.innerHeight - 120);

            // Show login/register windows
            run_krator_app();

            // Hide the loading screen when all has been loaded (Give also a buffer time for delayed rendering)
            setTimeout(function()
            {
                // Play the splash screen sound
                new_parrot.play('sys', '/site/themes/' + new_chameleon.get() + '/sounds/splash.mp3');

                load_screen.hide();
            }, 3000);

            return true;
        }

        function run_krator_app()
        {
            var krator_app = app_box_container.get('krator');

            if (!krator_app.init(login_success_callback))
            {
                var msg_win = new msgbox();

                msg_win.init('desktop');
                msg_win.show('GreyOS', 'A system error occurred. Your system will be rebooted!', 
                function()
                {
                    var cc_reload = new f5();

                    cc_reload.init();
                });

                return false;
            }

            var krator_bee = krator_app.get_bee();

            matrix_container.get('swarm').bees.insert(krator_bee);

            krator_bee.show();

            return true;
        }

        function login_success_callback()
        {
            // Iniatilaze loading screen
            var load_screen = new loading_screen();

            // Show the loading screen while everything is loading
            load_screen.show();

            // Remove Krator theme
            matrix_container.get('nature').remove('krator');

            // Load the full dektop UI infrastructure
            matrix_container.get('ui_controls').init('action_icons');
            matrix_container.get('dock').init('favorite_apps');
            matrix_container.get('user_profile').init('user_profile');
            matrix_container.get('forest').init('desktop');
            matrix_container.get('hive').init('desktop', 47, window.innerHeight - 85, os_settings.get('apps_per_view'), os_settings.get('stack_bars'));
            matrix_container.get('eagle').init('desktop');
            matrix_container.get('tik_tok').init('clock');
            matrix_container.get('octopus').init('device_manager');
            matrix_container.get('parrot').load('audio');

            // Show preloaded or saved bees (apps)
            matrix_container.get('swarm').bees.show();
            matrix_container.get('hive').stack.bees.show();

            // Load Banana (User suggestions widget)
            //Banana();

            // Hide the loading screen when all has been loaded (Give also a buffer time for delayed rendering)
            setTimeout(function()
            {
                // Play the login sound
                matrix_container.get('parrot').play('sys', '/site/themes/' + os_settings.get('theme') + '/sounds/login.mp3');

                load_screen.hide();
            }, 3000);
        }

        function load_desktop_ui()
        {
            // Iniatilaze loading screen
            var load_screen = new loading_screen();

            // Show the loading screen while everything is loading
            load_screen.show();

            // Load all services and full UI infrastructure
            var new_trinity = matrix_container.get('trinity');
            var new_octopus = matrix_container.get('octopus');
            var new_parrot = matrix_container.get('parrot');
            var new_chameleon = matrix_container.get('chameleon');
            var new_nature = matrix_container.get('nature');
            var new_ui_controls = matrix_container.get('ui_controls');
            var new_dock = matrix_container.get('dock');
            var new_user_profile = matrix_container.get('user_profile');
            var new_forest = matrix_container.get('forest');
            var new_swarm = matrix_container.get('swarm');
            var new_hive = matrix_container.get('hive');
            var new_eagle = matrix_container.get('eagle');
            var new_tik_tok = matrix_container.get('tik_tok');

            // Initialize system monitoring service
            new_trinity.init();

            // Set the theme in use
            new_chameleon.set(os_settings.get('theme'));

            // Preload (cache) Bee theme for better graphics performance on load
            new_nature.theme(['bee']);
            new_nature.apply('new');

            // Apply desktop theme
            os_utils.graphics.apply_theme('/site/themes/' + new_chameleon.get(), new_chameleon.get());

            // Initialize the desktop UI
            new_ui_controls.init('action_icons');
            new_dock.init('favorite_apps');
            new_user_profile.init('user_profile');
            new_forest.init('desktop');
            new_swarm.init('desktop', 47, 100, window.innerWidth - 70, window.innerHeight - 120);
            new_hive.init('desktop', 47, window.innerHeight - 85, os_settings.get('apps_per_view'), os_settings.get('stack_bars'));
            new_eagle.init('desktop');
            new_tik_tok.init('clock');
            new_octopus.init('device_manager');
            new_parrot.init('audio');

            // Show preloaded or saved bees (apps)
            new_swarm.bees.show();
            new_hive.stack.bees.show();

            // Load Banana (User suggestions widget)
            //Banana();

            // Hide the loading screen when all has been loaded (Give also a buffer time for delayed rendering)
            setTimeout(function()
            {
                // Play the login sound
                new_parrot.play('sys', '/site/themes/' + new_chameleon.get() + '/sounds/login.mp3');

                load_screen.hide();
            }, 3000);

            return true;
        }

        function init_environment()
        {
            var cc_reload = new f5();

            os_utils.events.attach('greyos', window, 'resize', 
            function() 
            {
                cc_reload.init();
            });
            os_utils.events.attach('greyos', document, 'keydown', 
            function(event) 
            {
                os_keys.scan(event);

                if (os_keys.get() === 112 || os_keys.get() === 114 || os_keys.get() === 115 || 
                    os_keys.get() === 116 || os_keys.get() === 117 || os_keys.get() === 118 || 
                    os_keys.get() === 119)
                    event.preventDefault();

                if (event.ctrlKey === true && 
                    (os_keys.get() === 82 || os_keys.get() === 68 || os_keys.get() === 79 || os_keys.get() === 80 || 
                     os_keys.get() === 83 || os_keys.get() === 70 || os_keys.get() === 71 || os_keys.get() === 72 || 
                     os_keys.get() === 74 || os_keys.get() === 75 || os_keys.get() === 84 || os_keys.get() === 87 || 
                     os_keys.get() === 85 || os_keys.get() === 78 || os_keys.get() === 69))
                    event.preventDefault();

                if (event.altKey === true && (os_keys.get() === 68 || os_keys.get() === 69 || os_keys.get() === 70))
                    event.preventDefault();
            });
            os_utils.events.attach('greyos', document, 'contextmenu', function(event){ event.preventDefault(); });
            os_utils.events.attach('greyos', document, 'mousedown', function(event)
                                                                    {
                                                                        if (event.buttons === 4)
                                                                            event.preventDefault();
                                                                    });
            //document.body.addEventListener('touchmove', function(event) { event.preventDefault(); }, false);

            // Calculate speed index
            os_benchmark.test(1000000);

            // Wait for 5 seconds and then print the result
            os_timers.start(5000, function()
                                  {
                                      var speed_index = 100 - os_benchmark.index();

                                      console.log('Browser speed quality: ' + speed_index + '%');
                                  }, true);

            auth_verification();

            return true;
        }

        init_environment();
    };

    // Initialization script (Development)
    var init_script_dev = function()
    {
        // List of containers
        var containers_list = [matrix, dev_box, app_box, colony];

        // List of system services
        var sys_services = [swarm, hive, forest, ui_controls, dock, user_profile, eagle, 
                            tik_tok, trinity, octopus, parrot, owl, infinity, nature, chameleon];

        // List of development tools
        var dev_tools = [bee];

        // List of user applications
        var user_apps = [krator, coyote, radio_dude, cloud_edit, i_bassoon, i_quakejs, i_minecraft, i_webgl_preview];

        // Add a VM to the hypervisor
        //os_hypervisor.backtrace(true);
        os_hypervisor.add([os_vm]);

        // Attach containers to the VM
        //os_vm.backtrace(true);
        os_vm.hub.attach(containers_list);

        /* ================= Populate containers ================= */

        // Matrix - System services container
        var matrix_container = os_vm.hub.access('matrix');

        // Put services in the container
        //matrix_container.backtrace(true);
        matrix_container.put(sys_services);

        //console.log(matrix_container.list());

        // Dev Box - Development tools container
        var dev_box_container = os_vm.hub.access('dev_box');

        // Add development tools in the container
        //dev_box_container.backtrace(true);
        dev_box_container.add(dev_tools);

        //console.log(dev_box_container.list());

        // App Box - Integrated/User applications container
        var app_box_container = os_vm.hub.access('app_box');

        // Add user applications in the container
        //app_box_container.backtrace(true);
        app_box_container.add(user_apps);

        //console.log(app_box_container.list());

        // Colony - Bee keeper container
        var bees_container = os_vm.hub.access('colony');

        // Set maximum allowed active apps (bees) per session
        //bees_container.backtrace(true);
        bees_container.max(os_settings.get('max_apps'));

        //console.log(bees_container.list());

        /* ======================================================= */

        function load_full_desktop_ui()
        {
            // Iniatilaze loading screen
            var load_screen = new loading_screen();

            // Show the loading screen while everything is loading
            load_screen.show();

            // Load all services and full UI infrastructure
            var new_trinity = matrix_container.get('trinity');
            var new_ui_controls = matrix_container.get('ui_controls');
            var new_dock = matrix_container.get('dock');
            var new_user_profile = matrix_container.get('user_profile');
            var new_forest = matrix_container.get('forest');
            var new_swarm = matrix_container.get('swarm');
            var new_hive = matrix_container.get('hive');
            var new_eagle = matrix_container.get('eagle');
            var new_tik_tok = matrix_container.get('tik_tok');
            var new_octopus = matrix_container.get('octopus');
            var new_parrot = matrix_container.get('parrot');
            var new_chameleon = matrix_container.get('chameleon');
            var new_nature = matrix_container.get('nature');

            // Initialize system monitoring service
            new_trinity.init();

            // Set the theme in use
            new_chameleon.set(os_settings.get('theme'));

            // Preload (cache) Bee theme for better graphics performance on load
            new_nature.theme(['bee']);
            new_nature.apply('new');

            // Apply desktop theme
            os_utils.graphics.apply_theme('/site/themes/' + new_chameleon.get(), new_chameleon.get());

            // Initialize the desktop UI
            new_ui_controls.init('action_icons');
            new_dock.init('favorite_apps');
            new_user_profile.init('user_profile');
            new_forest.init('desktop');
            new_swarm.init('desktop', 47, 100, window.innerWidth - 70, window.innerHeight - 120);
            new_hive.init('desktop', 47, window.innerHeight - 85, os_settings.get('apps_per_view'), os_settings.get('stack_bars'));
            new_eagle.init('desktop');
            new_tik_tok.init('clock');
            new_octopus.init('device_manager');
            new_parrot.init('audio');

            // Show preloaded or saved bees (apps)
            new_swarm.bees.show();
            new_hive.stack.bees.show();

            // Load Banana (User suggestions widget)
            Banana();

            // Hide the loading screen when all has been loaded (Give also a buffer time for delayed rendering)
            setTimeout(function()
            {
                // Play the login sound
                new_parrot.play('sys', '/site/themes/' + new_chameleon.get() + '/sounds/login.mp3');

                load_screen.hide();
            }, 3000);

            return true;
        }

        function init_environment()
        {
            var cc_reload = new f5();

            os_utils.events.attach('greyos', window, 'resize', 
            function() 
            {
                cc_reload.init();
            });
            os_utils.events.attach('greyos', document, 'keydown', 
            function(event) 
            {
                os_keys.scan(event);

                if (os_keys.get() === 112 || os_keys.get() === 114 || os_keys.get() === 115 || 
                    os_keys.get() === 116 || os_keys.get() === 117 || os_keys.get() === 118 || 
                    os_keys.get() === 119)
                    event.preventDefault();

                if (event.ctrlKey === true && os_keys.get() === 82)
                    cc_reload.init();

                if (event.ctrlKey === true && 
                    (os_keys.get() === 68 || os_keys.get() === 79 || os_keys.get() === 80 || os_keys.get() === 83 || 
                     os_keys.get() === 70 || os_keys.get() === 71 || os_keys.get() === 72 || os_keys.get() === 74 || 
                     os_keys.get() === 75 || os_keys.get() === 84 || os_keys.get() === 87 || os_keys.get() === 85 || 
                     os_keys.get() === 78 || os_keys.get() === 69))
                    event.preventDefault();

                if (event.altKey === true && (os_keys.get() === 68 || os_keys.get() === 69 || os_keys.get() === 70))
                    event.preventDefault();
            });
            os_utils.events.attach('greyos', document, 'contextmenu', function(event){ event.preventDefault(); });
            os_utils.events.attach('greyos', document, 'mousedown', function(event)
                                                                    {
                                                                        if (event.buttons === 4)
                                                                            event.preventDefault();
                                                                    });
            //document.body.addEventListener('touchmove', function(event) { event.preventDefault(); }, false);

            // Calculate speed index
            os_benchmark.test(1000000);

            // Wait for 5 seconds and then print the result
            os_timers.start(5000, function()
                                  {
                                      var speed_index = 100 - os_benchmark.index();

                                      console.log('Browser speed quality: ' + speed_index + '%');
                                  }, true);

            load_full_desktop_ui();

            return true;
        }

        init_environment();
    };

    function check_system_compatibility()
    {
        if (!os_boot.init())
            return false;

        os_environment.init();

        //os_loader.backtrace(true);
        os_loader.use([init_script, init_script_dev]);
        os_loader.execute([os_settings.get('boot_mode')]);

        return true;
    }

    check_system_compatibility();
}

// Boot loader
ultron(boot_script);
