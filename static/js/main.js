$(document).ready(function(){
  $("#signup").click(function(e){
    e.preventDefault();
    $.post("/signup", $("#signupForm").serialize(), function(data){
      var tween2 = TweenMax.to($("#signupWrapper"), 0.5, {opacity: "0", right: "300px"});
      var tween1 = TweenMax.to($("#slogan"), 0.5, {opacity: "0"});
      var tl = new TimelineLite();
      tl.add(tween1).add(tween2);
      setTimeout(()=>{
        $("#frontContent").html(data);
        s2next();
      ;}, 1000);
    })
  });
});

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
      TweenMax.to($('#frontContent'), 1, {opacity: "0", right: "600px"});
      setTimeout(()=>{
        $("body").html(data);
        TweenMax.from($('#mainContent'), 1, {right: "600px"});
      ;}, 1000);
    });
  });
};
