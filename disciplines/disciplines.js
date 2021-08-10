var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};


function init(){
    //init data
    var json = {
        children: [{
            children: [{
                children: [
						   {
                children: [],
                data: {
                    $area: "80",
                    $color: "#00CC66",
                    image: "images/icon.jpg"
                },
                id: "TPC-IP",
                name: "TPC-IP"
            }, {
                children: [],
                data: {
                    $area: "80",
                    $color: "#336699",
                    image: "images/icon.jpg"
                },
                id: "Telephony",
                name: "Telephony"
            }, {
                children: [],
                data: {
                    $area: "80",
                    $color: "#FF99FF",
                    image: "images/icon.jpg"
                },
                id: "Wireless",
                name: "Wireless"
            }, {
                children: [],
                data: {
                    $area: "80",
                    $color: "#6699FF",
                    image: "images/icon.jpg"
                },
                id: "Email",
                name: "Email"
            }],
				
				
                data: {
                    $area: "80",
                    image: "images/icon.jpg"
                },
                id: "Networking",
                name: "Networking"
            }, {
                children: [
						   						   {
                children: [],
                data: {
                    $area: "80",
                    $color: "#66CCCC",
                    image: "images/icon.jpg"
                },
                id: "Architecture",
                name: "Architecture"
            } , 
			{
                children: [],
                data: {
                    $area: "80",
                    $color: "#6666CC",
                    image: "images/icon.jpg"
                },
                id: "Informa",
                name: "Information"
            } ,
			{
                children: [],
                data: {
                    $area: "80",
                    $color: "#FF99FF",
                    image: "images/icon.jpg"
                },
                id: "KM",
                name: "KM"
            } , 
			{
                children: [],
                data: {
                    $area: "50",
                    $color: "#02D532",
                    image: "images/icon.jpg"
                },
                id: "BPM",
                name: "BPM"
            }
			],
                data: {
                    $area: "80",
 
                    image: "images/icon.jpg"
                },
                id: "Datas",
                name: "Datas"
            }, {
                children: [
						   
						   						   {
                children: [],
                data: {
                    $area: "80",
                    $color: "grey",
                    image: "images/icon.jpg"
                },
                id: "XML",
                name: "XML"
            } , 
			{
                children: [],
                data: {
                    $area: "80",
                    $color: "#FF99FF",
                    image: "images/icon.jpg"
                },
                id: "SQL",
                name: "SQL"
            } ,
			{
                children: [],
                data: {
                    $area: "80",
                    $color: "green",
                    image: "images/icon.jpg"
                },
                id: "CMS",
                name: "CMS"
            } , 
			{
                children: [],
                data: {
                    $area: "50",
                    $color: "blue",
                    image: "images/icon.jpg"
                },
                id: "UML",
                name: "UML"
            }
						   
						   ],
                data: {
                    $area: "80",
                    image: "images/icon.jpg"
                },
                id: "Softwares",
                name: "Softwares"
            }, {
                children: [						   {
                children: [],
                data: {
                    $area: "80",
                    $color: "#FF99FF",
                    image: "images/icon.jpg"
                },
                id: "Microsoft",
                name: "Microsoft"
            } , 
			{
                children: [],
                data: {
                    $area: "80",
                    $color: "#02D532",
                    image: "images/icon.jpg"
                },
                id: "Linux",
                name: "Linux"
            } ,
			{
                children: [],
                data: {
                    $area: "80",
                    $color: "green",
                    image: "images/icon.jpg"
                },
                id: "Sun",
                name: "Sun"
            } , 
			{
                children: [],
                data: {
                    $area: "50",
                    $color: "orange",
                    image: "images/icon.jpg"
                },
                id: "W3C",
                name: "W3C"
            }],
                data: {
                    $area: "80",
                    image: "images/icon.jpg"
                },
                id: "Operating",
                name: "Operating Systems"
            }, {
                children: [						   {
                children: [],
                data: {
                    $area: "80",
                    $color: "#FF99FF",
                    image: "images/icon.jpg"
                },
                id: "Clients",
                name: "Clients"
            } , 
			{
                children: [],
                data: {
                    $area: "80",
                    $color: "blue",
                    image: "images/icon.jpg"
                },
                id: "Servers",
                name: "Servers"
            } ,
			{
                children: [],
                data: {
                    $area: "80",
                    $color: "#FF99FF",
                    image: "images/icon.jpg"
                },
                id: "Routers",
                name: "Routers"
            } , 
			{
                children: [],
                data: {
                    $area: "50",
                    $color: "#02D532",
                    image: "images/icon.jpg"
                },
                id: "Storage",
                name: "Storage"
            }],
                data: {
                    $area: "80",
                    image: "images/icon.jpg"
                },
                id: "Hardware",
                name: "Hardware"
            }],
            data: {
                $area: 100
            },
            id: "TECHNOLOGY",
            name: "TECHNOLOGY"
        }, {
            children: [{
                children: [],
                data: {
                    $area: "94",
                    $color: "#FF6633",
                    image: "images/icon.jpg"
                },
                id: "Project Management",
                name: "Project Management"
            }, 
			
			 {
			children: [],
                data: {
                    $area: "96",
                    $color: "blue",
                    image: "images/icon.jpg"
                },
                id: "Economy",
                name: "Economy"
            }, {
				children: [],
                data: {
                    $area: "96",
                    $color: "#66CC66",
                    image: "images/icon.jpg"
                },
                id: "Organization",
                name: "Organization"
            }, {
				children: [],
                data: {
                    $area: "96",
                    $color: "#CC9999",
                    image: "images/icon.jpg"
                },
                id: "Psychology",
                name: "Pyschology"
            }, {
				children: [],
                data: {
                    $area: "96",
                    $color: "#FF9933",
                    image: "images/icon.jpg"
                },
                id: "Anthropology",
                name: "Anthropology"
            }],
            data: {
                $area: 100
            },
            id: "SOCIAL SCIENCES",
            name: "SOCIAL SCIENCES"
        }, {
            children: [{
                children: [],
                data: {
                    $area: "211",
                    $color: "#CC99CC",
                    image: "images/icon.jpg"
                },
                id: "Optics",
                name: "Optics"
            }, {
                children: [],
                data: {
                    $area: "211",
                    $color: "#66CCCC",
                    image: "images/icon.jpg"
                },
                id: "Mechanics",
                name: "Mechanics"
            }, {
                children: [],
                data: {
                    $area: "211",
                    $color: "#99FF33",
                    image: "images/icon.jpg"
                },
                id: "Material Sciences",
                name: "Material Sciences"
            }, {
                children: [],
                data: {
                    $area: "211",
                    $color: "#0066FF",
                    image: "images/icon.jpg"
                },
                id: "Energetics",
                name: "Energetics"
            }, {
                children: [],
                data: {
                    $area: "211",
                    $color: "#CC99FF",
                    image: "images/icon.jpg"
                },
                id: "Acoustics",
                name: "Acoustics"
            }, {
                children: [],
                data: {
                    $area: "211",
                    $color: "#0099FF",
                    image: "images/icon.jpg"
                },
                id: "Electromagnetics",
                name: "Electromagnetics"
            }, {
                children: [],
                data: {
                    $area: "211",
                    $color: "#0099CC",
                    image: "images/icon.jpg"
                },
                id: "Electronics",
                name: "Electronics"
            }, {
                children: [],
                data: {
                    $area: "211",
                    $color: "#3366CC",
                    image: "images/icon.jpg"
                },
                id: "Physics",
                name: "Physics"
            }, {
                children: [],
                data: {
                    $area: "211",
                    $color: "#FF9999",
                    image: "images/icon.jpg"
                },
                id: "Electricity",
                name: "Electricity"
            }],
            data: {
                $area: 100
            },
            id: "PHYSICS",
            name: "PHYSICS"
        }, {
            children: [{
                children: [],
                data: {
                    $area: "100",
                    $color: "#009999",
                    image: "images/icon.jpg"
                },
                id: "Geometry",
                name: "Geometry"
            }, {
                children: [],
                data: {
                    $area: "100",
                    $color: "#3399CC",
                    image: "images/icon.jpg"
                },
                id: "Statistics",
                name: "Statistics"
            }, {
                children: [],
                data: {
                    $area: "100",
                    $color: "#02D53",
                    image: "images/icon.jpg"
                },
                id: "Algebra",
                name: "Algebra"
            }, {
                children: [],
                data: {
                    $area: "100",
                    $color: "#666699",
                    image: "images/icon.jpg"
                },
                id: "Operational Research",
                name: "Operational Research"
            }, {
                children: [],
                data: {
                    $area: "100",
                    $color: "#00CC33",
                    image: "images/icon.jpg"
                },
                id: "Signal Treatment",
                name: "Signal Treatment"
            }],
            data: {
                $area: 100
            },
            id: "MATHEMATIC",
            name: "MATHEMATICS"
        }],
        data: {
            $area: 600
        },
        id: "DISCIPLINES",
        name: "DISCIPLINES"
    };
    //end

var tm = new $jit.TM.Squarified({
    //where to inject the visualization
    injectInto: 'infovis',
    //parent box title heights
    titleHeight: 20,
    //enable animations
    animate: animate,
    //box offsets
    offset: 1,
    //Attach left and right click events
    Events: {
      enable: true,
      onClick: function(node) {
        if(node) tm.enter(node);
      },
      onRightClick: function() {
        tm.out();
      }
    },
    duration: 1000,
    //Enable tips
    Tips: {
      enable: true,
      //add positioning offsets
      offsetX: 20,
      offsetY: 20,
      //implement the onShow method to
      //add content to the tooltip when a node
      //is hovered
      onShow: function(tip, node, isLeaf, domElement) {
        var html = "<div class=\"tip-title\">" + node.name 
          + "</div><div class=\"tip-text\">";
        var data = node.data;
        if(data.playcount) {
          html += "play count: " + data.playcount;
        }
        if(data.image) {
          html += "<img src=\""+ data.image +"\" class=\"album\" />";
        }
        tip.innerHTML =  html; 
      }  
    },
    //Add the name of the node in the correponding label
    //This method is called once, on label creation.
    onCreateLabel: function(domElement, node){
        domElement.innerHTML = node.name;
        var style = domElement.style;
        style.display = '';
        style.border = '1px solid transparent';
        domElement.onmouseover = function() {
          style.border = '1px solid #9FD4FF';
        };
        domElement.onmouseout = function() {
          style.border = '1px solid transparent';
        };
    }
  });
  tm.loadJSON(json);
  tm.refresh();
  //end
  //add events to radio buttons
  var sq = $jit.id('r-sq'),
      st = $jit.id('r-st'),
      sd = $jit.id('r-sd');
  var util = $jit.util;
  util.addEvent(sq, 'change', function() {
    if(!sq.checked) return;
    util.extend(tm, new $jit.Layouts.TM.Squarified);
    tm.refresh();
  });
  util.addEvent(st, 'change', function() {
    if(!st.checked) return;
    util.extend(tm, new $jit.Layouts.TM.Strip);
    tm.layout.orientation = "v";
    tm.refresh();
  });
  util.addEvent(sd, 'change', function() {
    if(!sd.checked) return;
    util.extend(tm, new $jit.Layouts.TM.SliceAndDice);
    tm.layout.orientation = "v";
    tm.refresh();
  });
  //add event to the back button
  var back = $jit.id('back');
  $jit.util.addEvent(back, 'click', function() {
    tm.out();
  });
}
