$(document).ready(function(){
  var s1 = TweenMax.to($("#slogan1"), 2, {opacity: "1"});
  var s2 = TweenMax.to($("#slogan2"), 2, {opacity: "1"});
  var s3 = TweenMax.to($("#slogan3"), 1, {opacity: "1"});
  var s4 = TweenMax.to($("#slogan4"), 1, {opacity: "1"});
  var f1 = TweenMax.to($("#signupForm"), 0.5, {opacity: "1"});
  var tl1 = new TimelineLite();
  tl1.add(s1).add(s2).add(s3).add(s4).add(f1);

  $("#slogan").click(function(){
    tl1.seek(6.5, false);
  })

  clicksignup();
});

var clicksignup = function(){
  $("#signup").click(function(e){
    e.preventDefault();
    $.post("/signup", $("#signupForm").serialize(), function(data){
      var tween2 = TweenMax.to($("#signupWrapper"), 0.5, {opacity: "0", right: "300px"});
      var tween1 = TweenMax.to($("#slogan"), 0.5, {opacity: "0"});
      var tl = new TimelineLite();
      tl.add(tween1).add(tween2);
      setTimeout(()=>{
        $("#frontContent").html(data);
        $("#dob").datepicker("option", "dateFormat", "YYYY-MM-DD");
        s2next();
      ;}, 1000);
    })
  });
};

var clickLogin = function(){
  $("#login").click(function(e){
    e.preventDefault();
    $.post("/login", $("#loginForm").serialize(), function(data){
      var tween2 = TweenMax.to($("#signupWrapper"), 0.5, {opacity: "0", right: "300px"});
      var tween1 = TweenMax.to($("#slogan"), 0.5, {opacity: "0"});
      var tl = new TimelineLite();
      tl.add(tween1).add(tween2);
      setTimeout(()=>{
        location.replace(data);
      ;}, 1000);
    })
  });
};

var s2next = function(){
  $("#s2Next").click(function(e){
    e.preventDefault();
    $.post("/signup2", $("#signup2Form").serialize(), function(data){
      TweenMax.to($('#signup2Form'), 1, {opacity: "0"})
      var tween1 = TweenMax.to($(".prog-ball-2"), 0.5, {backgroundColor: "#22A39F"});
      var tween2 = TweenMax.to($(".prog-ball-3"), 0.5, {backgroundColor: "#EF0A1A"});
      var tl = new TimelineLite();
      tl.add(tween1).add(tween2);
      setTimeout(()=>{
        $("#frontContent").html(data);
        s3next();
      ;}, 1000);
    })
  });
};

var s3next = function(){
  $("#s3Next").click(function(e){
    e.preventDefault();
    $.post("/signup3", $("#signup3Form").serialize(), function(data){
      TweenMax.to($('#frontContent'), 1, {opacity: "0"});
      setTimeout(()=>{
        $("body").html(data);
        TweenMax.from($('#mainContent'), 1, {right: "600px"});
      ;}, 1000);
    });
  });
};

var toggleLogin = function(){
  $.get("/toggleLogin", function(data){
    TweenMax.to($('#signupForm'), 1, {opacity: "0"});
    setTimeout(()=>{
      $("#signupWrapper").html(data);
      clickLogin();
    ;}, 1000);
  });
};

var toggleSignup = function(){
  $.get("/toggleSignup", function(data){
    TweenMax.to($('#loginForm'), 1, {opacity: "0"});
    setTimeout(()=>{
      $("#signupWrapper").html(data);
      clicksignup();
    ;}, 1000);
  });
};
