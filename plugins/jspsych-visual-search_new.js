/**
 *
 * jspsych-visual-search
 * Mengya Zhang
 * 31/01/2018
 **/

jsPsych.plugins["visual-search"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('visual-search', 'target', 'image');
  jsPsych.pluginAPI.registerPreload('visual-search', 'distractor1', 'image');
  jsPsych.pluginAPI.registerPreload('visual-search', 'distractor2', 'image');
  jsPsych.pluginAPI.registerPreload('visual-search', 'fixation', 'image');

plugin.info = {
    name: 'visual-search',
    description: '',
    parameters: {
      target: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Target',
        default: '/study_assets_root/ac_stm_training/img_black/target.png',
        description: 'The image to be displayed.'
      },
      distractor1: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Distractor1',
        default: '/study_assets_root/ac_stm_training/img_black/distractor_-0.4.png',
        description: 'Path to image file that is the foil/distractor.'
      },
      distractor2: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name:  'Distractor2',
        default: '/study_assets_root/ac_stm_training/img_black/distractor_0.6.png',
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
        default: -0.4,
        description: 'x position for distractor1'
      },
      x2: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'x2',
        default: 0.6,
        description: 'x position for distractor2'
      },
      y1: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'y1',
        default: -20,
        description: 'y1 in degree'
      },
      y2: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'y2',
        default: 30,
        description: 'y2 in degree.'
      },
      target_present: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Target present',
        default: true,
        description: 'Is the target present?'
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
      distance: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'distance',
        default: 200,
        description: 'The distance between two stimuli.'
      },
      target_present_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Target present key',
        default: 'z',
        description: 'The key to press if the target is present in the search array.'
      },
      target_absent_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Target absent key',
        default: 'm',
        description: 'The key to press if the target is not present in the search array.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: 3000,
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
      feedback_img: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'feedback image',
        default: 'img/red_cross.png',
        description: 'Path to image file that is used to warn incorrect trials.'
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
    if (trial.reminder==true){
        display_element.innerHTML += '<div class = "centerbox"><p class = "center-block-text">Z: target present; M: not present</p></div>';
      }
    display_element.innerHTML += '<div id="jspsych-visual-search-container" style="position: relative; width:' + paper_size + 'px; height:' + paper_size + 'px"></div>';
    var paper = display_element.querySelector("#jspsych-visual-search-container");

    show_fixation();

    function show_fixation() {
      // show fixation
      paper.innerHTML += trial.fixation;

      // wait
      setTimeout(function() {
        $('#jspsych-visual-search-container').empty(); //clear fixation
        show_search_array(); 
      }, trial.fixation_duration);
    }


    function show_search_array() {

      target_loc =  Math.floor(Math.random() *  (display_locs.length-1));
      target_ori = Math.floor(Math.random() * 90 - 45); //the orientation of the target

      for (var i = 0; i < display_locs.length; i++) {
        which_distractor = Math.floor(Math.random()*2); //decide which distractor

        if (i==target_loc &&trial.target_present){
          which_image = trial.target;
          ori = target_ori;
        } else if (which_distractor==0){
            which_image = trial.distractor1;
            ori = trial.y1 + target_ori; //degree of rotation

        } else{
            which_image = trial.distractor2;
            ori = trial.y2 + target_ori;
        }
        img_id = "image_" + i;
        //var img = paper.image(which_image, display_locs[i][0], display_locs[i][1], trial.target_size[0], trial.target_size[1]);
        paper.innerHTML += "<img src='"+which_image+"' id='"+img_id+"' style='position: absolute; left:"+display_locs[i][0]+"px; top:"+display_locs[i][1]+"px; width:"+trial.target_size[0]+"px; height:"+trial.target_size[1]+"px;'></img>";        
        //img.attr({ visibility: 'hidden' }); //set invisible to allow image rotation
                                     //otherwise images appear with small delay
        $("#"+img_id).rotate(ori);
      }

      var trial_over = false;

      var after_response = function(info) {

        trial_over = true;

        var correct = false;
        if (jsPsych.pluginAPI.compareKeys(info.key,trial.target_present_key) && trial.target_present ||
            jsPsych.pluginAPI.compareKeys(info.key,trial.target_absent_key) && !trial.target_present) {
          correct = true;
        }

        showFeedback(info.rt, correct, info.key);

        };


      var valid_keys = [trial.target_present_key, trial.target_absent_key, 80];

      key_listener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: valid_keys,
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });
      //here's probably where to specify what to do 
      //when duration is not infinite
      if (trial.trial_duration !== null) {

        jsPsych.pluginAPI.setTimeout(function() {

          if (!trial_over) {

            jsPsych.pluginAPI.cancelKeyboardResponse(key_listener);

            trial_over = true;

            var rt = null;
            var correct = 999;
            var key_press = null;
            showFeedback(rt,correct, key_press);
          }
        }, trial.trial_duration);

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
        $('#jspsych-visual-search-container').empty(); 

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
        target_present: trial.target_present,
        set_size: trial.set_size,
        stimuli_param: [trial.x1, trial.x2, trial.y1, trial.y2],
        target_loc: target_loc
      };

      // go to next trial
      jsPsych.finishTrial(trial_data);
    }
  };

  return plugin;
})();
