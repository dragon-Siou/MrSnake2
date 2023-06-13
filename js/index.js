let canFlip = true;
let flipbook;


const { createApp } = Vue
let pageVue;
let animationVue;
let pageNum;

$(function(){

    loadApp();

	//建立Vue
	createPageVue();
	createAnimationVue();

	$(window).resize(function() {
		resizeViewport();
	}).bind('orientationchange', function() {
		resizeViewport();
	});

	if ($.isTouch) {
	
		$('.thumbnails').
			addClass('thumbanils-touch').
			bind($.mouseEvents.move, function(event) {
				event.preventDefault();
			});

	} else {

		$('.thumbnails ul').mouseover(function() {

			$('.thumbnails').addClass('thumbnails-hover');

		}).mousedown(function() {

			return false;

		}).mouseout(function() {

			$('.thumbnails').removeClass('thumbnails-hover');

		});

	}


	// Regions
	
	if ($.isTouch) {
		$('.magazine').bind('touchstart', regionClick);
	} else {
		$('.magazine').click(regionClick);
	}


	
	//翻頁
	$(".magazine-viewport")
	.click(function(event){

		//alert("magazine-viewport click")

		let e = event || window.event;
		
		//右邊
		if(e.clientX > window.innerWidth/2){
			turnPage("previous")
		}
		//左邊
		else{
			
			turnPage("next")
		}
	})

	//方向鍵
	$(document).keydown(function(event){
		if(event.keyCode == 37 || event.keyCode == 65){
			turnPage("next")
		}
		if(event.keyCode == 39 || event.keyCode == 68){
			turnPage("previous")
		}
	})

})


function turnPage(dir){
	//alert(canFlip)
	if(canFlip){
		//console.log("main canFlip: " + canFlip )
		//看有沒有啟用動畫
		if(animationVue.useAnimation){
			flipbook.turn(dir);
		}
		else{
			flipbook.turn(dir).turn("stop");
		}
	}
	else{
		canFlip = true;
	}
}


function createPageVue(){
	

	pageVue = createApp({
		data() {
			return {
				page: 1
			}
		},
		methods:{
			turn(){
				flipbook.turn("page",this.page)
			}
		}


	}).mount('#pageInput')

	flipbook.bind("turning",function(event, page, obj){
		pageVue.page = page
	})

}


function createAnimationVue(){

	animationVue = createApp({
		data() {
			return {
				useAnimation: true
			}
		}

	}).mount('#animationInput')

}



function loadApp(){
    //let pagePath = 'pages/';

    
    flipbook = $('.magazine');

    pageNum = 201;

	let isMobileBool = isMobile()

    yepnope({
		test : isMobileBool,
		yep : 'css/magazine-mobile.css',
		nope : 'css/magazine-pc.css'
	});

	//載入手機板
	if(isMobileBool){
		loadMobile()
	}
	else{
		loadPC()
	}



	
}



function loadPC(){

	let heightNum = 1.39

	let h = 912

	// Create the flipbook
	flipbook.turn({
			
		// Magazine width

		width: h*heightNum,

		// Magazine height

		height: h,

		// Duration in millisecond

		duration: 1000,

		// Hardware acceleration

		acceleration:  !isChrome(),

		// Enables gradients

		gradients: true,
		
		// Auto center this flipbook

		autoCenter: true,

		// Elevation from the edge of the flipbook when turning a page

		elevation: 50,

		// The number of pages

		pages: pageNum,

		direction: "rtl",

		// Events

		when: {
			turning: function(event, page, view) {
				
				var book = $(this),
				currentPage = book.turn('page'),
				pages = book.turn('pages');
		
				// Update the current URI

				Hash.go('page/' + page).update();

				// Show and hide navigation buttons

				disableControls(page);
				

				$('.thumbnails .page-'+currentPage).
					parent().
					removeClass('current');

				$('.thumbnails .page-'+page).
					parent().
					addClass('current');



			},

			turned: function(event, page, view) {

				disableControls(page);

				$(this).turn('center');

				if (page==1) { 
					$(this).turn('peel', 'br');
				}

			},

			missing: function (event, pages) {

				// Add pages that aren't in the magazine

				for (var i = 0; i < pages.length; i++)
					addPage(pages[i], $(this));

			}
		}

	});
}

function loadMobile(){
	let heightNum = 0.69

	let h = 580

	// Create the flipbook
	flipbook.turn({
			
		// Magazine width

		width: h*heightNum,

		// Magazine height

		height: h,

		// Duration in millisecond

		duration: 1000,

		// Hardware acceleration

		acceleration:  !isChrome(),

		// Enables gradients

		gradients: true,
		
		// Auto center this flipbook

		autoCenter: true,

		// Elevation from the edge of the flipbook when turning a page

		elevation: 50,

		// The number of pages

		pages: pageNum,

		direction: "rtl",

		display: "single",

		// Events

		when: {
			turning: function(event, page, view) {
				
				var book = $(this),
				currentPage = book.turn('page'),
				pages = book.turn('pages');
		
				// Update the current URI

				Hash.go('page/' + page).update();

				// Show and hide navigation buttons

				disableControls(page);
				

				$('.thumbnails .page-'+currentPage).
					parent().
					removeClass('current');

				$('.thumbnails .page-'+page).
					parent().
					addClass('current');



			},

			turned: function(event, page, view) {

				disableControls(page);

				$(this).turn('center');

				if (page==1) { 
					$(this).turn('peel', 'br');
				}

			},

			missing: function (event, pages) {

				// Add pages that aren't in the magazine

				for (var i = 0; i < pages.length; i++)
					addPage(pages[i], $(this));

			}
		}

	});
}


