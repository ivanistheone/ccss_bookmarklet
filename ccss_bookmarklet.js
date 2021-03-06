
(function(){
    var done = false;
    var script = document.createElement("script");
    script.src = "//cdnjs.cloudflare.com/ajax/libs/yepnope/1.5.4/yepnope.min.js";
    script.onload = script.onreadystatechange = function(){
      if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
        done = true;
        requireDeps();
      }
    };
    document.getElementsByTagName("head")[0].appendChild(script);
})();

function requireDeps() {
  yepnope([{ test: typeof(window.jQuery) === 'undefined' || jQuery.fn.jquery.match(/^1\.[0-9]+/) <= 1.4,
              yep: ['//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js']
            },
            { test: typeof(window.CClookup) === 'undefined' || typeof(window.CClookup.raw_data) === 'undefined',
               yep: ['//raw.github.com/ivanistheone/ccss_bookmarklet/gh-pages/data/ccss_data.js'],
               complete: function( url, result, key) {
                  console.log("Loaded data");
               }
            },
            {
              test: typeof(window.jQuery) === 'undefined' || typeof(jQuery.fn.highlighter) === 'undefined',
              yep: ['//raw.github.com/huffpostlabs/highlighter.js/master/jQuery.highlighter.js'],
              complete: function (url, result, key) {
                initMyBookmarklet(jQuery);
              }
            }
          ]);
}


function initMyBookmarklet($) {

    // Setup
    window.CClookup = window.CClookup || {};                           // The  namespace we will work in

    // setup lookuptable and aliases
    CClookup.setupLUT = function ( ) {
      var i;
      var raw_data = window.CClookup["raw_data"];
      var LUT = {};
      window.CClookup["LUT"] = LUT;

      for (i=0; i<raw_data.length; i++) {
        LUT[ raw_data[i].shortCode ] = raw_data[i].statement ;
        LUT[ "CC." + raw_data[i].shortCode ] = "redirect:"+raw_data[i].shortCode ;
        LUT[ "Math." + raw_data[i].shortCode ] = "redirect:"+aaw_data[i].shortCode ;
      }
    };

    // lookup function --- follows redirects
    CClookup.doLookup = function ( q ) {
      statement = window.CClookup["LUT"][ q ];          // statement could be the full statement or a redirect
      if (!statement){ return null; }                   // not found then return null...
      if (statement.substring(0,9)==="redirect:"){
        statement = window.CClookup["LUT"][ statement.substring(9) ];
      }
      return statement;
    };


    // on document ready
    $(function() { 
        console.log("Setting up CClookup on the document body");
        window.CClookup.setupLUT();

        // setup highlighter
        $('body').highlighter({  'selector': '.holder',
                                 'minWords': 0,
                                 'complete': function (data) {
                                                var statement =  window.CClookup.doLookup( data ) || "na" ;
                                                console.log(data);
                                                $("#tooltiptext").text(statement) ;
                                  }
                              });
        //$('.holder').mousedown(function(){ return false; });
        //$('.btn-right').click(function(){ $('.holder').hide(); return false; });


        // Hack for Trello board
        // prevent default click handler when ALT is pressed
        if (window.location.hostname === "trello.com") { 
            $('.window-wrapper').get(0).addEventListener('click', function(e) { 
              if(e.altKey) { 
                console.log("alt clicked2", e);
                e.stopPropagation();
                return false;
              }
            }, true);
        }

    });
}





