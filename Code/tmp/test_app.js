// Test app
function test_app()
{
    var self = this;

    function utilities()
    {
        this.gui_init = function()
        {
            utils.draw();
            utils.attach_events();

            return true;
        };

        this.draw = function()
        {
            

            return true;
        };

        this.attach_events = function()
        {
            //var __my_object = vulcan.objects.by_id('my_content');

            //vulcan.events.attach(config.id, __my_object, 'click', function(event) { my_function(event); });

            return true;
        };
    }

    function config_model()
    {
        this.id = null;
        this.content = null;
    }
    
    this.id = function()
    {
        return 'test_app';
    };

    this.get_bee = function()
    {
        if (is_init === false)
            return false;

        return test_app_bee;
    };

    this.init = function()
    {
        if (is_init === true)
            return false;

        is_init = true;

        test_app_bee = dev_box.get('bee');
        infinity = dev_box.get('infinity');
        fx = dev_box.get('fx');
        fx.init(cosmos);  

        //vulcan.graphics.apply_theme('/framework/extensions/js/test_app/themes', 'test_app');

        config.id = 'test_app'; //+ pythia.generate();

        // Declare bee's settings
        test_app_bee.init(cosmos, config.id, 2);
        test_app_bee.settings.data.window.labels.title('GreyOS :: Test App');
        test_app_bee.settings.data.window.labels.status_bar('My first integrated app!');
        test_app_bee.gui.position.left(420);
        test_app_bee.gui.position.top(180);
        test_app_bee.gui.size.width(720);
        test_app_bee.gui.size.height(480);
        test_app_bee.gui.size.min.width(560);
        test_app_bee.gui.size.min.height(400);
        test_app_bee.gui.fx.fade.settings.into.set(0.07, 25, 100);
        test_app_bee.gui.fx.fade.settings.out.set(0.07, 25, 100);
        test_app_bee.on('open', function() { test_app_bee.gui.fx.fade.into(); });
        test_app_bee.on('opened', function() { return utils.gui_init(); });
        test_app_bee.on('dragging', function()
                                      {
                                          test_app_bee.gui.fx.opacity.settings.set(0.7);
                                          test_app_bee.gui.fx.opacity.apply();
                                      });
        test_app_bee.on('dragged', function() { test_app_bee.gui.fx.opacity.reset(); });
        //test_app_bee.on('resizing', function() {  });
        //test_app_bee.on('resize', function() {  });
        //test_app_bee.on('resized', function() {  });
        test_app_bee.on('close', function() { test_app_bee.gui.fx.fade.out(); });

        return true;
    };
    
    this.cosmos = function(cosmos_object)
    {
        if (cosmos_exists === true)
            return false;

        if (cosmos_object === undefined)
            return false;

        cosmos = cosmos_object;

        vulcan = cosmos.hub.access('vulcan');
        matrix = cosmos.hub.access('matrix');
        dev_box = cosmos.hub.access('dev_box');

        pythia = matrix.get('pythia');
        colony = matrix.get('colony');
        swarm = matrix.get('swarm');

        cosmos_exists = true;

        return true;
    };

    var cosmos_exists = false,
        is_init = false,
        cosmos = null,
        vulcan = null,
        matrix = null,
        dev_box = null,
        pythia = null,
        infinity = null,
        colony = null,
        swarm = null,
        fx = null,
        test_app_bee = null,
        config = new config_model(),
        utils = new utilities();
}
