module('lively.ide.tools.ObjectEditor').requires('lively.persistence.BuildSpec').toRun(function() {

lively.BuildSpec('lively.ide.tools.ObjectEditor', {
    _BorderColor: Color.rgb(204,0,0),
    _Extent: lively.pt(816.0,457.8),
    className: "lively.morphic.Window",
    contentOffset: lively.pt(4.0,22.0),
    draggingEnabled: true,
    layout: {adjustForNewBounds: true},
    name: "ObjectEditor",
    submorphs: [{
        _BorderColor: Color.rgb(95,94,95),
        _Extent: lively.pt(808.0,431.8),
        _Fill: Color.rgb(255,255,255),
        _Position: lively.pt(4.0,22.0),
        changeIndicator: {
            isMorphRef: true,
            name: "ChangeIndicator"
        },
        className: "lively.morphic.Box",
        connectionList: {
            isMorphRef: true,
            name: "ObjectEditorConnectionList"
        },
        currentCategory: null,
        currentTag: null,
        doNotSerialize: ["_renderContext","halos","_isRendered","priorExtent","cachedBounds"],
        droppingEnabled: true,
        grabbingEnabled: false,
        layout: {
            adjustForNewBounds: true,
            resizeHeight: true,
            resizeWidth: true
        },
        morphSelector: {
            isMorphRef: true,
            name: "ObjectEditorMorphSelector"
        },
        name: "ObjectEditorPane",
        scriptList: {
            isMorphRef: true,
            name: "ObjectEditorScriptList"
        },
        scriptPane: {
            isMorphRef: true,
            name: "ObjectEditorScriptPane"
        },
        sourceModule: "lively.morphic.Core",
        submorphs: [{
            _BorderColor: Color.rgb(204,0,0),
            _Extent: lively.pt(590.0,380.0),
            _FontSize: 12,
            _Position: lively.pt(200.0,40.0),
            _ShowGutter: false,
            _setShowIndents: true,
            accessibleInInactiveWindow: true,
            className: "lively.morphic.CodeEditor",
            doitContext: null,
            grabbingEnabled: false,
            lastSaveSource: "",
            layout: {
                resizeHeight: true,
                resizeWidth: true
            },
            name: "ObjectEditorScriptPane",
            objectEditorPane: {
                isMorphRef: true,
                name: "ObjectEditorPane"
            },
            sourceModule: "lively.ide.CodeEditor",
            storedString: "",
            storedTextString: "",
            textMode: "javascript",
            boundEval: function boundEval(str) {
            var result;
        
            this.objectEditorPane.ensureAnnotationLayer();
            withLayers([ScriptAnnotationLayer], function() {
                result = $super(str);
            })
            
            return result
        },
            connectionRebuilder: function connectionRebuilder() {
            lively.bindings.connect(this, "textString", this.get("ChangeIndicator"), "indicateUnsavedChanges", {});
        },
            display: function display(jsCode) {
            this.lastSaveSource = jsCode;
            this.setTextString(jsCode);
        },
            doSave: function doSave() {
            $super();
            var saved = this.boundEval(this.getTextString());

            if (saved) {
                this.lastSaveSource = this.textString;
                this.owner.changeIndicator.indicateUnsavedChanges();
                this.owner.updateLists();
                this.owner.selectChangedContent(this.getTextString());
                this.setStatusMessage("saved source", Color.green);
            } else {
                this.setStatusMessage("not saved", Color.red);
            }
        },
            hasChanged: function hasChanged() {
            var cleanText = function (string) {
                var source = string.trim();
                if (source.substring(0,2) === "//") {
                    // removes annotation line
                    source = source.substring(source.indexOf("\n"), source.length);
                    source = source.trim();
                }
                if (source === 'undefined' || source === 'null') source = '';
                return source;
            }
            var cleanedTextString = cleanText(this.textString);
            var cleanedLastSource = cleanText(this.lastSaveSource);
            return cleanedTextString !== cleanedLastSource;
        },
            reset: function reset() {
            this.doitContext = null;
            this.lastSaveSource = "";
            this.textString = "";
            this.lastSaveSource = this.textString;
            this.enableSyntaxHighlighting();
        },
            updateTarget: function updateTarget(target) {
            module('lively.ide.SyntaxHighlighting').load(true);
            this.doitContext = this.owner.target;
        }
        },{
            _ClipMode: "auto",
            _Extent: lively.pt(180.0,242.8),
            _Fill: Color.rgb(243,243,243),
            _FontSize: 10,
            _Position: lively.pt(10.0,63.0),
            className: "lively.morphic.List",
            currentCategory: null,
            doitContext: {isMorphRef: true,name: "ObjectEditor"},
            droppingEnabled: true,
            grabbingEnabled: false,
            itemList: [],
            layout: {resizeHeight: true},
            name: "ObjectEditorScriptList",
            sourceModule: "lively.morphic.Core",
            connectionRebuilder: function connectionRebuilder() {
            connect(this, "selection", this.get("ObjectEditorPane"), "displaySourceForScript", {updater: 
                function ($upd, value) {
                    this.sourceObj.isFocused() && this.sourceObj.focus.bind(this.sourceObj).delay(0.1);
                    $upd(value === '-- ALL --'? null : value);
                }});;
        },
            onKeyDown: function onKeyDown(evt) {
                var keys = evt.getKeyString();
                switch (keys) {
                    case 'Del': case 'Backspace':
                        this.get('ObjectEditorPane').deleteSelectedScript();
                        evt.stop(); return true;
                }
                return $super(evt);
        },
            preselectItem: function preselectItem() {
            if (this.getList().size() === 2) {
                this.selectAt(1);
            } else {
                this.selectAt(0);
            }
        },
            selectAddedScript: function selectAddedScript(scriptName) {
            var index = this.getList().indexOf(scriptName);
            if (index !== -1) 
                return this.selectAt(index);
            
            // added script not in current tag, therefore list all scripts
            this.owner.tagChooser.setTag(null);
            
            var index = this.getList().indexOf(scriptName);
            if (index !== -1) 
                return this.selectAt(index);
        }
        },{
            _Extent: lively.pt(64.9,15.0),
            _FontFamily: "Arial, sans-serif",
            _FontSize: 9,
            _MaxTextWidth: 64.8979476392384,
            _MinTextWidth: 64.8979476392384,
            _Position: lively.pt(10.0,46.0),
            allowsInput: false,
            className: "lively.morphic.Text",
            doNotSerialize: ["charsTyped"],
            emphasis: [[0,7,{
                fontWeight: "normal",
                italics: "normal"
            }]],
            eventsAreIgnored: true,
            fixedWidth: true,
            isCopyMorphRef: true,
            morphRefId: 18,
            name: "ObjectEditorScriptsText",
            sourceModule: "lively.morphic.TextCore",
            submorphs: [],
            textString: "Scripts"
        },{
            _ClipMode: "auto",
            _Extent: lively.pt(180.0,74.0),
            _Fill: Color.rgb(243,243,243),
            _FontSize: 10,
            _Position: lively.pt(10.0,346.7),
            className: "lively.morphic.List",
            droppingEnabled: true,
            grabbingEnabled: false,
            itemList: [],
            layout: {moveVertical: true,resizeHeight: false},
            name: "ObjectEditorConnectionList",
            sourceModule: "lively.morphic.Core",
            connectionRebuilder: function connectionRebuilder() {
            lively.bindings.connect(this, "selection", this.get("ObjectEditorPane"), "displaySourceForConnection", {converter: 
        function (value) {
                if (!value) return;
                return (value === '-- ALL --') ? null : value[1];
        }});
        },
            preselectItem: function preselectItem() {
            if (this.getList().size() === 2) {
                this.selectAt(1);
            } else {
                this.selectAt(0);
            }
        }
        },{
            _Extent: lively.pt(124.1,22.0),
            _FontFamily: "Arial, sans-serif",
            _FontSize: 14,
            _MaxTextWidth: 124.10506681670552,
            _MinTextWidth: 124.10506681670552,
            _Position: lively.pt(10.0,322.8),
            allowsInput: false,
            className: "lively.morphic.Text",
            doNotSerialize: ["charsTyped"],
            emphasis: [[0,11,{
                fontSize: "9",
                fontWeight: "normal",
                italics: "normal"
            }]],
            eventsAreIgnored: true,
            fixedWidth: true,
            isCopyMorphRef: true,
            layout: {
                moveVertical: true
            },
            morphRefId: 20,
            name: "ObjectEditorConnectionsText",
            sourceModule: "lively.morphic.TextCore",
            submorphs: [],
            textString: "Connections"
        },{
            _BorderColor: Color.rgb(214,214,214),
            _BorderRadius: 5,
            _BorderWidth: 1,
            _Extent: lively.pt(25.0,20.0),
            _Position: lively.pt(130.0,322.8),
            className: "lively.morphic.Button",
            doNotCopyProperties: [],
            doNotSerialize: [],
            isCopyMorphRef: true,
            isPressed: false,
            label: "+",
            layout: {
                moveVertical: true
            },
            morphRefId: 21,
            name: "ObjectEditorAddConnectionButton",
            padding: lively.rect(5,0,0,0),
            showsMorphMenu: true,
            sourceModule: "lively.morphic.Widgets",
            submorphs: [],
            toggle: false,
            value: false,
            connectionRebuilder: function connectionRebuilder() {
            lively.bindings.connect(this, "fire", this.get("ObjectEditorPane"), "newConnection", {});
        }
        },{
            _BorderColor: Color.rgb(214,214,214),
            _BorderRadius: 5,
            _BorderWidth: 1,
            _Extent: lively.pt(25.0,20.0),
            _Position: lively.pt(130.0,40.0),
            className: "lively.morphic.Button",
            doNotCopyProperties: [],
            doNotSerialize: [],
            isCopyMorphRef: true,
            isPressed: false,
            label: "+",
            morphRefId: 22,
            name: "ObjectEditorAddScriptButton",
            padding: lively.rect(5,0,0,0),
            showsMorphMenu: true,
            sourceModule: "lively.morphic.Widgets",
            submorphs: [],
            toggle: false,
            value: false,
            connectionRebuilder: function connectionRebuilder() {
            lively.bindings.connect(this, "fire", this.get("ObjectEditorPane"), "newScript", {});
        }
        },{
            _BorderColor: Color.rgb(214,214,214),
            _BorderRadius: 5,
            _BorderWidth: 1,
            _Extent: lively.pt(25.0,20.0),
            _Position: lively.pt(160.0,322.8),
            className: "lively.morphic.Button",
            doNotCopyProperties: [],
            doNotSerialize: [],
            isCopyMorphRef: true,
            isPressed: false,
            label: "-",
            layout: {
                moveVertical: true
            },
            morphRefId: 23,
            name: "ObjectEditorRemoveConnectionButton",
            objectEditorPane: {
                isMorphRef: true,
                name: "ObjectEditorPane"
            },
            padding: lively.rect(5,0,0,0),
            showsMorphMenu: true,
            sourceModule: "lively.morphic.Widgets",
            submorphs: [],
            toggle: false,
            value: false,
            connectionRebuilder: function connectionRebuilder() {
            lively.bindings.connect(this, "fire", this, "disconnectSelectedConnection", {});
        },
            disconnectSelectedConnection: function disconnectSelectedConnection() {
            var editor = this.objectEditorPane,
                selection = editor.connectionList.selection;
            if (!editor.target || editor.connectionList.getList().size() < 2) return;
            return this.world().confirm(
                'Disconnect "' + selection[0] +'" connection?',
                function (confirmed) {
                    if (!confirmed) return;
                    var listIndex = editor.target.attributeConnections.indexOf(selection[1]);
                    if (selection && (typeof selection !== "string") && listIndex > -1) {
                        var c = selection[1];
                        lively.bindings.disconnect(
                            c.sourceObj, c.sourceAttrName, c.targetObj, c.targetMethodName);
                        editor.updateLists();
                        editor.displayInitialScript();
                    } 
                });
        }
        },{
            _BorderColor: Color.rgb(214,214,214),
            _BorderRadius: 5,
            _BorderWidth: 1,
            _Extent: lively.pt(25.0,20.0),
            _Position: lively.pt(160.0,40.0),
            className: "lively.morphic.Button",
            doNotCopyProperties: [],
            doNotSerialize: [],
            isCopyMorphRef: true,
            isPressed: false,
            label: "-",
            morphRefId: 24,
            name: "ObjectEditorRemoveScriptButton",
            objectEditorPane: {
                isMorphRef: true,
                name: "ObjectEditorPane"
            },
            padding: lively.rect(5,0,0,0),
            showsMorphMenu: true,
            sourceModule: "lively.morphic.Widgets",
            submorphs: [],
            toggle: false,
            value: false,
            connectionRebuilder: function connectionRebuilder() {
            lively.bindings.connect(this, "fire", this.get("ObjectEditorPane"), "deleteSelectedScript", {});
        }
        },{
            _BorderWidth: 1,
            _Extent: lively.pt(8.6,9.7),
            _Fill: Color.rgb(0,0,0),
            _Position: lively.pt(782.0,40.0),
            alarmColor: Color.rgb(240,0,0),
            className: "lively.morphic.Box",
            doNotSerialize: ["_renderContext","halos","_isRendered","priorExtent","cachedBounds"],
            droppingEnabled: true,
            isCopyMorphRef: true,
            layout: {
                adjustForNewBounds: true,
                moveHorizontal: true
            },
            morphRefId: 26,
            name: "ChangeIndicator",
            savedColor: Color.rgb(0,0,0),
            sourceModule: "lively.morphic.Core",
            submorphs: [],
            indicateUnsavedChanges: function indicateUnsavedChanges() {
            if (this.owner.scriptPane.hasChanged()) {
                this.setColors(this.alarmColor);
            } else {
                this.setColors(this.savedColor);
            }
        },
            setColors: function setColors(color) {
            this.setFill(color);
            this.setBorderColor(color);
        }
        },{
            _BorderColor: Color.rgb(214,214,214),
            _BorderRadius: 5,
            _BorderWidth: 1,
            _Extent: lively.pt(220.0,21),
            _Position: lively.pt(200,10),
            className: "lively.morphic.Button",
            isPressed: false,
            label: "empty",
            list: [],
            name: "ObjectEditorMorphSelector",
            padding: lively.rect(5,0,0,0),
            selection: {
                isMorphRef: true,
                name: "Title"
            },
            showsMorphMenu: true,
            sourceModule: "lively.morphic.Widgets",
            textString: "",
            createScenePresentation: function createScenePresentation() {
             var that = this,
                items = this.currentMorphicScene(),
                height = this.owner.getExtent().y,
                bounds = new Rectangle(0, this.getExtent().y, this.getExtent().x * 2, height),
                treeMorph = new lively.morphic.Tree(),
                rect = lively.morphic.Morph.makeRectangle(bounds),
                currentTarget = null;
                
            treeMorph.childrenPerPage = 10000;
            treeMorph.setName("MorphSelectorTree");
            treeMorph.getLayouter().defer();
            treeMorph.setItem(items);
            treeMorph.childNodes.each(function (n) {
                n.expand();
            })
                
            currentTarget = this.highlightCurrentTarget(treeMorph);
            
            rect.setFill(Color.white);
            rect.beClip(true);
            rect.disableGrabbing();
            rect.disableDragging();
            rect.setBorderWidth(1);
            rect.setBorderColor(Color.rgb(150,150,150));
            rect.addMorph(treeMorph);
            rect.treeMorph = treeMorph;
            rect.currentTarget = currentTarget;
        
            return rect;
        },
            currentMorphicScene: function currentMorphicScene() {
            var onSelect = function onSelect(tree) {
                this.selector.updateTargetFromSelection(this.value);
            }
            var properties = {
                    editorPane: this.owner,
                    selector: this
                }
            
            return {children: [{ 
                name: 'World',
                value: this.world(),
                selector: this,
                onSelect: onSelect,
                children: this.world().submorphs.invoke('treeItemsOfMorphNames',
                    {scripts: [onSelect],
                     properties: properties,
                     showUnnamed: true}).compact()
            }]};
        },
            highlightCurrentTarget: function highlightCurrentTarget(tree) {
            var target = this.owner.target,
                nodes = tree.childNodes,
                highlightNode;
        
            if (!target) {
                return
            } else if (target.isMorph) {
                var expandables = [target],
                    nextOwner = target,
                    currentNode
                while (nextOwner.owner) {
                    expandables.push(nextOwner.owner)
                    nextOwner = nextOwner.owner
                }
                expandables.reverse().each(function (m) {
                    currentNode = nodes.detect(function (n) {
                        return n.item.value === m;
                    })
                    if (currentNode) {
                        nodes = currentNode.childNodes
                        if (!nodes && currentNode.item.children) {
                            currentNode.expand();
                            nodes = currentNode.childNodes;
                        }
                    } else {
                        return;
                    }
                })
                if (currentNode && currentNode.item.value === target) {
                    highlightNode = currentNode;
                }
            } else {
                var groupNodes = nodes.detect(function (n) {
                    return n.item.value === 'groups';
                }).childNodes
                highlightNode = groupNodes.detect(function (n) {
                    // group names are unique
                    return n.item.value.name === target.name;
                })
            }
        
            if (highlightNode) {
                this.highlightTarget(highlightNode);
            }
            return highlightNode;
        },
            highlightTarget: function highlightTarget(node) {
            node.submorphs[0].setFill(Color.rgb(218,218,218))
        },
            onBlur: function onBlur(evt) {
            $super(evt);
            
            // remove the scene presentation when clicked elsewhere
            var target = evt.world.clickedOnMorph;
            if (!this.listMorph || !this.listMorph.isAncestorOf(target)) {
                this.removeTargetChooser();
            } else {
                this.focus();
            }
        },
            onMouseDown: function onMouseDown(evt) {
            if (evt.isCommandKey() || evt.isRightMouseButtonDown()) {
                return $super(evt);
            }
            
            if (this.listMorph) {
                // clicked on morph, not the list, not the list's scrollbar
                if (evt.target === this.renderContext().shapeNode)
                    this.removeTargetChooser();
            } else {
                this.presentTargetChooser();
            }
        },
            presentTargetChooser: function presentTargetChooser() {
            var list = this.createScenePresentation(),
                tree = list.treeMorph,
                target = list.currentTarget
            
            list.setVisible(false)
            this.addMorph(list)
            this.listMorph = list
            list.focus()
        
            // need temp here, doesn't work otherwise, strange errors... Javascript WAT
            var layouting = function() {
                list.setVisible(true)
                
                if (target) {
                    var globalTransform = new lively.morphic.Similitude()
                    for (var morph = target; (morph != list) && 
                            (morph != undefined); morph = morph.owner) {
                        globalTransform.preConcatenate(morph.getTransform());
                    }              
                        
                    list.scrollRectIntoView(target.getBounds().
                                                translatedBy(globalTransform.getTranslation()));
                    tree.getLayouter().resume();
                }
            }
            layouting.morphicDelay(1);
        },
            removeHighlight: function removeHighlight(node) {
            node.submorphs[0].setFill(Color.rgb(255,255,255))
        },
            removeTargetChooser: function removeTargetChooser() {
            if (this.listMorph) {
                this.listMorph.remove();
                delete this.listMorph;   
            }
        },
            reset: function reset() {
            this.removeTargetChooser();
            this.setLabel('empty');
            this.applyStyle({fixedWidth: true, fixedHeight: true, borderWidth: 1, overflow: 'visible'});
        },
            setLabel: function setLabel(label) {
            this.label.setTextString(label);
            this.label.setAlign('left');
        },
            updateTargetFromOwner: function updateTargetFromOwner() {
            this.setLabel(this.owner.target);
        },
            updateTargetFromSelection: function updateTargetFromSelection(selection) { 
            function update(confirmed) {
                if (!confirmed) return;
                this.owner.setTarget(selection);
                this.setLabel(selection.getName() || selection.toString());
            }
            this.removeTargetChooser();
            if (this.owner.hasUnsavedChanges && this.owner.hasUnsavedChanges()) {
                this.owner.confirmUnsavedChanges(update);
            } else {
                update.call(this, true);
            }
        }
        },{
            _Extent: lively.pt(64.9,15.0),
            _FontFamily: "Arial, sans-serif",
            _FontSize: 9,
            _MaxTextWidth: 64.8979476392384,
            _MinTextWidth: 64.8979476392384,
            _Position: lively.pt(10.0,12.9),
            allowsInput: false,
            className: "lively.morphic.Text",
            doNotSerialize: ["charsTyped"],
            emphasis: [[0,4,{
                fontWeight: "normal",
                italics: "normal"
            }]],
            eventsAreIgnored: true,
            fixedWidth: true,
            isCopyMorphRef: true,
            morphRefId: 27,
            name: "ObjectEditorScriptsText2",
            sourceModule: "lively.morphic.TextCore",
            submorphs: [],
            textString: "Tag:"
        },{
            _BorderColor: Color.rgb(214,214,214),
            _BorderRadius: 5,
            _BorderWidth: 1,
            _Extent: lively.pt(130.0,20.0),
            _Position: lively.pt(39.1,10.0),
            className: "lively.morphic.Button",
            doNotSerialize: ["_renderContext","halos","_isRendered","priorExtent","cachedBounds"],
            isPressed: false,
            label: "all",
            list: [],
            listMorph: null,
            name: "ObjectEditorTagChooser",
            padding: lively.rect(5,0,0,0),
            savedTextString: "all",
            selection: "",
            setTargetToListSelection: "all",
            showsMorphMenu: true,
            sourceModule: "lively.morphic.Widgets",
            submorphs: [],
            textString: "PartsBinBrowser",
            toggle: false,
            value: true,
            createListMorph: function createListMorph() {
            var items = this.getList();
        
            var height = Math.min(this.owner.getExtent().y, items.length * 17);
            var extent = new Rectangle(0, this.getExtent().y, this.getExtent().x, height);
        
            var listMorph = new lively.morphic.List(extent);
            listMorph.setList(items);
        
            listMorph.disableGrabbing();
            listMorph.disableDragging();
            
            connect(listMorph, 'selection', this, 'setTag');
            
            return listMorph;
        },
            getList: function getList() {
            if (!this.owner.target) return [''];
        
            var target = this.owner.target;
        
            var tags = Functions.own(target).collect(function (each) {
                return target[each].tags || [];
            }).flatten().uniq();
        
            var sortedTags = tags.sortBy(function(name) { 
                return name.toLowerCase() 
            });
            
            sortedTags.unshift('all'); 
            return sortedTags;
        },
            onBlur: function onBlur(evt) {
            $super(evt);
            
            // workaround - otherwise other morphs get this event
            var clickedMorph = evt && evt.world && evt.world.clickedOnMorph;
            if (clickedMorph && (clickedMorph !== this && clickedMorph !== this.listMorph)) {
                this.removeList();
            }
        },
            onMouseUp: function onMouseUp(evt) {
            if (evt.isCommandKey() || evt.isRightMouseButtonDown()) return $super(evt);
            if (this.listMorph) {
                this.removeList.bind(this).delay(0);
                return true;
            } 
            if (this.getList().size() < 2) return;
            var list = this.createListMorph();
            this.addMorph(list);
            this.listMorph = list;
            return true;
        },
            removeList: function removeList() {
            this.listMorph && this.listMorph.remove()
            this.listMorph = null;
        },
            reset: function reset() {
            this.list = [];
            this.setLabel('all');
            this.label.setAlign('left');
            this.removeList();
            this.applyStyle({fixedWidth: true, fixedHeight: true, borderWidth: 1, overflow: 'visible'})
        },
            setTag: function setTag(tag) {
            this.setLabel(tag || '');
            this.label.setAlign('left');
            this.owner.setTag(tag);
        }
        },{
            _BorderColor: Color.rgb(214,214,214),
            _BorderRadius: 5,
            _BorderWidth: 1,
            _Extent: lively.pt(100,21),
            _Position: lively.pt(690,10),
            className: "lively.morphic.Button",
            label: "run",
            layout: {
                centeredHorizontal: false,
                moveHorizontal: true
            },
            name: "Button",
            connectionRebuilder: function connectionRebuilder() {
            lively.bindings.connect(this, "fire", this.get("ObjectEditorPane"), "runScript", {});
        }
        },{
            _BorderColor: Color.rgb(214,214,214),
            _BorderRadius: 5,
            _BorderWidth: 1,
            _Extent: lively.pt(100,21),
            _Position: lively.pt(580,10),
            className: "lively.morphic.Button",
            doNotCopyProperties: [],
            doNotSerialize: [],
            isPressed: false,
            label: "save",
            layout: {
                centeredHorizontal: false,
                moveHorizontal: true
            },
            name: "saveButton",
            sourceModule: "lively.morphic.Widgets",
            submorphs: [],
            toggle: false,
            value: false,
            connectionRebuilder: function connectionRebuilder() {
            lively.bindings.connect(this, "fire", this.get("ObjectEditorScriptPane"), "doSave", {});
        }
        },{
            _BorderColor: Color.rgb(214,214,214),
            _BorderRadius: 5,
            _BorderWidth: 1,
            _Extent: lively.pt(100,21),
            _Position: lively.pt(470,10),
            className: "lively.morphic.Button",
            label: "Tests",
            layout: { moveHorizontal: true },
            name: "openTestsButton",
            sourceModule: "lively.morphic.Widgets",
            connectionRebuilder: function connectionRebuilder() {
            lively.bindings.connect(this, "fire", this.get("ObjectEditorPane"), "openPartTestRunner", {});
        }
        },{
            _BorderColor: Color.rgb(214,214,214),
            _BorderRadius: 5,
            _BorderWidth: 1,
            _Extent: lively.pt(27.0,21),
            _Position: lively.pt(425,10),
            className: "lively.morphic.Button",
            highlightRectangle: {
                isMorphRef: true,
                name: "HighlightRectangle"
            },
            name: "MagnifierButton",
            submorphs: [{
                _BorderColor: Color.rgb(204,0,0),
                _Extent: lively.pt(29.0,29.0),
                _HandStyle: "default",
                _PointerEvents: "none",
                _Position: lively.pt(-14,1),
                className: "lively.morphic.Image",
                eventsAreDisabled: true,
                name: "leftpointing_magnifying_glass.png",
                sourceModule: "lively.morphic.Widgets",
                submorphs: [],
                url: "data:image/png;base64,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"
            }],
            toggle: false,
            value: false,
            connectionRebuilder: function connectionRebuilder() {
            lively.bindings.connect(this, "fire", this, "onFire", {});
        },
            currentTarget: function currentTarget() {
            return this.owner.target;
        },
            getHighlightRectangle: function getHighlightRectangle() {
            // delete this.highlightRectangle
            if (this.highlightRectangle) return this.highlightRectangle;
            var rect = this.highlightRectangle = lively.BuildSpec('HighlightRectangle', {
                _BorderColor: Color.rgb(204,0,0),
                _Extent: lively.pt(474.7,129.0),
                _Fill: Color.rgb(58,0,255),
                _Opacity: 0.3,
                className: "lively.morphic.Box",
                name: "HighlightRectangle",
                bringToFront: function bringToFront() {
                    this.renderContext().morphNode.style.zIndex= 1000;
                },
                connectionRebuilder: function connectionRebuilder() {
                    lively.bindings.connect(this, "onMouseMove", this, "updateOnMove", {});
                },
                morphUnderCursor: function morphUnderCursor() {
                    var that = this,
                        world = lively.morphic.World.current();    
                    
                    return world.morphsContainingPoint(world.firstHand().getPosition()).detect(
                        function(ea) {
                            return  !ea.isPlaceholder &&
                                    !ea.isHalo &&
                                    (!ea.owner || !ea.owner.isHalo) &&
                                    !(ea === that);
                    });
                },
                update: function update(morphUnderCursor) {
                    if (morphUnderCursor === this.magnifierButton ||
                            this.magnifierButton.submorphs.include(morphUnderCursor)) {
                        morphToHighlight = this.magnifierButton.currentTarget();
                    } else {
                        morphToHighlight = morphUnderCursor;
                    }
                
                    if (morphToHighlight && morphToHighlight.world()) {
                        this.setPosition(morphToHighlight.getPositionInWorld());
                        this.setExtent(morphToHighlight.getExtent());
                    }
                },
                updateOnMove: function updateOnMove() {
                    this.update(this.morphUnderCursor());
                    this.bringToFront();
                }
            }).createMorph();
            rect.magnifierButton = this;
            connect(rect, "onMouseMove", this.getHighlightRectangle(), "updateOnMove")
            connect(rect, "onMouseUp", this, "removeHighlighting")
            connect(rect, "onMouseUp", this.owner, "setTarget",{
                converter: function () { return this.sourceObj.morphUnderCursor(); }})
            return rect;
        },
            isHighlighting: function isHighlighting() {
            return !!this.targetHighlight;
        },
            isTracking: function isTracking() {
            return !!this.world().firstHand().highlightConnection;
        },
            onFire: function onFire() {
            var hand = lively.morphic.World.current().firstHand(),
                highlight = this.getHighlightRectangle(),
                that = this;
        
            if (this.isTracking()) {
                this.removeHighlighting();
            } else {
                this.world().addMorph(highlight);
                hand.highlightConnection = connect(hand, "scrollFocusMorph", highlight, "update");
                highlight.bringToFront();
                if (!this.currentTarget() || !this.currentTarget().world()) {
                    highlight.setExtent(pt(0,0));
                }
            }
        },
            onMouseMove: function onMouseMove(evt) {
            var target = this.currentTarget();
            if (target && target.world() && !this.isHighlighting()) {
                this.getHighlightRectangle().update(target);
                this.world().addMorph(this.getHighlightRectangle());
                this.getHighlightRectangle().bringToFront();
                this.targetHighlight = this.getHighlightRectangle();
            }
        },
            onMouseOut: function onMouseOut() {
            if (this.isHighlighting()) {
                if (!this.isTracking()) {
                    this.targetHighlight.remove();
                }
                delete this.targetHighlight;
            }
        },
            removeHighlighting: function removeHighlighting() {
            var hand = this.world().firstHand();
            
            if (this.getHighlightRectangle()) {
                this.getHighlightRectangle().remove();
            }
            
            hand.highlightConnection && hand.highlightConnection.disconnect();
            hand.highlightConnection = null;
        },
            reset: function reset() {
            disconnectAll(this.getHighlightRectangle());
        }
        }],
        tagChooser: {isMorphRef: true, name: "ObjectEditorTagChooser" },
        target: null,
        confirmUnsavedChanges: function confirmUnsavedChanges(callback) {
        return this.world().confirm("Discard unsaved changes?", callback.bind(this));
    },
        copyToPartsBinWithUserRequest: function copyToPartsBinWithUserRequest() {
        this.owner.copyToPartsBinWithUserRequest();
    },
        deleteSelectedScript: function deleteSelectedScript() {
        var editor = this,
            selection = editor.scriptList.selection,
            idx = editor.scriptList.selectedLineNo;
        if (!editor.target || editor.scriptList.getList().size() < 2) return;    
        
        return editor.world().confirm('Delete "' + selection + '" script?', function (confirmed) {
            if (!confirmed || !selection || !editor.target
             || !editor.target.hasOwnProperty(selection)) return;
            delete editor.target[selection];
            editor.updateLists();
            editor.scriptList.selectAt(idx);
        });
    },
        displayInitialScript: function displayInitialScript() {
        if (this.scriptList.getList().size() > 1) {
            this.scriptList.preselectItem();
        } else if (this.connectionList.getList().size() > 1) {
            this.connectionList.preselectItem();
        } else {
            this.scriptList.selectAt(0);
        }
    },
        displayJavaScriptSource: function displayJavaScriptSource(jsCode, selectString) {
        var editor = this.scriptPane;
        function insert() {
            editor.display(jsCode);
            editor.focus();
            selectString && editor.find({needle: selectString, start: {column: 0, row: 0}});
        }
        if (this.scriptPane.hasChanged()) {
            this.confirmUnsavedChanges(function(confirmed) { confirmed && insert(); });
        } else { insert(); }
    },
        displaySourceForConnection: function displaySourceForConnection(connection) {
        var code = "", that = this;
        if (connection === undefined) return;
        if (connection === null) {
            this.sortedConnectionNamesOfObj(this.target).forEach(function(each) {
                code = code.concat(that.generateSourceForConnection(each[1])).concat("\n\n");
            });
            code = code.substring(0, code.length - "\n\n".length - 1);
        } else {
            code = this.generateSourceForConnection(connection);
        }
        this.displayJavaScriptSource(code);
    },
        displaySourceForScript: function displaySourceForScript(scriptName) {
        var code = "",
            that = this;
        if (scriptName === null) {
            this.sortedScriptNamesOfObj(this.target).forEach(function(each) {
                code = code.concat(that.generateSourceForScript(each)).concat("\n\n\n");
            });
            code = code.substring(0, code.length - "\n\n\n".length - 1);
        } else {
            code = this.generateSourceForScript(scriptName);
        }
        if (code) this.displayJavaScriptSource(code);
    },
        ensureAnnotationLayer: function ensureAnnotationLayer() {
        module('lively.LayerableMorphs').load(true);
    
        if ("ScriptAnnotationLayer" in Global) return;
        
        cop.create("ScriptAnnotationLayer");
        ScriptAnnotationLayer.refineClass(
            lively.morphic.Morph,{
                
            addScript: function(funcOrString) {
                var func = Function.fromString(funcOrString),
                    oldFunction = this[func.name],
                    changed = oldFunction && oldFunction.toString() !== func.toString();
                   
                var result = cop.proceed.apply(this, arguments);
    
                if (oldFunction && !changed) {
                     this[func.name].setTimestampAndUser(oldFunction.timestamp, oldFunction.user);
                } else {
                     this[func.name].setTimestampAndUser();
                }
                return result;
            },
    
            tagScript: function(scriptName, tags) {
                return this[scriptName].tag(tags);
            }
    
        });   
        ScriptAnnotationLayer.refineObject(
            Function.prototype,{
    
            setTimestampAndUser: function(timestamp, user) {
                this.setProperty('timestamp', timestamp || new Date());
                this.setProperty('user', user || (lively.LocalStorage && lively.LocalStorage.get('UserName')));
            },
            
            tag: function(tags) {
                tags = (typeof tags === 'string') ? [tags] : tags;
                this.setProperty("tags", tags);
                return true; 
            }  
        });
    
    },
        generateSourceForConnection: function generateSourceForConnection(connection) {
        var c = connection, targetObject = this.target;
        if (!c.getTargetObj() || !c.getTargetObj().name || 
            !c.getSourceObj() || !c.getSourceObj().name) return String(c);
    
        var optConfig = [];
        if (c.converterString)
            optConfig.push("converter: \n\t" + c.converterString);
        if (c.updaterString)
            optConfig.push("updater: \n\t" + c.updaterString);
        return Strings.format('connect(%s, "%s", %s, "%s", {%s});', 
            this.generateTargetCode(targetObject, c.getSourceObj()),
            c.getSourceAttrName(),
            this.generateTargetCode(targetObject, c.getTargetObj()),
            c.getTargetMethodName(),
            optConfig.join(','));
    
    },
        generateSourceForScript: function generateSourceForScript(scriptName) {
        var script = this.target[scriptName],
            annotation = '',
            scriptSource = '',
            tagScript = '';
    
        if (!script) return;
    
        if (script.timestamp && script.user) 
            annotation = Strings.format('// changed at %s by %s  \n', script.timestamp, script.user);
        scriptSource = Strings.format('this.addScript(%s)', script.getOriginal());
        tagScript = Strings.format('.tag(%s);', this.printTags(script));
    
        return annotation + scriptSource + tagScript;
    },
        generateTargetCode: function generateTargetCode(baseObject, targetObject) {
        var name = targetObject.name;
        if (baseObject === targetObject) 
            return "this";
        else if (baseObject[name] ===  targetObject) 
            return "this." + name;
        else if (baseObject.testObject ===  targetObject) 
            return "this.testObject";
        else if (baseObject.get(name) === targetObject) 
            return 'this.get("' + name + '")';
        else if (targetObject instanceof lively.morphic.Morph) 
            return '$morph("' + name + '")';
        else 
            return "????";
    },
        hasUnsavedChanges: function hasUnsavedChanges() {
        return this.scriptPane.hasChanged();
    },
        newConnection: function newConnection() {
        if (this.target) {
            var code = "lively.bindings.connect(SOURCE, SOURCE_PROPERTY, TARGET, TARGET_PROPERTY);";
            this.displayJavaScriptSource(code, "SOURCE");
        }
    },
        newScript: function newScript() {
        if (this.target) {
            var code = "this.addScript(function SCRIPTNAME() {\n    \n}).tag([]);";
            this.displayJavaScriptSource(code, "SCRIPTNAME");
        }
    },
        confirmShutdown: function confirmShutdown(thenDo) {
        if (!this.scriptPane.hasChanged()) return thenDo(true);
        this.confirmUnsavedChanges(thenDo);
    },
    onKeyDown: function onKeyDown(evt) {
    var keys = evt.getKeyString();
    switch (keys) {
        case 'Command-Shift-R': case 'Control-Shift-R':
            this.runScript();
            evt.stop(); return true;
        case 'Command-Shift-+': case 'Control-Shift-+':
            this.newScript();
            evt.stop(); return true;
    }
    return $super(evt);
},
        onWindowGetsFocus: function onWindowGetsFocus() {
                this.get('ObjectEditorScriptPane').focus();
            },
        openPartTestRunner: function openPartTestRunner() {
        module('lively.PartsTestFramework').load();
        var runner = $part('PartTestRunnerWithCodeEditor', 'PartsBin/Tools');
        runner.setPartUnderTest(this.target);
        runner.openInWorld();
        runner.align(runner.bounds().topLeft(),
            this.owner.bounds().topLeft().addPt(pt(30,30)))
    },
        printTags: function printTags(script) {
        if (!script.tags) return "[]";
    
        var printString = '[';
        for (var i=0; i < script.tags.length; i++) {
            if (i !== 0) printString += ', ';
            printString += '"' + script.tags[i] + '"';
        }
        printString += ']';
        return printString;
    },
        reset: function reset() {
        this.scriptPane = this.get('ObjectEditorScriptPane');
        this.scriptList = this.get('ObjectEditorScriptList');
        this.connectionList = this.get('ObjectEditorConnectionList');
        this.morphSelector = this.get('ObjectEditorMorphSelector');
        
        this.target = null;
        this.currentTag = null;
        
        this.scriptPane.reset();
        this.scriptList.setList();
        this.scriptList.selection = null;
        this.connectionList.setList();
        this.connectionList.selection = null;
        this.morphSelector.reset();
        this.tagChooser.reset();
        
        this.stopStepping();
    },
        runScript: function runScript() {
        var scriptName = this.get("ObjectEditorScriptList").selection;
        if (!scriptName || !this.target) return;
        this.world().alertOK("Running " + scriptName);
        this.target[scriptName]();
    },
        selectChangedContent: function selectChangedContent(source) {
    
        var addScriptRegex = /this\.addScript\s*\(\s*function\s*([^\(]*)/g;
        var addScriptMatches = [];
        var addScriptMatch = addScriptRegex.exec(source);
        while (addScriptMatch) {
            addScriptMatches.push(addScriptMatch[1]);
            addScriptMatch = addScriptRegex.exec(source);
        }
            
        // if scripts were added, select either a specific one or all
        if (addScriptMatches.length > 0) { 
            if (addScriptMatches.length === 1) {
                return this.scriptList.selectAddedScript(addScriptMatches[0]);
            }
            return this.scriptList.selectAt(0);
        }
    
        var connectionRegex = 
            /connect\(\s*([^,]*)\s*,\s*"([^,]*)"\s*,\s*([^,]*)\s*,\s*"([^,]*)"/g;
        var connectionMatches = [];
        var connectionMatch = connectionRegex.exec(source);
        while (connectionMatch) {
            connectionMatches.push(connectionMatch);
            connectionMatch = connectionRegex.exec(source);
        }
    
        // if connections were made, select either a specific one or all
        if (connectionMatches.length > 0) {
            if (connectionMatches.length === 1) {
                var match = connectionMatches[0];
                for (var i=0; i<this.connectionList.getList().length; i++) {
                    if (this.connectionList.getList()[i] === "-- ALL --") continue;
                    var connection = this.connectionList.getList()[i][1];
                    if (connection.sourceAttrName === match[2] &&
                    connection.targetMethodName === match[4]) {
                        return this.connectionList.selectAt(i);
                    }
                }
                this.connectionList.getList().indexOf(addScriptMatches[0]);
            } 
            return this.connectionList.selectAt(0);
        }
    
    },
        setTag: function setTag(tag) {
        if (tag === 'all') {
            this.currentTag = '';
        } else {
            this.currentTag = tag;
        }
        this.updateLists();
        this.displayInitialScript();
    },
        setTarget: function setTarget(targetMorph) {
        this.target = targetMorph;
        this.scriptPane.updateTarget();
        this.morphSelector.updateTargetFromOwner();
        this.updateLists();
        this.displayInitialScript();
    
        this.stopStepping();
        this.startStepping(500/*ms*/, 'update'); 
    },
        sortedConnectionNamesOfObj: function sortedConnectionNamesOfObj(obj) {
        if ("attributeConnections" in obj) {
            return obj.attributeConnections.
                sortBy(function(each) {return name.toLowerCase() }).
                collect(function(each) {return [each.getSourceAttrName(), each]});
        } else {
            return [];
        }
    },
        sortedScriptNamesOfObj: function sortedScriptNamesOfObj(obj) {
    
        if (!Functions.own(obj) ||  Functions.own(obj).size() == 0) return [];
    
        var selectedScripts = Functions.own(obj).
        select(function(name) { return obj[name].getOriginal().hasLivelyClosure }).
        sortBy(function(name) { return name.toLowerCase() });
    
        if (!this.currentTag) return selectedScripts;
    
        var that = this;
        selectedScripts = selectedScripts.select(function(scriptName) {
            return obj[scriptName].tags && 
                obj[scriptName].tags.indexOf(that.currentTag) !== -1;
        });
    
        return selectedScripts;
    },
        update: function update() {
        // alias to conform to convention
        this.updateLists();
    },
        updateLists: function updateLists() {
    
        var scriptListItems = this.sortedScriptNamesOfObj(this.target);
        scriptListItems.unshift("-- ALL --");
        if (!Arrays.equal(scriptListItems, this.scriptList.getList())) {
            this.scriptList.setList(scriptListItems);
        }
        
        var connectionListItems = this.sortedConnectionNamesOfObj(this.target);
        connectionListItems.unshift("-- ALL --");
        if (!Arrays.equal(connectionListItems, this.connectionList.getList())) {
            this.connectionList.setList(connectionListItems);
        }
    }
    }],
    titleBar: "ObjectEditor",
    onKeyDown: function onKeyDown(evt) {
    var sig = evt.getKeyString(),
        scriptList = this.get('ObjectEditorScriptList'),
        sourcePane = this.get('ObjectEditorScriptPane');
    switch(sig) {
        case 'F1': scriptList.focus(); evt.stop(); return true;
        case 'F2': sourcePane.focus(); evt.stop(); return true;
        default: $super(evt);        
    }
},
    initiateShutdown: function initiateShutdown(force) {
    if (force || !this.targetMorph.scriptPane.hasChanged()) {
        $super();
    } else {
        this.targetMorph.confirmShutdown(function(answer) {
            answer && this.initiateShutdown(true);
        }.bind(this));
    }
},
    reset: function reset() {
    this.targetMorph.reset();
},
    setTarget: function setTarget(t) {
    this.targetMorph.setTarget(t);
}
});

}) // end of module