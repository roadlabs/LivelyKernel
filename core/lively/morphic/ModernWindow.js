module('lively.morphic.ModernWindow').requires('lively.morphic.Widgets', 'lively.morphic.StyleSheets').toRun(function() {

lively.morphic.Morph.addMethods({
    openInModernWindow: function (optPos) {
        lively.morphic.World.current().internalAddWindow(this,
            this.name, optPos || this.getPosition());
        this.applyStyle({resizeWidth: true, resizeHeight: true});
        if (this.partsBinMetaInfo) {
            this.owner.setPartsBinMetaInfo(this.getPartsBinMetaInfo());
            this.owner.setName(this.name);
            this.owner.setTitle(this.name);
        }
    }
});

lively.morphic.World.addMethods({
    internalAddModernWindow: function (morph, title, pos, suppressReframeHandle) {
        morph.applyStyle({borderWidth: 1, borderColor: CrayonColors.iron});
        pos = pos || this.firstHand().getPosition().subPt(pt(5, 5));
        var win = this.addFramedModernMorph(morph, String(title || ""), pos, suppressReframeHandle);
        return morph;
    },
     addFramedModernMorph: function (morph, title, optLoc, optSuppressControls, suppressReframeHandle) {
        var w = this.addMorph(
            new lively.morphic.ModernWindow(morph, title || 'ModernWindow',
                                      optSuppressControls, suppressReframeHandle));
        w.setPosition(optLoc || this.positionForNewMorph(morph));
        return w;
    }
    
});

lively.morphic.TitleBar.subclass("lively.morphic.ModernTitleBar",
'properties', {
    controlSpacing: 3,
    barHeight: 22,
    shortBarHeight: 15,
    accessibleInInactiveWindow: true,
    style: {
        fill: new lively.morphic.LinearGradient(
            [{offset: 0, color: Color.white},
            {offset: 1, color: Color.gray.mixedWith(Color.black, 0.8)}]),
        strokeOpacity: 1,
        borderRadius: "8px 8px 0px 0px",
        borderWidth: 1,
        borderColor: Color.darkGray,
        adjustForNewBounds: true,
        resizeWidth: true
    },
    labelStyle: {
        borderRadius: 0,
        padding: Rectangle.inset(0,0),
        fill: null,
        fontSize: 10,
        align: 'center',
        clipMode: 'hidden',
        fixedWidth: true,
        fixedHeight: true,
        resizeWidth: true,
        textColor: Color.darkGray,
        emphasize: {textShadow: {color: Color.white, offset: pt(0,1)}}
    }
},
'intitializing', {
    initialize: function($super, headline, windowWidth, windowMorph, optSuppressControls) {

        if (optSuppressControls)  {  // for dialog boxes
            this.suppressControls = true;
            this.barHeight = this.shortBarHeight;
        }
        var bounds = new Rectangle(0, 0, windowWidth, this.barHeight);

        // calling $super.$super ...
        lively.morphic.Box.prototype.initialize.call(this, bounds);

        // this.ignoreEvents();
        this.windowMorph = windowMorph;

        // Note: Layout of submorphs happens in adjustForNewBounds (q.v.)
        var label;
        if (headline instanceof lively.morphic.Text) {
            label = headline;
        } else if (headline != null) { // String
            label = lively.morphic.Text.makeLabel(headline, this.labelStyle);
        }
        this.label = this.addMorph(label);

        if (!this.suppressControls) {
            var cell = new Rectangle(0, 0, this.barHeight-5, this.barHeight-5);

            this.closeButton = this.addMorph(
                new lively.morphic.ModernWindowControl(cell, this.controlSpacing, "X", pt(1,-3), "#E73F22"));
            this.closeButton.applyStyle({moveHorizontal: true});
            this.closeButton.label.applyStyle({textColor: Color.white});
            
            //this.closeButton.linkToStyles('titleBar_closeButton');
            this.menuButton = this.addMorph(
                new lively.morphic.ModernWindowControl(cell, this.controlSpacing, "M", pt(-5,-6), "#EEEEEE"));
            
            //this.menuButton.linkToStyles('titleBar_menuButton');
            this.collapseButton = this.addMorph(
                new lively.morphic.ModernWindowControl(cell, this.controlSpacing, "–", pt(-2,-6), "#EEEEEE"));
            this.collapseButton.applyStyle({moveHorizontal: true});
            //this.collapseButton.linkToStyles('titleBar_collapseButton');

            this.connectButtons(windowMorph);
        }
        // This will align the buttons and label properly
        this.adjustForNewBounds();
        this.adjustForNewBounds();

        this.disableDropping();
        
        

        this.setAppearanceStylingMode(true);
        this.setBorderStylingMode(true);


    },

}

);

lively.morphic.WindowControl.subclass("lively.morphic.ModernWindowControl",
'documentation', {
    documentation: "Event handling for ModernWindow morphs",
},

'style', {
    style: "border-radius: 4px; box-shadow: inset 0 0 2px #FFFFFF;",
    
},

'initializing', {
    initialize: function($super, bnds, inset, labelString, labelOffset, color) {
        $super(bnds, inset, labelString, labelOffset);
        this.setAppearanceStylingMode(true);
        //this.setBorderStylingMode(true);
        this.applyStyle({borderWidth: 1, borderRadius: 3, borderColor: Color.rgbHex("888888")});
        this.label.applyStyle({emphasize: {fontWeight: 'bold'}});
        //this.label.setPosition(this.label.getPosition().addPt(labelOffset));
        this.setStyleSheet(this.style +"background: "+color+";");
    },
});


lively.morphic.Morph.subclass('lively.morphic.Window',
'appearance', {
    spacing: 4, // window border
    minWidth: 200,
    minHeight: 100,
    debugMode: false,
    style: {borderWidth: 0, fill: null, borderRadius: 0, strokeOpacity: 0, adjustForNewBounds: true, enableDragging: true},
    styleSheet: "background-color: rgba(255, 255, 255, 0.6); box-shadow: 0px 5px 20px #000; border-radius: 5px; &.highlighted {box-shadow: 0px 4px 15px #666;}",
},


'documentation', {
    documentation: "Full-fledged AND good looking windows with title bar, menus, etc",
},
'initializing', {
    initialize: function($super, targetMorph, titleString, optSuppressControls) {
        $super(new lively.morphic.Shapes.Rectangle());
        this.LK2 = true; // to enable workaround in WindowMorph trait.expand

        var bounds      = targetMorph.bounds();
        bounds.width += 2 * this.spacing;
        bounds.height += 1 * this.spacing;
    
        var titleBar    = this.makeTitleBar(titleString, bounds.width, optSuppressControls);
        var titleHeight = titleBar.bounds().height - titleBar.getBorderWidth();
        this.setBounds(bounds.withHeight(bounds.height + titleHeight));
        this.targetMorph = this.addMorph(targetMorph);
        
        // create three reframe handles (bottom, right, and bottom-right) and align them to the window
        this.reframeHandle = this.addMorph(this.makeReframeHandle());
        this.alignReframeHandle();
        
        this.bottomReframeHandle = this.addMorph(this.makeBottomReframeHandle());
        this.alignBottomReframeHandle();
        
        this.rightReframeHandle = this.addMorph(this.makeRightReframeHandle());
        this.alignRightReframeHandle();
        
        
        this.titleBar = this.addMorph(titleBar);
        this.contentOffset = pt(this.spacing, titleHeight);
        targetMorph.setPosition(this.contentOffset);
        // this.closeAllToDnD();

        this.collapsedTransform   = null;
        this.collapsedExtent      = null;
        this.expandedTransform    = null;
        this.expandedExtent       = null;
        this.ignoreEventsOnExpand = false;
        this.disableDropping();
        
        this.setAppearanceStylingMode(true);
        this.setBorderStylingMode(true);
        this.setStyleSheet(this.styleSheet);
        
        return this;
    },
    makeTitleBar: function(titleString, width, optSuppressControls) {
        // Overridden in TabbedPanelMorph
        return new lively.morphic.ModernTitleBar(titleString, width, this, optSuppressControls);
    },
    
    highlight: function(trueForLight) {
        this.highlighted = trueForLight;
        //var fill = this.titleBar.getStyle().fill || this.titleBar.getFill(),
      //      newFill = trueForLight ? fill.lighter(1) : fill;
        //this.titleBar.applyStyle({
      //      fill: newFill,
        //});
        
        this.setNodeClass(!trueForLight ? 'highlighted' : '');
        this.titleBar.label.applyStyle({emphasize: {fontWeight: trueForLight ? 'bold' : 'normal'}});
    },

    makeReframeHandle: function() {
        //var handle = lively.morphic.Morph.makePolygon([pt(14, 0), pt(14, 14), pt(0, 14)], 0, null, this.debugMode?Color.red:null);
                    var handle = new lively.morphic.Box(new Rectangle(0, 0, 14, 14));
        handle.addScript(function onDragStart(evt) {
            this.dragStartPoint = evt.mousePoint;
            this.originalTargetExtent = this.owner.getExtent();
        });
        handle.addScript(function onDrag(evt) {
            var moveDelta = evt.mousePoint.subPt(this.dragStartPoint)
            var newExtent = this.originalTargetExtent.addPt(moveDelta);
            if (newExtent.x < this.owner.minWidth) newExtent.x = this.owner.minWidth;
            if (newExtent.y < this.owner.minHeight) newExtent.y = this.owner.minHeight;
            this.owner.setExtent(newExtent);
            //console.log("WindowExtent: "+this.owner.getExtent().x+" ,  "+this.owner.getExtent().y);
            this.align(this.bounds().bottomRight(), this.owner.getExtent());
        });
        handle.addScript(function onDragEnd (evt) {
            this.dragStartPoint = null;
            this.originalTargetExtent = null;
            this.owner.alignBottomReframeHandle();
            this.owner.alignRightReframeHandle();
        });
        handle.setHandStyle("se-resize");
        return handle;
    },
    alignReframeHandle: function() {
        if (this.reframeHandle) {
            this.reframeHandle.align(this.reframeHandle.bounds().bottomRight(), this.getExtent());
            this.reframeHandle.bringToFront();
        }
    },

    
    makeBottomReframeHandle: function() {
        var theExtent = this.getExtent();
        //var handle = lively.morphic.Morph.makeRectangle(0,0,theExtent.x, this.spacing);
        //var handle = lively.morphic.Morph.makePolygon([pt(0, 0), pt(theExtent.x, 0), pt(theExtent.x, this.spacing), pt(0, this.spacing)], 0, null, this.debugMode?Color.purple:null);
            
        var handle = new lively.morphic.Box(new Rectangle(0, 0, theExtent.x, this.spacing));
        //handle.applyStyle({fill: Color.purple}); 
        handle.addScript(function onDragStart(evt) {
            this.dragStartPoint = evt.mousePoint;
            this.originalTargetExtent = this.owner.getExtent();
        });
        handle.addScript(function onDrag(evt) {
            var moveDelta = pt(0,evt.mousePoint.subPt(this.dragStartPoint).y);
            var newExtent = this.originalTargetExtent.addPt(moveDelta);
        
            if (newExtent.y < this.owner.minHeight) newExtent.y = this.owner.minHeight;
            this.owner.setExtent(newExtent);

            this.align(this.bounds().bottomLeft(), pt(0,this.owner.getExtent().y));
        });
        handle.addScript(function onDragEnd (evt) {
            this.dragStartPoint = null;
            this.originalTargetExtent = null;
            this.owner.alignReframeHandle();
            this.owner.alignRightReframeHandle();
        });
        handle.setHandStyle("s-resize");
        return handle;
    },

    alignBottomReframeHandle: function() {
        if (this.bottomReframeHandle) {
            this.bottomReframeHandle.bringToFront();
            this.bottomReframeHandle.setExtent(this.bottomReframeHandle.getExtent().withX(this.getExtent().x  - this.reframeHandle.getExtent().x));
            this.bottomReframeHandle.align(this.bottomReframeHandle.bounds().bottomLeft(), pt(0,this.getExtent().y));


        }
    },
    
    makeRightReframeHandle: function() {
        var theExtent = this.getExtent();
        //var handle = lively.morphic.Morph.makeRectangle(0,0,theExtent.x, this.spacing);
        //var handle = lively.morphic.Morph.makePolygon([pt(0, 0), pt(this.spacing, 0), pt(this.spacing, theExtent.y), pt(0, theExtent.y)], 0, null, this.debugMode? Color.green : null);
        
        var handle = new lively.morphic.Box(new Rectangle(0, 0, this.spacing, theExtent.y));
        
        //handle.applyStyle({fill: Color.purple}); 
        handle.addScript(function onDragStart(evt) {
            this.dragStartPoint = evt.mousePoint;
            this.originalTargetExtent = this.owner.getExtent();
        });
        handle.addScript(function onDrag(evt) {
            var moveDelta = pt(evt.mousePoint.subPt(this.dragStartPoint).x,0);
            var newExtent = this.originalTargetExtent.addPt(moveDelta);
            if (newExtent.x < this.owner.minWidth) newExtent.x = this.owner.minWidth;
 
            this.owner.setExtent(newExtent);
            this.align(this.bounds().topRight(), pt(this.owner.getExtent().x,0));
        });
        handle.addScript(function onDragEnd (evt) {
            this.dragStartPoint = null;
            this.originalTargetExtent = null;
            this.owner.alignReframeHandle();
            this.owner.alignBottomReframeHandle();
        });
        handle.setHandStyle("e-resize");
        
        return handle;
    },

    alignRightReframeHandle: function() {
        if (this.rightReframeHandle) {

            this.rightReframeHandle.setExtent(this.rightReframeHandle.getExtent().withY(this.getExtent().y - this.reframeHandle.getExtent().y));
            this.rightReframeHandle.align(this.rightReframeHandle.bounds().topRight(), this.getExtent().withY(0));

            
        }
    },
    
    
    
    

},'rest',
{

}
);

}) // end of module