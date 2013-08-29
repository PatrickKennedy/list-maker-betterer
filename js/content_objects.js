
/*index = jQuery("#index");*/

console.log("content_objects");

jQuery
  .ajax({async: false, url: chrome.extension.getURL("ich/step_panel.html"), dataType: "html"})
  .complete(function(data) {
    jQuery(document.body).append(data.responseText);
  });
ich.grabTemplates();

function get_doc_id() {
  /*var matches = window.location.href.match(/.*?DOC-(\d+)/);*/
  var matches = window.location.href.match(/.*?DOC-(\d+).*?/);
  return matches ? matches[1] : "";
}

function get_state_cb(id, cb) {
  var s, fin;
  console.log("Getting State");
  if (!id) return;
  chrome.storage.local.get(id, function (items) {
    s = items[id];
    if (!s) {
      s = {steps:[], reference:[]};
    }
    cb(s)
  });
}

function set_state(state) {
  jQuery("#sp-state").addClass("saving");
  var id = get_doc_id();
  console.log("Saving State for DOC #"+ id);
  console.log(state["steps"]);
  var data = {};
  data[id] = state;
  chrome.storage.local.set(data, function() {
    jQuery("#sp-state").removeClass("saving");
    console.log("Successfully Saved #"+ id);
  });
}


step_tools = {
  new: function () {
    var panel = ich.step_panel({memo: ""});
    return panel;
  },

  set_state: function(panel, index, state) {
    console.log(state);
    panel.find("#sp-memo").val(state["memo"]);
    panel.find(".tmb-button-group").find("#sp-"+state["color"])[0].checked = true;
    panel.find("#sp-index").text(index+1);
  },

  reapply_state: function() {

  },


  bind_handlers: function(panel, index, steps, step, save) {
    panel.find(".tmb-button-group .tmb-button").each(function(i) {
      var $this = jQuery(this);
      var $step = jQuery(step);
      $this
        .off("click.sp")
        .on("click.sp", function() {
        steps[index].color = jQuery("#"+$this.attr("for")).val();
        save();
        $step.removeClass("sp-user").removeClass("sp-neither").removeClass("sp-agent");
        $step.addClass("sp-"+ steps[index].color);
      });
    });

    var timer;
    panel.find("#sp-memo").off("input.sp").on("input.sp", function(e) {
      $this = jQuery(this);
      jQuery("#sp-state").addClass("saving");
      clearTimeout(timer);
      timer = setTimeout(function() {
        steps[index].memo = $this.val();
        save();
      }, 1000);
    });

    jQuery("#sp-remove").off("click.sp").on("click.sp", function() {
      console.log("clicked sp-remove");
      if (!active) return;
      console.log("Removing Line #"+ index);
      steps.splice(index, 1);
      save();
      step_tools.reapply_state();
    });

    jQuery("#sp-add").off("click.sp").on("click.sp", function() {
      console.log("clicked sp-add");
      if (!active) return;
      console.log("Adding Line after #"+ index);
      steps.splice(index+1, 0, {memo:"", color:"neither"});
      save();
      step_tools.reapply_state();
    });
  },

  set_inline_state: function($inline_panel, index, state) {
    $inline_panel.find(".memo-edit").text(state["memo"]);
    $inline_panel.find(".tmb-button-group").find("#sp-"+ state["color"] +"-"+ index)[0].checked = true;
  },

  bind_inline_handlers: function($inline_panel, index, steps, step, save) {
    $inline_panel.find(".memo-edit")
    .off("input.sp")
    .on("input.sp", function(e) {
      $this = jQuery(this);
      var timer = $this.data("timer");
      if (timer)
        clearTimeout(timer);
      $this.data("timer", setTimeout(function() {
        steps[index].memo = $this.text();
        set_state(state);
      }, 1000));
    });

    $inline_panel.find(".tmb-button-group .tmb-button").each(function(i) {
      var $this = jQuery(this);
      var $step = jQuery(step);
      $this
        .off("click.sp")
        .on("click.sp", function() {
        steps[index].color = jQuery("#"+$this.attr("for")).val();
        save();
        $step.removeClass("sp-user").removeClass("sp-neither").removeClass("sp-agent");
        $step.addClass("sp-"+ steps[index].color);
      });
    });


  }
}

