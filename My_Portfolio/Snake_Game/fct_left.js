function gauche(){
  var l=a.length;
  var i =0;
			   
  if( !(b[l-1]==b[l-2] && ((a[l-1]-a[l-2]==32) || a[l-2]-a[l-1]>32)) ){
    contexte.clearRect(0,0,320,514);
    var hx=a[l-1]; // get the previous coordinates o the head
    var hy=b[l-1];
    
    if (hx==v[0]){  // change the position of the head to the right.
            a[l-1]=v[9];
        }else{
            a[l-1] -= 32;
    }
					
    if (a[l-1]==v[fx] && b[l-1]==v[fy]){ // if the snake get into the fruit
        a.splice(l-1,0,hx);  // insert the previous position of the head in the snake, just before its new position.
        b.splice(l-1,0,hy);
        coords_fruit();
    }else{
        for(i=0; i<a.length-2;i++){
        a[i] = a[i+1];
        b[i] = b[i+1];
        }
        // Gérer le fait de sortir des bords du canvas :
        a[i]=hx;
        b[i]=hy;
    }
  draw_snake();
  draw_fruit(fx,fy);
  check_bitten();
					
  }else{ droite(); }
}