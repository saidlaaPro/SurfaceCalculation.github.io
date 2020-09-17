
function coords_fruit(){
  var l=a.length;				
  do{
     intersection = 0;
     n1 = Math.random()*9;
     fx = Math.round(n1);  // generate a random integer between 0 et 9 -> this will make the x-coodonnate of the fruit
					
     n2 = Math.random()*15;
     fy = Math.round(n2);  // generate a random integer between 0 et 15 -> this will make the y-coodonnate of the fruit
					
     for (var i=0; i<l;i++){
     if (v[fx]==a[i] && v[fy]==b[i]){ intersection++;break; }
     }
  }while(intersection!=0);
}