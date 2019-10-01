/**
 *
 * jspsych-change-detection(single probe)
 * Mengya Zhang
 * 31/01/2018
 **/

jsPsych.plugins["change-detection"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('change-detection', 'red', 'image');
  jsPsych.pluginAPI.registerPreload('change-detection', 'yellow', 'image');
  jsPsych.pluginAPI.registerPreload('change-detection', 'green', 'image');
  jsPsych.pluginAPI.registerPreload('change-detection', 'white', 'image');
  jsPsych.pluginAPI.registerPreload('change-detection', 'pink', 'image');
  jsPsych.pluginAPI.registerPreload('change-detection', 'blue', 'image');


plugin.info = {
    name: 'change-detection',
    description: '',
    parameters: {
      red: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'red',
        default: '/study_assets_root/ac_stm_training/img_black/red.png',
        description: ''
      },
      yellow: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name:  'yellow',
        default: '/study_assets_root/ac_stm_training/img_black/yellow.png',
        description: ''
      },
      green: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: '',
        default: '/study_assets_root/ac_stm_training/img_black/green.png',
        description: ''
      },
      white: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: '',
        default: '/study_assets_root/ac_stm_training/img_black/white.png',
        description: ''
      },
      pink: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: '',
        default: '/study_assets_root/ac_stm_training/img_black/pink.png',
        description: ''
      },
      blue: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: '',
        default: '/study_assets_root/ac_stm_training/img_black/blue.png',
        description: ''
      },
      set_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Set size',
        default: 4,
        description: 'How many items should be displayed?'
      },
      fixation: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Fixation cross',
        default: '<div class = centerbox><div class = fixation>+</div></div>',
        description: 'A nice little fixation cross'
      },
      changed: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'change or not',
        default: true,
        description: 'whether probe is changed from initial display'
      },
      target_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Target size',
        array: true,
        default: [50, 50],
        description: 'Two element array indicating the height and width of the search array element images.'
      },
      fixation_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Fixation size',
        array: true,
        default: [25, 25],
        description: 'Two element array indicating the height and width of the fixation image.'
      },
      circle_diameter1: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Circle diameter',
        default: 250,
        description: 'The diameter of the search array circle in pixels.'
      },
      circle_diameter2: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Circle diameter',
        default: 500,
        description: 'The diameter of the search array circle in pixels.'
      },
      same_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'same key',
        default: 'z',
        description: 'The key to press if the prompt is rotated anticlockwise'
      },
      difference_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'different key',
        default: 'm',
        description: 'The key to press if the prompt is rotated clockwise'
      },
      search_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: 1000,
        description: 'The duration for encoding.'
      },
      blank_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: 1000,
        description: 'The duration for maintenance.'
      },
      recall_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: 6000,
        description: 'The maximum duration to wait for a response.'
      },
      fixation_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Fixation duration',
        default: 800,
        description: 'How long to show the fixation image for before the search array (in milliseconds).'
      },
      show_feedback: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show response feedback',
        default: true,
        description: 'If true, show feedback on incorrect or timeout trials.'
      },
      reminder:{
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'response key reminder',
        default: false,
        description: 'whether to show response key to use during trials'
    }
    }
  }

  plugin.trial = function(display_element, trial) {
    // display array params
    var distance = trial.circle_diameter2; // pixels
    var radi = distance / 2;
    var paper_size = (distance + trial.target_size[0]);

    var hstimh = trial.target_size[0] / 2;
    var hstimw = trial.target_size[1]/ 2;
    // fixation location
    var fix_loc = [Math.floor(paper_size / 2 ), Math.floor(paper_size / 2 )];

    // stimulus locations 
    var display_locs = [];
    var possible_display_locs = trial.set_size;
    var random_offset = Math.floor(Math.random() * 360);
    for (var i = 0; i < possible_display_locs; i++) {
      display_locs.push([
        Math.floor(paper_size / 2 + (cosd(random_offset + (i * (360 / possible_display_locs))) * radi) - hstimw),
        Math.floor(paper_size / 2 - (sind(random_offset + (i * (360 / possible_display_locs))) * radi) - hstimh)
      ]);
    };
    // get target to draw on
    if (trial.reminder==true){
        display_element.innerHTML += '<div class = "centerbox"><p class = "center-block-text">Z: same; M: different</p></div>';
      }
    display_element.innerHTML += '<div id="jspsych-working-memory-container" style="position: relative; width:' + paper_size + 'px; height:' + paper_size + 'px"></div>';
    var paper = display_element.querySelector("#jspsych-working-memory-container");

    show_fixation();

    function show_fixation() {
      // show fixation
      //var fixation = paper.image(trial.fixation, fix_loc[0], fix_loc[1], trial.fixation_size[0], trial.fixation_size[1]);
      paper.innerHTML += trial.fixation;

      // wait
      setTimeout(function() {
        $('#jspsych-working-memory-container').empty(); //clear fixation
        show_search_array(); //show search array
      }, trial.fixation_duration);
    }

    var target_no = Math.floor(Math.random() *  display_locs.length); //select one image as target
    var which_target = null;

    function show_search_array() {

      color_list=[];
      for (var i = 0; i < display_locs.length; i++) {
        temp = Math.floor(Math.random()*6);
        occurrance = color_list.filter(function(value){return value === temp;}).length 
        while(occurrance>1){//ensure no more than 2 of the same color
          temp = Math.floor(Math.random()*6);
          occurrance = color_list.filter(function(value){return value === temp;}).length 
        }
        color_list.push(temp);
      }
      for (var i = 0; i < display_locs.length; i++) {
        which_color = color_list[i];
        switch (which_color) {
            case 0:
                which_image = trial.red;
                break;
            case 1:
                which_image = trial.yellow;
                break;
            case 2:
                which_image = trial.green;
                break;
            case 3:
                which_image = trial.white;
                break;
            case 4:
                which_image = trial.pink;
                break;
            case 5:
                which_image = trial.blue;
        }

        img_id = "image_" + i;
        paper.innerHTML += "<img src='"+which_image+"' id='"+img_id+"' style='position: absolute; top:"+display_locs[i][0]+"px; left:"+display_locs[i][1]+"px; width:"+trial.target_size[0]+"px; height:"+trial.target_size[1]+"px;'></img>";        
        
        if (target_no==i){
          target_color = which_color;
        }; //pass the target color code
      }

      // wait
      setTimeout(function() {
        blank(); //show blank screen
      }, trial.search_duration);
}

    // Just wait
    function blank(){
      $('#jspsych-working-memory-container').empty(); //clear array
      setTimeout(function() {
        recall();
      }, trial.blank_duration);
    }


    //draw the prompt
    function recall(){
      if (trial.changed==true){
        new_color = Math.floor(Math.random()*6);
        while(new_color==target_color){
          new_color = Math.floor(Math.random()*6);}
      }else{
        new_color = target_color;
      }
      switch (new_color) {
            case 0:
                which_image = trial.red;
                break;
            case 1:
                which_image = trial.yellow;
                break;
            case 2:
                which_image = trial.green;
                break;
            case 3:
                which_image = trial.white;
                break;
            case 4:
                which_image = trial.pink;
                break;
            case 5:
                which_image = trial.blue;
        }
      img_id = "target"
      paper.innerHTML += "<img src='"+which_image+"' id='"+img_id+"' style='position: absolute; top:"+display_locs[target_no][0]+"px; left:"+display_locs[target_no][1]+"px; width:"+trial.target_size[0]+"px; height:"+trial.target_size[1]+"px;'></img>";        

      var trial_over = false;

      var after_response = function(info) {

        trial_over = true;

        var correct = false;
        if (jsPsych.pluginAPI.compareKeys(info.key,trial.same_key) && (trial.changed==false) ||
            jsPsych.pluginAPI.compareKeys(info.key,trial.difference_key) && (trial.changed==true)) {
          correct = true;
        }

        showFeedback(info.rt, correct, info.key);

      }

      var valid_keys = [trial.same_key, trial.difference_key, 80];

      key_listener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: valid_keys,
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });

      if (trial.recall_duration !== null) {

        jsPsych.pluginAPI.setTimeout(function() {

          if (!trial_over) {

            jsPsych.pluginAPI.cancelKeyboardResponse(key_listener);

            trial_over = true;

            var rt = null;
            var correct = 999;
            var key_press = null;

            showFeedback(rt,correct, key_press);
          }
        }, trial.recall_duration);

      }

    }

      function clear_display() {
        display_element.innerHTML = '';
      }

//provide immediate feedback on incorrect or timeout trials
    function showFeedback(rt, correct, key) {
      if (trial.show_feedback!==true || correct==true ){
        clear_display();
        end_trial(rt, correct, key);
      }else{
        $('#jspsych-working-memory-container').empty(); 

        if(correct==999){
          paper.innerHTML = '<p class = "center-text-vs">Please respond faster!</p>';
        }else{
          paper.innerHTML = '<p class = "center-text-vs">Incorrect</p>';}


  
        jsPsych.pluginAPI.setTimeout(function(){
         clear_display();
         end_trial(rt, correct, key); 
         }, 1500);
    }
  }


    function end_trial(rt, correct, key_press) {


      // data saving
      var trial_data = {
        correct: correct,
        rt: rt,
        key_press: key_press,
        locations: JSON.stringify(display_locs),
        answer: trial.changed,
        old_color: target_color,
        new_color: new_color,
        set_size: trial.set_size,
        target_no: target_no,
      };

      // go to next trial
      jsPsych.finishTrial(trial_data);
    }
  };

    // helper function for determining stimulus locations

  function cosd(num) {
    return Math.cos(num / 180 * Math.PI);
  }

  function sind(num) {
    return Math.sin(num / 180 * Math.PI);
  }

  return plugin;
})();
