//
//
(function($){
  // var trace = function(msg){
  //   if (typeof(window)=='undefined' || !window.console) return
  //   var len = arguments.length, args = [];
  //   for (var i=0; i<len; i++) args.push("arguments["+i+"]")
  //   eval("console.log("+args.join(",")+")")
  // }  


  var Renderer = function(elt){
    var dom = $(elt)
    var canvas = dom.get(0)
    var ctx = canvas.getContext("2d");
    var gfx = arbor.Graphics(canvas)
    var sys = null

    var _vignette = null
    var selected = null,
        nearest = null,
        _mouseP = null;

    
    var that = {
      init:function(pSystem){
        sys = pSystem
        sys.screen({size:{width:dom.width(), height:dom.height()},padding:[36,60,36,60]})
        $(window).resize(that.resize)
        that.resize()
        that._initMouseHandling()

        if (document.referrer.match(/Humanities|Computer_Sciences|Engineering/)){
          // if we got here by hitting the back button in one of the demos, 
          // start with the demos section pre-selected
          that.switchSection('demos')
        }
      },
      resize:function(){
        canvas.width = .8* $(window).width()
        canvas.height = .8* $(window).height()
        sys.screen({size:{width:canvas.width, height:canvas.height}})
        _vignette = null
        that.redraw()
      },
      redraw:function(){
        gfx.clear()
        sys.eachEdge(function(edge, p1, p2){
          if (edge.source.data.alpha * edge.target.data.alpha == 0) return
          gfx.line(p1, p2, {stroke:"lime", width:6, alpha:edge.target.data.alpha})
        })
        sys.eachNode(function(node, pt){
          var w = Math.max(20, 20+gfx.textWidth(node.name) )
          if (node.data.alpha===0) return
          if (node.data.shape=='dot'){
            gfx.oval(pt.x-w/2, pt.y-w/2, w, w, {fill:node.data.color, alpha:node.data.alpha})
            gfx.text(node.name, pt.x, pt.y+7, {color:"white", align:"center", font:"Arial", size:16})
            gfx.text(node.name, pt.x, pt.y+7, {color:"white", align:"center", font:"Arial", size:16})
          }else{
            gfx.rect(pt.x-w/2, pt.y-8, w, 20, 4, {fill:node.data.color, alpha:node.data.alpha})
            gfx.text(node.name, pt.x, pt.y+9, {color:"white", align:"center", font:"Arial", size:14})
            gfx.text(node.name, pt.x, pt.y+9, {color:"white", align:"center", font:"Arial", size:14})
          }
        })
        that._drawVignette()
      },
      
      _drawVignette:function(){
        var w = canvas.width
        var h = canvas.height
        var r = 20

        if (!_vignette){
          var top = ctx.createLinearGradient(0,0,0,r)
          top.addColorStop(0, "#ccc")
          top.addColorStop(.7, "rgba(255,255,255,0)")

          var bot = ctx.createLinearGradient(0,h-r,0,h)
          bot.addColorStop(0, "rgba(255,255,255,0)")
          bot.addColorStop(1, "white")

          _vignette = {top:top, bot:bot}
        }
        
        // top
        ctx.fillStyle = _vignette.top
        ctx.fillRect(0,0, w,r)

        // bot
        ctx.fillStyle = _vignette.bot
        ctx.fillRect(0,h-r, w,r)
      },

      switchMode:function(e){
        if (e.mode=='hidden'){
          dom.stop(true).fadeTo(e.dt,0, function(){
            if (sys) sys.stop()
            $(this).hide()
          })
        }else if (e.mode=='visible'){
          dom.stop(true).css('opacity',0).show().fadeTo(e.dt,1,function(){
            that.resize()
          })
          if (sys) sys.start()
        }
      },
      
      switchSection:function(newSection){
        var parent = sys.getEdgesFrom(newSection)[0].source
        var children = $.map(sys.getEdgesFrom(newSection), function(edge){
          return edge.target
        })
        
        sys.eachNode(function(node){
          if (node.data.shape=='dot') return // skip all but leafnodes

          var nowVisible = ($.inArray(node, children)>=0)
          var newAlpha = (nowVisible) ? 1 : 0
          var dt = (nowVisible) ? .2 : .2
          sys.tweenNode(node, dt, {alpha:newAlpha})

          if (newAlpha==1){
            node.p.x = parent.p.x + .05*Math.random() - .025
            node.p.y = parent.p.y + .05*Math.random() - .025
            node.tempMass = .003
          }
        })
      },
      
      
      _initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        selected = null;
        nearest = null;
        var dragged = null;
        var dropped = null;
        var oldmass = 1

        var _section = null

        var handler = {
          moved:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            nearest = sys.nearest(_mouseP);

            if (!nearest.node) return false

            if (nearest.node.data.shape!='dot'){
              selected = (nearest.distance < 20) ? nearest : null
              if (selected){
                 dom.addClass('linkable')
                 window.status = selected.node.data.link.replace(/^\//,"http://"+window.location.host+"/").replace(/^#/,'')
              }
              else{
                 dom.removeClass('linkable')
                 window.status = ''
              }
            }else if ($.inArray(nearest.node.name, ['COMPETENCE','Engineering','Humanities','Computer_Sciences']) >=0 ){
              if (nearest.node.name!=_section){
                _section = nearest.node.name
                that.switchSection(_section)
              }
              dom.removeClass('linkable')
              window.status = ''
            }
            
            return false
          },
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            nearest = dragged = sys.nearest(_mouseP);
            
            if (nearest && selected && nearest.node===selected.node){
              var link = selected.node.data.link
              if (link.match(/^#/)){
                 $(that).trigger({type:"navigate", path:link.substr(1)})
              }else{
                 window.location = link
              }
              return false
            }
            
            
            if (dragged && dragged.node !== null) dragged.node.fixed = true

            $(canvas).unbind('mousemove', handler.moved);
            $(canvas).bind('mouseout', handler.moved);
            $(canvas).bind('mousemove', handler.dragged);
            $(window).bind('mouseup', handler.dropped);

            return false
          },
          dragged:function(e){
            var old_nearest = nearest && nearest.node._id
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

            if (!nearest) return
            if (dragged !== null && dragged.node !== null){
              var p = sys.fromScreen(s)
              dragged.node.p = p
            }

            return false
          },

          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 1000
            dragged = null;
            // selected = null
            $(canvas).unbind('mousemove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            $(canvas).bind('mousemove', handler.moved);
            _mouseP = null
            return false
          }


        }

        $(canvas).mousedown(handler.clicked);
        $(canvas).mousemove(handler.moved);
        $(canvas).mousemove(handler.dragged);
        $(canvas).mouseup(handler.dropped);
      }
    }
    
    return that
  }
  
  
  var Nav = function(elt){
    var dom = $(elt)

    var _path = null
    
    var that = {
      init:function(){
        $(window).bind('popstate',that.navigate)
        dom.find('> a').click(that.back)
        $('.more').one('click',that.more)
        
        $('#Humanities dl:not(.datastructure) dt').click(that.reveal)
        that.update()
        return that
      },
      more:function(e){
        $(this).removeAttr('href').addClass('less').html('&nbsp;').siblings().fadeIn()
        $(this).next('h2').find('a').one('click', that.less)
        
        return false
      },
      less:function(e){
        var more = $(this).closest('h2').prev('a')
        $(this).closest('h2').prev('a')
        .nextAll().fadeOut(function(){
          $(more).text('creation & use').removeClass('less').attr('href','#')
        })
        $(this).closest('h2').prev('a').one('click',that.more)

        return false
      },
      reveal:function(e){
        $(this).next('dd').fadeToggle('fast')
        return false
      },
      back:function(){
        _path = "/"
        if (window.history && window.history.pushState){
          window.history.pushState({path:_path}, "", _path);
        }
        that.update()
        return false
      },
      navigate:function(e){
        var oldpath = _path
        if (e.type=='navigate'){
          _path = e.path
          if (window.history && window.history.pushState){
             window.history.pushState({path:_path}, "", _path);
          }else{
            that.update()
          }
        }else if (e.type=='popstate'){
          var state = e.originalEvent.state || {}
          _path = state.path || window.location.pathname.replace(/^\//,'')
        }
        if (_path != oldpath) that.update()
      },
      update:function(){
        var dt = 'fast'
        if (_path===null){
          // this is the original page load. don't animate anything just jump
          // to the proper state
          _path = window.location.pathname.replace(/^\//,'')
          dt = 0
          dom.find('p').css('opacity',0).show().fadeTo('slow',0.5)
        }

        switch (_path){
          case '':
          case '/':
          dom.find('p').text('COMPETENCE')
          dom.find('> a').removeClass('active').attr('href','#')

          $('#Humanities').fadeTo('fast',0, function(){
            $(this).hide()
            $(that).trigger({type:'mode', mode:'visible', dt:dt})
          })
          document.title = "COMPETENCE"
          break
          
          case 'Engineering':
          case 'Computer_Sciences':
          case 'Humanities':
          $(that).trigger({type:'mode', mode:'hidden', dt:dt})
          dom.find('> p').text(_path)
          dom.find('> a').addClass('active').attr('href','#')
          $('#Humanities').stop(true).css({opacity:0}).show().delay(100).fadeTo('fast',1)
          $('#Humanities').find(">div").hide()
          $('#Humanities').find('#'+_path).show()
          document.title = "COMPETENCE ?? " + _path
          break
        }
        
      }
    }
    return that
  }
  
  $(document).ready(function(){
    var CLR = {
      branch:"#b2b19d",
      Engineering:"orange",
      Humanities:"#922E00",
      Computer_Sciences:"#a7af00"
    }

    var theUI = {
      nodes:{"COMPETENCE":{color:"red", shape:"dot", alpha:1}, 
      
             Computer_Sciences:{color:CLR.branch, shape:"dot", alpha:1}, 
             Storage:{color:CLR.Computer_Sciences, alpha:0, link:'/Storage'},
             Processing:{color:CLR.Computer_Sciences, alpha:0, link:'/Processing'},
             Communication:{color:CLR.Computer_Sciences, alpha:0, link:'/Communication'},
             SysAdmin:{color:CLR.Computer_Sciences, alpha:0, link:'/Storage'},
             DevOps:{color:CLR.Computer_Sciences, alpha:0, link:'/Processing'},
             SecOps_CISM:{color:CLR.Computer_Sciences, alpha:0, link:'/Communication'},
             IT_Services:{color:CLR.Computer_Sciences, alpha:0, link:'/Storage'},
             IT_Management_CIO:{color:CLR.Computer_Sciences, alpha:0, link:'/Processing'},
             Software:{color:CLR.Computer_Sciences, alpha:0, link:'/Communication'},
             Hardware:{color:CLR.Computer_Sciences, alpha:0, link:'/Communication'},

             Humanities:{color:CLR.branch, shape:"dot", alpha:1}, 
             Economics:{color:CLR.Humanities, alpha:0, link:'https://gpypicon.github.com'},
             Finances:{color:CLR.Humanities, alpha:0, link:'https://gpypicon.github.com'},
             Arts:{color:CLR.Humanities, alpha:0, link:'https://gpypicon.github.com'},
             Graphics:{color:CLR.Humanities, alpha:0, link:'https://gpypicon.github.com'},
             Management:{color:CLR.Humanities, alpha:0, link:'https://gpypicon.github.com'},
             Legal:{color:CLR.Humanities, alpha:0, link:'https://gpypicon.github.com'},
             Sales:{color:CLR.Humanities, alpha:0, link:'https://gpypicon.github.com'},
             Litterature:{color:CLR.Humanities, alpha:0, link:'https://gpypicon.github.com'},
             Sport:{color:CLR.Humanities, alpha:0, link:'https://gpypicon.github.com'},
                    
             Engineering:{color:CLR.branch, shape:"dot", alpha:1},
             "System Engineering":{color:CLR.Engineering, alpha:0, link:'https://gpypicon.github.com'},
             "Mechanical Engineering":{color:CLR.Engineering, alpha:0, link:'https://gpypicon.github.com'},
             "Electrical Engineering":{color:CLR.Engineering, alpha:0, link:'https://gpypicon.github.com'},
             "Material Engineering":{color:CLR.Engineering, alpha:0, link:'https://gpypicon.github.com'},
             "Energetic Engineering":{color:CLR.Engineering, alpha:0, link:'https://gpypicon.github.com'},
             "Biological Engineering":{color:CLR.Engineering, alpha:0, link:'https://gpypicon.github.com'},
             "Chemical Engineering":{color:CLR.Engineering, alpha:0, link:'https://gpypicon.github.com'},
             "Hydraulic Engineering":{color:CLR.Engineering, alpha:0, link:'https://gpypicon.github.com'},
             "Physical Engineering":{color:CLR.Engineering, alpha:0, link:'https://gpypicon.github.com'},
             "Software Engineering":{color:CLR.Engineering, alpha:0, link:'https://gpypicon.github.com'},
             "Electronics Engineering":{color:CLR.Engineering, alpha:0, link:'https://gpypicon.github.com'},
             "Optical Engineering":{color:CLR.Engineering, alpha:0, link:'https://gpypicon.github.com'}
            },
      edges:{
        "COMPETENCE":{
          Computer_Sciences:{length:.7},
          Humanities:{length:.7},
          Engineering:{length:.7}
      },
      Computer_Sciences:{
			Storage:{},
			Processing:{},
			Communication:{},
			SysAdmin:{},
      DevOps:{},
      SecOps_CISM:{},
      IT_Services:{},
      IT_Management_CIO:{},
      Software:{},
      Hardware:{}
      },
      Humanities:{Economics:{},
			Arts:{},
			Management:{},
			Litterature:{},
			Graphics:{},
			Legal:{},
			Sport:{},
			Sales:{},
      Finances:{}
      },
      Engineering:{"Mechanical Engineering":{},
              "Electrical Engineering":{},
              "System Engineering":{},
              "Material Engineering":{},
              "Energetic Engineering":{},
              "Software Engineering":{},
              "Electronics Engineering":{},
              "Biological Engineering":{},
              "Chemical Engineering":{},
              "Hydraulic Engineering":{},
              "Physical Engineering":{},
              "Optical Engineering":{}
        }
      }
    }


    var sys = arbor.ParticleSystem()
    sys.parameters({stiffness:500, repulsion:2000, gravity:true, dt:0.005})
    sys.renderer = Renderer("#sitemap")
    sys.graft(theUI)


    that.update()
    that.redraw()
  })
})(this.jQuery)
