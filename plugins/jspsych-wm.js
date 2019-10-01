/**
 *
 * jspsych-working-memory-precision
 * Mengya Zhang
 * 31/01/2018
 **/

jsPsych.plugins["working-memory"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('wokring-memory', 'distractor1', 'image');
  jsPsych.pluginAPI.registerPreload('wokring-memory', 'distractor2', 'image');
  jsPsych.pluginAPI.registerPreload('wokring-memory', 'fixation', 'image');

plugin.info = {
    name: 'working-memory',
    description: '',
    parameters: {
      distractor1: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Distractor1',
        default: '/study_assets_root/ac_stm_training/img_black/distractor_-0.6.png',
        description: 'Path to image file that is the foil/distractor.'
      },
      distractor2: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name:  'Distractor2',
        default: '/study_assets_root/ac_stm_training/img_black/distractor_0.7.png',
        description: 'Path to image file that is the foil/distractor.'
      },
      fixation: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Fixation cross',
        default: '<div class = centerbox><div class = fixation>+</div></div>',
        description: 'A nice little fixation cross'
      },
      set_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Set size',
        default: 3,
        description: 'How many items should be displayed?'
      },
      x1: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'x1',
        default: 0,
        description: 'x position for distractor1'
      },
      x2: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'x2',
        default: 0,
        description: 'x position for distractor2'
      },
      y1: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'y1',
        default: 0,
        description: 'y1 in degree'
      },
      y2: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'y2',
        default: 0,
        description: 'y2 in degree.'
      },
      target_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Target size',
        array: true,
        default: [50, 50],
        description: 'Two element array indicating the height and width of the search array element images.'
      },
      rotation: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'rotation',
        default: null,
        description: 'Degree of rotation for the prompt'
      },
      fixation_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Fixation size',
        array: true,
        default: [25, 25],
        description: 'Two element array indicating the height and width of the fixation image.'
      },
      distance: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'distance',
        default: 200,
        description: 'The distance between two stimuli.'
      },
      anticlockwise_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Target present key',
        default: 'z',
        description: 'The key to press if the prompt is rotated anticlockwise'
      },
      clockwise_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Target absent key',
        default: 'm',
        description: 'The key to press if the prompt is rotated clockwise'
      },
      search_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: 6000,
        description: 'The duration for encoding.'
      },
      blank_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: 2000,
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
        default: 1000,
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
    },
      difficulty: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Difficulty',
        default: null,
        description: 'difficulty level'
      },
    }
  }

  plugin.trial = function(display_element, trial) {
    console.log(trial.blank_duration);
    console.log(trial.distractor1);
    // display array params
    var distance = trial.distance; // pixels
    var paper_size = (distance + trial.target_size[0])  *(trial.set_size);

    // fixation location
    var fix_loc = [Math.floor(paper_size / 2 ), Math.floor(paper_size / 2 )];

    // stimulus locations 
    var display_locs = [];
    var x_locs=[];
    var y_locs=[];
    if (trial.set_size%2 ==1){ 
      for (var i = 0; i < (trial.set_size-1)/2; i++) {
        x_locs.push((i+1)*distance+ paper_size/2,  paper_size/2-(i+1)*distance);
        y_locs.push((i+1)*distance+ paper_size/2,  paper_size/2-(i+1)*distance);
        x_locs.push(paper_size/2); 
        y_locs.push(paper_size/2);
      }
    } else{
        for (var i = 0; i < (trial.set_size)/2; i++) {
          x_locs.push((i+0.5)*distance+ paper_size/2,  paper_size/2-(i+0.5)*distance);
          y_locs.push((i+0.5)*distance+ paper_size/2,  paper_size/2-(i+0.5)*distance);
      }
    }
    for (var i = 0; i < x_locs.length; i++){
      for (var j = 0; j < x_locs.length; j++){
        //jitter the position a bit
        rng1= jsPsych.randomization.sampleWithReplacement([-12,-9,-7,7,9,12], 1);
        rng2= jsPsych.randomization.sampleWithReplacement([-12,-9,-7,7,9,12], 1);
        display_locs.push([x_locs[i]+rng1[0], y_locs[j]+rng2[0]])
      }
    }
    // get target to draw on
    if (trial.reminder==true){
        display_element.innerHTML += '<div class = "centerbox"><p class = "center-block-text">Z: anticlockwise; M: clockwise</p></div>';
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
    var orientation = null;

    function show_search_array() {

      var orilist = [-50,-35,-20,-5,5,20,35, 50]; //the orientations that initial array can assume

      for (var i = 0; i < display_locs.length; i++) {
        which_distractor = Math.floor(Math.random()*2); //decide which distractor
        which_ori = Math.floor(Math.random()*orilist.length);

        if (which_distractor==0){
            which_image = trial.distractor1;
            ori = orilist[which_ori]; //degree of rotation
        } else{
            which_image = trial.distractor2;
            ori = orilist[which_ori];
        };
        img_id = "image_" + i;
        paper.innerHTML += "<img src='"+which_image+"' id='"+img_id+"' style='position: absolute; top:"+display_locs[i][0]+"px; left:"+display_locs[i][1]+"px; width:"+trial.target_size[0]+"px; height:"+trial.target_size[1]+"px;'></img>";        
        $("#"+img_id).rotate(ori);
        
        if (target_no==i){
          which_target= which_image;
          orientation = ori;
        }; //pass the target object
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

    if (trial.rotation<0){
      answer = 'anticlockwise';
    }else{
      answer = 'clockwise';
      };

    //draw the prompt
    function recall(){
      
      img_id = "target"
      paper.innerHTML += "<img src='"+which_target+"' id='"+img_id+"' style='position: absolute; top:"+display_locs[target_no][0]+"px; left:"+display_locs[target_no][1]+"px; width:"+trial.target_size[0]+"px; height:"+trial.target_size[1]+"px;'></img>";        
      $("#"+img_id).rotate(trial.rotation+orientation); //rotate the prompt

      var trial_over = false;

      var after_response = function(info) {

        trial_over = true;

        var correct = false;
        if (jsPsych.pluginAPI.compareKeys(info.key,trial.anticlockwise_key) && (answer=='anticlockwise') ||
            jsPsych.pluginAPI.compareKeys(info.key,trial.clockwise_key) && (answer=='clockwise')) {
          correct = true;
        }

        showFeedback(info.rt, correct, info.key);

      }

      var valid_keys = [trial.anticlockwise_key, trial.clockwise_key, 80];

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
        answer: answer,
        rotation: trial.rotation,
        set_size: trial.set_size,
        target_no: target_no,
        blank_duration: trial.blank_duration,
        difficulty: trial.difficulty
      };

      // go to next trial
      jsPsych.finishTrial(trial_data);
    }
  };

  return plugin;
})();
