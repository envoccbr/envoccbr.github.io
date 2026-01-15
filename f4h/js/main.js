// This is a JavaScript file
var appName="F4H3M";  //โปรแกรมรับรองเมนูชูสุขภาพออนไลน์
var appPHP="https://mnm19.com/f4hsuite/f4hm/php/";
var appURL="https://mnm19.com/f4hsuite/f4hm/";
var addedit="add";
var peopleid="1234567890123";
var menuid="1234567890123-00001";
var selectedrow=0;
var pageHeight=0;
var bH=0;		//PC monitor height"
var pinvalue="";
var OS="Windows";
var altmenu_sodium="N";
var altmenu_sugar="N";
var altmenu_fat="N";

//google map
var latitude=0;
var longitude=0;
var currentposition;


$(document).ready(function(){
    //get phone physical working area dimension
    var scrnH=screen.height;
    var scrnW=screen.width;
	pageHeight=$("#tabbar").height()-100;

	OS=getMobileOperatingSystem();

///////////////////////////////////////////////////////////////////////////
	var onsmenudetailH=$("#div_menudetail").height();
	var onsanalyzeH=$("#ons_analyze").height();
	var onsctrlbuttonH=$("#ons_ctrlbutton").height();
	if (OS=="Windows"){
        //PWA
		bH=window.innerHeight;
		var bW=window.innerWidth;
		var bWW=bH * 0.56222 * .98;
		$("body").css({"width": bWW, "height": bH*0.98, "margin": "0 auto", "border" : "1px solid blue"});
		
		//background
		var bg = document.getElementsByClassName('page__background page--home_bg__background');
		bg[0].style.backgroundImage="url('"+appURL+"www/images/f4h3m-background.png')";

		//home-page layout
        var onsIngredientH=pageHeight - onsmenudetailH - onsanalyzeH - onsctrlbuttonH - (24 * 3);
	}
	else if (OS=="Mac"){
		//iPhone Full Screen
		iPhoneXFullScreen();

		//background
		$("body").css({"backgroundImage":"url('"+appURL+"www/images/f4h3m-background.png')"});

		//home-page layout
        var onsIngredientH=pageHeight - onsmenudetailH - onsanalyzeH - onsctrlbuttonH - (15 * 3);	
	}
	else if (OS=="Android"){
		//background
		$("body").css({"backgroundImage":"url('"+appURL+"www/images/f4h3m-background.png')"});
        $("nav").hide();

		//home-page layout
        var onsIngredientH=pageHeight - onsmenudetailH - onsanalyzeH - onsctrlbuttonH - (21 * 3);
	}
	$("#onsIngredient").css({height: onsIngredientH});
	$("#div_menuingredient").css({height:'100%'});
	$("#div_addpopup").css({height:'100%'});

    $("#onsAnalyze").css({height:onsIngredientH});
    $("#div_analyzeresult").css({"height": '100%'});

/*alert("paheHeight: " + pageHeight + "\r\n" +
		"onsmenudetail: " + onsmenudetailH + "\r\n" +
		"onsanalyze: " + onsanalyzeH + "\r\n" +
		"onsctrlbutton: " + onsctrlbuttonH + "\r\n" +
		"onsIngredient: " + onsIngredientH + "\r\n");*/

///////////////////////////////////////////////////////////////////////////

    //get user
    username=localStorage.getItem("username");
    gpin=localStorage.getItem("pin");

    if (username==null){    //new user
        $("#setuppage").click();
    }
    else{
        peopleid=username;  //global variable
        $("#div_makemenu").hide();
        $("#div_allHMmenu").hide();
        $("#btn_logout").prop("disabled", true);
        $("#PINlogin").show();
        showPin();
    }

    //********************//
    //buttons manipulation//
    //********************//
    //home.html
    $("#btn_addmenu").on("click", addIngredient);   //ok
    $("#btn_ingredientSearch").on("click", searchIngredient);   //ok
    $("#btn_addingsave").on("click", updateIngredient); //ok
    $("#div_menuingredient").on("click", "#tbl_menuingredient td", editIngredient); //ok
    $("#btn_savemenu").on("click", menuSave);   //ok
    $("#btn_editmenu").on("click", editMenu);
    $("#div_allHMmenu").on("click", "#tbl_allHMmenu td", editAllMenu);  //ok
    $("#btn_analyze").on("click", analyze);
    $("#btn_newmenu").on("click", newMenu); //ok
    $("#btn_logout").on("click", appLogout);    //ok
    $("#btn_ingPassClose").on("click", onsAnalyzeClose);
    $("#btn_recpAdjClose").on("click", onsAnalyzeClose);
	$("#btn_snapshot").on("click", loadPicture);

    $(document).on("click", "#btn_popupClose", hidePopup);  //ok
	$(document).on("click", ".autoQ", autoQ);

    //*certificate.html
    $(document).on("click", "#tbl_certificate tr", selectCertMenu);
    $(document).on("click", "#btn_certdownload", downloadCertificate);



    //hmmap.html
	$(document).on("click", "#tbl_markerShop tr", markerHMShow1);
    $(document).on("click", "#btn_locreset", locBack);
//    $("#hmmap-page").on("click", hideMarkerShop);


    //other.html
    $(document).on("click", "#btn_suggestion", showSuggestion);
	$(document).on("click", "img", satisAlert);
	$(document).on("click", "#btn_suggsend", suggSend);
    $(document).on("click", "#btn_howtouse", showHowtouse);
    $(document).on("click", "#btn_logodownload", showLogoDownload);
    $(document).on("click", "#btn_otherBack", showOtherMenu);
    $(document).on("click", "#download_logo", downloadLogo);
    $(document).on("click", "#btn_HMcriteria", showHMcriteria);
    $(document).on("click", "#btn_healthPoint", showHealthpoint);
    $(document).on("click", "#btn_expcertificate", showExpCertificate);

    //setup.html
    $(document).on("click", "#btn_saveuser", saveUser);
    $(document).on("click", "#div_imgusr", upPhoto);

    //pin entry process
    $(document).on("click", "#div_ppin div", pinPress); //login
    $(document).on("keyup", "#tbl_pin input", setpinPress); //setup user
	
	//pdpa acknowledge
	$(document).on("click",  "#inp_pdpa", ackPdpa);

	
	//reset (delete localStorage user
	$("#plogo").on("dblclick", resetApp);
	$("#toolbar").on("dblclick", resetApp);

    //when page active
    document.addEventListener('init', function(event) {
        var page = event.target;
        if (page.id == "home-page") {
			stopVideo();
            $("#home_header").text("Food4Health");
//            getAllHMmenu();
        }
    });

	if (OS=="Windows"){
	   document.addEventListener('show', function(event) {
    	    var page = event.target;
        	if (page.id == "home-page") {
				stopVideo();
	        }
	   });
	}   

	if (OS=="Mac"){
	   document.addEventListener('show', function(event) {
    	    var page = event.target;
        	if (page.id == "home-page") {
				stopVideo();
	            $("#home_header").text("Food4Health");
        	    getAllHMmenu();
	        }
	   });
	}   

    document.addEventListener('show', function(event) {
        var page = event.target;
        if (page.id == "certificate-page") {
			if (OS=="Windows"){
				var bg = document.getElementsByClassName('page__background page--certificate_bg__background');
				bg[0].style.backgroundImage="url('"+appURL+"www/images/f4h3m-background.png')";
			}

			stopVideo();
            $("#showcertificate").remove();
			$("#btn_certdownload").hide();          
            getCertMenu();
        }
    });

    document.addEventListener('show', function(event) {
        var page = event.target;
        if (page.id == "hmmap-page") {
			stopVideo();

			if (OS=="Windows"){
				var bg = document.getElementsByClassName('page__background page--hmmap_bg__background');
				bg[0].style.backgroundImage="url('"+appURL+"www/images/f4h3m-background.png')";
			}

            showAllMap(12.719786220308247, 101.16039951833636);
            $("#allrange").prop("checked", true);

        }
    });

    document.addEventListener('show', function(event) {
        var page = event.target;
        if (page.id == "other-page") {
			stopVideo();

			if (OS=="Windows"){
				var bg = document.getElementsByClassName('page__background page--other_bg__background');
				bg[0].style.backgroundImage="url('"+appURL+"www/images/f4h3m-background.png')";
			}
        }
    });


    document.addEventListener('show', function(event) {
        var page = event.target;
        if (page.id == "setup-page") {
			stopVideo();

			if (OS=="Windows"){
				var bg = document.getElementsByClassName('page__background page--setup_bg__background');
				bg[0].style.backgroundImage="url('"+appURL+"www/images/f4h3m-background.png')";
			}

            getUser();
        }
    });

});

function initHomePage(){
	$("#onsIngredient").show();
//	$("#onsAnalyze").show();
	$("#onsAllMenu").hide();
	$("#div_addpopup").hide();
	
	$("#btn_logout").show();
	$("#btn_newmenu").show();
	//$("#btn_addmenu").text("+เพิ่ม");
	
	$("#menuname").val("");
	$("#noofeater").val("");

	//clear tbl_menuingredient
    //$("#tbl_menuingredient tr:not(:first)").remove();

	//clear nutrient values
	$("#energy").text("-");
	$("#carbohydrate").text("-");
	$("#protein").text("-");
	$("#fat").text("-");
	$("#calcium").text("-");
	$("#potassium").text("-");
	$("#dietaryfiber").text("-");
	$("#sugar").text("-");
	$("#sodium").text("-");
	$("#cholesterol").text("-");
	$("#iron").text("-");
	$("#vitamina").text("-");
	$("#vitaminb1").text("-");
	$("#vitaminb2").text("-");
	$("#vitaminc").text("-");
	$("#phosphorus").text("-");
	$("#magnesium").text("-");
	$("#copper").text("-");
	$("#zinc").text("-");
	$("#iodine").text("-");
	$("#betacarotine").text("-");
	$("#niacin").text("-");
	$("#vitamine").text("-");
	$("#folate").text("-");

}

function clearDistrict(){
	$("#amphur").val("");
	$("#tumbol").val("");
}
function fillDistrict(){
	var province = $("#province").val();
	var amp=document.getElementById("amphur");

//debug
	var p = new Promise(function (resolve, reject) {	//debug
		//get all districts for the selected province
		$.ajax({
			url: appPHP + "getdistrict.php",
			type: "POST",
			data: {"province" : province},
			success: function(response){
				data=JSON.parse(response).district;
				if (data.length >0){
					var lst="";
					$.each(data, function(index,item){
						var district=item.district;
						lst = lst + "<option value=" + district + ">" + district + "</option>";
					});									
					amp.innerHTML=lst;
				}
			},
			error: function(response){
				alert("something went wrong....(fillDistrict)");
			}
		});
	});
	return p;	//debug
}
function clearSubDistrict(){
	$("#tumbol").val("");
}
function fillSubDistrict(){
	var province = $("#province").val();
	var district=$("#amphur").val();
	var tum=document.getElementById("tumbol");

	//get all subdistricts for the selected province and district
	$.ajax({
		url: appPHP + "getsubdistrict.php",
		type: "POST",
		data: {"province" : province, "district" : district},
		success: function(response){
			data=JSON.parse(response).subdistrict;
			if (data.length >0){
				var lst="";
				$.each(data, function(index,item){
					var subdistrict=item.subdistrict;
					lst = lst + "<option value=" + subdistrict + ">" + subdistrict + "</option>";
				});									
				tum.innerHTML=lst;
			}
		},
		error: function(response){
			alert("something went wrong....");
		}
	});	
}

//**makemenu**//
function getAllHMmenu(){
    //empty the table
    var tbl_length=$("#tbl_allHMmenu tr").length;

    for (var ix=2; ix<tbl_length; ix++){
        document.getElementById('tbl_allHMmenu').deleteRow(2);
    }

    var xData=new FormData();
    xData.append("peopleid", peopleid);
    $.ajax({
        url: appPHP + "gethmmenu.php",
        type: "POST",
        data: xData,
        processData:false,
        contentType:false,
        cache:false,
        success: function(response){
            var data=JSON.parse(response).hmmenu;
            if (data.length > 0){
        		var tbl=document.getElementById("tbl_allHMmenu");

				$.each(data, function(index,item){
                    var r=tbl.insertRow();
                    var cell0=r.insertCell(0);
                    var cell1=r.insertCell(1);
                    var cell2=r.insertCell(2);
                    var cell3=r.insertCell(3);
                    var cell4=r.insertCell(4);

                    cell0.align="center";
                    cell1.align="center";
                    cell3.align="center";
                    
                    cell0.className="highRowU";
                    cell1.className="highRowU";
                    cell2.className="highRowU";
                    cell3.className="highRowU";
                    cell4.style.display="none";

                    cell0.innerHTML="<img src='images/delete.png' width='80%'/>";
                    if (item.approve=="Y"){
                        //cell1.innerHTML="<img src='images/f4h3mLogo.png' width='80%'/>"
                        cell1.innerHTML="<img src='images/pass.png' width='65%'/>"
                    }
					if (item.name.substr(-1)=="*"){
	                    cell2.innerHTML="<font style='color:red'>" + item.name + "</font>";
					}
					else{
	                    cell2.innerHTML=item.name;						
					}
                    cell3.innerHTML="<img src='"+appURL+"www/foodphoto/"+item.menuid+".jpg?v="+Date.now()+"' width='98%' />";
                    cell4.innerHTML=item.menuid;
                });
            }
        }
    });

}

function addIngredient(){
    addedit="add";

    $("#ons_ctrlbutton").hide();
    $("#div_menuingredient").hide();
    $("#onsAnalyze").hide();
    $("#onsIngredient").show();

    $("#div_addpopup").show();
    //blank the search, quantity
    $("#searchText").val("");
    $("#adding_quantity").val("");
    $("#ingList").empty();
    $("#searchText").focus();

}

function hidePopup(){
    $("#div_addpopup").hide()
    $("#ons_ctrlbutton").show();
    $("#div_menuingredient").show();

}

function autoQ(event){
	var id=event.target.id;
	if (id=="aQ1_2"){$("#adding_quantity").val("1/2");}
	if (id=="aQ1_3"){$("#adding_quantity").val("1/3");}
	if (id=="aQ1_4"){$("#adding_quantity").val("1/4");}
	if (id=="aQ3_4"){$("#adding_quantity").val("3/4");}
	if (id=="aQ1_8"){$("#adding_quantity").val("1/8");}	
}

function searchIngredient(){
    var searchText=$("#searchText").val();
    xData=new FormData();
    xData.append("searchtext", searchText);

    $.ajax({
        url: appPHP + "ingredientsearch.php",
        type: "POST",
        data: xData,
        processData:false,
        contentType:false,
        cache:false,
        success: function(response){
            var data=JSON.parse(response).ingredient;
            if (data.length > 0){
        		var ingL=document.getElementById("ingList");
				var opt="";
        		$("#ingList").empty();

				$.each(data, function(index,item){
				    opt=opt+"<option value='" + item.foodcode +"' />" + item.foodname + "</option>";
                });
				ingL.innerHTML=opt;
                getUnit();
            }
            else{
                alert("ค้นหาไม่พบ");
            }
        }
    })
}

function getUnit(){
	//filling quanunit
	var foodcode=$("#ingList").val();
	var quanunit=document.getElementById("quanunit");
	$("#quanunit").empty();

    xData=new FormData();
    xData.append("foodcode", foodcode);

	$.ajax({
		url: appPHP + "getunit.php",
		type: "POST",
		data: xData,
        processData:false,
        contentType:false,
        cache:false,
		success: function(response){
			data=JSON.parse(response).quanunit;
			if (data.length >0){
				var opt="";
				$.each(data, function(index,item){
					opt=opt+"<option value='"+item.unitcode+"' />"+item.unitname+"</option>";										
				});
				quanunit.innerHTML=opt;
			}
		}
	});					

	$("#adding_quantity").focus();
}

function updateIngredient(){
    var foodcode=$("#ingList").val();
    var foodname=$("#ingList option:selected").text();
    var quantity=$("#adding_quantity").val();
    var unit=$("#quanunit option:selected").text();

    if (addedit=="add"){
        $("#div_addpopup").hide();
        $("#ons_ctrlbutton").show();
        $("#div_menuingredient").show();

        //add new ingredient to menu
        var tbl=document.getElementById("tbl_menuingredient");

        var r=tbl.insertRow();
        var cell0=r.insertCell(0);
        var cell1=r.insertCell(1);
        var cell2=r.insertCell(2);
        var cell3=r.insertCell(3);
        var cell4=r.insertCell(4);

        cell0.align="left";
        cell1.align="center";
        cell2.align="left";
        cell3.align="center";
        cell4.align="center";

        cell0.style.display="none";
		cell1.width="5%";

        cell0.innerHTML=foodcode;
        cell1.innerHTML="<img src='images/delete.png' width='90%'>";
        cell2.innerHTML=foodname;
        cell3.innerHTML=quantity;
        cell4.innerHTML=unit;
    }
    else{
        var xx=$("#tbl_menuingredient").find("tr:eq(" + selectedrow + ")");
        xx.find("td:eq(0)").text(foodcode);
        xx.find("td:eq(2)").text(foodname);
        xx.find("td:eq(3)").text(quantity);
        xx.find("td:eq(4)").text(unit);

        $("#div_addpopup").hide();
        $("#ons_ctrlbutton").show();
        $("#div_menuingredient").show();
    }
}

function editIngredient(){
    addedit="edit";

	selectedrow=parseInt($(this).parent().index());
	selectedcol=parseInt($(this).index());

    if (selectedrow == 0){
        //table header -> no action to take
        return
    }

    var xx=$("#tbl_menuingredient").find("tr:eq(" + selectedrow + ")");
    var foodcode=xx.find("td:eq(0)").text();
    var foodname=xx.find("td:eq(2)").text();
    var quantity=xx.find("td:eq(3)").text();
    var unit=xx.find("td:eq(4)").text();
    var quantityunit=["กรัม", "ช้อนชา", "ช้อนกินข้าว", "ทัพพี", "ถ้วยตวง", "ส่วน", "ฟอง", "ผล/ยวง/ฝัก", "ชิ้นพอคำ", "เม็ด"]
    
    if (selectedcol=="1"){
        //ลบวัตถุดิบ
        xr=confirm("ต้องการลบวัตถุดิบรายการนี้: " + foodname);
        if (xr==true){
            //delete this row from table
            $(this).closest('tr').remove();
        }
    }
    else{
        //แก้ไขวัตถุดิบ (ชนิด, ปริมาณ, หน่วยชั่งตวงวัด)
        $("#div_addpopup").show();
        $("#div_menuingredient").hide();

        $("#searchText").val(foodname);
        
        //ingredient search
        var searchText=$("#searchText").val();
        xData=new FormData();
        xData.append("searchtext", searchText);

        $.ajax({
            url: appPHP + "ingredientsearch.php",
            type: "POST",
            data: xData,
            processData:false,
            contentType:false,
            cache:false,
            success: function(response){
                var data=JSON.parse(response).ingredient;
                if (data.length > 0){
                    var ingL=document.getElementById("ingList");
                    var opt="";
                    $("#ingList").empty();

                    $.each(data, function(index,item){
                        opt=opt+"<option value='" + item.foodcode +"' />" + item.foodname + "</option>";
                    });
                    ingL.innerHTML=opt;
                
                    //select foodname from list (by value=foodcode)
                    $("#ingList").val(foodcode).change();

                    //get unit                    
                    var quanunit=document.getElementById("quanunit");
                    $("#quanunit").empty();

                    xData=new FormData();
                    xData.append("foodcode", foodcode);

                    $.ajax({
                        url: appPHP + "getunit.php",
                        type: "POST",
                        data: xData,
                        processData:false,
                        contentType:false,
                        cache:false,
                        success: function(response){
                            data=JSON.parse(response).quanunit;
                            if (data.length >0){
                                var opt="";
                                $.each(data, function(index,item){
                                    opt=opt+"<option value='"+item.unitcode+"' />"+item.unitname+"</option>";										
                                });
                                quanunit.innerHTML=opt;
                                $("#adding_quantity").val(quantity);
                                $("#quanunit").val(quantityunit.indexOf(unit)).change();
                            }
                        }
                    });
                }
            }
        })
    }
}

function checkDuplicateMenuName(){
    var menuname=$("#menuname").val();
    if (menuname.length > 0 && menuid.length != 0){
        var xData=new FormData();
        xData.append("peopleid", peopleid);
        xData.append("menuname", menuname);
		xData.append("menuid", menuid);

        $.ajax({
            url: appPHP + "duplicatecheck.php",
            type: "POST",
            data: xData,
            processData:false,
            contentType:false,
            cache:false,
            success: function(response){
                if (response=="Y"){
                    alert("ชื่อเมนูซ้ำ กรุณาแก้ไขชื่อเมนู");
                }
            }
        });        


    }
}

function menuSave(){
    if (!$("#tbl_menuingredient").is(":visible")){
        return
    }

//    var foodtype=$("#lst_menutype").val();
    var foodtype=$("#lst_menutype option:selected").text();
    var menuname=$("#menuname").val();
    var noofeater=$("#noofeater").val();
    var price=$("#price").val();
    if (menuname.length==0 || noofeater.length==0 || price==0){
        alert("ตรวจสอบชื่อเมนู, จำนวนคนกินและราคา");
        return
    }

    //save ingredient to database
    xData=new FormData();
    xData.append("peopleid", peopleid);
    xData.append("foodtype", foodtype);
    xData.append("menuid", menuid);
    xData.append("menuname", menuname);
    xData.append("noofeater", noofeater);
    xData.append("price", price);

    var tblcontent={};
	tblcontent.ingredient=new Array();

	var maxrows = document.getElementById("tbl_menuingredient").rows.length;

	for (var i=1; i<maxrows; i++){
		var xx=$("#tbl_menuingredient").find("tr:eq(" + i + ")");
		var foodcode=xx.find("td:eq(0)").text();
		var foodname=xx.find("td:eq(2)").text();
		var quantity=xx.find("td:eq(3)").text();
		var quanunit=xx.find("td:eq(4)").text();

		tblcontent.ingredient.push({
			'foodcode':foodcode,
			'quantity':f2N(quantity),
			'quanunit':quanunit
		});
	}
	var myJSON = JSON.stringify(tblcontent);
	xData.append('tabledata', myJSON);

    $.ajax({
        url: appPHP + "savemenu.php",
        type: "POST",
        data: xData,
        processData:false,
        contentType:false,
        cache:false,
        success: function(response){
            var data=JSON.parse(response).menu;
            
            if (data.length > 0){
                $.each(data, function(index,item){
                    menuid=item.menuid;
                    alert("ระบบทำการบันทึกเรียบร้อยแล้ว !อย่าลืมบันทึกภาพถ่ายอาหาร");
					
					HP("makemenu");
                });
            }
        }
    });	        
}

function editMenu(){
    $("#div_allHMmenu").show();
    $("#div_makemenu").hide();
    $("#div_recipeAdjust").hide();
    $("#onsAnalyze").hide();
    $("#onsIngredient").show();

	getAllHMmenu();
}


function editAllMenu(){
	selectedrow=parseInt($(this).parent().index());
	selectedcol=parseInt($(this).index());

    if (selectedrow == 0){
        //table header -> no action to take
        return
    }

    var xx=$("#tbl_allHMmenu").find("tr:eq(" + selectedrow + ")");
    menuid=xx.find("td:eq(4)").text();  //global variable
    var menuname=xx.find("td:eq(2)").text();

    if (selectedcol=="0"){
        //delete menu
        xr=confirm("ต้องการลบเมนูนี้: " + menuname);
        if (xr==true){
            //delete this row from table
            $(this).closest('tr').remove();

            xData=new FormData();
            xData.append("menuid", menuid);
        
            $.ajax({
                url: appPHP + "markmenudelete.php",
                type: "POST",
                data: xData,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response){
                    if (response=="Complete"){
                        alert("ลบเมนูเรียบร้อยแล้ว");
                    }
                }
            });
        }
    }
    else{
        //edit ingredients of this menu      
        $("#div_allHMmenu").hide();
        $("#div_makemenu").show();
        $("dash_energy").text("");

        $("#carbohydrate_r").text("");
        $("#protein_r").text("");
        $("#fat_r").text("");

        $("#dash_sodium").text("");
        $("#dash_sugar").text("");
        $("#dash_fat").text("");

        //retrieve ingredients of this menu and fill the tbl_menuingredient
        xData=new FormData();
        xData.append("peopleid", peopleid);
        xData.append("menuid", menuid);

        $.ajax({
            url: appPHP + "getingredient.php",
            type: "POST",
            data: xData,
            processData:false,
            contentType:false,
            cache:false,
            success: function(response){
                data=JSON.parse(response).ingredient;

                if (data.length >0){
                    var tbl=document.getElementById("tbl_menuingredient");

                    //delete from row#1 to end of table
                    $("#tbl_menuingredient tr:not(:first)").remove();

				    var lstfoodtype=["", "1. ข้าวและกับข้าว", "2. อาหารจานเดียว", "3. อาหารตามสั่ง", "4. อาหารประเภทเส้น", "5. ขนม", "6. เครื่องดื่ม", "7. ผลไม้"]
					var ft=data[0].foodtype;
					$("#lst_menutype").val(lstfoodtype.indexOf(ft)).change();

                    $("#menuname").val(data[0].name);
                    $("#noofeater").val(data[0].noofeater);
                    $("#price").val(data[0].price);

                    //calculate and update CHO : PROT : FAT ratio
                    noofeater=parseFloat(data[0].noofeater);
                    energy=parseFloat(data[0].energy/noofeater);
                    carbohydrate=parseFloat(data[0].carbohydrate/noofeater);
                    protein=parseFloat(data[0].protein/noofeater);
                    fat=parseFloat(data[0].fat/noofeater);
                    sodium=parseFloat(data[0].sodium/noofeater);
                    sugar=parseFloat(data[0].sugar/noofeater);

                    var temp=carbohydrate*4 + protein*4 + fat*9;

                    $("#carbohydrate_r").text(digit(carbohydrate * 4 * 100/temp));
                    $("#protein_r").text(digit(protein * 4 * 100/temp));
                    $("#fat_r").text(digit(fat * 9 * 100/temp));

                    //setting up low and high boundaries for each foodtype//
                    if (data[0].foodtype.substr(0, 1)=="5"){
                        var energy_low=0;
                        var energy_high=100;
                        var sodium_high=100;
                        var sugar_high=6;
                        var fat_high=3;
                    }
                    else if (data[0].foodtype.substr(0, 1)=="6"){
                        var energy_low=0;
                        var energy_high=40;
                        var sodium_high=40;
                        var sugar_high=10;
                        var fat_high=3;
                    }
                    else if (data[0].foodtype.substr(0, 1)=="7"){
                        var energy_low=0;
                        var energy_high=120;
                        var sodium_high=700;
                        var sugar_high=10;
                        var fat_high=100;
                    }
                    else{
                        var energy_low=200;
                        var energy_high=600;
                        var sodium_high=700;
                        var sugar_high=2;
                        var fat_high=10;
                    }
                    //----------------------------------------------------//

                    //energy
                    if (energy >= energy_low && energy <= energy_high){
                        $("#dash_energy").html("<font style='color:green'>"+numeral(energy).format('#,#')+"</font>");
                    }
                    else{
                        $("#dash_energy").html("<font style='color:red'>"+numeral(energy).format('#,#')+"</font>");
                    }

                    //sodium
                    if (sodium <= sodium_high){
                        $("#dash_sodium").html("<font style='color:green'>"+numeral(sodium).format("#,#")+"</font>");
                    }
                    else{
                        $("#dash_sodium").html("<font style='color:red'>"+numeral(sodium).format("#,#")+"</font>");
                    }

                    //sugar
                    if (sugar <= sugar_high){
                        $("#dash_sugar").html("<font style='color:green'>"+digit(sugar)+"</font>");
                    }
                    else{
                        $("#dash_sugar").html("<font style='color:red'>"+digit(sugar)+"</font>");
                    }

                    //fat
                    if (fat <= fat_high){
                        $("#dash_fat").html("<font style='color:green'>"+digit(fat)+"</font>");
                    }
                    else{
                        $("#dash_fat").html("<font style='color:red'>"+digit(fat)+"</font>");
                    }

                    $.each(data, function(index,item){
                        var r=tbl.insertRow();
                        var cell0=r.insertCell(0);
                        var cell1=r.insertCell(1);
                        var cell2=r.insertCell(2);
                        var cell3=r.insertCell(3);
                        var cell4=r.insertCell(4);

                        cell0.style.display="none";
                        cell1.align="center";
                        cell2.align="left";
                        cell3.align="center";
                        cell4.align="center";
						
						cell1.width="5%";

                        cell0.innerHTML=item.foodcode;
                        cell1.innerHTML="<img src='images/delete.png' width='90%'>";
                        cell2.innerHTML=item.foodname;
                        cell3.innerHTML=n2F(item.quantity);
                        cell4.innerHTML=item.quanunit;
                    });
                }
            }
        });
    }
}

function onsAnalyzeClose(){
    $("#onsAnalyze").hide();
    $("#div_recipeAdjust").hide();
    $("#onsIngredient").show();

}

function analyze(){
    //analyze from ingredient and quantity displayed on tbl_menuingredient NOT FROM database
    //but the system always SAVE ingredient BEFORE analyzing
    if ($("#menuname").val().length==0 || $("#noofeater").val().length==0 || $("#price").val()==0){
        alert("ป้อนชื่อเมนู, จำนวนคนกินและราคา");
        return
    }

    //adjust height of onsAnalyze
    //var cardH=pageHeight - 116 - $("#onsButton").height() - $("#onsIngredient").height();
    if (OS=="Windows"){
        var cardH = pageHeight - $("#ons_menudetail").height() - $("#ons_analyze").height() - $("#ons_ctrlbutton").height() - (33 * 4);
    }
    else if (OS=="Mac"){
        var cardH = pageHeight - $("#ons_menudetail").height() - $("#ons_analyze").height() - $("#ons_ctrlbutton").height() - (33 * 4);
    }
    else if (OS=="Android"){
        var cardH = pageHeight - $("#ons_menudetail").height() - $("#ons_analyze").height() - $("#ons_ctrlbutton").height() - (33 * 4);
    }

//    $("#onsAnalyze").css({"height":cardH});
//    $("#div_analyzeresult").css({"height": cardH-100});
	
    $("#onsIngredient").hide();
    var analyzefoodtype=$("#lst_menutype option:selected").text().substr(0, 1);
//    var foodtype=$("#lst_menutype").val().substr(0, 1);

    if (analyzefoodtype=="5"){ //ขนม
        analyze5();
    }
    else if (analyzefoodtype=="6"){    //เครื่องดื่ม
        analyze6();
    }
    else if (analyzefoodtype=="7"){    // ผลไม้
        analyze7();
    }
    else{   //1.ข้าวและกับข้าว, 2.อาหารจานเดียว, 3.อาหารตามสั่ง, 4.อาหารประเภทเส้น
        analyze1();
    }
}

function analyze1(){
//    var foodtype=$("#lst_menutype").val();
    var foodtype=$("#lst_menutype option:selected").text();

    menuname=$("#menuname").val();
    noofeater=$("#noofeater").val();
    price=$("#price").val();
    
    xData=new FormData();
    xData.append("peopleid", peopleid);
    xData.append("foodtype", foodtype);
    xData.append("menuid", menuid);
    xData.append("menuname", menuname);
    xData.append("noofeater", noofeater);
    xData.append("price", price);

    //start analyzing
    var tblcontent={};
	tblcontent.ingredient=new Array();
	var maxrows = document.getElementById("tbl_menuingredient").rows.length;

	for (var i=1; i<maxrows; i++){
		var xx=$("#tbl_menuingredient").find("tr:eq(" + i + ")");
		var foodcode=xx.find("td:eq(0)").text();
		var foodname=xx.find("td:eq(2)").text();
		var quantity=xx.find("td:eq(3)").text();
		var quanunit=xx.find("td:eq(4)").text();

		tblcontent.ingredient.push({
			'foodcode':foodcode,
            'foodnamet':foodname,
			'quantity':f2N(quantity),
			'quanunit':quanunit
		});
	}
	var myJSON = JSON.stringify(tblcontent);
	xData.append('tabledata', myJSON);

    $.ajax({
        url: appPHP + "analyze1.php",
        type: "POST",
        data: xData,
        processData:false,
        contentType:false,
        cache:false,
        success: function(response){
            data=JSON.parse(response).nutrient;
            data1=JSON.parse(response).ingredient;

            if (data1.length > 0){
                var analyseresult=data1[0].analyseresult;
                var st1=analyseresult.substr(0, 1);
                var st2=analyseresult.substr(1, 1);
                var st3=analyseresult.substr(2, 1);
                var st4=analyseresult.substr(3, 1);
                var st5=analyseresult.substr(4, 1);
                var st6=analyseresult.substr(5, 1);
                var st7=analyseresult.substr(6, 1);
                var st8=analyseresult.substr(7, 1);
                var st9=analyseresult.substr(8, 1);

                $("#onsAnalyze").css({'display':'block'});
                $("#div_ingredientPass").hide();

                if (analyseresult=="YYYYYYYYY" || analyseresult=="YNYYYYYYY"){  //ผ่านเกณฑ์วัตถุดิบ
                    //ผ่านเกณฑ์เรื่องวัตถุดิบ

                    //วิเคราะห์การผ่านเกณฑ์เป็นเมนูชูสุขภาพ
                    if (data.length >0){
                        $("#div_recipeAdjust").show();
                        $.each(data, function(index,item){
                            menuid=item.menuid;   //global variable
                            energy=item.energy;
                            sugar=item.sugar;
                            sodium=item.sodium;
                            fat=item.fat;
                            carbohydrate_r=item.carbohydrate_r;
                            protein_r=item.protein_r;
                            fat_r=item.fat_r;

                            d_energy=item.d_energy; //dominant energy
                            d_carbohydrate=item.d_carbohydrate;
                            d_protein=item.d_protein;
                            d_fat=item.d_fat;
                            d_sodium=item.d_sodium;
                            d_sugar=item.d_sugar;

                            $("#carbohydrate_r").text(digit(item.carbohydrate_r));
                            $("#protein_r").text(digit(item.protein_r));
                            $("#fat_r").text(digit(item.fat_r));

                            //energy
                            if (energy > 200 && energy < 600){
                                $("#dash_energy").html("<font style='color:green'>"+numeral(item.energy).format('#,#')+"</font>");
                            }
                            else{
                                $("#dash_energy").html("<font style='color:red'>"+numeral(item.energy).format('#,#')+"</font>");
                            }
                            
                            //sodium
                            if (sodium <= 700){
                                $("#dash_sodium").html("<font style='color:green'>"+numeral(item.sodium).format("#,#")+"</font>");
                            }
                            else{
                                $("#dash_sodium").html("<font style='color:red'>"+numeral(item.sodium).format("#,#")+"</font>");
                            }

                            //sugar
                            if (sugar <= 2){
                                $("#dash_sugar").html("<font style='color:green'>"+digit(item.sugar)+"</font>");
                            }
                            else{
                                $("#dash_sugar").html("<font style='color:red'>"+digit(item.sugar)+"</font>");
                            }

                            //fat
                            if (fat <= 10){
                                $("#dash_fat").html("<font style='color:green'>"+digit(item.fat)+"</font>");
                            }
                            else{
                                $("#dash_fat").html("<font style='color:red'>"+digit(item.fat)+"</font>");
                            }

                            energy=item.energy;
                            carbohydrate=item.carbohydrate;
                            protein=item.protein;
                            fat=item.fat;
                            calcium=item.calcium;
                            potassium=item.potassium;
                            dietaryfiber=item.dietaryfiber;
                            sugar=item.sugar;
                            sodium=item.sodium;
                            cholesterol=item.cholesterol;
                            iron=item.iron;
                            vitamina=item.vitamina;
                            vitaminb1=item.vitaminb1;
                            vitaminb2=item.vitaminb2;
                            vitaminc=item.vitaminc;
                            phosphorus=item.phosphorus;
                            magnesium=item.magnesium;
                            copper=item.copper;
                            zinc=item.zinc;
                            iodine=item.iodine;
                            betacarotine=item.betacarotine;
                            niacin=item.niacin;
                            vitamine=item.vitamine;
                            folate=item.folate;
                        });

                        //reset heading
                        $("#pass_fail").text("");
                        $("#cause").text("");
                        $("#howtofix").text("");
                        //$("#tbl_recipeAdjust tr:not(:second)").remove();

                        //check เกณฑ์เมนูทางเลือก ลดเค็ม(1200) ลดหวาน(8) ลดมัน(15)
                        //_______________________________________________________
                        altmenu_sodium="N";
                        altmenu_sugar="N"
                        altmenu_fat="N";
                        healthy_menu="N";
                        altmenu="N";

                        if (sodium <= 1200){altmenu_sodium="Y"; altmenu="Y";}else{altmenu_sodium="N"}
                        if (sugar <= 8){altmenu_sugar="Y"; altmenu="Y";}else{altmenu_sugar="N"}
                        if (fat <= 15){altmenu_fat="Y";altmenu="Y";}else{altmenu_fat="N"}
                        
                        if (altmenu_sodium=="Y" || altmenu_sugar=="Y" || altmenu_fat=="Y"){
                            var temp="เมนูนี้ ผ่านเกณฑ์เป็นเมนูทางเลือก " + "\r\n\r\n";
                            if (altmenu_sodium=="Y"){temp=temp + "     " + "ลดเค็ม" + "\r\n";}
                            if (altmenu_sugar=="Y"){temp=temp + "     " + "ลดหวาน" + "\r\n";}
                            if (altmenu_fat=="Y"){temp=temp + "     " + "ลดมัน" + "\r\n";}

                            temp=temp + "\r\n";
                            temp=temp + "ท่านสามารถปรับสูตรให้ผ่านเกณฑ์เป็นเมนูชูสุขภาพได้ ตามคำแนะนำต่อไป";
                            //alert(temp);
                        }


                        //check if pass the Healthymenu criteria
                        if (energy < 200){ //too low
                            $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                            $("#cause").text("พลังงานต่ำเกินไป \r\n (ควรอยู่ระหว่าง 200-600 กิโลแคลอรี)");
                            var hty="แนวทางปรับสูตร" + "<br>";
                            hty=hty+"&nbsp;&nbsp;"+"1. ลดจำนวนคนกิน"+"<br>";
                            hty=hty+"&nbsp;&nbsp;"+"2. เพิ่มวัตถุดิบที่ให้พลังงาน เช่น"+"<br>";
                            hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+"คาร์โบไฮเดรต, ไขมัน, โปรตีน";
                            
                            $("#howtofix").html(hty);
                        }
                        else if (energy > 600){    //too high
                            $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                            $("#cause").text("พลังงานสูงเกินไป");
                            var hty="แนวทางปรับสูตร" + "<br>";
                            hty=hty+"&nbsp;&nbsp;"+"1. เพิ่มจำนวนคนกิน"+"<br>";
                            hty=hty+"&nbsp;&nbsp;"+"2. ลดวัตถุดิบที่ให้พลังงาน เช่น"+"<br>";
                            hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+"คาร์โบไฮเดรต, ไขมัน, โปรตีน";
                            
                            $("#howtofix").html(hty);
                        }
                        else {  // energy > 200 and < 600
                            if (carbohydrate_r < 45){  // cho too low
                                $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                                $("#cause").text("อัตราส่วนคาร์โบไฮเดรทต่ำเกินไป" + "<br>" + "(ควรอยู่ระหว่าง 45-80%)");
                                var hty="แนวทางปรับสูตร" + "<br>";
                                hty=hty+"&nbsp;&nbsp;"+"1. ลดจำนวนคนกิน"+"<br>";
                                hty=hty+"&nbsp;&nbsp;"+"2. เพิ่มวัตถุดิบที่มีคาร์โบไฮเดรท เช่น"+"<br>";
                                hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ d_carbohydrate + "<br><br>";
                                
                                $("#howtofix").html(hty);
                            }
                            else if (carbohydrate_r > 80){
                                $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                                $("#cause").text("อัตราส่วนคาร์โบไฮเดรทสูงเกินไป"  + "<br>" + "(ควรอยู่ระหว่าง 45-80%)");
                                var hty="แนวทางปรับสูตร" + "<br>";
                                hty=hty+"&nbsp;&nbsp;"+"1. เพิ่มจำนวนคนกิน"+"<br>";
                                hty=hty+"&nbsp;&nbsp;"+"2. ลดวัตถุดิบที่มีคาร์โบไฮเดรท เช่น"+"<br>";
                                hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ d_carbohydrate + "<br><br>";
                                
                                $("#howtofix").html(hty);
                            }
                            else {  //cho > 45 and < 80
                                if (sugar > 2){    //too high
                                    $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                                    $("#cause").text("น้ำตาลสูงเกินไป" + "<br>" + "(ไม่ควรเกิน 2 กรัม)");
                                    var hty="แนวทางปรับสูตร" + "<br>";
                                    hty=hty+"&nbsp;&nbsp;"+"1. เพิ่มจำนวนคนกิน"+"<br>";
                                    hty=hty+"&nbsp;&nbsp;"+"2. ลดวัตถุดิบที่มีน้ำตาล เช่น"+"<br>";
                                    hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ d_sugar + "<br><br>";
                                    
                                    $("#howtofix").html(hty);
                                }
                                else {  //ok
                                    if (protein_r < 10){   //too low
                                        $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                                        $("#cause").text("อัตราส่วนโปรตีนต่ำเกินไป"  + "<br>" + "(ไม่ควรต่ำกว่า 10%)");
                                        var hty="แนวทางปรับสูตร" + "<br>";
                                        hty=hty+"&nbsp;&nbsp;"+"1. เพิ่มจำนวนคนกิน"+"<br>";
                                        hty=hty+"&nbsp;&nbsp;"+"2. เพิ่มวัตถุดิบที่มีโปรตีน เช่น"+"<br>";
                                        hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ d_protein + "<br><br>";
                                        
                                        $("#howtofix").html(hty);
                                    }
                                    else {  //ok
                                        if (fat_r > 30){   //too high
                                            $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                                            $("#cause").text("อัตราส่วนไขมันสูงเกินไป"  + "<br>" + "(ไม่ตวรสูงกว่า 30%)");
                                            var hty="แนวทางปรับสูตร" + "<br>";
                                            hty=hty+"&nbsp;&nbsp;"+"1. เพิ่มจำนวนคนกิน"+"<br>";
                                            hty=hty+"&nbsp;&nbsp;"+"2. ลดวัตถุดิบที่มีไขมัน เช่น"+"<br>";
                                            hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ d_fat + "<br><br>";
                                            
                                            $("#howtofix").html(hty);
                                        }
                                        else{   //ok
                                            if (sodium > 700){ //too high
                                                $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                                                $("#cause").html("โซเดียมสูงเกินไป" + "<br>" + "(ไม่ควรเกิน 700 มิลิกรัม)");
                                                var hty="แนวทางปรับสูตร" + "<br>";
                                                hty=hty+"&nbsp;&nbsp;"+"1. เพิ่มจำนวนคนกิน"+"<br>";
                                                hty=hty+"&nbsp;&nbsp;"+"2. ลดวัตถุดิบที่มีโซเดียม เช่น"+"<br>";
                                                hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ d_sodium + "<br><br>";
                                                
                                                $("#howtofix").html(hty);
                                            }
                                            else{   //ok
                                                if (fat > 10){ //too high
                                                    $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                                                    $("#cause").text("ไขมันสูงเกินไป");
                                                    var hty="แนวทางปรับสูตร" + "<br>";
                                                    hty=hty+"&nbsp;&nbsp;"+"1. เพิ่มจำนวนคนกิน"+"<br>";
                                                    hty=hty+"&nbsp;&nbsp;"+"2. ลดวัตถุดิบที่มีไขมัน เช่น"+"<br>";
                                                    hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ d_fat + "<br><br>";
                                                    
                                                    $("#howtofix").html(hty);
                                                }
                                                else{   //ok
                                                    //pass the Healtymenu criteria//
                                                    //----------------------------//
                                                    //$("#pass_fail").text("ผ่านเกณฑ์");
                                                    var healthy_menu="Y";
													saveHMPass();   //save "Y" to approve to be a Healthy Menu

                                                    //construct pass logo and wording and table
                                                    var tbl=document.createElement("table");
                                                    var td=document.getElementById("pass_fail");
                                                    var r=tbl.insertRow();
                                                    var cell0=r.insertCell(0);
                                                    var cell1=r.insertCell(1);
                                                    
                                                    tbl.width="100%";
                                                    tbl.style.borderSpacing=0;

                                                    cell0.width="30%";
                                                    cell1.width="70%";

                                                    cell0.align="center"
                                                    cell1.align="center";

                                                    cell0.innerHTML="<div><img src='images/healthymenuLogo.png' width='90%' /></div>"
                                                    cell1.innerHTML="<div><font style='color: green; font-family:Kanit;font-size:17px'>ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font></div>";
                                                    td.appendChild(tbl);

                                                    $("#cause").html("");

	                                            }
    	                                    }
        	                            }
            	                    }
                	            }
                    	    }
	                    }

						//contruct nutrient table the append to $("#howtofix")
						tbl=document.createElement("table");
						td=document.getElementById("howtofix");
						r=tbl.insertRow();
						cell0=r.insertCell(0);
						cell1=r.insertCell(1);

						tbl.width="100%";

						cell0.align="center"
						cell1.align="center"

						cell0.width="75%";
						cell1.width="25%";

						cell0.innerHTML="รายการ";
						cell1.innerHTML="ปริมาณ";

						cell0.className="highRowDB";
						cell1.className="highRowDB";

						for (var ix=0; ix<=24; ix++){
							r=tbl.insertRow()
							cell0=r.insertCell(0);
							cell1=r.insertCell(1);

							cell1.align="center";

							if (ix % 2 ==0){
								cell0.className="highRowLB";
								cell1.className="highRowLB";
							}

							if (ix==0){cell0.innerHTML="พลังงาน/Energy (kcal)"; cell1.innerHTML=numeral(energy).format("#,#");}
							if (ix==2){cell0.innerHTML="คาร์โบไฮเดรต/Carbohydrate (g) "; cell1.innerHTML=digit(carbohydrate);}
							if (ix==3){cell0.innerHTML="โปรตีน/Protein (g)"; cell1.innerHTML=digit(protein);}
							if (ix==4){cell0.innerHTML="ไขมัน/Fat (g)"; cell1.innerHTML=digit(fat);}
							if (ix==5){cell0.innerHTML="แคลเซียม/Calcium (mg)"; cell1.innerHTML=digit(calcium);}
							if (ix==6){cell0.innerHTML="โพแทสเซียม/Potassium (mg)"; cell1.innerHTML=digit(potassium);}
							if (ix==7){cell0.innerHTML="เส้นใยอาหาร/Dietaryfiber (g)"; cell1.innerHTML=digit(dietaryfiber);}
							if (ix==8){cell0.innerHTML="น้ำตาล/Sugar (g)"; cell1.innerHTML=digit(sugar);}
							if (ix==9){cell0.innerHTML="โซเดียม/Sodium (mg)"; cell1.innerHTML=numeral(sodium).format("#,#");}
							if (ix==10){cell0.innerHTML="คอเลสเตอรอล/Cholesterol (g)"; cell1.innerHTML=digit(cholesterol);}
							if (ix==11){cell0.innerHTML="เหล็ก/Iron (mg)"; cell1.innerHTML=digit(iron);}
							if (ix==12){cell0.innerHTML="วิตามิน เอ/Vitamin A (IU)"; cell1.innerHTML=digit(vitamina);}
							if (ix==13){cell0.innerHTML="วิตามิน บี1/Vitamin B1 (mg)"; cell1.innerHTML=digit(vitaminb1);}
							if (ix==14){cell0.innerHTML="วิตามิน บี2/Vitamin B2 (mg)"; cell1.innerHTML=digit(vitaminb2);}
							if (ix==15){cell0.innerHTML="วิตามิน ซี/Vitamin C (mg)"; cell1.innerHTML=digit(vitaminc);}
							if (ix==16){cell0.innerHTML="วิตามิน อี/Vitamin E (mg)"; cell1.innerHTML=digit(vitamine);}
							if (ix==17){cell0.innerHTML="ฟอสฟอรัส/Phosphorus (mg)"; cell1.innerHTML=digit(phosphorus);}
							if (ix==18){cell0.innerHTML="แมกนีเซียม/Magnesium (mg)"; cell1.innerHTML=digit(magnesium);}
							if (ix==19){cell0.innerHTML="ทองแดง/Copper (mg)"; cell1.innerHTML=digit(copper);}
							if (ix==20){cell0.innerHTML="สังกะสี/Zinc (mg)"; cell1.innerHTML=digit(zinc);}
							if (ix==21){cell0.innerHTML="ไอโอดีน/Iodine (mg)"; cell1.innerHTML=digit(iodine);}
							if (ix==22){cell0.innerHTML="เบต้าแคโรทีน/Betacarotine (mg)"; cell1.innerHTML=digit(betacarotine);}
							if (ix==23){cell0.innerHTML="ไนอาซิน/Niacin (mg)"; cell1.innerHTML=digit(niacin);}
							if (ix==24){cell0.innerHTML="โฟเลต/Folate (mg)"; cell1.innerHTML=digit(folate);}
						}

						td.appendChild(tbl);
					}   
                }
                else{   //ไม่ผ่านเกณฑ์วัตถุดิบ
                    $("#div_ingredientPass").show();

                    //show ingredient group condition
                    if (st1=="Y"){$("#cond1").html("<img src='images/pass.png' width='80%' />")}else{$("#cond1").html("<img src='images/delete.png' width='80%' />")}
                    if (st2=="Y"){$("#cond2").html("<img src='images/pass.png' width='80%' />")}else{$("#cond2").html("<img src='images/delete.png' width='80%' />")}
                    if (st3=="Y"){$("#cond3").html("<img src='images/pass.png' width='80%' />")}else{$("#cond3").html("<img src='images/delete.png' width='80%' />")}
                    if (st4=="Y"){$("#cond4").html("<img src='images/pass.png' width='80%' />")}else{$("#cond4").html("<img src='images/delete.png' width='80%' />")}
                    if (st5=="Y"){$("#cond5").html("<img src='images/pass.png' width='80%' />")}else{$("#cond5").html("<img src='images/delete.png' width='80%' />")}
                    if (st6=="Y"){$("#cond6").html("<img src='images/pass.png' width='80%' />")}else{$("#cond6").html("<img src='images/delete.png' width='80%' />")}
                    if (st7=="Y"){$("#cond7").html("<img src='images/pass.png' width='80%' />")}else{$("#cond7").html("<img src='images/delete.png' width='80%' />")}
                    if (st8=="Y"){$("#cond8").html("<img src='images/pass.png' width='80%' />")}else{$("#cond8").html("<img src='images/delete.png' width='80%' />")}
                    if (st9=="Y"){$("#cond9").html("<img src='images/pass.png' width='80%' />")}else{$("#cond9").html("<img src='images/delete.png' width='80%' />")}
                }
                if (healthy_menu != "Y"){
                    if (altmenu=="Y"){
                        saveAltPass();  //บันทึก การผ่านเป็นเมนูทางเลือก
                        alert(temp);    //แจ้งว่าผ่านเมนูทางเลือกอะไรบ้าง
                    }
                    saveHMnotPass();
                }
            }
        }
    });
}

function analyze5(){
//    var foodtype=$("#lst_menutype").val();
    var foodtype=$("#lst_menutype option:selected").text();

    menuname=$("#menuname").val();
    noofeater=$("#noofeater").val();
    price=$("#price").val();
    
    xData=new FormData();
    xData.append("peopleid", peopleid);
    xData.append("foodtype", foodtype);
    xData.append("menuid", menuid);
    xData.append("menuname", menuname);
    xData.append("noofeater", noofeater);
    xData.append("price", price);

    //start analyzing
    var tblcontent={};
	tblcontent.ingredient=new Array();
	var maxrows = document.getElementById("tbl_menuingredient").rows.length;

	for (var i=1; i<maxrows; i++){
		var xx=$("#tbl_menuingredient").find("tr:eq(" + i + ")");
		var foodcode=xx.find("td:eq(0)").text();
		var foodname=xx.find("td:eq(2)").text();
		var quantity=xx.find("td:eq(3)").text();
		var quanunit=xx.find("td:eq(4)").text();

		tblcontent.ingredient.push({
			'foodcode':foodcode,
            'foodnamet':foodname,
			'quantity':f2N(quantity),
			'quanunit':quanunit
		});
	}
	var myJSON = JSON.stringify(tblcontent);
	xData.append('tabledata', myJSON);

    $.ajax({
        url: appPHP + "analyze5.php",
        type: "POST",
        data: xData,
        processData:false,
        contentType:false,
        cache:false,
        success: function(response){
            data=JSON.parse(response).nutrient;
            data1=JSON.parse(response).ingredient;

            $("#div_recipeAdjust").show();
            if (data.length >0){
                $.each(data, function(index,item){
                    menuid=item.menuid;   //global variable
                    energy=item.energy;
                    sugar=item.sugar;
                    sodium=item.sodium;
                    fat=item.fat;
                    dietaryfiber=item.dietaryfiber;
                    carbohydrate_r=item.carbohydrate_r;
                    protein_r=item.protein_r;
                    fat_r=item.fat_r;

                    d_energy=item.d_energy; //dominant energy
                    d_carbohydrate=item.d_carbohydrate;
                    d_protein=item.d_protein;
                    d_fat=item.d_fat;
                    d_sodium=item.d_sodium;
                    d_sugar=item.d_sugar;
                    d_dietaryfiber=item.d_dietaryfiber;

                    $("#carbohydrate_r").text(digit(item.carbohydrate_r));
                    $("#protein_r").text(digit(item.protein_r));
                    $("#fat_r").text(digit(item.fat_r));

                    //energy
                    if (energy <= 100){
                        $("#dash_energy").html("<font style='color:green'>"+numeral(item.energy).format('#,#')+"</font>");
                    }
                    else{
                        $("#dash_energy").html("<font style='color:red'>"+numeral(item.energy).format('#,#')+"</font>");
                    }
                    
                    //sodium
                    if (sodium <= 100){
                        $("#dash_sodium").html("<font style='color:green'>"+numeral(item.sodium).format("#,#")+"</font>");
                    }
                    else{
                        $("#dash_sodium").html("<font style='color:red'>"+numeral(item.sodium).format("#,#")+"</font>");
                    }

                    //sugar
                    if (sugar <= 6){
                        $("#dash_sugar").html("<font style='color:green'>"+digit(item.sugar)+"</font>");
                    }
                    else{
                        $("#dash_sugar").html("<font style='color:red'>"+digit(item.sugar)+"</font>");
                    }

                    //fat
                    if (fat <= 3){
                        $("#dash_fat").html("<font style='color:green'>"+digit(item.fat)+"</font>");
                    }
                    else{
                        $("#dash_fat").html("<font style='color:red'>"+digit(item.fat)+"</font>");
                    }

                    energy=item.energy;
                    carbohydrate=item.carbohydrate;
                    protein=item.protein;
                    fat=item.fat;
                    calcium=item.calcium;
                    potassium=item.potassium;
                    dietaryfiber=item.dietaryfiber;
                    sugar=item.sugar;
                    sodium=item.sodium;
                    cholesterol=item.cholesterol;
                    iron=item.iron;
                    vitamina=item.vitamina;
                    vitaminb1=item.vitaminb1;
                    vitaminb2=item.vitaminb2;
                    vitaminc=item.vitaminc;
                    phosphorus=item.phosphorus;
                    magnesium=item.magnesium;
                    copper=item.copper;
                    zinc=item.zinc;
                    iodine=item.iodine;
                    betacarotine=item.betacarotine;
                    niacin=item.niacin;
                    vitamine=item.vitamine;
                    folate=item.folate;
                });
            }

            if (data1.length > 0){
                var pass=data1[0].pass;
                var reason=data1[0].reason;

                $("#onsAnalyze").css({'display':'block'});
                $("#div_ingredientPass").hide();

                if (pass=="Y"){
                    //reset heading
                    $("#pass_fail").text("");
                    $("#cause").text("");
                    $("#howtofix").text("");

                    //pass the Healtymenu criteria//
                    //----------------------------//
                    //$("#pass_fail").text("ผ่านเกณฑ์");
                    var healthy_menu="Y";
					saveHMPass();   //save "Y" to approve to be a Healthy Menu

                    //construct pass logo and wording and table
                    var tbl=document.createElement("table");
                    var td=document.getElementById("pass_fail");
                    tbl.width="100%";
                    tbl.style.borderSpacing=0;
					
                    var r=tbl.insertRow();
                    var cell0=r.insertCell(0);
                    var cell1=r.insertCell(1);

                    cell0.width="30%";
                    cell1.width="70%";

                    cell0.align="center"
                    cell1.align="center";

                    cell0.innerHTML="<div><img src='images/healthymenuLogo.png' width='90%' /></div>"
                    cell1.innerHTML="<div><font style='color: green; font-family:Kanit;font-size:17px'>ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font></div>";
                    td.appendChild(tbl);

                    $("#cause").html("");
                }
                else{
                    //check if pass the Healthymenu criteria
                    if (energy > 100){ //too high
                        $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                        $("#cause").html("พลังงาน " + digit(energy) + " กิโลแคลอรี สูงเกินไป" +  "<br>" + "(ต้องไม่เกิน 100 กิโลแคลอรี)");
                        var hty="แนวทางปรับสูตร" + "<br>";
                        hty=hty+"&nbsp;&nbsp;"+"1. เพิ่มจำนวนคนกิน"+"<br>";
                        hty=hty+"&nbsp;&nbsp;"+"2. ลดวัตถุดิบที่ให้พลังงาน เช่น"+"<br>";
                        hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ d_energy;
                        
                        $("#howtofix").html(hty);
                    }
                    else {  // energy <= 100
                        if (sugar > 6){  // sugar too high
                            $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                            $("#cause").html("น้ำตาล " + digit(sugar) + " กรัมสูงเกินไป" + "<br>" + "(ต้องไม่เกิน 6 กรัม)");
                            var hty="แนวทางปรับสูตร" + "<br>";
                            hty=hty+"&nbsp;&nbsp;"+"1. เพิ่มจำนวนคนกิน"+"<br>";
                            hty=hty+"&nbsp;&nbsp;"+"2. ลดวัตถุดิบที่มีน้ำตาลลง เช่น"+"<br>";
                            hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ d_sugar;
                            
                            $("#howtofix").html(hty);
                        }
                        else {  //sugar <= 6
                            if (fat > 3){    //fat too high
                                $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                                $("#cause").html("ไขมัน " + digit(fat) + " กรัม สูงเกินไป" + "<br>" + "(ต้องไม่เกิน 3 กรัม)");
                                var hty="แนวทางปรับสูตร" + "<br>";
                                hty=hty+"&nbsp;&nbsp;"+"1. เพิ่มจำนวนคนกิน"+"<br>";
                                hty=hty+"&nbsp;&nbsp;"+"2. ลดวัตถุดิบที่มีไขมัน เช่น"+"<br>";
                                hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ d_fat;
                                
                                $("#howtofix").html(hty);
                            }
                            else {  //ok
                                if (sodium > 100){   //sodium too hight
                                    $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                                    $("#cause").html("โซเดียม " + digit(sodium) + " มิลลิกรัม สูงเกินไป" + "<br>" + "(ต้องไม่เกิน 100 มิลลิกรัม)");
                                    var hty="แนวทางปรับสูตร" + "<br>";
                                    hty=hty+"&nbsp;&nbsp;"+"1. เพิ่มจำนวนคนกิน"+"<br>";
                                    hty=hty+"&nbsp;&nbsp;"+"2. ลดวัตถุดิบที่มีโซเดียม เช่น"+"<br>";
                                    hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ d_sodium;
                                    
                                    $("#howtofix").html(hty);
                                }
                                else {  //ok
                                    if (dietaryfiber < 0.7){   //dietary fiber too low
                                        $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                                        $("#cause").html("ใยอาหาร " + digit(dietaryfiber) + "กรัม ต่ำเกินไป" + "<br>" + "(อย่างน้อย 0.7 กรัม)");
                                        var hty="แนวทางปรับสูตร" + "<br>";
                                        hty=hty+"&nbsp;&nbsp;"+"1. ลดจำนวนคนกิน"+"<br>";
                                        hty=hty+"&nbsp;&nbsp;"+"2. เพิ่มวัตถุดิบที่มีใยอาหาร เช่น"+"<br>";
                                        hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ d_dietaryfiber;

                                        $("#howtofix").html(hty);
                                    }
                                    else{   //ok
                                        if (protein < 1.80){ //protein too low
                                            $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                                            $("#cause").html("โปรตีน " + digit(protein) + " กรัม ต่ำเกินไป" + "<br>" + "(อย่างน้อย 1.8 กรัม)");
                                            var hty="แนวทางปรับสูตร" + "<br>";
                                            hty=hty+"&nbsp;&nbsp;"+"1. ลดจำนวนคนกิน"+"<br>";
                                            hty=hty+"&nbsp;&nbsp;"+"2. เพิ่มวัตถุดิบที่มีโปรตีน เช่น"+"<br>";
                                            hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ d_protein;
                                            
                                            $("#howtofix").html(hty);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (pass != "Y"){
                        saveHMnotPass();
                    }
                }

				//show nutrient table
				tbl=document.createElement("table");
				td=document.getElementById("howtofix");

				//insert blank line
				r=tbl.insertRow();
				cell0=r.insertCell(0)
				cell0.colSpan=2;
				cell0.innerHTML="&nbsp";
				//------------------

				r=tbl.insertRow();
				cell0=r.insertCell(0);
				cell1=r.insertCell(1);

				tbl.width="100%";

				cell0.align="center"
				cell1.align="center"

				cell0.width="75%";
				cell1.width="25%";

				cell0.innerHTML="รายการ";
				cell1.innerHTML="ปริมาณ";

				cell0.className="highRowDB";
				cell1.className="highRowDB";

				for (var ix=0; ix<=24; ix++){
					r=tbl.insertRow()
					cell0=r.insertCell(0);
					cell1=r.insertCell(1);

					cell1.align="center";

					if (ix % 2 ==0){
						cell0.className="highRowLB";
						cell1.className="highRowLB";
					}

					if (ix==0){cell0.innerHTML="พลังงาน/Energy (kcal)"; cell1.innerHTML=numeral(energy).format("#,#");}
					if (ix==2){cell0.innerHTML="คาร์โบไฮเดรต/Carbohydrate (g) "; cell1.innerHTML=digit(carbohydrate);}
					if (ix==3){cell0.innerHTML="โปรตีน/Protein (g)"; cell1.innerHTML=digit(protein);}
					if (ix==4){cell0.innerHTML="ไขมัน/Fat (g)"; cell1.innerHTML=digit(fat);}
					if (ix==5){cell0.innerHTML="แคลเซียม/Calcium (mg)"; cell1.innerHTML=digit(calcium);}
					if (ix==6){cell0.innerHTML="โพแทสเซียม/Potassium (mg)"; cell1.innerHTML=digit(potassium);}
					if (ix==7){cell0.innerHTML="เส้นใยอาหาร/Dietaryfiber (g)"; cell1.innerHTML=digit(dietaryfiber);}
					if (ix==8){cell0.innerHTML="น้ำตาล/Sugar (g)"; cell1.innerHTML=digit(sugar);}
					if (ix==9){cell0.innerHTML="โซเดียม/Sodium (mg)"; cell1.innerHTML=digit(sodium);}
					if (ix==10){cell0.innerHTML="คอเลสเตอรอล/Cholesterol (g)"; cell1.innerHTML=digit(cholesterol);}
					if (ix==11){cell0.innerHTML="เหล็ก/Iron (mg)"; cell1.innerHTML=digit(iron);}
					if (ix==12){cell0.innerHTML="วิตามิน เอ/Vitamin A (IU)"; cell1.innerHTML=digit(vitamina);}
					if (ix==13){cell0.innerHTML="วิตามิน บี1/Vitamin B1 (mg)"; cell1.innerHTML=digit(vitaminb1);}
					if (ix==14){cell0.innerHTML="วิตามิน บี2/Vitamin B2 (mg)"; cell1.innerHTML=digit(vitaminb2);}
					if (ix==15){cell0.innerHTML="วิตามิน ซี/Vitamin C (mg)"; cell1.innerHTML=digit(vitaminc);}
					if (ix==16){cell0.innerHTML="วิตามิน อี/Vitamin E (mg)"; cell1.innerHTML=digit(vitamine);}
					if (ix==17){cell0.innerHTML="ฟอสฟอรัส/Phosphorus (mg)"; cell1.innerHTML=digit(phosphorus);}
					if (ix==18){cell0.innerHTML="แมกนีเซียม/Magnesium (mg)"; cell1.innerHTML=digit(magnesium);}
					if (ix==19){cell0.innerHTML="ทองแดง/Copper (mg)"; cell1.innerHTML=digit(copper);}
					if (ix==20){cell0.innerHTML="สังกะสี/Zinc (mg)"; cell1.innerHTML=digit(zinc);}
					if (ix==21){cell0.innerHTML="ไอโอดีน/Iodine (mg)"; cell1.innerHTML=digit(iodine);}
					if (ix==22){cell0.innerHTML="เบต้าแคโรทีน/Betacarotine (mg)"; cell1.innerHTML=digit(betacarotine);}
					if (ix==23){cell0.innerHTML="ไนอาซิน/Niacin (mg)"; cell1.innerHTML=digit(niacin);}
					if (ix==24){cell0.innerHTML="โฟเลต/Folate (mg)"; cell1.innerHTML=digit(folate);}
				}

				td.appendChild(tbl);

            }
        }
    });
}

function analyze6(){
//    var foodtype=$("#lst_menutype").val();
    var foodtype=$("#lst_menutype option:selected").text();

    menuname=$("#menuname").val();
    noofeater=$("#noofeater").val();
    price=$("#price").val();
    
    xData=new FormData();
    xData.append("peopleid", peopleid);
    xData.append("foodtype", foodtype);
    xData.append("menuid", menuid);
    xData.append("menuname", menuname);
    xData.append("noofeater", noofeater);
    xData.append("price", price);

    //start analyzing
    var tblcontent={};
	tblcontent.ingredient=new Array();
	var maxrows = document.getElementById("tbl_menuingredient").rows.length;

	for (var i=1; i<maxrows; i++){
		var xx=$("#tbl_menuingredient").find("tr:eq(" + i + ")");
		var foodcode=xx.find("td:eq(0)").text();
		var foodname=xx.find("td:eq(2)").text();
		var quantity=xx.find("td:eq(3)").text();
		var quanunit=xx.find("td:eq(4)").text();

		tblcontent.ingredient.push({
			'foodcode':foodcode,
            'foodnamet':foodname,
			'quantity':f2N(quantity),
			'quanunit':quanunit
		});
	}
	var myJSON = JSON.stringify(tblcontent);
	xData.append('tabledata', myJSON);

    $.ajax({
        url: appPHP + "analyze6.php",
        type: "POST",
        data: xData,
        processData:false,
        contentType:false,
        cache:false,
        success: function(response){
            data=JSON.parse(response).nutrient;
            data1=JSON.parse(response).ingredient;

            $("#div_recipeAdjust").show();
            if (data.length >0){
                $.each(data, function(index,item){
                    menuid=item.menuid;   //global variable
                    energy=item.energy;
                    sugar=item.sugar;
                    sodium=item.sodium;
                    fat=item.fat;
                    dietaryfiber=item.dietaryfiber;
                    carbohydrate_r=item.carbohydrate_r;
                    protein_r=item.protein_r;
                    fat_r=item.fat_r;

                    d_energy=item.d_energy; //dominant energy
                    d_carbohydrate=item.d_carbohydrate;
                    d_sodium=item.d_sodium;
                    d_sugar=item.d_sugar;

                    $("#carbohydrate_r").text(digit(item.carbohydrate_r));
                    $("#protein_r").text(digit(item.protein_r));
                    $("#fat_r").text(digit(item.fat_r));

                    //energy
                    if (energy <= 40){
                        $("#dash_energy").html("<font style='color:green'>"+numeral(item.energy).format('#,#')+"</font>");
                    }
                    else{
                        $("#dash_energy").html("<font style='color:red'>"+numeral(item.energy).format('#,#')+"</font>");
                    }
                    
                    //sodium
                    if (sodium <= 40){
                        $("#dash_sodium").html("<font style='color:green'>"+numeral(item.sodium).format("#,#")+"</font>");
                    }
                    else{
                        $("#dash_sodium").html("<font style='color:red'>"+numeral(item.sodium).format("#,#")+"</font>");
                    }

                    //sugar
                    if (sugar <= 10){
                        $("#dash_sugar").html("<font style='color:green'>"+digit(item.sugar)+"</font>");
                    }
                    else{
                        $("#dash_sugar").html("<font style='color:red'>"+digit(item.sugar)+"</font>");
                    }

                    energy=item.energy;
                    carbohydrate=item.carbohydrate;
                    protein=item.protein;
                    fat=item.fat;
                    calcium=item.calcium;
                    potassium=item.potassium;
                    dietaryfiber=item.dietaryfiber;
                    sugar=item.sugar;
                    sodium=item.sodium;
                    cholesterol=item.cholesterol;
                    iron=item.iron;
                    vitamina=item.vitamina;
                    vitaminb1=item.vitaminb1;
                    vitaminb2=item.vitaminb2;
                    vitaminc=item.vitaminc;
                    phosphorus=item.phosphorus;
                    magnesium=item.magnesium;
                    copper=item.copper;
                    zinc=item.zinc;
                    iodine=item.iodine;
                    betacarotine=item.betacarotine;
                    niacin=item.niacin;
                    vitamine=item.vitamine;
                    folate=item.folate;
                });
            }

            if (data1.length > 0){
                var pass=data1[0].pass;
                var reason=data1[0].reason;

                $("#onsAnalyze").css({'display':'block'});
                $("#div_ingredientPass").hide();

                if (pass=="Y"){
                    //reset heading
                    $("#pass_fail").text("");
                    $("#cause").text("");
                    $("#howtofix").text("");

                    //pass the Healtymenu criteria//
                    //----------------------------//
                    //$("#pass_fail").text("ผ่านเกณฑ์");
                    var healthy_menu="Y";
                    saveHMPass();   //save "Y" to approve to be a Healthy Menu

                    //construct pass logo and wording and table
                    var tbl=document.createElement("table");
                    var td=document.getElementById("pass_fail");
                    var r=tbl.insertRow();
                    var cell0=r.insertCell(0);
                    var cell1=r.insertCell(1);
                    
                    tbl.width="100%";
                    tbl.style.borderSpacing=0;

                    cell0.width="30%";
                    cell1.width="70%";

                    cell0.align="center"
                    cell1.align="center";

                    cell0.innerHTML="<div><img src='images/healthymenuLogo.png' width='90%' /></div>"
                    cell1.innerHTML="<div><font style='color: green; font-family:Kanit;font-size:17px'>ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font></div>";
                    td.appendChild(tbl);

                    $("#cause").html("");

                }
                else{
                    //check if pass the Healthymenu criteria
                    if (energy > 40){ //too high
                        $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                        $("#cause").html("พลังงานสูงเกินไป <br> (ต้องไม่เกิน 40 กิโลแคลอรี)");
                        var hty="แนวทางปรับสูตร" + "<br>";
                        hty=hty+"&nbsp;&nbsp;"+"1. เพิ่มจำนวนคนกิน"+"<br>";
                        hty=hty+"&nbsp;&nbsp;"+"2. ลดวัตถุดิบที่ให้พลังงาน เช่น"+"<br>";
                        hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ d_energy;
                        
                        $("#howtofix").html(hty);
                    }
                    else {  // energy <= 100
                        if (sugar > 10){  // sugar too high
                            $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                            $("#cause").html("น้ำตาลสูงเกินไป <br> (ต้อวไท่เกิน 10 กรัม)");
                            var hty="แนวทางปรับสูตร" + "<br>";
                            hty=hty+"&nbsp;&nbsp;"+"1. เพิ่มจำนวนคนกิน"+"<br>";
                            hty=hty+"&nbsp;&nbsp;"+"2. ลดวัตถุดิบที่มีน้ำตาลลง เช่น"+"<br>";
                            hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ d_sugar;
                            
                            $("#howtofix").html(hty);
                        }
                        else {  //sugar <= 6
                            if (sodium > 100){   //sodium too hight
                                $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                                $("#cause").html("โซเดียมสูงเกินไป <br> (ต้องไม่เกิน 100 มิลลิกรัม)");
                                var hty="แนวทางปรับสูตร" + "<br>";
                                hty=hty+"&nbsp;&nbsp;"+"1. เพิ่มจำนวนคนกิน"+"<br>";
                                hty=hty+"&nbsp;&nbsp;"+"2. ลดวัตถุดิบที่มีโซเดียม เช่น"+"<br>";
                                hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ d_sodium;
                                
                                $("#howtofix").html(hty);
                            }
                        }
                    }

                    if (pass != "Y"){
                        saveHMnotPass();
                    }
                }

				//contruct nutrient table the append to $("#howtofix")
				tbl=document.createElement("table");
				td=document.getElementById("howtofix");
				
				//insert blank row
				r=tbl.insertRow();
				cell0=r.insertCell(0);
				cell0.colSpan=2;
				cell0.innerHTML="&nbsp;";
				
				r=tbl.insertRow();
				cell0=r.insertCell(0);
				cell1=r.insertCell(1);

				tbl.width="100%";

				cell0.align="center"
				cell1.align="center"

				cell0.width="75%";
				cell1.width="25%";

				cell0.innerHTML="รายการ";
				cell1.innerHTML="ปริมาณ";

				cell0.className="highRowDB";
				cell1.className="highRowDB";

				for (var ix=0; ix<=24; ix++){
					r=tbl.insertRow()
					cell0=r.insertCell(0);
					cell1=r.insertCell(1);

					cell1.align="center";

					if (ix % 2 ==0){
						cell0.className="highRowLB";
						cell1.className="highRowLB";
					}

					if (ix==0){cell0.innerHTML="พลังงาน/Energy (kcal)"; cell1.innerHTML=numeral(energy).format("#,#");}
					if (ix==2){cell0.innerHTML="คาร์โบไฮเดรต/Carbohydrate (g) "; cell1.innerHTML=digit(carbohydrate);}
					if (ix==3){cell0.innerHTML="โปรตีน/Protein (g)"; cell1.innerHTML=digit(protein);}
					if (ix==4){cell0.innerHTML="ไขมัน/Fat (g)"; cell1.innerHTML=digit(fat);}
					if (ix==5){cell0.innerHTML="แคลเซียม/Calcium (mg)"; cell1.innerHTML=digit(calcium);}
					if (ix==6){cell0.innerHTML="โพแทสเซียม/Potassium (mg)"; cell1.innerHTML=digit(potassium);}
					if (ix==7){cell0.innerHTML="เส้นใยอาหาร/Dietaryfiber (g)"; cell1.innerHTML=digit(dietaryfiber);}
					if (ix==8){cell0.innerHTML="น้ำตาล/Sugar (g)"; cell1.innerHTML=digit(sugar);}
					if (ix==9){cell0.innerHTML="โซเดียม/Sodium (mg)"; cell1.innerHTML=digit(sodium);}
					if (ix==10){cell0.innerHTML="คอเลสเตอรอล/Cholesterol (g)"; cell1.innerHTML=digit(cholesterol);}
					if (ix==11){cell0.innerHTML="เหล็ก/Iron (mg)"; cell1.innerHTML=digit(iron);}
					if (ix==12){cell0.innerHTML="วิตามิน เอ/Vitamin A (IU)"; cell1.innerHTML=digit(vitamina);}
					if (ix==13){cell0.innerHTML="วิตามิน บี1/Vitamin B1 (mg)"; cell1.innerHTML=digit(vitaminb1);}
					if (ix==14){cell0.innerHTML="วิตามิน บี2/Vitamin B2 (mg)"; cell1.innerHTML=digit(vitaminb2);}
					if (ix==15){cell0.innerHTML="วิตามิน ซี/Vitamin C (mg)"; cell1.innerHTML=digit(vitaminc);}
					if (ix==16){cell0.innerHTML="วิตามิน อี/Vitamin E (mg)"; cell1.innerHTML=digit(vitamine);}
					if (ix==17){cell0.innerHTML="ฟอสฟอรัส/Phosphorus (mg)"; cell1.innerHTML=digit(phosphorus);}
					if (ix==18){cell0.innerHTML="แมกนีเซียม/Magnesium (mg)"; cell1.innerHTML=digit(magnesium);}
					if (ix==19){cell0.innerHTML="ทองแดง/Copper (mg)"; cell1.innerHTML=digit(copper);}
					if (ix==20){cell0.innerHTML="สังกะสี/Zinc (mg)"; cell1.innerHTML=digit(zinc);}
					if (ix==21){cell0.innerHTML="ไอโอดีน/Iodine (mg)"; cell1.innerHTML=digit(iodine);}
					if (ix==22){cell0.innerHTML="เบต้าแคโรทีน/Betacarotine (mg)"; cell1.innerHTML=digit(betacarotine);}
					if (ix==23){cell0.innerHTML="ไนอาซิน/Niacin (mg)"; cell1.innerHTML=digit(niacin);}
					if (ix==24){cell0.innerHTML="โฟเลต/Folate (mg)"; cell1.innerHTML=digit(folate);}
				}

				td.appendChild(tbl);
            }
        }
    });
}

function analyze7(){
    var foodtype=$("#lst_menutype option:selected").text();

    menuname=$("#menuname").val();
    noofeater=$("#noofeater").val();
    price=$("#price").val();
    
    xData=new FormData();
    xData.append("peopleid", peopleid);
    xData.append("foodtype", foodtype);
    xData.append("menuid", menuid);
    xData.append("menuname", menuname);
    xData.append("noofeater", noofeater);
    xData.append("price", price);

    //start analyzing
    var tblcontent={};
	tblcontent.ingredient=new Array();
	var maxrows = document.getElementById("tbl_menuingredient").rows.length;

	for (var i=1; i<maxrows; i++){
		var xx=$("#tbl_menuingredient").find("tr:eq(" + i + ")");
		var foodcode=xx.find("td:eq(0)").text();
		var foodname=xx.find("td:eq(2)").text();
		var quantity=xx.find("td:eq(3)").text();
		var quanunit=xx.find("td:eq(4)").text();

		tblcontent.ingredient.push({
			'foodcode':foodcode,
            'foodnamet':foodname,
			'quantity':f2N(quantity),
			'quanunit':quanunit
		});
	}
	var myJSON = JSON.stringify(tblcontent);
	xData.append('tabledata', myJSON);

    $.ajax({
        url: appPHP + "analyze7.php",
        type: "POST",
        data: xData,
        processData:false,
        contentType:false,
        cache:false,
        success: function(response){
            data=JSON.parse(response).nutrient;
            data1=JSON.parse(response).ingredient;

            $("#div_recipeAdjust").show();
            if (data.length >0){
                $.each(data, function(index,item){
                    menuid=item.menuid;   //global variable
                    energy=item.energy;
                    sugar=item.sugar;
                    sodium=item.sodium;
                    fat=item.fat;
                    dietaryfiber=item.dietaryfiber;
                    carbohydrate_r=item.carbohydrate_r;
                    protein_r=item.protein_r;
                    fat_r=item.fat_r;

                    d_energy=item.d_energy; //dominant energy
                    d_carbohydrate=item.d_carbohydrate;
                    d_sodium=item.d_sodium;
                    d_sugar=item.d_sugar;

                    $("#carbohydrate_r").text(digit(item.carbohydrate_r));
                    $("#protein_r").text(digit(item.protein_r));
                    $("#fat_r").text(digit(item.fat_r));

                    //energy
                    if (energy <= 120){
                        $("#dash_energy").html("<font style='color:green'>"+numeral(item.energy).format('#,#')+"</font>");
                    }
                    else{
                        $("#dash_energy").html("<font style='color:red'>"+numeral(item.energy).format('#,#')+"</font>");
                    }
                    
                    //sodium
                    if (sodium <= 700){
                        $("#dash_sodium").html("<font style='color:green'>"+numeral(item.sodium).format("#,#")+"</font>");
                    }
                    else{
                        $("#dash_sodium").html("<font style='color:red'>"+numeral(item.sodium).format("#,#")+"</font>");
                    }

                    //sugar
                    if (sugar <= 10){
                        $("#dash_sugar").html("<font style='color:green'>"+digit(item.sugar)+"</font>");
                    }
                    else{
                        $("#dash_sugar").html("<font style='color:red'>"+digit(item.sugar)+"</font>");
                    }
                    
                    //fat
                    $("#dash_fat").html(digit(item.fat));

                    energy=item.energy;
                    carbohydrate=item.carbohydrate;
                    protein=item.protein;
                    fat=item.fat;
                    calcium=item.calcium;
                    potassium=item.potassium;
                    dietaryfiber=item.dietaryfiber;
                    sugar=item.sugar;
                    sodium=item.sodium;
                    cholesterol=item.cholesterol;
                    iron=item.iron;
                    vitamina=item.vitamina;
                    vitaminb1=item.vitaminb1;
                    vitaminb2=item.vitaminb2;
                    vitaminc=item.vitaminc;
                    phosphorus=item.phosphorus;
                    magnesium=item.magnesium;
                    copper=item.copper;
                    zinc=item.zinc;
                    iodine=item.iodine;
                    betacarotine=item.betacarotine;
                    niacin=item.niacin;
                    vitamine=item.vitamine;
                    folate=item.folate;
                });
            }

            if (data1.length > 0){
                var pass=data1[0].pass;
                var fruitparts=parseFloat(data1[0].fruitparts);
                var noofeater=parseFloat(data1[0].noofeater);
                var excludeitem=data1[0].excludeitem;

                var personpart=fruitparts/noofeater;

                $("#onsAnalyze").css({'display':'block'});
                $("#div_ingredientPass").hide();

                if (pass=="Y"){
                    //reset heading
                    $("#pass_fail").text("");
                    $("#cause").text("");
                    $("#howtofix").text("");

                    //pass the Healtymenu criteria//
                    //----------------------------//
                    //$("#pass_fail").text("ผ่านเกณฑ์");
                    var healthy_menu="Y";
                    saveHMPass();   //save "Y" to approve to be a Healthy Menu

                    //construct pass logo and wording and table
                    var tbl=document.createElement("table");
                    var td=document.getElementById("pass_fail");
                    var r=tbl.insertRow();
                    var cell0=r.insertCell(0);
                    var cell1=r.insertCell(1);
                    
                    tbl.width="100%";
                    tbl.style.borderSpacing=0;

                    cell0.width="30%";
                    cell1.width="70%";

                    cell0.align="center"
                    cell1.align="center";

                    cell0.innerHTML="<div><img src='images/healthymenuLogo.png' width='90%' /></div>"
                    cell1.innerHTML="<div><font style='color: green; font-family:Kanit;font-size:17px'>ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font></div>";
                    td.appendChild(tbl);

                    $("#cause").html("");
/*
                    //contruct nutrient table the append to $("#howtofix")
                    tbl=document.createElement("table");
                    td=document.getElementById("howtofix");
                    r=tbl.insertRow();
                    cell0=r.insertCell(0);
                    cell1=r.insertCell(1);

                    tbl.width="100%";

                    cell0.align="center"
                    cell1.align="center"

                    cell0.width="75%";
                    cell1.width="25%";

                    cell0.innerHTML="รายการ";
                    cell1.innerHTML="ปริมาณ";

                    cell0.className="highRowDB";
                    cell1.className="highRowDB";

                    for (var ix=0; ix<=24; ix++){
                        r=tbl.insertRow()
                        cell0=r.insertCell(0);
                        cell1=r.insertCell(1);

                        cell1.align="center";

                        if (ix % 2 ==0){
                            cell0.className="highRowLB";
                            cell1.className="highRowLB";
                        }

						if (ix==0){cell0.innerHTML="พลังงาน/Energy (kcal)"; cell1.innerHTML=numeral(energy).format("#,#");}
						if (ix==2){cell0.innerHTML="คาร์โบไฮเดรต/Carbohydrate (g) "; cell1.innerHTML=digit(carbohydrate);}
						if (ix==3){cell0.innerHTML="โปรตีน/Protein (g)"; cell1.innerHTML=digit(protein);}
						if (ix==4){cell0.innerHTML="ไขมัน/Fat (g)"; cell1.innerHTML=digit(fat);}
						if (ix==5){cell0.innerHTML="แคลเซียม/Calcium (mg)"; cell1.innerHTML=digit(calcium);}
						if (ix==6){cell0.innerHTML="โพแทสเซียม/Potassium (mg)"; cell1.innerHTML=digit(potassium);}
						if (ix==7){cell0.innerHTML="เส้นใยอาหาร/Dietaryfiber (g)"; cell1.innerHTML=digit(dietaryfiber);}
						if (ix==8){cell0.innerHTML="น้ำตาล/Sugar (g)"; cell1.innerHTML=digit(sugar);}
						if (ix==9){cell0.innerHTML="โซเดียม/Sodium (mg)"; cell1.innerHTML=digit(sodium);}
						if (ix==10){cell0.innerHTML="คอเลสเตอรอล/Cholesterol (g)"; cell1.innerHTML=digit(cholesterol);}
						if (ix==11){cell0.innerHTML="เหล็ก/Iron (mg)"; cell1.innerHTML=digit(iron);}
						if (ix==12){cell0.innerHTML="วิตามิน เอ/Vitamin A (IU)"; cell1.innerHTML=digit(vitamina);}
						if (ix==13){cell0.innerHTML="วิตามิน บี1/Vitamin B1 (mg)"; cell1.innerHTML=digit(vitaminb1);}
						if (ix==14){cell0.innerHTML="วิตามิน บี2/Vitamin B2 (mg)"; cell1.innerHTML=digit(vitaminb2);}
						if (ix==15){cell0.innerHTML="วิตามิน ซี/Vitamin C (mg)"; cell1.innerHTML=digit(vitaminc);}
						if (ix==16){cell0.innerHTML="วิตามิน อี/Vitamin E (mg)"; cell1.innerHTML=digit(vitamine);}
						if (ix==17){cell0.innerHTML="ฟอสฟอรัส/Phosphorus (mg)"; cell1.innerHTML=digit(phosphorus);}
						if (ix==18){cell0.innerHTML="แมกนีเซียม/Magnesium (mg)"; cell1.innerHTML=digit(magnesium);}
						if (ix==19){cell0.innerHTML="ทองแดง/Copper (mg)"; cell1.innerHTML=digit(copper);}
						if (ix==20){cell0.innerHTML="สังกะสี/Zinc (mg)"; cell1.innerHTML=digit(zinc);}
						if (ix==21){cell0.innerHTML="ไอโอดีน/Iodine (mg)"; cell1.innerHTML=digit(iodine);}
						if (ix==22){cell0.innerHTML="เบต้าแคโรทีน/Betacarotine (mg)"; cell1.innerHTML=digit(betacarotine);}
						if (ix==23){cell0.innerHTML="ไนอาซิน/Niacin (mg)"; cell1.innerHTML=digit(niacin);}
						if (ix==24){cell0.innerHTML="โฟเลต/Folate (mg)"; cell1.innerHTML=digit(folate);}
                    }

                    td.appendChild(tbl);*/
                }
                else{
                    //check if pass the Healthymenu criteria
                    if (excludeitem.length > 0){
                        alert("ผลไม้ดังต่อไปนี้ มีความหวานมากเกินไป" + "\r\n\r\n" +
                        excludeitem);
                    }

                    if (personpart < 0.9){ //too low
                        $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                        $("#cause").html("ปริมาณ " + digit(personpart) + " ส่วน น้อยเกินไป" + "<br>" + "ปริมาณที่แนะนำคือ ผลไม้มื้อละ 1 ส่วน");
                        var hty="แนวทางปรับสูตร" + "<br>";
                        hty=hty+"&nbsp;&nbsp;"+"1. ลดจำนวนคนกิน"+"<br>";
                        hty=hty+"&nbsp;&nbsp;"+"2. เพิมปริมาณผลไม้ให้มากขึ้น";
                        //hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ d_energy;
                        
                        $("#howtofix").html(hty);
                    }
                    else if (personpart > 1){  //too high
                        $("#pass_fail").html("<font style='color:red'>ยังไม่ผ่านเกณฑ์เป็นเมนูชูสุขภาพ</font>");
                        $("#cause").html("ปริมาณ " + digit(personpart) + " ส่วน มากเกินไป" + "<br>" + "ปริมาณที่แนะนำคือ ผลไม้มื้อละ 1 ส่วน");
                        var hty="แนวทางปรับสูตร" + "<br>";
                        hty=hty+"&nbsp;&nbsp;"+"1. เพิ่มจำนวนคนกิน"+"<br>";
                        hty=hty+"&nbsp;&nbsp;"+"2. ลดปริมาณผลไม้ลง เช่น" + "<br>";
                        hty=hty+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ excludeitem;
                        
                        $("#howtofix").html(hty);
                    }
                    if (pass != "Y"){
                        saveHMnotPass();
                    }
                }

				//contruct nutrient table the append to $("#howtofix")
				tbl=document.createElement("table");
				td=document.getElementById("howtofix");
				
				//insert blank row
				r=tbl.insertRow();
				cell0=r.insertCell(0);
				cell0.colSpan="2";
				cell0.innerHTML="&nbsp;";

				r=tbl.insertRow();
				cell0=r.insertCell(0);
				cell1=r.insertCell(1);

				tbl.width="100%";

				cell0.align="center"
				cell1.align="center"

				cell0.width="75%";
				cell1.width="25%";

				cell0.innerHTML="รายการ";
				cell1.innerHTML="ปริมาณ";

				cell0.className="highRowDB";
				cell1.className="highRowDB";

				for (var ix=0; ix<=24; ix++){
					r=tbl.insertRow()
					cell0=r.insertCell(0);
					cell1=r.insertCell(1);

					cell1.align="center";

					if (ix % 2 ==0){
						cell0.className="highRowLB";
						cell1.className="highRowLB";
					}

					if (ix==0){cell0.innerHTML="พลังงาน/Energy (kcal)"; cell1.innerHTML=numeral(energy).format("#,#");}
					if (ix==2){cell0.innerHTML="คาร์โบไฮเดรต/Carbohydrate (g) "; cell1.innerHTML=digit(carbohydrate);}
					if (ix==3){cell0.innerHTML="โปรตีน/Protein (g)"; cell1.innerHTML=digit(protein);}
					if (ix==4){cell0.innerHTML="ไขมัน/Fat (g)"; cell1.innerHTML=digit(fat);}
					if (ix==5){cell0.innerHTML="แคลเซียม/Calcium (mg)"; cell1.innerHTML=digit(calcium);}
					if (ix==6){cell0.innerHTML="โพแทสเซียม/Potassium (mg)"; cell1.innerHTML=digit(potassium);}
					if (ix==7){cell0.innerHTML="เส้นใยอาหาร/Dietaryfiber (g)"; cell1.innerHTML=digit(dietaryfiber);}
					if (ix==8){cell0.innerHTML="น้ำตาล/Sugar (g)"; cell1.innerHTML=digit(sugar);}
					if (ix==9){cell0.innerHTML="โซเดียม/Sodium (mg)"; cell1.innerHTML=digit(sodium);}
					if (ix==10){cell0.innerHTML="คอเลสเตอรอล/Cholesterol (g)"; cell1.innerHTML=digit(cholesterol);}
					if (ix==11){cell0.innerHTML="เหล็ก/Iron (mg)"; cell1.innerHTML=digit(iron);}
					if (ix==12){cell0.innerHTML="วิตามิน เอ/Vitamin A (IU)"; cell1.innerHTML=digit(vitamina);}
					if (ix==13){cell0.innerHTML="วิตามิน บี1/Vitamin B1 (mg)"; cell1.innerHTML=digit(vitaminb1);}
					if (ix==14){cell0.innerHTML="วิตามิน บี2/Vitamin B2 (mg)"; cell1.innerHTML=digit(vitaminb2);}
					if (ix==15){cell0.innerHTML="วิตามิน ซี/Vitamin C (mg)"; cell1.innerHTML=digit(vitaminc);}
					if (ix==16){cell0.innerHTML="วิตามิน อี/Vitamin E (mg)"; cell1.innerHTML=digit(vitamine);}
					if (ix==17){cell0.innerHTML="ฟอสฟอรัส/Phosphorus (mg)"; cell1.innerHTML=digit(phosphorus);}
					if (ix==18){cell0.innerHTML="แมกนีเซียม/Magnesium (mg)"; cell1.innerHTML=digit(magnesium);}
					if (ix==19){cell0.innerHTML="ทองแดง/Copper (mg)"; cell1.innerHTML=digit(copper);}
					if (ix==20){cell0.innerHTML="สังกะสี/Zinc (mg)"; cell1.innerHTML=digit(zinc);}
					if (ix==21){cell0.innerHTML="ไอโอดีน/Iodine (mg)"; cell1.innerHTML=digit(iodine);}
					if (ix==22){cell0.innerHTML="เบต้าแคโรทีน/Betacarotine (mg)"; cell1.innerHTML=digit(betacarotine);}
					if (ix==23){cell0.innerHTML="ไนอาซิน/Niacin (mg)"; cell1.innerHTML=digit(niacin);}
					if (ix==24){cell0.innerHTML="โฟเลต/Folate (mg)"; cell1.innerHTML=digit(folate);}
				}

				td.appendChild(tbl);
            }
        }
    });
}
//-----------------------------------------------//

function saveHMPass(){
    var xData=new FormData();
    xData.append("menuid", menuid);

    $.ajax({
        url: appPHP + "savehmpass.php",
        type: "POST",
        data: xData,
        processData:false,
        contentType:false,
        cache:false,
        success: function(response){
            //done
        }
    });
}

function saveHMnotPass(){
    var xData=new FormData();
    xData.append("menuid", menuid);

    $.ajax({
        url: appPHP + "savehmnotpass.php",
        type: "POST",
        data: xData,
        processData:false,
        contentType:false,
        cache:false,
        success: function(response){
            //done
        }
    });
}

function saveAltPass(){
    var xData=new FormData();
    xData.append("menuid", menuid);
    xData.append("altmenu_sodium", altmenu_sodium);
    xData.append("altmenu_sugar", altmenu_sugar);
    xData.append("altmenu_fat", altmenu_fat);

    $.ajax({
        url: appPHP + "savealtmenupass.php",
        type: "POST",
        data: xData,
        processData:false,
        contentType:false,
        cache:false,
        success: function(response){
            //done
        }
    });
}

function digit(fx){
    var temp=numeral(fx).format("#,##0.00");
    return temp;
}

function newMenu(){
    //reset home.html
    $("#div_allHMmenu").hide();
    $("#div_makemenu").show();
    $("#menuname").val("");
    $("#noofeater").val("");
    $("#price").val("");
	
    //clear tbl_menuingredient
    $("#tbl_menuingredient tr:not(:first)").remove();

    $("#div_addpopup").hide();
    $("#div_menuingredient").show();
    menuid="";

}

function getMobileOperatingSystem() {
	if (navigator.userAgent.indexOf("Win") != -1){
		return "Windows";
	}
	else if (navigator.userAgent.indexOf("Mac") != -1){
		return "Mac";
	}
	else if (navigator.userAgent.indexOf("Android") != -1){
		return "Android";
	}
	else if (navigator.userAgent.indexOf("like Mac") != -1){
		return "iOS";
	}
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}

//**********//
//setup.html//
//**********//
function resetPin(){
	$("#pin1").val("");	
	$("#pin2").val("");	
	$("#pin3").val("");	
	$("#pin4").val("");	
	$("#pin5").val("");	
	$("#pin6").val("");	

	$("#inp_pdpa").prop("checked", false);
	$("#btn_saveuser").prop("disabled", true);

}

function saveUser(){
    peopleid=$("#peopleid").val();
    var name=$("#name").val();
    var gender=$("input[name='gender']:checked").val();
    var shopname=$("#shopname").val();
    var address=$("#address").val();
    var province=$("#province").val();
    var amphur=$("#amphur").val();
    var tumbol=$("#tumbol").val();
    var officehour=$("#officehour").val();

    var telno=$("#peopleid").val();
    var lat=latitude;
    var lang=longitude;
    var linemanurl=$("#linemanurl").val();
    var pin1=$("#pin1").val();
    var pin2=$("#pin2").val();
    var pin3=$("#pin3").val();
    var pin4=$("#pin4").val();
    var pin5=$("#pin5").val();
    var pin6=$("#pin6").val();

    if (peopleid.length < 8){alert("กรุณาป้อนหมายเลขโทรศัพท์"); $("#div_pdpa").hide(); $("#div_setup").show(); resetPin(); return}
    if (name == null || name==""){alert("กรุณาป้อนชื่อ-นามสกุล"); $("#div_pdpa").hide(); $("#div_setup").show(); resetPin(); return}
    if (province == null || province==""){alert("กรุณาเลือกจังหวัด"); $("#div_pdpa").hide(); $("#div_setup").show(); resetPin(); return}
    if (amphur == null || amphur==""){alert("กรุณาเลือกอำเภอ"); $("#div_pdpa").hide(); $("#div_setup").show(); resetPin(); return}
    if (tumbol == null || tumbol==""){alert("กรุณาเลือกตำบล"); $("#div_pdpa").hide(); $("#div_setup").show(); resetPin(); return}
    if (shopname == null || shopname==""){alert("กรุณาป้อนชื่อร้านอาหาร"); $("#div_pdpa").hide(); $("#div_setup").show(); resetPin(); return}
    if (address == null || address==""){alert("กรุณาป้อนที่อยู่\r\nมิฉะนั้นจะไม่สามารถลงทะเบียนได้"); $("#div_pdpa").hide(); $("#div_setup").show(); resetPin(); return}
    if (officehour == null || officehour==""){alert("กรุณาป้อนเวลาทำการ"); $("#div_pdpa").hide(); $("#div_setup").show(); resetPin(); return}

    if (officehour.indexOf("น") == -1){
        officehour=officehour + " น.";
    }

    if (pin1.length < 1){alert("กรุณาป้อนรหัสผ่าน 6 หลัก");return;}
    if (pin2.length < 1){alert("กรุณาป้อนรหัสผ่าน 6 หลัก");return;}
    if (pin3.length < 1){alert("กรุณาป้อนรหัสผ่าน 6 หลัก");return;}
    if (pin4.length < 1){alert("กรุณาป้อนรหัสผ่าน 6 หลัก");return;}
    if (pin5.length < 1){alert("กรุณาป้อนรหัสผ่าน 6 หลัก");return;}
    if (pin6.length < 1){alert("กรุณาป้อนรหัสผ่าน 6 หลัก");return;}

    //contruct PIN
    gpin = pin1 + pin2 + pin3 + pin4 + pin5 + pin6;

    xData=new FormData();
    xData.append("peopleid", peopleid);
    xData.append("name", name);
    xData.append("gender", gender);
    xData.append("shopname", shopname);
    xData.append("address", address);
    xData.append("province", province);
    xData.append("amphur", amphur);
    xData.append("tumbol", tumbol);
    xData.append("officehour", officehour);
    xData.append("telno", telno);
    xData.append("latitude", lat);
    xData.append("longitude", lang);
    xData.append("linemanurl", linemanurl);

    xData.append("pin", gpin);

    $.ajax({
        url: appPHP + "saveuser.php",
        type: "POST",
        data: xData,
        processData:false,
        contentType:false,
        cache:false,
        success: function(response){
            if (response=="Complete"){
                //save username and PIN to the phone
                localStorage.setItem("username", peopleid);
                localStorage.setItem("pin", gpin);
				
				username=peopleid;	//global variable

                $("#pin1").val("");
                $("#pin2").val("");
                $("#pin3").val("");
                $("#pin4").val("");
                $("#pin5").val("");
                $("#pin6").val("");
				
				$("#inp_pdpa").prop( "checked", false );
				$("#btn_saveuser").prop( "disabled", true );
				$("#div_pdpa").hide();
                alert("ลงทะเบียนเรียบร้อยแล้ว");
				$("#div_setup").show();
				
				HP("register");

	            document.querySelector('ons-tabbar').setActiveTab(0);	//call home page
            }
        }
    });
}

function setpinPress(){
    var pkey=this.id;

    if (pkey=="pin1" && $("#pin1").length>0){$("#pin2").focus()};
    if (pkey=="pin2" && $("#pin2").length>0){$("#pin3").focus()};
    if (pkey=="pin3" && $("#pin3").length>0){$("#pin4").focus()};
    if (pkey=="pin4" && $("#pin4").length>0){$("#pin5").focus()};
    if (pkey=="pin5" && $("#pin5").length>0){$("#pin6").focus()};
    if (pkey=="pin6" && $("#pin6").length>0){$("#btn_saveuser").focus()};
	
	var pin=$("#pin1").val()+$("#pin2").val()+$("#pin3").val()+$("#pin4").val()+$("#pin5").val()+$("#pin6").val();
	if (pin.length==6){
		//show pdpa card
		$("#div_setup").hide(); 
		$("#div_pdpa").show();

        //retrieve pdpa from server
        $.ajax({
            url: appPHP + "getpdpa.php",
            type: "POST",
            data: {"dummy" : 12345},
            success: function(response){
                data=JSON.parse(response).pdpa;
                if (data.length > 0){
                    $("#div_pdpa").show()
                    $.each(data, function(index,item){        
                        $("#pdpa").html(item.pdpa);
                    });
                    $("#div_pdpa").scrollTop(0);
                }
            }
        });

	}
}

function getUser(){
	//setup pin inout height
	$("#pin1").height($("#pin1").width()*1.25);
	$("#pin2").height($("#pin1").width()*1.25);
	$("#pin3").height($("#pin1").width()*1.25);
	$("#pin4").height($("#pin1").width()*1.25);
	$("#pin5").height($("#pin1").width()*1.25);
	$("#pin6").height($("#pin1").width()*1.25);
	
	$("#div_pdpa").hide()

	//get all provinces
	$.ajax({
		url: appPHP + "getprovince.php",
		type: "POST",
		data: {"dummy" : 12345},
		success: function(response){
            //filling province combo box
        	var prov=document.getElementById("province");

			data=JSON.parse(response).province;
			if (data.length > 0){
				var lst="";
				$.each(data, function(index,item){
					var province=item.province;
					lst = lst + "<option value=" + province + ">" + province + "</option>";
				});

				prov.innerHTML=lst;
			}
        }
    });

	//size the div_setup
	if (OS=="Windows"){
		var dH=bH * .88;
		$("#div_setup").css({height: dH});
	}
    else if (OS=="Mac"){

    }
    else if (OS=="Android"){
		var dH=pageHeight;
		$("#div_setup").css({height: dH});
    }

    var username=localStorage.getItem("username");

    if (username != null){
        peopleid=username;  //global variable

        xData=new FormData();
        xData.append("peopleid", peopleid);
    
        $.ajax({
            url: appPHP + "getuser.php",
            type: "POST",
            data: xData,
            processData: false,
            contentType: false,
            cache: false,
            success: function(response){
                data=JSON.parse(response).user;

                if (data.length >0){
                    $.each(data, function(index,item){
                        var name=item.name;
                        var gender=item.gender;
                        var address=item.address;
                        
                        province=item.province;
                        amphur=item.amphur;
                        tumbol=item.tumbol;

                        var shopname=item.shopname;
                        var officehour=item.officehour;
                        var telno=item.telno;
                        latitude=item.latitude;
                        longitude=item.longitude;
                        var linemanurl=item.linemanurl;

                        $("#peopleid").val(item.peopleid);
                        $("#name").val(name);
                        $("#gender").val(gender);
                        $("#address").val(address);
                        $("#shopname").val(shopname);
                        $("#officehour").val(officehour);
                        $("#telno").val(telno);
                        $("#linemanurl").val(linemanurl);

                        fillDSD(province, amphur, tumbol);
                    });
                }
            }
        });
    }
}

function fillDSD(province, district, subdistrict){
	var prov=document.getElementById("province");
	var amp=document.getElementById("amphur");
	var tum=document.getElementById("tumbol");
	$("#province").val("");
	$("#amphur").val("");
	$("#tumbol").val("");
	
	//get all provinces
	$.ajax({
		url: appPHP + "getprovince.php",
		type: "POST",
		data: {"dummy" : 12345},
		success: function(response){
			data=JSON.parse(response).province;
			if (data.length >0){
				var lst="";
				$.each(data, function(index,item){
					var province=item.province;
					lst = lst + "<option value=" + province + ">" + province + "</option>";
				});									
				prov.innerHTML=lst;
				$("#province").val(province);
				
				//get all districts for the selected province
				$.ajax({
					url: appPHP + "getdistrict.php",
					type: "POST",
					data: {"province" : province},
					success: function(response){
						data=JSON.parse(response).district;
						if (data.length >0){
							var lst="";
							$.each(data, function(index,item){
								var district=item.district;
								lst = lst + "<option value=" + district + ">" + district + "</option>";
							});									
							amp.innerHTML=lst;
							$("#amphur").val(district);
							
							//get all subdistricts for the selected province and district
							$.ajax({
								url: appPHP + "getsubdistrict.php",
								type: "POST",
								data: {"province" : province, "district" : district},
								success: function(response){
									data=JSON.parse(response).subdistrict;
									if (data.length >0){
										var lst="";
										$.each(data, function(index,item){
											var subdistrict=item.subdistrict;
											lst = lst + "<option value=" + subdistrict + ">" + subdistrict + "</option>";
										});									
										tum.innerHTML=lst;
										$("#tumbol").val(subdistrict);

                                        showRegMap();
                                        showProfile();
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

function showPin(){
    document.querySelector('ons-tabbar').setAttribute('hide-tabs', 'true')
	$("#btn_logout").hide();

    //customize the divs
    //div_plogo
    $("#div_plogo").css({'width':'100%', 'height': '30%', 'text-align': 'center'});
    $("#plogo").css({'position': 'relative', 'top': '13%'});

    //div_pinprogress
    $("#div_pinprogress").css({'position':'relative', 'width':'100%', 'height':'10%', 'top':'8%', 'color': 'white'});
    //draw 6 blank circles
    var pdheight=$("#div_pinprogress").height() * 0.2;
    var pdleft=($("#div_pinprogress").width()-(pdheight*6)-((pdheight/2) *5))/2;
    var pdspace=pdheight/2;
    
    $("#pd1").css({'width': pdheight, 'height': pdheight, 'left': pdleft});
    $("#pd2").css({'width': pdheight, 'height': pdheight, 'left': pdleft+(pdspace*1)});
    $("#pd3").css({'width': pdheight, 'height': pdheight, 'left': pdleft+(pdspace*2)});
    $("#pd4").css({'width': pdheight, 'height': pdheight, 'left': pdleft+(pdspace*3)});
    $("#pd5").css({'width': pdheight, 'height': pdheight, 'left': pdleft+(pdspace*4)});
    $("#pd6").css({'width': pdheight, 'height': pdheight, 'left': pdleft+(pdspace*5)});

    //div_ppin
	var pk11H=$("#pk0").height();
    $("#div_ppin").css({'width':'100%', 'height': '60%', 'top': '15%', 'margin':'0 auto', 'position':'relative'});
	$("#pk11").css({'height': pk11H});
}
function pinPress(){
    var pkey=this.id;

    if (pkey=="pk0"){pnum='0'};
    if (pkey=="pk1"){pnum='1'};
    if (pkey=="pk2"){pnum='2'};
    if (pkey=="pk3"){pnum='3'};
    if (pkey=="pk4"){pnum='4'};
    if (pkey=="pk5"){pnum='5'};
    if (pkey=="pk6"){pnum='6'};
    if (pkey=="pk7"){pnum='7'};
    if (pkey=="pk8"){pnum='8'};
    if (pkey=="pk9"){pnum='9'};
    if (pkey=="pk11"){pnum='del'};

    //display pin progress
    if (pnum != 'del'){
        pinvalue=pinvalue+pnum;
    }

    if (pnum != 'del' && pinvalue.length <= 6){
        var digitno=pinvalue.length;
        if (digitno == 1){$("#pd1").css({'background-color':'yellow'})}
        if (digitno == 2){$("#pd2").css({'background-color':'yellow'})}
        if (digitno == 3){$("#pd3").css({'background-color':'yellow'})}
        if (digitno == 4){$("#pd4").css({'background-color':'yellow'})}
        if (digitno == 5){$("#pd5").css({'background-color':'yellow'})}
        if (digitno == 6){$("#pd6").css({'background-color':'yellow'})}
    }
    else{
        var digitno=pinvalue.length;
        if (digitno == 1){$("#pd1").css({'background-color':'white'})}
        if (digitno == 2){$("#pd2").css({'background-color':'white'})}
        if (digitno == 3){$("#pd3").css({'background-color':'white'})}
        if (digitno == 4){$("#pd4").css({'background-color':'white'})}
        if (digitno == 5){$("#pd5").css({'background-color':'white'})}
        if (digitno == 6){$("#pd6").css({'background-color':'white'})}
        pinvalue=pinvalue.substr(0, digitno-1);
    }
    if (pinvalue.length == 6){
        if (pinvalue == gpin){
			//iPhone Full Screen
			iPhoneXLoginFullScreen();

            document.querySelector('ons-tabbar').setActiveTab(0);
            $("#PINlogin").hide();
            $("#home_header").text("สร้างเมนู");

            //reset circles
            $("#pd1").css({'background-color':'white'});
            $("#pd2").css({'background-color':'white'});
            $("#pd3").css({'background-color':'white'});
            $("#pd4").css({'background-color':'white'});
            $("#pd5").css({'background-color':'white'});
            $("#pd6").css({'background-color':'white'});
            $("#PINlogin").hide();
			pinvalue="";
            
            $("#btn_logout").prop("disabled", false);
		    document.querySelector('ons-tabbar').setAttribute('hide-tabs', 'false')

			entryLog();			//init home page
			certExpCheck();		//check for expired certificate (30 days)
			initVideo();			//load video how to use
			initHomePage();		//homepage iniitialize

            $("#div_allHMmenu").show();
			getAllHMmenu();
        }
        else{
            $("#pd6").css({'background-color':'yellow'});
            alert("รหัสผ่านไม่ถูกต้อง กรุณาป้อนใหม่");
        }
    }
}

function appLogout(){
	//iPhone Full Screen
	iPhoneXLogoutFullScreen();

    xr=confirm("!อย่าลืมบันทึกเมนูก่อนออกจากโปรแกรม");
    if (xr==true){
        $("#div_makemenu").hide();
        $("#div_allHMmenu").hide();
        $("#btn_export").hide();
        $("#btn_newmenu").hide();
        $("#PINlogin").show();
        $("#home_header").text("Food4Health");
        showPin();
    }
}

function suggChange(){
	var ifmW=$("#tbl_suggestion").width();
	var suggType=$("#suggType").val();

	if (suggType=="8"){	//8. ความพึงพอใจ
		$("#txt_suggestion").hide();
		$("#sp_satisfaction").show();
		
		//resize the icons
		var iconW=ifmW/8;
		$("#s_s1").css({"width":iconW});
		$("#s_s2").css({"width":iconW});
		$("#s_s3").css({"width":iconW});
		$("#s_s4").css({"width":iconW});
		$("#s_s5").css({"width":iconW});
		
	}
    else{
		$("#txt_suggestion").show();
		$("#sp_satisfaction").hide();

    }
}

function satisAlert(){
	var imgId=this.id;

	if (imgId=="s_s1"){
		$("#s_s1").prop("src","images/s1.png");
		$("#s_s2").prop("src","images/s20.png");
		$("#s_s3").prop("src","images/s30.png");
		$("#s_s4").prop("src","images/s40.png");
		$("#s_s5").prop("src","images/s50.png");
		$("#txt_suggestion").val("1");
	}
	else if (imgId=="s_s2"){
		$("#s_s1").prop("src","images/s10.png");
		$("#s_s2").prop("src","images/s2.png");
		$("#s_s3").prop("src","images/s30.png");
		$("#s_s4").prop("src","images/s40.png");
		$("#s_s5").prop("src","images/s50.png");		
		$("#txt_suggestion").val("2");
	}
	else if (imgId=="s_s3"){
		$("#s_s1").prop("src","images/s10.png");
		$("#s_s2").prop("src","images/s20.png");
		$("#s_s3").prop("src","images/s3.png");
		$("#s_s4").prop("src","images/s40.png");
		$("#s_s5").prop("src","images/s50.png");		
		$("#txt_suggestion").val("3");
	}
	else if (imgId=="s_s4"){
		$("#s_s1").prop("src","images/s10.png");
		$("#s_s2").prop("src","images/s20.png");
		$("#s_s3").prop("src","images/s30.png");
		$("#s_s4").prop("src","images/s4.png");
		$("#s_s5").prop("src","images/s50.png");		
		$("#txt_suggestion").val("4");
	}
	else if (imgId=="s_s5"){
		$("#s_s1").prop("src","images/s10.png");
		$("#s_s2").prop("src","images/s20.png");
		$("#s_s3").prop("src","images/s30.png");
		$("#s_s4").prop("src","images/s40.png");
		$("#s_s5").prop("src","images/s5.png");		
		$("#txt_suggestion").val("5");
	}	
}

function suggSend(){
	peopleid=localStorage.getItem("username");
	var suggtype=$("#suggType").val().substr(0, 1);
	var suggtext=$("#txt_suggestion").val();

    if (suggtext.length == 0){
        alert("กรุณาเขียนคำแนะนำติชม");
    }
    else{
        var xData = new FormData();
        xData.append('peopleid', peopleid);
        xData.append('suggtype', suggtype);
        xData.append('suggtext', suggtext);
        xData.append("appname", appName);

        $.ajax({
            url: appPHP + "savesuggestion.php",
            type: "POST",
            data: xData,
            processData:false,
            contentType: false,
            success: function(response){
                if (response.substr(0,8) == "Complete"){
                    alert("ขอขอบคุณสำหรับคำแนะนำ");

                    $("#sp_satisfaction").hide();
                    $("#txt_suggestion").show();
                    $("#suggType").val("");
                    $("#suggType").prop("selectedIndex", 0).val();
                    $("#txt_suggestion").val("");

					if (suggtype != "8"){
						HP("suggestion");
					}
					else{
						HP("satisfaction");
					}
                }
            }
        });	
    }
}

function adjustHomepage(){

}

function resetApp(){
	localStorage.removeItem("username");
	localStorage.removeItem("pin");
	$("#peopleid").val("");
	peopleid="";
	username="";

	var amp=document.getElementById("amphur");
	amp.innerHTML="";
	
	var tum=document.getElementById("tumbol");
	tum.innerHTML="";
	
	$("#setuppage").click();	
}

function stopVideo(){
    $("#v_howtouse").get(0).pause();
//    $("#v_howtouse").get(0).currentTime = 0;

}

function initVideo(){
    var video=document.getElementById("v_howtouse");
    video.src=appURL + "www/video/f4h3m-howtouse.mp4?v=" + Date.now();
	video.load();


//	var video = $('#v_howtouse video')[0];
//	video.src = appURL + "www/video/f4h3m-howtouse.mp4?v="  + Date.now();
//	video.load();
	
}

function ackPdpa(){
	if ($("#inp_pdpa").is(":checked")){
		$("#btn_saveuser").prop("disabled", false);
	}
	else{
		$("#btn_saveuser").prop("disabled", true);
	}

}

//google map experiment//
///////////////////////////////
var geocoder;
var map;
function initialize() {
    var dv=document.getElementById("ons_map");
    var address=$("#address").val();
    var province=$("#province").val()
    var amphur=$("#amphur").val();
    var tumbol=$("#tumbol").val();
    
    //remove previous created "regmap"
    var mmap=document.createElement("div");
    mmap.remove();

    //create new regmap    
    var mmap=document.createElement("div");
    mmap.id="regmap";

    dv.appendChild(mmap);
    $("#ons_map").css({"height":"300px"});
    $("#regmap").css({"width":"100%", "height": "90%"});

    geocoder = new google.maps.Geocoder();
    if (latitude !=0 && longitude !=0){
        var latlng = new google.maps.LatLng(latitude, longitude);
    }
    else{
        var latlng = new google.maps.LatLng(-34.397, 150.644);
    }
    var mapOptions = {
        zoom: 15,
        center: latlng,
    	disableDefaultUI: true
    }
    
    if (address.length>0 && province.length>0 && amphur.length>0 && tumbol.length>0){
        map = new google.maps.Map(document.getElementById('regmap'), mapOptions);   //show real map
    }
    else{
        //<img src='../image/map-placeholder' width="100%" style="opacity:20%">
    }
}

function codeAddress() {
    //ทดสอบแสดง marker จาก latlang จาก database
    var latlng = new google.maps.LatLng(latitude, longitude);
	var address = $("#address").val() + " " + $("#tumbol").val() + " " +$("#amphur").val() + " " + $("#province").val();

	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
            latitude=results[0].geometry.location.lat();
			longitude=results[0].geometry.location.lng();

			var marker = new google.maps.Marker({
				map: map,
				draggable:true,
				//position: results[0].geometry.location
                position: latlng
			});

			//newly added to get the lat and lang of new marker
			google.maps.event.addListener(marker, 'dragend', function (event) {
				latitude=this.getPosition().lat();
				longitude=this.getPosition().lng();
			});
		}
		else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

function showRegMap(){
	//show map by address
	initialize();	
	codeAddress();
	$("#regmap").show();
}

function showMap(lat, lang){
	var latlng = new google.maps.LatLng(lat, lang);
	var mapOptions = {  
			zoom: 13,
			center: latlng
	};

	//customized map icon
	var icon = {
		url: "images/f4hmarker.png",
		scaledSize: new google.maps.Size(30, 48), // size (30,48)
	}

    //remove previous created "regmap"
    var mmap=document.createElement("div");
    mmap.remove();

    //create new regmap
    var dv=document.getElementById("ons_lochmmap");
    var mmap=document.createElement("div");
    mmap.id="locmap";

    dv.appendChild(mmap);
    $("#ons_hmmap").css({"height":"300px"});
    $("#locmap").css({"width":"100%", "height": "300px"});

	//show map inside the <div> element
	var map = new google.maps.Map(document.getElementById('locmap'), mapOptions);

	//create marker according to lat and lng
	var directionsService = new google.maps.DirectionsService();
	var directionsRenderer = new google.maps.DirectionsRenderer();
	var myCenter = new google.maps.LatLng(lat, lang);

	//show marker on map
	var marker = new google.maps.Marker(  
	{  
		position: myCenter,
		icon:icon
	}); 
	marker.setMap(map);
}

function changeMapRange(){
    var mapoption=$("input[name='maprange']:checked").val();
    if (mapoption=="1"){
        //show allmap
        showAllMap(12.719786220308247, 101.16039951833636);
    }
    else{
        //show within radius of 150 km. (150,000 m)
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(thisposition);
        }
    }
    function thisposition(position){
        currentposition=position;
        var currentLat=position.coords.latitude;
        var currentLang=position.coords.longitude;

        showInrangeMap(currentposition);
    }
}

//google.maps.event.addDomListener(window, 'load', initialize);
//end map experiment//
////////////////////////////

function upPhoto(){
    $("#img_user").click();
}

function uploadFile(ix){
	var peopleid=$("#peopleid").val();

	var xData = new FormData();
	xData.append('fname', $("#img_user").prop('files')[0]);
	xData.append('peopleid', peopleid);

	$.ajax({
		url: appPHP + "photoupload.php",
		type: "POST",
		data: xData,
		processData:false,
		contentType: false,
		success: function(response){
			$("#div_imgusr").empty();

			//remove background image
			$("#div_imgusr").css("background-image","none")		

			//show the uploaded photo
			$("#div_imgusr").append("<img src="+appURL+"www/images/profile/"+peopleid+".jpg?v="+Date.now()+ " id='userphoto' style='width:100%' />");
		}
	});
}

function showProfile(){
    $("#div_imgusr").empty();

    $("#div_imgusr").append("<img src="+appURL+"www/images/profile/"+peopleid+".jpg?v="+Date.now()+" id='userphoto' style='width:100%' />");

}

function showAllMap(lat, lang){
	$("#allmap").show();
    $("#div_nearyou").show();
	var mapOptions = {  
			zoom:5.77, 
			center: {'lat':lat, 'lng':lang},
	};

	//show map inside the <div> element    
	var map = new google.maps.Map(document.getElementById('allmap'), mapOptions); 

	//customized map icon
	var icon = {
		url: "images/f4hmarker.png", //"https://mnm19.com/healthycanteen/www/images/f4hmarker.png",
		scaledSize: new google.maps.Size(20, 30), // size 14, 22
	}

	//mark all merchants??
	//get all merchant coordinate from database

	$.ajax({
		url: appPHP + "getalllatlong.php",
		type: "POST",
		data:("dummay","hello"),
		success: function(response){
			data=JSON.parse(response).coordinate;
			if (data.length >0){
				$.each(data, function(index,item){
					//add markers to map
					var myPosition = new google.maps.LatLng(item.lat, item.lang);
					var marker = new google.maps.Marker({
						position: myPosition,
						icon:icon
					});
					marker.setMap(map);

					marker.addListener("click", function(){
						var lat = marker.getPosition().lat();
						var lng = marker.getPosition().lng();
						$("#allmap").hide();
                        $("#div_nearyou").hide()
                        $("#div_hmmap").show();
						$("#div_markershopDetail").hide();

						//search database for peopleid (s)
						$.ajax({
							url: appPHP + "getidfromlatlang.php",
							type: "POST",
							data:{"latitude":lat, "longitude": lng},
							success: function(response){
								//show on screen (div_markerShop)
								$("#allmap").hide();
                                $("#div_nearyou").hide();
								$("#div_markerShop").show();
					
								data=JSON.parse(response).merchant;
								var tbl=document.getElementById("tbl_markerShop");
								tbl.className="f12";
								
								//empty tbl_markerShop (let header remain) (row0, 1)
								$("#tbl_markerShop").empty();
								
								//construct first 2 rows of table
								var row=tbl.insertRow(0);
								var cell=row.insertCell(0);
								var cell1=row.insertCell(1);
								var cell2=row.insertCell(2);
								
								cell.width="5%";
								cell1.width="95%";
								cell2.width="0px";
								
								var row=tbl.insertRow(1);
								var cell=row.insertCell(0);
								cell.colSpan=3;
								cell.align="center";

								cell.innerHTML="โปรดเลือกเมนูชูสุขภาพ";
								//end construct table header

								var ix=2;
								var oldpeopleid="";
								if (data.length >0){
									$.each(data, function(index,item){
										var peopleid=item.peopleid;
										var merchantname=item.merchantname
										var menuid=item.menuid;
										var name=item.name;
										
										//add merchant name totable
										if (oldpeopleid != peopleid){	//new merchant
											//show merchant name
											oldpeopleid=peopleid;
											var row=tbl.insertRow(ix);
											row.className="gWhite";
											var cell=row.insertCell(0);
											cell.colSpan=2;
											var cell1=row.insertCell(1);

											cell.innerHTML=merchantname;
											cell1.innerHTML=peopleid;
											cell1.style.display="none";
											ix=ix+1
											
											//show menu name
											var row=tbl.insertRow(ix);
											var cell=row.insertCell(0);
											var cell1=row.insertCell(1);
											var cell2=row.insertCell(2);
										
											cell1.innerHTML="> "+name;
											cell2.innerHTML=menuid;
											cell2.style.display="none";
										}
										else{	//old merchant
											//show menu name
											var row=tbl.insertRow(ix);
											var cell=row.insertCell(0);
											var cell1=row.insertCell(1);
											var cell2=row.insertCell(2);
											
											cell1.innerHTML="> "+name;
											cell2.innerHTML=menuid;
											cell2.style.display="none";
										}
										ix=ix+1;
									});
								}
							}
						});
					});
				});
			}
		}
	});
}
//////////////////////
function showInrangeMap(currentlatlang){
	$("#allmap").show();
    $("#div_nearyou").show();
    var lat=currentlatlang.coords.latitude;
    var lang=currentlatlang.coords.longitude;
    var currentposition = new google.maps.LatLng(lat, lang);
	var mapOptions = {  
			zoom:7.5,     //5.77
			center: {'lat':lat, 'lng':lang},
	};

	//show map inside the <div> element    
	var map = new google.maps.Map(document.getElementById('allmap'), mapOptions); 

	//customized map icon
	var icon = {
		url: "images/f4hmarker.png", //"https://mnm19.com/healthycanteen/www/images/f4hmarker.png",
		scaledSize: new google.maps.Size(20, 30), // size 14, 22
	}

	//get all merchant coordinate from database
	$.ajax({
		url: appPHP + "getalllatlong.php",
		type: "POST",
		data:("dummay","hello"),
		success: function(response){
			data=JSON.parse(response).coordinate;
			if (data.length >0){
				$.each(data, function(index,item){
					//add markers to map
					var shopposition = new google.maps.LatLng(item.lat, item.lang);
                    var distance=google.maps.geometry.spherical.computeDistanceBetween(shopposition, currentposition);

                    if (distance <= 100000 && distance != 0){
                        var marker = new google.maps.Marker({
                            position: shopposition,
                            icon:icon
                        });
                        marker.setMap(map);

                        marker.addListener("click", function(){
                            var lat = marker.getPosition().lat();
                            var lng = marker.getPosition().lng();
                            $("#allmap").hide();
                            $("#div_nearyou").hide();
                            $("#div_hmmap").show();
                            $("#div_markershopDetail").hide();

                            //search database for peopleid (s)
                            $.ajax({
                                url: appPHP + "getidfromlatlang.php",
                                type: "POST",
                                data:{"latitude":lat, "longitude": lng},
                                success: function(response){
                                    //show on screen (div_markerShop)
                                    $("#allmap").hide();
                                    $("#div_markerShop").show();
                        
                                    data=JSON.parse(response).merchant;
                                    var tbl=document.getElementById("tbl_markerShop");
                                    tbl.className="f12";
                                    
                                    //empty tbl_markerShop (let header remain) (row0, 1)
                                    $("#tbl_markerShop").empty();
                                    
                                    //construct first 2 rows of table
                                    var row=tbl.insertRow(0);
                                    var cell=row.insertCell(0);
                                    var cell1=row.insertCell(1);
                                    var cell2=row.insertCell(2);
                                    
                                    cell.width="5%";
                                    cell1.width="95%";
                                    cell2.width="0px";
                                    
                                    var row=tbl.insertRow(1);
                                    var cell=row.insertCell(0);
                                    cell.colSpan=3;
                                    cell.align="center";

                                    cell.innerHTML="โปรดเลือกเมนูชูสุขภาพ";
                                    //end construct table header

                                    var ix=2;
                                    var oldpeopleid="";
                                    if (data.length >0){
                                        $.each(data, function(index,item){
                                            var peopleid=item.peopleid;
                                            var merchantname=item.merchantname
                                            var menuid=item.menuid;
                                            var name=item.name;
                                            
                                            //add merchant name totable
                                            if (oldpeopleid != peopleid){	//new merchant
                                                //show merchant name
                                                oldpeopleid=peopleid;
                                                var row=tbl.insertRow(ix);
                                                row.className="gWhite";
                                                var cell=row.insertCell(0);
                                                cell.colSpan=2;
                                                var cell1=row.insertCell(1);

                                                cell.innerHTML=merchantname;
                                                cell1.innerHTML=peopleid;
                                                cell1.style.display="none";
                                                ix=ix+1
                                                
                                                //show menu name
                                                var row=tbl.insertRow(ix);
                                                var cell=row.insertCell(0);
                                                var cell1=row.insertCell(1);
                                                var cell2=row.insertCell(2);
                                            
                                                cell1.innerHTML="> "+name;
                                                cell2.innerHTML=menuid;
                                                cell2.style.display="none";
                                            }
                                            else{	//old merchant
                                                //show menu name
                                                var row=tbl.insertRow(ix);
                                                var cell=row.insertCell(0);
                                                var cell1=row.insertCell(1);
                                                var cell2=row.insertCell(2);
                                                
                                                cell1.innerHTML="> "+name;
                                                cell2.innerHTML=menuid;
                                                cell2.style.display="none";
                                            }
                                            ix=ix+1;
                                        });
                                    }
                                }
                            });
                        });
                    }
				});
			}
		}
	});
}
//////////////////////
function markerHMShow1(){
    $("#div_markerShop").hide();
    $("#div_nearyou").hide();
    $("#div_markershopDetail").show();
    $("#btn_locreset").show(); //left arrow

	selectedrow=this.rowIndex;
	var xx=$("#tbl_markerShop").find("tr:eq(" + selectedrow + ")");
	var xfirstcolumn=xx.find("td:eq(0)").text();
	var xname=xx.find("td:eq(1)").text();
	var xmenuid=xx.find("td:eq(2)").text();	

	if (xfirstcolumn.length == 0){	//menu item (not merchant name)
        //show menu image
        $("#div_hmImg").empty();
        $("#div_hmImg").append("<img src="+appURL+"www/foodphoto/"+xmenuid+".jpg?v="+Date.now()+ " style='width:100%' />");

        //retrieve data from database
        var xData=new FormData();
        xData.append("menuid", xmenuid);

        $.ajax({
            url: appPHP + "getmarkerdata.php",
            type: "POST",
            data: xData,
            processData:false,
            contentType:false,
            cache:false,
            success: function(response){
                var lat=0;
                var lang=0;

                var data=JSON.parse(response).shop;
                if (data.length > 0){
                    $.each(data, function(index,item){
                        var shopname=item.shopname;
                        var address=item.address + " " + item.tumbol + " " + item.amphur + " จ." + item.province;
                        var officehour=item.officehour;
                        var telno=item.telno;
                        lat=item.latitude;
                        lang=item.longitude;

                        $("#loc_name").text(shopname);
                        $("#loc_address").text(address);
                        $("#loc_officehour").text(officehour);
                        $("#loc_telno").text(telno);
                    });
                }

                var data=JSON.parse(response).marker;
                if (data.length > 0){
                    $.each(data, function(index,item){
                        var menuname=item.menuname;
                        var energy=numeral(item.energy).format("#,0");
                        var protein=item.protein;
                        var fat=item.fat;
                        var carbohydrate=item.carbohydrate;
                        var dietaryfiber=item.dietaryfiber;
                        var calcium=item.calcium;
                        var phosphorus=item.phosphorus;
                        var magnesium=item.magnesium;
                        var sodium=item.sodium;
                        var potassium=item.potassium;
                        var iron=item.iron;
                        var cholesterol=item.cholesterol;
                        var copper=item.copper;
                        var zinc=item.zinc;
                        var iodine=item.iodine;
                        var betacarotine=item.betacarotine;
                        var vitamina=item.vitamina;
                        var vitaminb1=item.vitaminb1;
                        var vitaminb2=item.vitaminb2;
                        var niacin=item.niacin;
                        var vitaminc=item.vitaminc;
                        var vitamine=item.vitamine;
                        var sugar=item.sugar;
                        var folate=item.folate;

                        $("#loc_menuname").text(menuname);
                        $("#loc_energy").text(energy);
                        $("#loc_protein").text(digit(protein));
                        $("#loc_fat").text(digit(fat));
                        $("#loc_carbohydrate").text(digit(carbohydrate));
                        $("#loc_dietaryfiber").text(digit(dietaryfiber));
                        $("#loc_calcium").text(digit(calcium));
                        $("#loc_phosphorus").text(digit(phosphorus));
                        $("#loc_magnesium").text(digit(magnesium));
                        $("#loc_sodium").text(digit(sodium));
                        $("#loc_potassium").text(digit(potassium));
                        $("#loc_iron").text(digit(iron));
                        $("#loc_cholesterol").text(digit(cholesterol));
                        $("#loc_copper").text(digit(copper));
                        $("#loc_zinc").text(digit(zinc));
                        $("#loc_iodine").text(digit(iodine));
                        $("#loc_betacarotine").text(digit(betacarotine));
                        $("#loc_vitamina").text(digit(vitamina));
                        $("#loc_vitaminb1").text(digit(vitaminb1));
                        $("#loc_vitaminb2").text(digit(vitaminb2));
                        $("#loc_niacin").text(digit(niacin));
                        $("#loc_vitaminc").text(digit(vitaminc));
                        $("#loc_vitamine").text(digit(vitamine));
                        $("#loc_sugar").text(digit(sugar));
                        $("#loc_folate").text(digit(folate));

                    });
                }
                showMap(lat, lang);
				
				HP("map");
            }
        });
    }
}

function locBack(){
	if ($("#div_markershopDetail").is(":visible")==true){
	    $("#div_markerShop").show()
    	$("#div_markershopDetail").hide();
	}
	else{
		showAllMap(12.719786220308247, 101.16039951833636);
	    $("#btn_locreset").hide(); //left arrow
	}
}

function digit(ix){
    if (ix==0 || ix==""){ix="-"}else{ix=numeral(ix).format("0,0.00")}

    return ix;
}

function checkOfficehour(){
    var officehour=$("#officehour").val();    
    var temp=officehour.indexOf("น.");
    if (temp == -1){
        temp=officehour + " น.";
        $("#officehour").val(temp);
    }
}

function showSuggestion(){
    $("#div_othermenu").hide();
    $("#div_howtouse").hide();
    $("#div_logodownload").hide();
    $("#div_hmcriteria").hide();
    $("#div_healthpoint").hide();
    $("#div_expcertificate").hide();

    $("#div_sugggroup").show();
    $("#other_header").text("แนะนำติชม");
    $("#btn_otherBack").show();

}

function showHowtouse(){
    $("#div_othermenu").hide();
    $("#div_sugggroup").hide();
    $("#div_logodownload").hide();
    $("#div_hmcriteria").hide();
    $("#div_healthpoint").hide();
    $("#div_expcertificate").hide();

    $("#div_howtouse").show();
    $("#other_header").text("วิธีใช้งาน");
    $("#btn_otherBack").show();
	
	HP("vdo");
}

function showLogoDownload(){
    $("#div_othermenu").hide();
    $("#div_sugggroup").hide();
    $("#div_howtouse").hide();
    $("#div_hmcriteria").hide();
    $("#div_healthpoint").hide();
    $("#div_expcertificate").hide();

    $("#div_logodownload").show();
    $("#other_header").text("ดาวน์โหลดสัญลักษณ์โลโก้");
    $("#btn_otherBack").show();

}

function showHMcriteria(){
    $("#div_othermenu").hide();
    $("#div_sugggroup").hide();
    $("#div_howtouse").hide();
    $("#div_logodownload").hide();
    $("#div_healthpoint").hide();
    $("#div_expcertificate").hide();

    $("#div_hmcriteria").show();
    $("#other_header").text("เกณฑ์เมนูชูสุขภาพ");
    $("#btn_otherBack").show();

    //retrieve pdpa from server
    $.ajax({
        url: appPHP + "gethmcriteria.php",
        type: "POST",
        data: {"dummy" : 12345},
        success: function(response){
            data=JSON.parse(response).hmcriteria;
            if (data.length > 0){
                $.each(data, function(index,item){        
                    $("#hmcriteria").html(item.hmcriteria);
                });
                $("#div_hmcriteria").scrollTop(0);
            }
			
			HP("readcriteria");
        }
    });
}

function showHealthpoint(){
    $("#div_othermenu").hide();
    $("#div_sugggroup").hide();
    $("#div_howtouse").hide();
    $("#div_logodownload").hide();
    $("#div_hmcriteria").hide();
    $("#div_expcertificate").hide();

    $("#div_healthpoint").show();
    $("#other_header").text("Health Point");
    $("#btn_otherBack").show();

    //retrieve pdpa from server
	var xData=new FormData();
	xData.append("peopleid", peopleid);

	$.ajax({
		url: appPHP + "gethealthpoint.php",
		type: "POST",
		data: xData,
		processData:false,
		contentType:false,
		cache:false,
		success: function(response){
			var healthpoint=0;
			var data=JSON.parse(response).point;

			if (data.length > 0){
				$.each(data, function(index,item){
                    $("#healthpoint").html(numeral(item.healthpoint).format("#,#"));
                });
            }
        }
    });
}

function showExpCertificate(){
    $("#div_othermenu").hide();
    $("#div_sugggroup").hide();
    $("#div_howtouse").hide();
    $("#div_logodownload").hide();
    $("#div_hmcriteria").hide();
    $("#div_healthpoint").hide();

    $("#div_expcertificate").show();
    $("#other_header").text("ใบรับรองหมดอายุ");
    $("#btn_otherBack").show();

	//empty tbl_expcertificate
    $("#tbl_expcertificate tr:not(:first)").remove();

    //retrieve pdpa from server
	var xData=new FormData();
	xData.append("peopleid", peopleid);

	$.ajax({
		url: appPHP + "expcertcheck.php",
		type: "POST",
		data: xData,
		processData:false,
		contentType:false,
		cache:false,
		success: function(response){
			var data=JSON.parse(response).certificate;

			if (data.length > 0){
				ix=0
				$.each(data, function(index,item){
					var tbl=document.getElementById("tbl_expcertificate");
					var r=tbl.insertRow();
					var cell0=r.insertCell(0);
					var cell1=r.insertCell(1);
					var cell2=r.insertCell(2);
					
					cell0.align="center";
					cell1.align="center";
					cell2.align="center";
					
					if (ix % 2 != 0){
						cell0.className="highRowLB";
						cell1.className="highRowLB";
						cell2.className="highRowLB";
					}

					cell0.innerHTML=dateE2T(item.issuedate);
					cell1.innerHTML=dateE2T(item.expdate);
					cell2.innerHTML=item.menu1;
					if (item.menu2 !=""){
						cell2.innerHTML=cell2.text() + "<br>" + item.menu2;
					}
					if (item.menu3 !=""){
						cell2.innerHTML=cell2.text() + "<br>" + item.menu3;
					}
                });
            }
        }
    });
}

function showOtherMenu(){
    stopVideo();
    $("#div_sugggroup").hide();
    $("#div_howtouse").hide();
    $("#div_logodownload").hide();
    $("#div_hmcriteria").hide();
    $("#div_healthpoint").hide();
    $("#div_expcertificate").hide();

    $("#div_othermenu").show();
    $("#other_header").text("อื่นๆ");
    $("#btn_otherBack").hide();

}

function downloadLogo(){
    if (OS=="Android"){
        var ref = cordova.InAppBrowser.open('"+appURL+"www/images/healthymenuLogo.png', '_system', 'location=no');

    }
}

function changeCerttype(){
    var certtype=$("input[name='certtype']:checked").val();

    if (certtype=="1"){ //healthy menu
        getCertMenu();
    }
    else if (certtype=="2"){    //altmenu sodium 20%
        getAltSodium();
    }
    else if (certtype=="3"){    //altmenu sugar 20%
        getAltSugar();
    }
    else if (certtype=="4"){    //altmenu fat 20%
        getAltFat();
    }
}

function getCertMenu(){
	$("#hm").prop("checked", true);

    $("#div_certificate").show();
    var xData=new FormData();
    xData.append("peopleid", peopleid);

    $.ajax({
        url: appPHP + "getcertmenu.php",
        type: "POST",
        data: xData,
        processData:false,
        contentType:false,
        cache:false,
        success: function(response){
            var data=JSON.parse(response).certificate;

            var tbl=document.getElementById("tbl_certificate");
            //$("#tbl_certificate").empty();
            //empty the table
            var tbl_length=$("#tbl_certificate tr").length;
            for (var ix=3; ix<tbl_length; ix++){
                document.getElementById('tbl_certificate').deleteRow(3);
            }
            $("#tbl_certificate").show();

            if (data.length > 0){
				$.each(data, function(index,item){
                    r=tbl.insertRow();

                    cell0=r.insertCell(0);
                    cell1=r.insertCell(1);
                    cell2=r.insertCell(2);

                    cell0.className="highRowU";
                    cell1.className="highRowU";
                    cell2.className="highRowU";

                    cell0.align="center";
                    cell1.align="left";
                    cell2.align="center"

                    cell0.width="10%";
                    cell1.width="60%";
                    cell2.width="30%";

                    cell0.innerHTML="<input type='checkbox' name='chkHM' value='" + item.name + "'>";
                    cell1.innerHTML=item.name;
                    cell2.innerHTML="<img src='"+appURL+"www/foodphoto/"+item.menuid +".jpg?v="+Date.now()+"' width='60%' />";
                });
            }
        }
    });
}

function getAltSodium(){
    $("#div_certificate").show();
    var xData=new FormData();
    xData.append("peopleid", peopleid);

    $.ajax({
        url: appPHP + "getaltsodium.php",
        type: "POST",
        data: xData,
        processData:false,
        contentType:false,
        cache:false,
        success: function(response){
            var data=JSON.parse(response).certificate;

            var tbl=document.getElementById("tbl_certificate");

            //empty the table
            var tbl_length=$("#tbl_certificate tr").length;
            for (var ix=3; ix<tbl_length; ix++){
                document.getElementById('tbl_certificate').deleteRow(3);
            }
            $("#tbl_certificate").show();

            if (data.length > 0){
				$.each(data, function(index,item){
                    r=tbl.insertRow();

                    cell0=r.insertCell(0);
                    cell1=r.insertCell(1);
                    cell2=r.insertCell(2);

                    cell0.className="highRowU";
                    cell1.className="highRowU";
                    cell2.className="highRowU";

                    cell0.align="center";
                    cell1.align="left";
                    cell2.align="center"

                    cell0.width="10%";
                    cell1.width="60%";
                    cell2.width="30%";

                    cell0.innerHTML="<input type='checkbox' name='chkHM' value='" + item.name + "'>";
                    cell1.innerHTML=item.name;
                    cell2.innerHTML="<img src='"+appURL+"www/foodphoto/"+item.menuid +".jpg?v="+Date.now()+"' width='60%' />";
                });
            }
        }
    });
}

function getAltSugar(){
    $("#div_certificate").show();
    var xData=new FormData();
    xData.append("peopleid", peopleid);

    $.ajax({
        url: appPHP + "getaltsugar.php",
        type: "POST",
        data: xData,
        processData:false,
        contentType:false,
        cache:false,
        success: function(response){
            var data=JSON.parse(response).certificate;

            var tbl=document.getElementById("tbl_certificate");

            //empty the table
            var tbl_length=$("#tbl_certificate tr").length;
            for (var ix=3; ix<tbl_length; ix++){
                document.getElementById('tbl_certificate').deleteRow(3);
            }
            $("#tbl_certificate").show();

            if (data.length > 0){
				$.each(data, function(index,item){
                    r=tbl.insertRow();

                    cell0=r.insertCell(0);
                    cell1=r.insertCell(1);
                    cell2=r.insertCell(2);

                    cell0.className="highRowU";
                    cell1.className="highRowU";
                    cell2.className="highRowU";

                    cell0.align="center";
                    cell1.align="left";
                    cell2.align="center"

                    cell0.width="10%";
                    cell1.width="60%";
                    cell2.width="30%";

                    cell0.innerHTML="<input type='checkbox' name='chkHM' value='" + item.name + "'>";
                    cell1.innerHTML=item.name;
                    cell2.innerHTML="<img src='"+appURL+"www/foodphoto/"+item.menuid +".jpg?v="+Date.now()+"' width='60%' />";
                });
            }
        }
    });
}

function getAltFat(){
    $("#div_certificate").show();
    var xData=new FormData();
    xData.append("peopleid", peopleid);

    $.ajax({
        url: appPHP + "getaltfat.php",
        type: "POST",
        data: xData,
        processData:false,
        contentType:false,
        cache:false,
        success: function(response){
            var data=JSON.parse(response).certificate;

            var tbl=document.getElementById("tbl_certificate");

            //empty the table
            var tbl_length=$("#tbl_certificate tr").length;
            for (var ix=3; ix<tbl_length; ix++){
                document.getElementById('tbl_certificate').deleteRow(3);
            }
            $("#tbl_certificate").show();

            if (data.length > 0){
				$.each(data, function(index,item){
                    r=tbl.insertRow();

                    cell0=r.insertCell(0);
                    cell1=r.insertCell(1);
                    cell2=r.insertCell(2);

                    cell0.className="highRowU";
                    cell1.className="highRowU";
                    cell2.className="highRowU";

                    cell0.align="center";
                    cell1.align="left";
                    cell2.align="center"

                    cell0.width="10%";
                    cell1.width="60%";
                    cell2.width="30%";

                    cell0.innerHTML="<input type='checkbox' name='chkHM' value='" + item.name + "'>";
                    cell1.innerHTML=item.name;
                    cell2.innerHTML="<img src='"+appURL+"www/foodphoto/"+item.menuid +".jpg?v="+Date.now()+"' width='60%' />";
                });
            }
        }
    });
}

function selectCertMenu(){
    var selecteditem=document.querySelectorAll('input[type="checkbox"]:checked');
    var itemtoprint=selecteditem.length;

    if (itemtoprint > 3){
        alert("สามารถพิมพ์เมนูได้ 3 เมนูต่อใบรับรอง 1 ใบ");
    }
    else if (itemtoprint > 0){
        $("#btn_certdownload").show();
    }
    else if (itemtoprint == 0){
        $("#btn_certdownload").hide();
    }
}

function downloadCertificate(){
    var selecteditem=document.querySelectorAll('input[type="checkbox"]:checked');
    var itemtoprint=selecteditem.length;
    var certtype=$("input[name='certtype']:checked").val(); //1=hm, 2=alt sodium, 3=alt sugar, 4=alt fat

    if (itemtoprint > 3){
        alert("สามารถพิมพ์เมนูได้ 3 เมนูต่อใบรับรอง 1 ใบ");
        return
    }

    var name1="";
    var name2=""
    var name3=""

    for (var ix=1; ix <=itemtoprint; ix++){
        if (ix==1){
            name1=selecteditem.item(ix-1).value;
        }
        else if (ix==2){
            name2=selecteditem.item(ix-1).value;
        }
        else if (ix==3){
            name3=selecteditem.item(ix-1).value;
        }
    }

    var xData=new FormData();
    xData.append("peopleid", peopleid);
    xData.append("name1", name1);
    xData.append("name2", name2);
    xData.append("name3", name3);
    xData.append("certtype", certtype);

    $.ajax({
        url: appPHP + "createcertificate.php",
        type: "POST",
        data: xData,
        processData:false,
        contentType:false,
        cache:false,
        success: function(response){
			
			HP("certificate");

			var xx=$("#body");
			$("#div_certificate").hide();
			$("#btn_certdownload").hide();

			if (OS == "Windows"){
				$("<div id='showcertificate'><object data='"+appURL+"php/certificate/"+response+ "' type='application/pdf' width='100%' height='100%' >ดาวน์โหลด:<a href='"+appURL+"php/certificate/"+response+"' download>ใบรับรองเมนูชูสุขภาพ</a></object></div>").appendTo('#ons_certificate');

			    //format <div> showcetificate
    			$("#showcertificate").css({'width': '100%', 'overflow':'hidden', 'height': '100%'});
	    		$("#showcertificate").addClass('keep-scrolling');
            }
			else if (OS == "Android"){
				$("<div id='showcertificate'><object data='"+appURL+"php/certificate/"+response+ "' type='application/pdf' width='100%' height='100%' >ดาวน์โหลด:<a href='"+appURL+"php/certificate/"+response+"' download>ใบรับรองเมนูชูสุขภาพ</a></object></div>").appendTo('#ons_certificate');

			    //format <div> showcetificate
    			$("#showcertificate").css({'width': '100%', 'overflow':'hidden', 'height': '100%'});
	    		$("#showcertificate").addClass('keep-scrolling');

            }
            else if (OS=="Mac"){
				$("<div id='showcertificate'>ดาวน์โหลด:<a href='"+appURL+"php/certificate/"+response+"'>ใบรับรองเมนูชูสุขภาพ</a></div>").appendTo('#ons_certificate');
			}
			
			//format <div> showcetificate
			$("#showcertificate").css({'width': '100%', 'overflow':'hidden', 'height': '100%'});
			$("#showcertificate").addClass('keep-scrolling');
        }
    });
}

function loadPicture(){
	//select file from local storage then upload to server upload/...
	$("#selectedimage").click();
}

function uploadHMFile(ix){
	var xData = new FormData();
	xData.append('fname', $("#selectedimage").prop('files')[0]);
	xData.append('peopleid', peopleid);
	xData.append('menuid', menuid);

	$.ajax({
		url: appPHP + "hmphotoupload.php",
		type: "POST",
		data: xData,
		processData:false,
		contentType: false,
		success: function(response){
			alert("บันทึกรูปภาพอาหารเรียบร้อยแล้ว");
		}
	});
}

function n2F(fx){   //number 2 fraction
    var temp;
    if (fx < 0.2){
        temp="1/8";
    }
    else if (fx < 0.3){
        temp="1/4";
    }
	else if (fx < 0.4){
		temp="1/3";
	}
    else if (fx < 0.6){
        temp="1/2";
    }
    else if (fx < 0.8){
        temp="3/4";
    }
    else{
        temp=numeral(fx).format("#,#.0");
    }

    return temp;
}

function f2N(fx){   //fraction 2 Number
    var dash=fx.indexOf("/");
    var temp=0;

    //check if a number is fraction
    if (dash > -1){ //fraction
        temp=eval(fx);
    }
    else{
        temp=parseFloat(fx);
    }

    return temp;
}

function HP(fx){
	caller=fx;
	point = 1;
	appname="F4HM";
	
	if (fx=="register"){point = 1}
	if (fx=="suggestion"){point = 1}
	if (fx=="makemenu"){point = 1}
	if (fx=="certificate"){point = 1}
	if (fx=="map"){point = 1}
	if (fx=="readcriteria"){point = 1}
	if (fx=="vdo"){point = 1}
	if (fx=="satisfaction"){point = 1}

	var xData=new FormData();
	xData.append("peopleid", peopleid);
	xData.append("appname", appname);
	xData.append("point", point);
	xData.append("caller", caller);

	$.ajax({
		url: appPHP + "healthpoint.php",
		type: "POST",
		data: xData,
		processData:false,
		contentType: false,
		success: function(response){
			if (response.substr(0,1)=="Y"){
				var sound=new Audio('images/hpsound.mp3').play();
//				alert("ท่านได้รับ 1 คะแนนสุขภาพ");
			}
		}
	});
}

function entryLog(){
	var xData=new FormData();

	xData.append("peopleid", peopleid);
	xData.append("appname", appName);

	$.ajax({
		url: appPHP + "entrylog.php",
		type: "POST",
		data: xData,
		processData:false,
		contentType: false,
		success: function(response){

		}
	});	
}

function certExpCheck(){
	var xData=new FormData();
	
	xData.append("peopleid", peopleid);

	$.ajax({
		url: appPHP + "expcertcheck.php",
		type: "POST",
		data: xData,
		processData:false,
		contentType: false,
		success: function(response){
			data=JSON.parse(response).certificate;
			if (data.length >0){
				var noofexpcert=data.length;			
				if (noofexpcert > 0){
					alert("มีใบรับรองเมนูชูสุขภาพ จำนวน " + noofexpcert  + " ใบ ที่กำลังจะหมดอายุ" + "\r\n" + "\r\n" +
						"สามารถดูรายละเอียดได้ที่ 'หน้าอื่นๆ' -> ใบรับรองฯ หมดอายุ"
					);
				}
				$.each(data, function(index,item){
					//
				});
			}
		}
	});
}

function dateE2T(fx){
    //fx = 2024-mm-dd
    //T = dd/mm/25xx

    var ty = Number(fx.substr(0,4))+543;
    temp=fx.substr(8,2) + "/" + fx.substr(5,2) + "/" + ty;

    return temp;
}


//iPhone section//
function iPhoneXFullScreen(){
	if (OS=="Mac"){
		$('meta[name=viewport').remove();
		$('head').append( '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">' );
	
		document.body.style.marginTop="49px";
		document.body.style.marginBottom="-49px";
		document.documentElement.style.paddingBottom="80px";
		document.documentElement.style.overflow="hidden";
		document.body.style.backgroundColor="white";
	}
}

function iPhoneXLoginFullScreen(){
	if (OS=="Mac"){
		document.documentElement.style.paddingBottom="49px";	
	}
}

function iPhoneXLogoutFullScreen(){
	if (OS=="Mac"){
		document.documentElement.style.paddingBottom="80px";
	}
}

//end iPhone section//


