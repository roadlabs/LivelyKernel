module('lively.morphic.SAPCommonWidgets').requires('lively.morphic.Core', 'lively.morphic.Events', 'lively.WidgetsTraits', 'lively.morphic.Styles').toRun(function() {

lively.morphic.Morph.subclass('lively.morphic.SAPCellFormatter',
'default category', {
    initialize: function($super) {
        $super(new lively.morphic.Shapes.Rectangle(new Rectangle(0,0,500,500)));
        this.oOkCallBack=null;
        this.selectedCategory = "general" ;      //default
        this.selectedSymbol="USD";             //default
        this.selectedDecimalPlaces = 2;        //default
        this.selectedUseThousand = true;       //default
        this.selectedDateFormat = "mm/dd/yyyy";//default
        this.selectedTimeFormat = "h:M TT";    //default
        this.selectedNegativeNumber = 0        //default:  blackwith-(0),readwith-(1),blackwithBracket(2),redwithbracket(3)
        this.grid;
        this.toolBar;
        this.lstCategory = null;
        this.lstNegativeNumber=null;
        this.lstDataTime=null;
        this.ddlDecimalPlaces = null;
        this.ddlCurrencySymbol = null;
        this.txtCategory = null;
        this.txtDecimalPlaces = null;
        this.txtSymbol = null;
        this.txtType = null;
        this.txtGeneralInfo=null;
        this.chkUseThousand=null;
        this.txtNegatvieNumbers
        this.txtUseThousand=null;
        this.btnOk=null;
        this.btnCancel=null;
        this.arrCurrency=[];
        this.arrCategory=[];
        this.arrNegativeNumber=[];
        this.arrNegativeCurrencyNumber=[];
        this.arrDateFormat=[];
        this.arrTimeFormat=[];
        this.buildListItems();
        this.initializeLayout();
    },
    setSelections: function(oDataFormat) {
    //calls from external to set default UI set
        if (oDataFormat){
            this.selectedCategory = oDataFormat.type;
            switch(this.selectedCategory){
                case "number":
                    this.selectedDecimalPlaces = oDataFormat.decimalPlaces;
                    this.selectedNegativeNumber = oDataFormat.negativeType;
                    this.selectedUseThousand = oDataFormat.useThousandSeparator;
                    break;
                case "currency":
                    this.selectedDecimalPlaces = oDataFormat.decimalPlaces;
                    this.selectedSymbol = oDataFormat.symbol;
                    this.selectedNegativeNumber = oDataFormat.negativeType;
                    break;
                case "date":
                    this.selectedDateFormat = oDataFormat.dateFormat;
                    break;
                case "time":
                    this.selectedTimeFormat = oDataFormat.timeformat;
                    break;
                case "Percentage":
                    this.selectedDecimalPlaces = oDataFormat.decimalPlaces;
                    break;
                default:
            }
        }
        this.updateSelections();
    },
    lstCategory_onChange: function() {
        var sValue = this.lstCategory.getSelectedItem();
        if (sValue){
            this.selectedCategory = sValue;
            this.updateSelections();
        }
    },
    lstNegativeNumber_onChange: function(oItem) {
        if (oItem){
            var sValue = oItem.item.value;
            if (sValue){
                this.selectedNegativeNumber = sValue;
            }      
        }
    },
    lstDataTime_onChange: function(oItem) {
        if (oItem){
            var sValue = oItem.item.value;
            if (sValue){
                if (this.selectedCategory=="date"){
                    this.selectedDateFormat = sValue;
                }else{
                    this.selectedTimeFormat = sValue;
                }
                
            }      
        }
    },
    updateSelections: function() {

        this.lstCategory.setSelection(this.selectedCategory);
        this.ddlDecimalPlaces.setVisible(false);
        this.ddlCurrencySymbol.setVisible(false);
        this.txtDecimalPlaces.setVisible(false);
        this.txtSymbol.setVisible(false);
        this.txtType.setVisible(false);
        this.chkUseThousand.setVisible(false);
        this.txtNegatvieNumbers.setVisible(false);
        this.txtUseThousand.setVisible(false);
        this.lstNegativeNumber.setVisible(false);
        this.lstDataTime.setVisible(false);
        this.txtGeneralInfo.setVisible(false);

        switch(this.selectedCategory){
            case "general":
                this.txtGeneralInfo.setVisible(true);
                break;
            case "number": 
                this.ddlDecimalPlaces.setVisible(true);
                this.ddlDecimalPlaces.setSelection(this.selectedDecimalPlaces);
                this.txtDecimalPlaces.setVisible(true);
                this.chkUseThousand.setVisible(true);
                this.chkUseThousand.setChecked(this.selectedUseThousand);
                this.txtUseThousand.setVisible(true);
                this.txtNegatvieNumbers.setVisible(true);
                this.lstNegativeNumber.setVisible(true);
                this.lstNegativeNumber.updateList(this.selectedNegativeNumber,this.arrNegativeNumber);
                break;
            case "currency":  
                this.ddlDecimalPlaces.setVisible(true);
                this.ddlDecimalPlaces.setSelection(this.selectedDecimalPlaces);
                this.txtDecimalPlaces.setVisible(true);
                this.txtSymbol.setVisible(true);
                this.ddlCurrencySymbol.setVisible(true);
                this.txtNegatvieNumbers.setVisible(true);
                this.lstNegativeNumber.setVisible(true);
                this.lstNegativeNumber.updateList(this.selectedNegativeNumber,this.arrNegativeCurrencyNumber);
                break;
            case "date":
                this.txtType.setVisible(true);
                this.lstDataTime.setVisible(true);
                this.lstDataTime.updateList(this.selectedDateFormat,this.arrDateFormat);
                break;
            case "time":
                this.txtType.setVisible(true);
                this.lstDataTime.setVisible(true);
                this.lstDataTime.updateList(this.selectedTimeFormat,this.arrTimeFormat);
                break;
            case "percentage":
                this.ddlDecimalPlaces.setVisible(true);
                this.ddlDecimalPlaces.setSelection(this.selectedDecimalPlaces);
                this.txtDecimalPlaces.setVisible(true);
                break;
            default:
    
        }
    },
    chkUseThousand_onClick: function(){
        this.selectedUseThousand = this.chkUseThousand.isChecked()
    },
    ddlCurrencySymbol_onChange: function(){
        var sValue = this.ddlCurrencySymbol.getSelectedItem();
        this.selectedSymbol = sValue;
    },
    ddlDecimalPlaces_onChange: function(){
        var sValue = this.ddlDecimalPlaces.getSelectedItem();
        this.selectedDecimalPlaces = sValue;
    },
    setCategory: function(nIndex) {
        this.lstCategory.setSelection(nIndex);
    },
    initializeLayout: function() {
        var nXstart = 10;
        var nYStart = 10;
        var nX = 150;
        var nY = 25;
        var nGap = 1;
        var nXGap = 150;
        var nHeight=25;
        this.setExtent(lively.pt(525,265));
        this.setFill(Color.rgb(255,255,255));

        this.txtGeneralInfo = new lively.morphic.Text(new Rectangle(nXstart + nX,nY, 300, nHeight),'General format cells have no specific format.');
        this.txtGeneralInfo.applyStyle({borderWidth: 0, strokeOpacity: 0, fill: null});

        this.txtCategory=new lively.morphic.Text(new Rectangle(nXstart,0, 100, nHeight),'Category:');
        this.txtCategory.applyStyle({borderWidth: 0, strokeOpacity: 0, fill: null});
        
        this.txtDecimalPlaces=new lively.morphic.Text(new Rectangle(nXstart + nX,nY, 120, nHeight),'Decimal Places:');
        this.txtDecimalPlaces.applyStyle({borderWidth: 0, fill: null});
        this.txtType=new lively.morphic.Text(new Rectangle(nXstart + nX ,nY, 120, nHeight),'Type:');
        this.txtType.applyStyle({borderWidth: 0, fill: null});
        this.txtType.setVisible(false);

        this.ddlDecimalPlaces = new lively.morphic.DropDownList(new Rectangle(nXstart + nX+nXGap, nY, 37, 23), [0, 1, 2,3,4,5,6,7,8]);
        
        this.txtSymbol = new lively.morphic.Text(new Rectangle(nXstart + nX ,nY+nHeight+nGap, 100, nHeight),'Symbol:');
        this.txtSymbol.applyStyle({borderWidth: 0, strokeOpacity: 0, fill: null});
        this.chkUseThousand = new lively.morphic.CheckBox();
        this.chkUseThousand.setChecked(this.selectedUseThousand);
        this.chkUseThousand.setPosition(pt(nXstart + nX,nY+nHeight+nGap));
        this.chkUseThousand.setVisible(false);

        this.txtUseThousand = new lively.morphic.Text(new Rectangle(nXstart + nX+30 ,nY+nHeight+nGap, 150, nHeight),'Use 1000 Separator(,)');
        this.txtUseThousand.applyStyle({borderWidth: 0, strokeOpacity: 0, fill: null});
        this.txtUseThousand.setVisible(false);

        this.ddlCurrencySymbol = new lively.morphic.DropDownList(new Rectangle(nXstart + nX+nXGap, nY+nHeight+nGap, 200, 23), this.arrCurrency);

        this.txtNegatvieNumbers=new lively.morphic.Text(new Rectangle(nXstart + nX ,nY+2*nHeight+2*nGap, 135, nHeight),'Negative numbers:');
        this.txtNegatvieNumbers.applyStyle({borderWidth: 0, strokeOpacity: 0, fill: null})

        this.lstCategory = new lively.morphic.List(new Rectangle(nXstart, 25, nX-20 , 200), this.arrCategory);
        this.lstCategory.disableGrabbing();

        this.lstNegativeNumber= new lively.morphic.SAPListView(351,125,0,this.arrNegativeNumber);
        this.lstNegativeNumber.setPosition(pt(nXstart + nX, nY+3*nHeight+2*nGap));

        this.lstDataTime= new lively.morphic.SAPListView(351,175,0,this.arrDateFormat);
        this.lstDataTime.setPosition(pt(nXstart + nX, nY+nHeight+nGap));
        this.lstDataTime.setVisible(false);

        this.btnOk = new lively.morphic.Button(new Rectangle(nXstart + nX + 150 ,230,80,20), 'Ok');
        this.btnCancel = new lively.morphic.Button(new Rectangle(nXstart + nX +150+ 100,230,80,20), 'Cancel');

        this.addMorph(this.txtUseThousand);
        this.addMorph(this.chkUseThousand);
        this.addMorph(this.txtType);
        this.addMorph(this.txtCategory);
        this.addMorph(this.txtSymbol);
        this.addMorph(this.txtDecimalPlaces);
        this.addMorph(this.txtNegatvieNumbers);
        this.addMorph(this.lstCategory);
        this.addMorph(this.ddlDecimalPlaces );
        this.addMorph(this.ddlCurrencySymbol );
        this.addMorph(this.lstNegativeNumber);
        this.addMorph(this.lstDataTime);
        this.addMorph(this.btnOk);
        this.addMorph(this.btnCancel);
        this.addMorph(this.txtGeneralInfo);
       


        
        connect(this.lstCategory, "selection", this, "lstCategory_onChange", {});
        connect(this.ddlCurrencySymbol, "onChange", this, "ddlCurrencySymbol_onChange", {});
        connect(this.ddlDecimalPlaces, "onChange", this, "ddlDecimalPlaces_onChange", {});
        connect(this.lstNegativeNumber, "selection", this, "lstNegativeNumber_onChange", {});
        connect(this.lstNegativeNumber, "onMouseDown", this, "lstNegativeNumber_onChange", {});
        connect(this.lstDataTime, "onMouseDown", this, "lstDataTime_onChange", {});
        connect(this.chkUseThousand, "onClick", this, "chkUseThousand_onClick", {});


        //this.selectedValue
        //this.ddlDecimalPlaces


        connect(this.btnOk , "fire", this, "btnOk_Click", {});
        connect(this.btnCancel , "fire", this, "btnCancel_Click", {});
        this.updateSelections();

    },
    btnOk_Click: function() {
        if (this.oOkCallBack){
            var oDataFormat={};
            oDataFormat.type = this.selectedCategory;

            switch(this.selectedCategory){
                case "general":
                    oDataFormat=null;
                    break;
                case "number":
                    oDataFormat.decimalPlaces = this.selectedDecimalPlaces;
                    oDataFormat.negativeType = this.selectedNegativeNumber;
                    oDataFormat.useThousandSeparator = this.selectedUseThousand;
                    break;
                case "currency":
                    oDataFormat.decimalPlaces = this.selectedDecimalPlaces;
                    oDataFormat.symbol = this.selectedSymbol;
                    oDataFormat.negativeType = this.selectedNegativeNumber;
                    break;
                case "date":
                    oDataFormat.dateFormat = this.selectedDateFormat;
                    break;
                case "time":
                    oDataFormat.timeformat = this.selectedTimeFormat;
                    break;
                case "percentage":
                    oDataFormat.decimalPlaces = this.selectedDecimalPlaces;
                    break;
                default:
                    oDataFormat=null;
            }
            this.oOkCallBack(oDataFormat);
        }
        this.owner.state = 'shutdown';
        this.owner.remove();
    },
    btnCancel_Click: function() {
        this.owner.state = 'shutdown';
        this.owner.remove();
    },
    buildListItems: function() {
  
        this.arrCurrency=[];
        this.arrCategory=[];
        this.arrNegativeNumber=[];
        //'Number', 'Currency', 'Percentage','Date','Time'
        var oItem={};
        oItem.value= "general";
        oItem.string= "General";
        oItem.isListItem=true;
        this.arrCategory.push(oItem);
        var oItem={};
        oItem.value= "number";
        oItem.string= "Number";
        oItem.isListItem=true;
        this.arrCategory.push(oItem);

        oItem={};
        oItem.value= "currency";
        oItem.string= "Currency";
        oItem.isListItem=true;
        this.arrCategory.push(oItem);

        oItem={};
        oItem.value= "date";
        oItem.string= "Date";
        oItem.isListItem=true;
        this.arrCategory.push(oItem);

        oItem={};
        oItem.value= "time";
        oItem.string= "Time";
        oItem.isListItem=true;
        this.arrCategory.push(oItem);

        oItem={};
        oItem.value= "percentage";
        oItem.string= "Percentage";
        oItem.isListItem=true;
        this.arrCategory.push(oItem);

    //Currency Symbol
        oItem={};
        oItem.value= "USD";
        oItem.symbol="$";
        oItem.string= "United States Dollar($)";
        oItem.bFront=true;
        oItem.isListItem=true;
        this.arrCurrency.push(oItem);
        oItem={};
        oItem.value= "EUR";
        oItem.symbol="€";
        oItem.string= "Euro(€)";
        oItem.bFront=true;
        this.arrCurrency.push(oItem);
        oItem={};
        oItem.value = "JPY";
        oItem.symbol="¥;";
        oItem.string= "Japan, Yen (¥)";
        oItem.bFront=true;
        oItem.isListItem=true;
        this.arrCurrency.push(oItem);
        oItem={};
        oItem.value= "GBP";
        oItem.symbol="£";
        oItem.string= "Britain (United Kingdom), Pounds(£)";
        oItem.bFront=true;
        oItem.isListItem=true;
        this.arrCurrency.push(oItem);
        oItem={};
        oItem.value= "AUD";
        oItem.symbol="$";
        oItem.string = "Australia, Dollars($)";
        oItem.bFront=true;
        oItem.isListItem=true;
        this.arrCurrency.push(oItem);

        //for number
        oItem={};
        oItem.value= 0;
        oItem.string= "-1,234.10";
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrNegativeNumber.push(oItem);

        oItem={};
        oItem.value= 1;
        oItem.string= "1,234.10";
        oItem.isListItem=true;
        oItem.textColor=Color.red;
        this.arrNegativeNumber.push(oItem);

        oItem={};
        oItem.value= 2;
        oItem.string= "(1,234.10)";
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrNegativeNumber.push(oItem);

        oItem={};
        oItem.value= 3;
        oItem.string= "(1,234.10)";
        oItem.isListItem=true;
        oItem.textColor=Color.red;
        this.arrNegativeNumber.push(oItem);

        //for currency
        oItem={};
        oItem.value= 0;
        oItem.string= "-$1,234.10";
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrNegativeCurrencyNumber.push(oItem);

        oItem={};
        oItem.value= 1;
        oItem.string= "$1,234.10";
        oItem.isListItem=true;
        oItem.textColor=Color.red;
        this.arrNegativeCurrencyNumber.push(oItem);

        oItem={};
        oItem.value= 2;
        oItem.string= "($1,234.10)";
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrNegativeCurrencyNumber.push(oItem);

        oItem={};
        oItem.value= 3;
        oItem.string= "($1,234.10)";
        oItem.isListItem=true;
        oItem.textColor=Color.red;
        this.arrNegativeCurrencyNumber.push(oItem);

        this.arrDateFormat=[];
        this.arrTimeFormat=[];
//Date
var dNow = new Date();
//dNow.format("mm/dd/yyyy").toString();
        oItem={};
        oItem.value= "mm/dd/yyyy";
        oItem.string= dNow.format("mm/dd/yyyy").toString();
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrDateFormat.push(oItem);

        oItem={};
        oItem.value= "dddd, mmmm dd, yyyy";
        oItem.string= dNow.format("dddd, mmmm dd, yyyy").toString();
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrDateFormat.push(oItem);

        oItem={};
        oItem.value= "mm/dd";
        oItem.string= dNow.format("mm/dd").toString();
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrDateFormat.push(oItem);

        oItem={};
        oItem.value= "mm/dd/yy";
        oItem.string= dNow.format("mm/dd/yy").toString();
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrDateFormat.push(oItem);

        oItem={};
        oItem.value= "dd-mmm";
        oItem.string= dNow.format("dd-mmm").toString();
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrDateFormat.push(oItem);

        oItem={};
        oItem.value= "dd-mmm-yy";
        oItem.string= dNow.format("dd-mmm-yy").toString();
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrDateFormat.push(oItem);

        oItem={};
        oItem.value= "m/d/yy h:M TT";
        oItem.string= dNow.format("m/d/yy h:M TT").toString() +" (12-hour clock)";
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrDateFormat.push(oItem);

        oItem={};
        oItem.value= "m/d/yy H:M";
        oItem.string= dNow.format("m/d/yy H:M").toString() +" (24-hour clock)";
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrDateFormat.push(oItem);
//Time
        oItem={};
        oItem.value= "h:M TT";
        oItem.string= dNow.format("h:M TT").toString()+" (12-hour clock)";
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrTimeFormat.push(oItem);

        oItem={};
        oItem.value= "H:M";
        oItem.string= dNow.format("H:M").toString() + " (24-hour clock)";
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrTimeFormat.push(oItem);

        oItem={};
        oItem.value= "h:M:s TT";
        oItem.string= dNow.format("h:M:s TT").toString()+" (12-hour clock)";
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrTimeFormat.push(oItem);

        oItem={};
        oItem.value= "H:M:s";
        oItem.string= dNow.format("h:M:s").toString() + " (24-hour clock)";
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrTimeFormat.push(oItem);

        oItem={};
        oItem.value= "m/d/yy h:M TT";
        oItem.string= dNow.format("m/d/yy h:M TT").toString() +" (12-hour clock)";
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrTimeFormat.push(oItem);

        oItem={};
        oItem.value= "m/d/yy H:M";
        oItem.string= dNow.format("m/d/yy H:M").toString() +" (24-hour clock)";
        oItem.isListItem=true;
        oItem.textColor=Color.black;
        this.arrTimeFormat.push(oItem);

    },

});
lively.morphic.Morph.subclass('lively.morphic.SAPListView',
'default category', {
    initialize: function($super,nWidth,nHeight,selectedValue,arrData,oReturnCall) {
        $super(new lively.morphic.Shapes.Rectangle(new Rectangle(0,0,nWidth,nHeight)));
        this.applyStyle({borderColor: Color.black, borderWidth: 2, fill: Color.white});
        this.setClipMode({x: 'hidden', y: 'scroll'}); 
        this.disableGrabbing();
        this.returnCall = oReturnCall;
        this.selectedValue = selectedValue;
        this.selectedItem=null;
        this.arrData = arrData;
        this.setList();
        
    },
    getSelectedItem: function(sItemValue) {
        return this.selectedItem;
    },
    setDefaultItem: function(sItemValue) {
        var oSubMorphs = this.submorphs;
        this.selectedItem=null;
        this.selectedValue="";
	for (var i = 0; i < oSubMorphs.length; i++) {
            if (oSubMorphs[i].item.value.toString().toUpperCase()==sItemValue.toString().toUpperCase()){
                oSubMorphs[i].setFill(Color.rgb(240, 171, 0));
                this.selectedItem = oSubMorphs[i];
                this.selectedValue = this.selectedItem.item.value;
            }else{
                oSubMorphs[i].setFill(null);
            }
	
	}
    },
    setList: function() {
        var offset = pt(0,0);
        this.arrData.forEach(function(item) {
		var text = new lively.morphic.Text(offset.extent(pt(this.getExtent().x-20,20)), item.string);
                text.item = item;
		text.applyStyle({fill: null,textColor:item.textColor, borderWidth:0, fixedHeight: false, fixedWidth: true, allowInput: false});
                if (item.value.toString().toUpperCase()==this.selectedValue.toString().toUpperCase()){
                    this.selectedItem = text;
                    text.setFill(Color.rgb(240, 171, 0));
                }
		text.ignoreEvents();
		this.addMorph(text);
		text.fit();
		offset = text.bounds().bottomLeft();
	}, this);
    },
    updateList: function(selectedValue,arrData) {
        this.selectedValue = selectedValue;
        this.removeAllMorphs();
        this.arrData=arrData;
        this.setList();
    },
    onMouseDown: function($super, evt) {
        $super(evt);
        if (evt.isCommandKey() || !evt.isLeftMouseButtonDown()) return $super(evt);
        var scroll = this.getScroll();
	this.selectItem(this.localize(evt.getPosition()).addXY(scroll[0], scroll[1]));
        return this.selectedItem
    },
    selectItem: function(pos) {
        var oSubMorphs = this.submorphs, selected;
	for (var i = 0; i < oSubMorphs.length; i++) {
	   if (oSubMorphs[i].bounds().containsPoint(pos)) selected = oSubMorphs[i];
	}

	if (selected) {
            for (var i = 0; i < oSubMorphs.length; i++) {
	       oSubMorphs[i].setFill(null);
            }
	    selected.setFill(Color.rgb(240, 171, 0));
	    this.selectedItem= selected;
             
            if (this.returnCall){
                this.returnCall(this.selectedItem);
            }
	}
    }
});
lively.morphic.Morph.subclass('lively.morphic.SAPFontPicker',
'default category', {
    initialize: function($super,selectedFont,oReturnCall) {
        this.selectedFont = selectedFont;
        this.returnCall = oReturnCall;
        $super(new lively.morphic.Shapes.Rectangle(new Rectangle(0,0,200,500)));
        this.applyStyle({borderColor: Color.black, borderWidth: 2, fill: Color.white});
        this.setClipMode({x: 'hidden', y: 'scroll'}); 
        this.disableGrabbing();
 
        var fonts = this.availableFonts(this.getKnownFonts());
	var offset = pt(0,0);
 
	fonts.forEach(function(font) {
		var text = new lively.morphic.Text(offset.extent(pt(this.getExtent().x-25,20)), font);
		text.applyStyle({fill: null, borderWidth:0, fontFamily: font, fixedHeight: false, fixedWidth: true, allowInput: false});
                if (font.toUpperCase()==this.selectedFont.toUpperCase()){
                    text.setFill(Color.rgb(240, 171, 0));
                }
		text.ignoreEvents();
		this.addMorph(text);
		text.fit();
		offset = text.bounds().bottomLeft()
	}, this);

    },
    //calls from external: to highlight
    setDefaultFont: function(sFontName) {
        var fontMorphs = this.submorphs;
        this.selectedFont="";
	for (var i = 0; i < fontMorphs.length; i++) {
            if (fontMorphs[i].getTextString().toUpperCase()==sFontName.toUpperCase()){
                fontMorphs[i].setFill(Color.rgb(240, 171, 0));
                this.selectedFont = fontMorphs[i].getTextString();
                //break;
            }else{
                fontMorphs[i].setFill(null);
            }
	
	}
    },
    onMouseDown: function($super, evt) {
        $super(evt);
         console.log("SAPFontList.onMouseDown");
        
        if (evt.isCommandKey() || !evt.isLeftMouseButtonDown()) return $super(evt);
        var scroll = this.getScroll();
	this.selectFont(this.localize(evt.getPosition()).addXY(scroll[0], scroll[1]));
       
        
    },
    selectFont: function(pos) {
        var fontMorphs = this.submorphs, selected;
	for (var i = 0; i < fontMorphs.length; i++) {
	   if (fontMorphs[i].bounds().containsPoint(pos)) selected = fontMorphs[i];
	}

	if (selected) {
            for (var i = 0; i < fontMorphs.length; i++) {
	       fontMorphs[i].setFill(null);
            }
	    selected.setFill(Color.rgb(240, 171, 0));
	    this.selectedFont = selected.textString;
             
            if (this.returnCall){
                this.returnCall(this.selectedFont);
            }
        
            console.log(this.selectedFont)
	}
    },
    
    availableFonts: function(fontNames) {
        var testText = 'CmmwwmmwwmmwwmmL',
		parent = document.body,
		span = XHTMLNS.create('span');
	span.textContent = testText;
	span.style.fontSize = '72px';
	parent.appendChild(span);
	var defaultWidth = span.offsetWidth, defaultHeight = span.offsetHeight;
	var availableFonts = fontNames.select(function(fontName) {
		try {
			if (Global.getComputedStyle(span).fontFamily == fontName) return true;
			span.style.fontFamily = fontName;
			var available = defaultWidth !== span.offsetWidth || defaultHeight !== span.offsetHeight;
			return available;
		} catch(e) { return false }
	})
	parent.removeChild(span)
	return availableFonts;
    },
    getKnownFonts: function(fontNames) {
       return ['academy engraved let',
		'algerian',
		'amaze',
		'arial',
		'arial black',
		'balthazar',
		'bart',
		'bimini',
		'comic sans ms',
		'book antiqua',
		'bookman old style',
		'braggadocio',
		'britannic bold',
		'brush script mt',
                'Calibri',
		'century gothic',
		'century schoolbook',
		'chasm',
		'chicago',
		'colonna mt',
		'comic sans ms',
		'commercialscript bt',
		'coolsville ',
		'courier',
		'courier new',
		'cursive',
		'dayton',
		'desdemona',
		'fantasy',
		'flat brush ',
		'footlight mt light ',
		'futurablack bt',
		'futuralight bt',
		'garamond',
		'gaze',
		'geneva',
		'georgia',
		'geotype tt',
		'helterskelter',
		'helvetica',
		'herman',
		'highlight let',
		'impact',
		'jester',
		'joan',
		'john handy let',
		'jokerman let',
		'kelt',
		'kids',
		'kino mt',
		'la bamba let',
		'lithograph',
		'lucida console',
		'map symbols',
		'marlett',
		'matteroffact',
		'matisse itc ',
		'matura mt script capitals',
		'mekanik let',
		'monaco ',
		'monospace',
		'monotype sorts',
		'ms linedraw',
		'new york',
		'olddreadfulno7 bt',
		'orange let',
		'palatino ',
		'playbill',
		'pump demi bold let',
		'puppylike',
		'roland',
		'sans-serif',
		'scripts',
		'scruff let',
		'serif',
		'short hand',
		'signs normal',
		'simplex',
		'simpson',
		'stylus bt',
		'superfrench',
		'surfer',
		'swis721 bt',
		'swis721 blkoul bt',
		'symap',
		'symbol',
		'tahoma',
		'technic',
		'tempus sans itc',
		'terk ',
		'times',
		'times new roman',
		'trebuchet ms',
		'trendy',
		'txt',
		'verdana',
		'victorian let',
		'vineta bt',
		'vivian',
		'webdings',
		'wingdings',
		'western ',
		'westminster',
		'westwood let',
		'wide latin',
		'zapfellipt bt',
		// these are for linux
		'URW Chancery L',
		'URW Gothic L',
		'Century Schoolbook L',
		'URW Bookman L',
		'URW Palladio L',
		'Nimbus Mono L',
		'Nimbus Sans L',
		'Nimbus Roman No',
		'DejaVu Sans',
		'DejaVu Sans Mono',
		'DejaVu Serif',
		'DejaVu Sans Light',
		'Bitstream Charter',
		'DejaVu Sans Condensed',
		'DejaVu Serif Condensed',
		//'Courier ',
		'Liberation Mono',
		'Liberation Serif',
		'FreeSerif',
		'Liberation Sans',
		'FreeMono',
		'FreeSans',
		//'Arial',
		//'Courier New',
		'Times New Roman',
		'Verdana',
		'Lohit Bengali',
		'Lohit Gujarati',
		'Lohit Punjabi',
		'Lohit Tamil',
		'UnDotum',
		'Georgia',
		'Trebuchet MS',
		//'Arial Black',
		//'Impact',
		'Andale Mono',
		'Bitstream Vera Sans Mono',
		'Comic Sans MS',
		'Bitstream Vera Sans',
		'Waree'].uniq().sort();
    }
});
}) // end of module