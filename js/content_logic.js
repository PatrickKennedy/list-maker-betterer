console.log("content_logic");

var active = false,
    id = get_doc_id(),
    state, steps,
    $step_panel = jQuery("#step_panel"),
    separator = " / ";

get_state_cb(id, function(s) {
  state = s,
    steps = state["steps"];
  console.log("Initial State Loaded");
  console.log(steps),
    list_path = "div.toggle ol";


  // Set Initial Environment
  jQuery("div > ol > li").each(function (index) {
    console.log("-- Initializing #"+ index);
    var $this = jQuery(this);
    if (!steps[index]) {
      steps[index] = {memo:"", color:"neither"};
      console.log("Creating step state.");
    }

    // Apply State
    console.log("Applying State");
    $this.addClass("sp-"+ steps[index]["color"]);

    // Setup Action Listers
    console.log("Attaching Click Handler");
    $this.dblclick(function() {
      if (!active) return;
      console.log("clicked #"+ index);
      step_tools.set_state($step_panel, index, steps[index]);
      step_tools.bind_handlers($step_panel, index, steps, this, function(){set_state(state)});
      $step_panel.insertAfter(this);
    });

    // Insert Checkboxes
    // - wrapping in a span allows for adjusting the style of the text after the checkbox
    $this.wrapInner("<span>");
    jQuery("<input class=\"memo-select\" type=\"checkbox\" name=\"memos\" value="+ index +">")
    .prependTo($this);

    // Insert Inline Properties
    var $inline_panel = jQuery(ich.inline_panel({index:index, memo:steps[index].memo})).appendTo($this);
    step_tools.set_inline_state($inline_panel, index, steps[index]);
    step_tools.bind_inline_handlers($inline_panel, index, steps, this, function(){set_state(state)});
  });


  jQuery("<div class=\"tmb-button-group\" style=\"display: inline-block;\">")
  .append(jQuery("<div class=\"tmb-button generate-memo\">Generate Memos</div>")
          .off("click.sp")
          .on("click.sp", function(){
            var memo = "Completed DOC-"+ id;
            jQuery(".memo-select:checked").each(function (i) {
              $this = jQuery(this);
              var step_memo = steps[$this.val()].memo;
              if (step_memo)
                memo += separator + step_memo;
            });
            chrome.runtime.sendMessage({action:"copy", data:memo});
          })
         )
  .append(jQuery("<div class=\"tmb-button generate-memo\">Clear</div>")
          .off("click.sp")
          .on("click.sp", function(){
            jQuery(".memo-select:checked").each(function (i) {
              this.checked = false;
            });
          })
         )
  .appendTo(jQuery("div > ol"));


  set_state(state);
});

if ($step_panel.length == 0) $step_panel = jQuery(step_tools.new());

// Setup Action Listener
chrome.runtime.onMessage.addListener( function(request, sender, respond) {
  console.log("Message for you, Sir. Action: "+ request.action);
  if (request.action == "popup") {
    console.log(active ? "Disabling Handlers" : "Enabling Handlers");
    active = active ? false : true;
    if (active){
      jQuery(".inline-panel").slideDown(150);
      $step_panel.slideDown(150);
    } else {
      jQuery(".inline-panel").slideUp(150);
      $step_panel.slideUp(150, function() {jQuery(this).remove()});
    }
  }
});


